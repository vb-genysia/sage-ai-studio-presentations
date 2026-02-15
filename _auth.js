(function(){
  var HASH='a525531b9a92f52510b5b41168f783a0c0d78aade0db9c8f1ca33345e0e3fc1f';
  var KEY='_sage_auth';
  if(sessionStorage.getItem(KEY)==='1')return;
  async function h(s){var e=new TextEncoder().encode(s);var b=await crypto.subtle.digest('SHA-256',e);return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
  var o=document.createElement('div');
  o.id='pw-gate';
  o.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:#0B1120;z-index:99999;display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;';
  o.innerHTML='<div style="text-align:center;max-width:360px;padding:40px;"><div style="font-size:28px;font-weight:900;margin-bottom:8px;background:linear-gradient(135deg,#fff,#00D639);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Sage AI Studio</div><div style="color:#64748B;font-size:13px;margin-bottom:24px;">Confidential — Enter access code</div><input id="pw-input" type="password" placeholder="Access code" style="width:100%;padding:12px 16px;background:#1A2332;border:2px solid rgba(255,255,255,0.08);border-radius:8px;color:#F1F5F9;font-size:15px;font-family:inherit;outline:none;margin-bottom:12px;" /><button id="pw-btn" style="width:100%;padding:12px;background:#00D639;color:#0B1120;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">Unlock</button><div id="pw-err" style="color:#EF4444;font-size:12px;margin-top:8px;display:none;">Invalid access code</div></div>';
  document.body.appendChild(o);
  document.body.style.overflow='hidden';
  var inp=document.getElementById('pw-input');
  var btn=document.getElementById('pw-btn');
  var err=document.getElementById('pw-err');
  async function check(){var v=inp.value;var d=await h(v);if(d===HASH){sessionStorage.setItem(KEY,'1');o.remove();document.body.style.overflow='';}else{err.style.display='block';inp.style.borderColor='#EF4444';inp.value='';}}
  btn.addEventListener('click',check);
  inp.addEventListener('keydown',function(e){if(e.key==='Enter')check();});
  setTimeout(function(){inp.focus();},100);
})();