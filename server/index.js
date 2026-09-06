import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, chmodSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomInt } from 'node:crypto';
import { room, player, addPlayer, act, view } from './game.js';
import { publicOrigin, allowedOrigin, proxyHops, clientAddress } from './network.js';
const origin=publicOrigin(process.env.PUBLIC_ORIGIN||process.env.RENDER_EXTERNAL_URL);
const trustedHops=proxyHops(process.env.TRUST_PROXY_HOPS);
const app=express(),http=createServer(app),io=new Server(http,{
 maxHttpBufferSize:16384,
 allowRequest:(req,done)=>done(null,allowedOrigin(req.headers,origin))
});
app.disable('x-powered-by');
const dir=resolve(process.env.DATA_DIR||'.data');mkdirSync(dir,{recursive:true,mode:0o700});const file=resolve(dir,'rooms.json');
let rooms=new Map();if(existsSync(file)){try{rooms=new Map(JSON.parse(readFileSync(file,'utf8')).filter(([,r])=>Date.now()-r.updatedAt<86400000));for(const r of rooms.values())for(const p of r.players){p.online=false;p.offlineAt=Date.now()}}catch(e){throw new Error('Room storage could not be read; restore or move .data/rooms.json before restarting.',{cause:e})}}
function save(){writeFileSync(file+'.tmp',JSON.stringify([...rooms]),{mode:0o600});renameSync(file+'.tmp',file);chmodSync(file,0o600)}
const connections=new Map();function broadcast(r){for(const [id,s] of io.sockets.sockets){if(s.data.code===r.code){let p=r.players.find(p=>p.id===s.data.pid);if(p)s.emit('state',view(r,p));else{s.emit('removed');s.data.code=null}}}}
function code(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let c;do{c=Array.from({length:6},()=>chars[randomInt(chars.length)]).join('')}while(rooms.has(c));return c}
const ips=new Map();io.use((s,next)=>allowedOrigin(s.handshake.headers,origin)?next():next(new Error('Connect from the game website.')));
io.on('connection',socket=>{
 let times=[];
 socket.on('command',(input,callback)=>{
 const reply=typeof callback==='function'?callback:()=>{};
 try{
  times=times.filter(t=>Date.now()-t<10000);if(times.length>=30)throw Error('Please slow down and try again.');times.push(Date.now());
  const {type,data={}}=input??{};if(!data||typeof data!=='object')throw Error('Invalid request.');
  if(['create','join','resume'].includes(type)){
   if(socket.data.code)throw Error('You already have a seat. Leave it before joining another room.');
   let r,p;
   if(type==='create'){let ip=clientAddress(socket.request,trustedHops);let entry=(ips.get(ip)??[]).filter(t=>Date.now()-t<3600000);if(entry.length>=30)throw Error('Room creation limit reached. Please try later.');entry.push(Date.now());ips.set(ip,entry);p=player(data.name);r=room(code(),p,data.theme);rooms.set(r.code,r)}
   else {const c=String(data.code??'').trim().toUpperCase();r=rooms.get(c);if(!r||Date.now()-r.updatedAt>86400000)throw Error('Room not found or expired. Check the six-character code.');if(type==='join'){p=player(data.name);addPlayer(r,p)}else{p=r.players.find(x=>x.token===data.token);if(!p)throw Error('This seat is no longer available. Join again.');}}
   socket.data.code=r.code;socket.data.pid=p.id;p.online=true;p.offlineAt=null;const k=r.code+':'+p.id;let set=connections.get(k)??new Set();set.add(socket.id);connections.set(k,set);r.updatedAt=Date.now();save();reply({ok:true,code:r.code,token:p.token});broadcast(r);return;
  }
  const r=rooms.get(socket.data.code),p=r?.players.find(x=>x.id===socket.data.pid);if(!p)throw Error('Join a room first.');
  if(type==='leave'){if(r.phase!=='lobby'&&r.phase!=='finished')throw Error('Your seat is needed during this game. Reconnect to continue.');r.players=r.players.filter(x=>x.id!==p.id);if(r.host===p.id)r.host=r.players.find(x=>x.online)?.id??r.players[0]?.id;socket.data.code=null;connections.delete(r.code+':'+p.id);if(!r.players.length)rooms.delete(r.code)}else act(r,p,type,data);
  r.updatedAt=Date.now();save();broadcast(r);reply({ok:true});
 }catch(e){reply({ok:false,error:e.message})}
 });
 socket.on('disconnect',()=>{const r=rooms.get(socket.data.code),p=r?.players.find(x=>x.id===socket.data.pid);if(!p)return;const k=r.code+':'+p.id;const set=connections.get(k);set?.delete(socket.id);if(!set?.size){connections.delete(k);p.online=false;p.offlineAt=Date.now();save();broadcast(r)}});
});
setInterval(()=>{let changed=false;for(const [c,r]of rooms){if(Date.now()-r.updatedAt>86400000){rooms.delete(c);changed=true;for(const s of io.sockets.sockets.values())if(s.data.code===c){s.emit('removed');s.data.code=null}}}for(const [ip,ts]of ips)if(ts.every(t=>Date.now()-t>=3600000))ips.delete(ip);if(changed)save()},60000).unref();
app.get('/api/health',(_req,res)=>res.json({ok:true}));
if(process.env.NODE_ENV==='production'){app.use(express.static(resolve('dist')));app.get('/{*path}',(_req,res)=>res.sendFile(resolve('dist/index.html')))}else{const {createServer}=await import('vite');const vite=await createServer({server:{middlewareMode:true,fs:{deny:['.env','.env.*','*.{crt,pem}','**/.git/**','**/.data/**','**/rooms.json','**/rooms.json.tmp']}},appType:'spa'});app.use(vite.middlewares)}
const port=Number(process.env.PORT||3000);http.listen(port,'0.0.0.0',()=>console.log(`Gupt Sabha ready at http://localhost:${port}`));

for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>{save();io.close(()=>http.close(()=>process.exit(0)));setTimeout(()=>process.exit(0),10000).unref()});
