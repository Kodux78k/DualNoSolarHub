(function(){
  'use strict';
  const ARCHS = ["Atlas","Aion","Nova","Pulse","Solus","Serena","Vitalis","Kaos","Rhea","Artemis","Genus","Horus","Fit Lux","Meta Lux","INFODOSE","Omega","Minuz","UNO","DUO","TRINITY","KODUX","BLLUE","KOBLLUX","Lumine","Verbo","Deus","Jesus","Espírito Santo"];
  const VOICE_CFG = {
    Atlas:{hint:'male',rate:0.96,pitch:0.98},
    Aion:{hint:'male',rate:0.94,pitch:0.92},
    Nova:{hint:'female',rate:1.06,pitch:1.08},
    Pulse:{hint:'male',rate:1.02,pitch:1.00},
    Solus:{hint:'male',rate:0.88,pitch:0.90},
    Serena:{hint:'female',rate:0.94,pitch:0.92},
    Vitalis:{hint:'male',rate:1.00,pitch:1.02},
    Kaos:{hint:'male',rate:1.14,pitch:1.22},
    Rhea:{hint:'female',rate:0.98,pitch:0.98},
    Artemis:{hint:'female',rate:1.04,pitch:1.06},
    Genus:{hint:'male',rate:1.00,pitch:1.00},
    Horus:{hint:'male',rate:0.96,pitch:0.96},
    Lumine:{hint:'female',rate:1.08,pitch:1.12},
    KODUX:{hint:'male',rate:1.00,pitch:1.00},
    BLLUE:{hint:'female',rate:1.00,pitch:1.04},
    TRINITY:{hint:'mixed',rate:1.00,pitch:1.00},
    UNO:{hint:'system',rate:1.00,pitch:1.00},
    KOBLLUX:{hint:'system',rate:1.00,pitch:1.00},
    INFODOSE:{hint:'mixed',rate:1.00,pitch:1.00},
  };

  function pickVoiceForHint(hint){
    const voices = speechSynthesis.getVoices();
    if(!voices||!voices.length) return null;
    const pt = voices.find(v=>/pt[-_]br/i.test(v.lang)) || voices.find(v=>/pt/i.test(v.lang));
    if(hint==='female' || hint==='male'){
      const byHint = voices.find(v => new RegExp(hint,'i').test(v.name));
      return byHint || pt || voices[0];
    }
    return pt || voices[0];
  }

  function getVoiceForArchetype(ar){
    const cfg = VOICE_CFG[ar] || {};
    if(typeof speechSynthesis==='undefined') return null;
    let v = null;
    if(speechSynthesis.getVoices().length){
      v = pickVoiceForHint(cfg.hint || 'pt');
    }
    return v;
  }

  function injectJokers(rootSelector='#root'){
    const container = document.querySelector(rootSelector);
    if(!container) return;
    const ps = container.querySelectorAll('.sec p');
    if(!ps.length) return;
    let idx = 0;
    ps.forEach(p=>{
      const section = p.closest('.sec');
      let arche = null;
      const sum = section && section.previousElementSibling && section.previousElementSibling.querySelector('h2');
      if(sum && sum.textContent) {
        const htxt = sum.textContent;
        for(const a of ARCHS){
          if(htxt.includes(a)){ arche = a; break; }
        }
      }
      let candidateList = ARCHS.filter(a=>a!==arche);
      const joker = candidateList[idx % candidateList.length];
      idx++;
      const d = document.createElement('div');
      d.className = 'joker-comment';
      d.setAttribute('data-joker', joker);
      d.innerHTML = `<small><em>Comentário (Coringa — ${escapeHtml(joker)}):</em> “${generateShortComment(joker)}”</small>`;
      p.insertAdjacentElement('afterend', d);
    });
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

  function generateShortComment(ar){
    const templates = {
      Kaos: ["E se racharmos a forma para ver o novo padrão?","Ruptura é método, tente quebrar aqui."],
      Lumine: ["Leveza abre clareiras, ilumina o próximo passo.","Sorria: clareiras surgem onde há curiosidade."],
      Rhea: ["Conecte, não isole; cada ponto é um laço.","Entrelaçe as intenções antes de agir."],
      Fit Lux: ["Meça a frequência — ajuste a intensidade.","Precisão é poesia quando bem aplicada."],
      Genus: ["Fiando a forma, o organismo se revela.","Trabalhe em camadas; o fractal aparece."],
      default: ["Observe uma dobra, há sempre novo sentido.","Faça uma pausa — a resposta pode emergir sozinha."]
    };
    const list = templates[ar] || templates['default'];
    return list[Math.floor(Math.random()*list.length)];
  }

  function attachPlayable(rootSelector='#root'){
    const container = document.querySelector(rootSelector);
    if(!container) return;
    container.addEventListener('click', (e)=>{
      const p = e.target.closest('.sec p, .sec blockquote, .sec .callout, .sec li');
      if(!p) return;
      if(e.target.closest('button,a')) return;
      const text = (p.innerText||'').replace('Copiar','').trim();
      if(!text) return;
      const ctx = p.closest('.sec');
      let tag = null;
      const heading = ctx && ctx.previousElementSibling && ctx.previousElementSibling.querySelector('h2');
      if(heading && /TRINITY/i.test(heading.textContent)) tag = 'TRINITY';
      if(/TRINITY/i.test(text)) tag = 'TRINITY';
      if(/UNO\b/i.test(text) || (heading && /UNO\b/i.test(heading.textContent))) tag = 'UNO';
      if(/KODUX\b/i.test(text) || (heading && /KODUX\b/i.test(heading.textContent))) tag = 'KODUX';
      if(/BLLUE\b/i.test(text) || (heading && /BLLUE\b/i.test(heading.textContent))) tag = 'BLLUE';
      let arche = null;
      if(heading && heading.textContent){
        for(const a of ARCHS){ if(new RegExp('\\b'+a+'\\b','i').test(heading.textContent)){ arche = a; break; } }
      }
      if(!arche){
        for(const a of ARCHS){ if(new RegExp('\\b'+a+'\\b','i').test(text)){ arche = a; break; } }
      }
      if(typeof speechSynthesis==='undefined'){ alert('TTS não disponível neste navegador'); return; }
      if(tag==='TRINITY'){
        trinitySpeak(text);
      } else if(tag==='UNO'){
        speakWithCombo(text, ['Atlas','Aion']);
      } else if(tag==='KODUX'){
        speakWithCombo(text, ['KODUX','Horus','Genus','Lumine']);
      } else if(tag==='BLLUE'){
        speakWithCombo(text, ['BLLUE','Pulse']);
      } else if(arche){
        speakAsArchetype(text, arche);
      } else {
        speakPlain(text);
      }
    });
  }

  function speakPlain(text){
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    speechSynthesis.speak(u);
  }

  function speakAsArchetype(text, arche){
    const cfg = VOICE_CFG[arche] || {};
    const voice = getVoiceForArchetype(arche);
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if(voice) u.voice = voice;
    u.lang = (voice && voice.lang) || 'pt-BR';
    u.rate = cfg.rate || 1.0;
    u.pitch = cfg.pitch || 1.0;
    speechSynthesis.speak(u);
  }

  function speakWithCombo(text, archeSeq){
    speechSynthesis.cancel();
    const words = text.split(/\s+/).filter(Boolean);
    let i = 0;
    const utterQueue = [];
    const chunkLen = Math.max(3, Math.floor(words.length / (archeSeq.length || 1)));
    archeSeq = archeSeq.length ? archeSeq : ['Atlas'];
    while(i < words.length){
      for(let a=0;a<archeSeq.length && i<words.length;a++){
        const take = Math.min(chunkLen, words.length - i);
        const chunkWords = words.slice(i, i+take).join(' ');
        const arche = archeSeq[a % archeSeq.length];
        const u = new SpeechSynthesisUtterance(chunkWords);
        const v = getVoiceForArchetype(arche);
        if(v) u.voice = v;
        u.lang = (v && v.lang) || 'pt-BR';
        const cfg = VOICE_CFG[arche] || {};
        u.rate = cfg.rate || 1.0;
        u.pitch = cfg.pitch || 1.0;
        utterQueue.push(u);
        i += take;
      }
    }
    if(!utterQueue.length) return;
    let pos = 0;
    utterQueue[pos].onend = ()=>{ pos++; if(pos<utterQueue.length) speechSynthesis.speak(utterQueue[pos]); };
    speechSynthesis.speak(utterQueue[0]);
  }

  function trinitySpeak(text){
    speechSynthesis.cancel();
    const words = text.split(/\s+/).filter(Boolean);
    const pattern = [3,6,9];
    let outQueue = [];
    let idx = 0, wpos = 0;
    while(wpos < words.length){
      const len = pattern[idx % pattern.length];
      idx++;
      const group = words.slice(wpos, wpos + len);
      wpos += len;
      const triad = pickRandomTriad();
      for(let j=0;j<group.length;j++){
        const arche = triad[j % triad.length];
        const u = new SpeechSynthesisUtterance(group[j]);
        const v = getVoiceForArchetype(arche);
        if(v) u.voice = v;
        u.lang = (v && v.lang) || 'pt-BR';
        const cfg = VOICE_CFG[arche] || {};
        u.rate = cfg.rate || 1.0;
        u.pitch = cfg.pitch || 1.0;
        outQueue.push(u);
      }
    }
    if(!outQueue.length) return;
    let p = 0;
    outQueue[p].onend = ()=>{ p++; if(p<outQueue.length) speechSynthesis.speak(outQueue[p]); };
    speechSynthesis.speak(outQueue[0]);
  }

  function pickRandomTriad(){
    const pool = ARCHS.slice().filter(a=>!/TRINITY|UNO|KODUX|BLLUE|INFODOSE|KOBLLUX|Deus|Jesus|Espírito Santo/i.test(a));
    for(let i=pool.length-1;i>0;i--){ const r=Math.floor(Math.random()*(i+1)); [pool[i],pool[r]]=[pool[r],pool[i]];}
    return [pool[0]||'Atlas', pool[1]||'Nova', pool[2]||'Pulse'];
  }

  function initWhenReady(){
    if(typeof speechSynthesis==='undefined'){ console.warn('No TTS'); return; }
    let voices = speechSynthesis.getVoices();
    if(!voices.length){
      speechSynthesis.onvoiceschanged = ()=>{ injectJokers(); attachPlayable(); console.info('[trinity] voices ready'); };
    } else {
      injectJokers(); attachPlayable(); console.info('[trinity] init done');
    }
  }

  const css = `
  .joker-comment{ margin-top:6px; font-size:0.9rem; opacity:0.92; color:var(--muted); }
  .joker-comment em{ color:var(--cyan); font-weight:600; }
  .sec p{ cursor: pointer; }
  .sec p:hover{ outline: 1px dashed rgba(255,255,255,0.03); background: rgba(255,255,255,0.01); }
  `;
  const s = document.createElement('style'); s.id='trinity-override-styles'; s.textContent = css; document.head.appendChild(s);

  document.addEventListener('DOMContentLoaded', ()=>{ try{ initWhenReady(); }catch(e){console.error(e);} });
  window.TrinityTTS = { injectJokers, attachPlayable, trinitySpeak, speakAsArchetype, speakWithCombo };
})();