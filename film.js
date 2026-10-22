/* OUR DAY v5.45 — film simulation for daily photo uploads. No external image API. */
(function(){
"use strict";
const presets=[
  {id:"original",name:"Original",desc:"원본 그대로",b:0,c:1,s:1,w:0,green:0,blue:0,fade:0,grain:0,vignette:0},
  {id:"soft-green",name:"Soft Green",desc:"은은한 연두빛",b:7,c:.97,s:.89,w:0,green:10,blue:-4,fade:.065,grain:3,vignette:.07},
  {id:"warm-beige",name:"Warm Beige",desc:"햇살 같은 따뜻함",b:8,c:.97,s:.90,w:13,green:0,blue:0,fade:.055,grain:4,vignette:.08},
  {id:"cream-film",name:"Cream Film",desc:"부드럽고 밝은 필름",b:13,c:.92,s:.85,w:6,green:1,blue:0,fade:.10,grain:5,vignette:.07},
  {id:"moody-night",name:"Moody Night",desc:"차분한 밤의 색",b:-13,c:1.12,s:.77,w:-5,green:-1,blue:9,fade:.05,grain:6,vignette:.22},
  {id:"sky-fade",name:"Sky Fade",desc:"맑고 바랜 푸른빛",b:6,c:.95,s:.89,w:-5,green:1,blue:12,fade:.11,grain:4,vignette:.05},
  {id:"vintage-soft",name:"Vintage Soft",desc:"추억 같은 빈티지",b:3,c:.91,s:.74,w:12,green:1,blue:-1,fade:.16,grain:8,vignette:.16}
];
let source=null,selected="original",generation=0;
const $=id=>document.getElementById(id);
function clamp(x){return Math.max(0,Math.min(255,x))}
function process(canvas,preset){
  if(preset.id==="original")return;
  const ctx=canvas.getContext("2d",{willReadFrequently:true});
  const {width:w,height:h}=canvas;
  const frame=ctx.getImageData(0,0,w,h),a=frame.data;
  let seed=917213;
  const cx=w/2,cy=h/2,den=cx*cx+cy*cy;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;
    let r=a[i],g=a[i+1],b=a[i+2];
    const luminance=(r+g+b)/3;
    r=luminance+(r-luminance)*preset.s;
    g=luminance+(g-luminance)*preset.s;
    b=luminance+(b-luminance)*preset.s;
    r=(r-128)*preset.c+128+preset.b+preset.w;
    g=(g-128)*preset.c+128+preset.b+preset.green;
    b=(b-128)*preset.c+128+preset.b-preset.w+preset.blue;
    r=r*(1-preset.fade)+227*preset.fade;
    g=g*(1-preset.fade)+219*preset.fade;
    b=b*(1-preset.fade)+204*preset.fade;
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const noise=((seed/4294967296)-.5)*preset.grain*2;
    const dist=((x-cx)*(x-cx)+(y-cy)*(y-cy))/den;
    const edge=1-Math.max(0,dist-.12)*preset.vignette;
    a[i]=clamp((r+noise)*edge);
    a[i+1]=clamp((g+noise)*edge);
    a[i+2]=clamp((b+noise)*edge);
  }
  ctx.putImageData(frame,0,0);
}
async function imageFromFile(file){
  if(window.createImageBitmap){
    try{return await createImageBitmap(file,{imageOrientation:"from-image"})}catch(_){}
  }
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("사진을 읽지 못했어."))};
    img.src=url;
  });
}
async function render(file,presetId,max=900){
  const image=await imageFromFile(file);
  const iw=image.width||image.naturalWidth,ih=image.height||image.naturalHeight;
  if(!iw||!ih)throw new Error("사진 크기를 확인할 수 없어.");
  const ratio=Math.min(1,max/Math.max(iw,ih));
  const canvas=document.createElement("canvas");
  canvas.width=Math.max(1,Math.round(iw*ratio));canvas.height=Math.max(1,Math.round(ih*ratio));
  const ctx=canvas.getContext("2d",{willReadFrequently:true});
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  if(typeof image.close==="function")image.close();
  process(canvas,presets.find(p=>p.id===presetId)||presets[0]);
  return canvas;
}
async function updatePreview(){
  if(!source)return;
  const gen=++generation;
  const status=$("filmStatus");
  if(status)status.textContent="미리보기 만드는 중...";
  try{
    const canvas=await render(source,selected,900);
    if(gen!==generation)return;
    const target=$("filmPreview");
    if(target){target.width=canvas.width;target.height=canvas.height;target.getContext("2d").drawImage(canvas,0,0)}
    if(status)status.textContent=presets.find(p=>p.id===selected).desc+" · 저장 전 원본과 비교할 수 있어.";
  }catch(e){if(status)status.textContent=e.message||"사진 미리보기 오류"}
}
function choose(id){
 selected=id;
 document.querySelectorAll("[data-film-preset]").forEach(el=>el.classList.toggle("selected",el.dataset.filmPreset===id));
 updatePreview();
}
function selectedFile(){
 const input=$("photoInput");source=input?.files?.[0]||null;
 const box=$("filmEditor");
 if(box)box.hidden=!source;
 if(source){choose("original")}else{generation++;selected="original"}
}
function init(){
 const input=$("photoInput"),list=$("filmPresets");
 if(!input||!list)return;
 list.innerHTML=presets.map(p=>'<button type="button" class="filmPreset'+(p.id==="original"?" selected":"")+'" data-film-preset="'+p.id+'"><b>'+p.name+'</b><small>'+p.desc+'</small></button>').join("");
 list.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>choose(btn.dataset.filmPreset)));
 input.addEventListener("change",selectedFile);
 const originalBtn=$("filmCompare");
 if(originalBtn){
  const down=()=>{if(!source)return;render(source,"original",900).then(c=>{const t=$("filmPreview");if(t&&t.width===c.width&&t.height===c.height)t.getContext("2d").drawImage(c,0,0)}).catch(()=>{})};
  originalBtn.addEventListener("pointerdown",down);
  originalBtn.addEventListener("pointerup",updatePreview);
  originalBtn.addEventListener("pointercancel",updatePreview);
  originalBtn.addEventListener("pointerleave",updatePreview);
 }
}
async function outputFile(){
 const file=$("photoInput")?.files?.[0];
 if(!file)throw new Error("사진을 먼저 선택해줘.");
 if(selected==="original")return {file,preset:selected};
 const canvas=await render(file,selected,2400);
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("필름 사진 생성 실패")),"image/jpeg",.9));
 return {file:new File([blob],"ourday-"+selected+".jpg",{type:"image/jpeg"}),preset:selected};
}
window.OurDayFilm={outputFile,getPreset:()=>selected,reset:()=>{source=null;generation++;if($("filmEditor"))$("filmEditor").hidden=true;}};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
