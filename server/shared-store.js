import {randomInt,randomUUID,createHash} from 'node:crypto';
import {room,player,addPlayer,act,view} from './game.js';
export const ROOM_TTL=86400000, LEASE_MS=45000;
export class GameError extends Error {}
const CAS="if redis.call('GET',KEYS[1]) ~= ARGV[1] then return 0 end if ARGV[2] == '' then redis.call('DEL',KEYS[1]) else redis.call('SET',KEYS[1],ARGV[2],'PX',ARGV[3]) end return 1";
const RATE="local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end return n";
export class RedisBackend {
 constructor({url,token,prefix='sabha:production:'}){if(!url||!token)throw new Error('Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');if(new URL(url).protocol!=='https:')throw new Error('Redis REST URL must use HTTPS.');this.url=url.replace(/\/$/,'');this.token=token;this.prefix=prefix;}
 async command(args){const res=await fetch(this.url,{method:'POST',headers:{Authorization:`Bearer ${this.token}`,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(5000)});if(!res.ok)throw new Error('Redis unavailable');const data=await res.json();if(data.error)throw new Error('Redis command failed');return data.result;}
 get(key){return this.command(['GET',this.prefix+key]);}
 create(key,value,ttl){return this.command(['SET',this.prefix+key,value,'NX','PX',ttl]).then(r=>r==='OK');}
 cas(key,old,value,ttl){return this.command(['EVAL',CAS,1,this.prefix+key,old,value||'',ttl]).then(r=>r===1);}
 rate(key,seconds){return this.command(['EVAL',RATE,1,this.prefix+key,seconds]);}
}
function cleanPresence(r,now){
 r.presence??={};
 for(const [id,lease]of Object.entries(r.presence))if(lease.until<=now||!r.players.some(p=>p.id===lease.pid))delete r.presence[id];
 for(const p of r.players){const alive=Object.values(r.presence).some(l=>l.pid===p.id);if(!alive&&p.online){p.online=false;p.offlineAt=now}else if(alive){p.online=true;p.offlineAt=null}}
}
export class SharedGame {
 constructor(backend,{now=Date.now}={}){this.backend=backend;this.now=now;}
 async read(code){const raw=await this.backend.get('room:'+code);if(!raw)return null;const r=JSON.parse(raw);return this.now()-r.updatedAt<ROOM_TTL?r:null;}
 async update(code,mutate){
  for(let attempt=0;attempt<20;attempt++){
   const raw=await this.backend.get('room:'+code);if(!raw)throw new GameError('Room not found or expired. Check the six-character code.');
   const r=JSON.parse(raw),now=this.now();if(now-r.updatedAt>=ROOM_TTL)throw new GameError('This room has expired. Create a new room.');
   cleanPresence(r,now);const result=mutate(r,now);r.revision=(r.revision||0)+1;
   const saved=r.players.length?JSON.stringify(r):null;
   if(await this.backend.cas('room:'+code,raw,saved,Math.max(1,ROOM_TTL-(now-r.updatedAt))))return {r,result};
  }
  throw new GameError('The council is busy. Please try your action again.');
 }
 async command(session,type,data={},address='unknown'){
  if(!data||typeof data!=='object'||Array.isArray(data))throw new GameError('Invalid request.');
  if(['create','join','resume'].includes(type)){
   if(session.code)throw new GameError('You already have a seat. Leave it before joining another room.');
   if(type==='create'){
    const key=createHash('sha256').update(address).digest('hex');
    if(await this.backend.rate('create:'+key,3600)>30)throw new GameError('Room creation limit reached. Please try later.');
    let p;try{p=player(data.name)}catch(e){throw new GameError(e.message)}
    for(let i=0;i<10;i++){
     const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',code=Array.from({length:6},()=>chars[randomInt(chars.length)]).join('');
     const r=room(code,p,data.theme);r.createdAt=r.updatedAt=this.now();r.revision=1;r.presence={[session.id]:{pid:p.id,until:this.now()+LEASE_MS}};
     if(await this.backend.create('room:'+code,JSON.stringify(r),ROOM_TTL)){session.code=code;session.pid=p.id;return {ok:true,code,token:p.token};}
    }
    throw new GameError('Could not create a room. Please try again.');
   }
   const code=String(data.code||'').trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(code))throw new GameError('Enter the six-character room code.');
   const {result}=await this.update(code,(r,now)=>{
    let p;
    if(type==='join'){try{p=player(data.name);addPlayer(r,p)}catch(e){throw new GameError(e.message)}}
    else{p=r.players.find(p=>p.token===data.token);if(!p)throw new GameError('This seat is no longer available. Join again.');}
    const leases=Object.entries(r.presence).filter(([,l])=>l.pid===p.id);if(leases.length>=8)throw new GameError('This seat is open on too many connections. Close another tab and try again.');
    r.presence[session.id]={pid:p.id,until:now+LEASE_MS};p.online=true;p.offlineAt=null;r.updatedAt=now;
    return {pid:p.id,token:p.token};
   });session.code=code;session.pid=result.pid;return {ok:true,code,token:result.token};
  }
  if(!session.code)throw new GameError('Join a room first.');
  const {result}=await this.update(session.code,(r,now)=>{
   const p=r.players.find(p=>p.id===session.pid);if(!p)throw new GameError('Your seat is no longer available.');
   if(awaitNever()){} // mutations must stay synchronous for compare-and-swap retries
   if(type==='leave'){
    if(!['lobby','finished'].includes(r.phase))throw new GameError('Your seat is needed during this game. Reconnect to continue.');
    r.players=r.players.filter(x=>x.id!==p.id);for(const [id,l]of Object.entries(r.presence))if(l.pid===p.id)delete r.presence[id];
    if(r.host===p.id)r.host=r.players.find(x=>x.online)?.id??r.players[0]?.id;
   }else{
    r.presence[session.id]={pid:p.id,until:now+LEASE_MS};p.online=true;p.offlineAt=null;
    try{act(r,p,type,data)}catch(e){throw new GameError(e.message)}
   }
   r.updatedAt=now;return {ok:true};
  });if(type==='leave'){session.code=null;session.pid=null}return result;
 }
 async heartbeat(code,sessions){return this.update(code,(r,now)=>{for(const s of sessions)if(r.players.some(p=>p.id===s.pid))r.presence[s.id]={pid:s.pid,until:now+LEASE_MS};cleanPresence(r,now);});}
 async disconnect(session){if(!session.code)return;try{await this.update(session.code,(r,now)=>{delete r.presence[session.id];cleanPresence(r,now)})}catch(e){if(!(e instanceof GameError))throw e}}
 publicView(r,session){const p=r?.players.find(p=>p.id===session.pid);return p?view(r,p):null;}
 session(){return {id:randomUUID(),code:null,pid:null};}
}
function awaitNever(){return false}
