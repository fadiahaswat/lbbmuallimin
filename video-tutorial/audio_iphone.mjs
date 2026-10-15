import fs from 'fs';
const SR=44100,D=15,N=SR*D;
const L=new Float32Array(N),R=new Float32Array(N);
let seed=7;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296)*2-1;
const sm=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x)};
// pad: Dm9 chord, slow
const notes=[73.42,110,146.83,174.61,220,261.63,329.63];
for(let i=0;i<N;i++){const t=i/SR;
 const env=sm(t/2.5)*(1-sm((t-12.5)/2.4));
 let l=0,r=0;
 notes.forEach((f,k)=>{const lf=1+0.0012*Math.sin(t*0.3+k),amp=(k<2?0.5:0.22)/(1+k*0.15);
  l+=Math.sin(2*Math.PI*f*lf*t+k)*amp+Math.sin(2*Math.PI*f*2*lf*t)*amp*0.15;
  r+=Math.sin(2*Math.PI*f*1.002*t+k*2)*amp+Math.sin(2*Math.PI*f*2*1.002*t)*amp*0.15;});
 const trem=0.8+0.2*Math.sin(t*0.9);
 L[i]+=l*env*trem*0.16;R[i]+=r*env*trem*0.16;}
function whoosh(t0,dur,peak,gain,up=true){let lp=0,lp2=0;const s=Math.floor(t0*SR),n=Math.floor(dur*SR);
 for(let i=0;i<n&&s+i<N;i++){const k=i/n;const e=Math.sin(Math.PI*Math.pow(k,up?1.6:0.7));
  const c=0.02+0.35*(up?k:1-k)*peak;const x=rnd();lp+=c*(x-lp);lp2+=c*(lp-lp2);
  const v=lp2*e*gain*6;const p=Math.sin(Math.PI*k);L[s+i]+=v*(1-0.4*k);R[s+i]+=v*(0.6+0.4*k);}}
function tone(t0,f,dur,gain,pan=0.5,dec=5){const s=Math.floor(t0*SR),n=Math.floor(dur*SR);
 for(let i=0;i<n&&s+i<N;i++){const t=i/SR;const e=Math.exp(-t*dec)*Math.min(1,t*200);
  const v=(Math.sin(2*Math.PI*f*t)+0.3*Math.sin(2*Math.PI*f*2.01*t))*e*gain;L[s+i]+=v*(1-pan);R[s+i]+=v*pan;}}
function thump(t0,f0,gain){const s=Math.floor(t0*SR),n=Math.floor(0.4*SR);let ph=0;
 for(let i=0;i<n&&s+i<N;i++){const t=i/SR;const f=50+f0*Math.exp(-t*30);ph+=2*Math.PI*f/SR;const v=Math.sin(ph)*Math.exp(-t*9)*gain;L[s+i]+=v;R[s+i]+=v;}}
// push, glide, tap, sheet, end
whoosh(2.4,1.2,0.5,0.05);thump(3.0,60,0.35);
whoosh(6.0,1.0,0.4,0.04);
whoosh(6.8,2.4,0.7,0.05,false);
// tap
tone(10.0,1800,0.05,0.25,0.5,70);thump(10.0,40,0.45);tone(10.0,300,0.12,0.2,0.5,40);
// sheet slide
whoosh(10.25,1.3,0.9,0.07);tone(11.45,880,0.6,0.07,0.4,6);tone(11.5,1318,0.8,0.06,0.6,5);
whoosh(11.8,1.6,0.4,0.04,false);
// end shimmer + sub drop
[659.25,880,1318.5,1760].forEach((f,i)=>tone(13.0+i*0.18,f,2.2,0.07,0.3+i*0.14,2.2));
thump(13.0,30,0.4);
let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(L[i]),Math.abs(R[i]));
const g=0.89/pk;const buf=Buffer.alloc(44+N*4);
buf.write('RIFF',0);buf.writeUInt32LE(36+N*4,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);buf.writeUInt32LE(SR,24);buf.writeUInt32LE(SR*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(N*4,40);
for(let i=0;i<N;i++){buf.writeInt16LE(Math.round(L[i]*g*32767),44+i*4);buf.writeInt16LE(Math.round(R[i]*g*32767),46+i*4);}
fs.writeFileSync('audio_iphone.wav',buf);console.log('ok');
