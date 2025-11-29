// ===================== convertLivroVivo.js =====================
// Conversor Livro Vivo → HTML (sem depender do autoBuild)
// - Callouts: ::info, ::warn, ::success, ::question, ::aside (1 linha)
// - Tabelista: primeiras 2 linhas vivas; da 3ª em diante, vira lista "- | ... | (col2) | ... |"
// - Blocos ascii / code
// - Botões [[btn:acao|Rótulo]]

(function(global){
  function lvEscapeHtml(s){
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  }

  function inlineLivroVivo(text){
    if (!text) return '';

    // botões [[btn:acao|Rótulo]]
    text = text.replace(/\[\[btn:([^\]|]+)(?:\|([^\]]+))?\]\]/g, function(_m,action,label){
      const act = lvEscapeHtml(action.trim());
      const lab = lvEscapeHtml((label || action).trim());
      return `<button class="btn" data-action="${act}">${lab}</button>`;
    });

    // links [texto](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_m,label,href){
      return `<a href="${lvEscapeHtml(href)}" target="_blank" rel="noopener">${lvEscapeHtml(label)}</a>`;
    });

    // inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // bold + italic
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    return text;
  }

  function convertLivroVivo(md){
    if (md == null) return '';
    md = String(md).replace(/\r\n?/g, '\n');

    const lines = md.split('\n');
    const out = [];
    let i = 0;
    let inCode = false;
    let codeLang = '';
    let codeBuf = [];

    function flushCode(){
      if (!inCode) return;
      const code = codeBuf.join('\n');
      if (codeLang === 'ascii'){
        out.push('<pre class="md-code ascii"><code>' + lvEscapeHtml(code) + '</code></pre>');
      } else {
        const langClass = codeLang ? (' md-code-' + codeLang) : '';
        out.push('<pre class="md-code' + langClass + '"><code>' + lvEscapeHtml(code) + '</code></pre>');
      }
      inCode = false;
      codeLang = '';
      codeBuf = [];
    }

    function flushParagraph(buf){
      if (!buf.length) return;
      const txt = buf.join(' ').trim();
      if (!txt) { buf.length = 0; return; }
      out.push('<p>' + inlineLivroVivo(txt) + '</p>');
      buf.length = 0;
    }

    while (i < lines.length){
      let line = lines[i];

      // dentro de bloco de código
      if (inCode){
        if (/^```/.test(line)){
          flushCode();
          i++;
          continue;
        }
        codeBuf.push(line);
        i++;
        continue;
      }

      // início de bloco de código
      const codeMatch = line.match(/^```(\w+)?\s*$/);
      if (codeMatch){
        flushParagraph([]);
        inCode = true;
        codeLang = (codeMatch[1] || '').toLowerCase();
        codeBuf = [];
        i++;
        continue;
      }

      // linha em branco
      if (/^\s*$/.test(line)){
        flushParagraph([]);
        out.push('');
        i++;
        continue;
      }

      // headings
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h){
        flushParagraph([]);
        const level = h[1].length;
        out.push('<h'+level+'>'+inlineLivroVivo(h[2].trim())+'</h'+level+'>');
        i++;
        continue;
      }

      // callouts (1 linha, ::info/::warn/::success/::question/::aside)
      const call = line.match(/^::(info|warn|success|question|aside)\s+(.*)$/i);
      if (call){
        flushParagraph([]);
        const kind = call[1].toLowerCase();
        const body = call[2].trim();
        out.push('<div class="callout '+kind+'">'+inlineLivroVivo(body)+'</div>');
        i++;
        continue;
      }

      // Tabelista: tabela markdown fora de bloco de código
      if (/^\s*\|.*\|\s*$/.test(line) && i+1 < lines.length && /^\s*\|[-:]+.*\|\s*$/.test(lines[i+1])){
        flushParagraph([]);

        const tableLines = [];
        tableLines.push(line);
        tableLines.push(lines[i+1]);
        let j = i+2;
        while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j])){
          tableLines.push(lines[j]);
          j++;
        }

        // 1ª e 2ª linhas vivas
        const header = tableLines[0];
        const sep = tableLines[1];
        out.push('<p>'+lvEscapeHtml(header)+'</p>');
        out.push('<p>'+lvEscapeHtml(sep)+'</p>');

        // da 3ª linha em diante: vira lista
        if (tableLines.length > 2){
          out.push('<ul class="tbl-list">');
          for (let k = 2; k < tableLines.length; k++){
            const raw = tableLines[k];
            const cells = raw.replace(/^\s*\||\|\s*$/g,'').split('|').map(c=>c.trim());
            if (cells.length < 2){
              out.push('<li>'+lvEscapeHtml(raw.trim())+'</li>');
            } else {
              const c1 = cells[0] || '';
              const c2 = cells[1] || '';
              const rest = cells.slice(2).join(' | ');
              const lineStr = `| ${c1} | (${c2}) | ${rest} |`;
              out.push('<li>'+lvEscapeHtml(lineStr)+'</li>');
            }
          }
          out.push('</ul>');
        }

        i = j;
        continue;
      }

      // lista simples (não aninhada)
      const listMatch = line.match(/^\s*([-*+]|\d+\.)\s+(.*)$/);
      if (listMatch){
        flushParagraph([]);
        const isOrdered = /^\d+\./.test(listMatch[1]);
        const tag = isOrdered ? 'ol' : 'ul';
        const items = [];
        let j = i;
        while (j < lines.length){
          const lm = lines[j].match(/^\s*([-*+]|\d+\.)\s+(.*)$/);
          if (!lm) break;
          items.push(lm[2]);
          j++;
        }
        out.push('<'+tag+'>');
        for (const item of items){
          out.push('<li>'+inlineLivroVivo(item.trim())+'</li>');
        }
        out.push('</'+tag+'>');
        i = j;
        continue;
      }

      // blockquote simples
      if (/^\s*>/.test(line)){
        flushParagraph([]);
        const bq = [];
        let j = i;
        while (j < lines.length && /^\s*>/.test(lines[j])){
          bq.push(lines[j].replace(/^\s*>+\s?/, '').trim());
          j++;
        }
        out.push('<blockquote>'+inlineLivroVivo(bq.join(' '))+'</blockquote>');
        i = j;
        continue;
      }

      // parágrafo normal (acumula)
      let paraBuf = [line.trim()];
      i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) &&
             !/^```(\w+)?\s*$/.test(lines[i]) &&
             !/^(#{1,6})\s+/.test(lines[i]) &&
             !/^::(info|warn|success|question|aside)\s+/.test(lines[i]) &&
             !/^\s*\|.*\|\s*$/.test(lines[i]) &&
             !/^\s*([-*+]|\d+\.)\s+/.test(lines[i]) &&
             !/^\s*>/.test(lines[i])){
        paraBuf.push(lines[i].trim());
        i++;
      }
      flushParagraph(paraBuf);
    }

    flushCode();

    return out.join('\n');
  }

  // Expor no global
  global.convertLivroVivo = convertLivroVivo;
  global.inlineLivroVivo = inlineLivroVivo;
})(window);
