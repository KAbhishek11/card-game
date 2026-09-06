// Short, locally synthesized cues. No downloads, microphone, or background music.
let context,master,enabled=true;
try{enabled=localStorage.getItem('sabha-sound')!=='off'}catch{}
export const soundEnabled=()=>enabled;
export function setSoundEnabled(value){enabled=value;try{localStorage.setItem('sabha-sound',value?'on':'off')}catch{}if(master)master.gain.setValueAtTime(value?1:0,context.currentTime);if(value)playSound('select',true)}
export function playSound(kind='tap',gesture=false){
 if(!enabled||document.hidden)return;
 try{
  if(!context){if(!gesture)return;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;context=new Audio();master=context.createGain();master.connect(context.destination)}
  if(context.state!=='running'){if(!gesture)return;context.resume().catch(()=>{})}
  const notes=kind==='reveal'?[[390,0,.18],[780,.06,.28]]:kind==='phase'?[[440,0,.2],[660,.09,.3]]:kind==='select'?[[520,0,.09],[1040,.025,.12]]:[[180,0,.045]];
  for(const [hz,delay,duration]of notes){const start=context.currentTime+delay,osc=context.createOscillator(),gain=context.createGain();osc.type=kind==='tap'?'triangle':'sine';osc.frequency.setValueAtTime(hz,start);osc.frequency.exponentialRampToValueAtTime(hz*(kind==='tap'?.45:1.003),start+duration);gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(kind==='tap'?.055:.035,start+.006);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain);gain.connect(master);osc.start(start);osc.stop(start+duration+.02);osc.onended=()=>{osc.disconnect();gain.disconnect()}}
 }catch{/* Audio support must never interrupt a turn. */}
}
