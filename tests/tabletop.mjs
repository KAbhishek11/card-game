import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
const url=process.env.TEST_URL||'http://localhost:3017';
try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.audioNodes=0;const fn=AudioContext.prototype.createOscillator;AudioContext.prototype.createOscillator=function(...args){window.audioNodes++;return fn.apply(this,args)}});
 await p.goto(url);assert.equal(await p.evaluate(()=>window.audioNodes),0,'No sound before interaction');
 await p.getByRole('button',{name:'Choose Rang: Electric royalty'}).click();assert.ok(await p.evaluate(()=>window.audioNodes)>0,'Theme selection produces an audio cue');
 await p.getByRole('button',{name:'Mute sound effects'}).click();const before=await p.evaluate(()=>window.audioNodes);await p.getByRole('button',{name:'Choose Vana: Spirit wilds'}).click();assert.equal(await p.evaluate(()=>window.audioNodes),before,'Mute suppresses cues');
 await p.reload();await p.getByRole('button',{name:'Enable sound effects'}).waitFor();await p.getByRole('button',{name:'Enable sound effects'}).focus();await p.keyboard.press('Enter');await p.getByRole('button',{name:'Mute sound effects'}).waitFor();
 const card=p.locator('.showcase-card-1'),b=await card.boundingBox();await p.mouse.move(b.x+b.width*.7,b.y+b.height*.2);assert.equal(await card.getAttribute('data-lit'),'true');const x1=await card.evaluate(e=>e.style.getPropertyValue('--light-x'));await p.mouse.move(b.x+b.width*.3,b.y+b.height*.7);assert.notEqual(await card.evaluate(e=>e.style.getPropertyValue('--light-x')),x1);await p.screenshot({path:'.impeccable/review/foil-desktop.png',fullPage:true});
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await card.evaluate(e=>getComputedStyle(e).transform),'none');
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await mobile.goto(url);await mobile.locator('.showcase-card-1').tap();assert.ok(await mobile.locator('.showcase-card-1').evaluate(e=>e.classList.contains('touch-shine')));assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);await mobile.screenshot({path:'.impeccable/review/foil-mobile.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('PASS: gesture-only audio, cue playback, mute and persistence, keyboard toggle, pointer-driven foil, touch shine and reduced motion.');
}finally{await browser.close()}
