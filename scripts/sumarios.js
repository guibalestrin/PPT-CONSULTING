// sumarios.js -- sumarios (transicao, pilares da tese, indice, resumo executivo) e pop-ups, no formato dos decks de referencia.
// Carregado por moldura.js; as funcoes publicas aparecem como deck.indice, deck.resumoExecutivo,
// deck.popup, deck.esmaecer, deck.destacar e deck.faixaPergunta. Ver references/sumarios_popups.md.
//   require('./sumarios.js')({ pres, COR, F, formas, tom, larg, X0, X1, AREA })
// Regras copiadas das referencias: item ativo aceso e os demais esmaecidos (cinza claro, nunca outra cor); contorno fino;
// numerais romanos (I, II...) ou 01/02/03; nada de cartao arredondado com icone em circulo.
module.exports = function ({ pres, COR, F, formas, tom, larg, X0, X1, AREA }) {
  const S = pres.shapes;
  const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const APAGADO = 'BFBFBF', APAGADO2 = 'D0D0D0', FIO = 'D9D9D9', MEDIO = 'A6A6A6', PAINEL = 'F2F2F2';
  const W_SLIDE = 13.333, H_SLIDE = 7.5;
  const ESC = tom(COR.texto, -0.4);
  const T = (s, c, o) => s.addText(c, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: COR.texto, fontSize: 9 }, o));

  // ------------------------------------------------------------------ indice (colunas por tema, itens sublinhados com link para o slide)
  // grupos: [{ titulo, itens: [{ texto, slide? }] }] (slide = numero final do slide, vira link interno); colunas: quantas colunas
  function indice(s, grupos, o = {}) {
    const nCol = o.colunas || Math.min(3, grupos.length), colW = (AREA.w - 0.3 * (nCol - 1)) / nCol;
    const cols = Array.from({ length: nCol }, () => []);
    const peso = grupos.map(g => 1 + g.itens.length * 0.8);
    const alvo = peso.reduce((a, b) => a + b, 0) / nCol; let c = 0, acc = 0;
    grupos.forEach((g, i) => { if (acc >= alvo * (c + 1) - 0.01 && c < nCol - 1) c++; cols[c].push(g); acc += peso[i]; });
    cols.forEach((gs, ci) => {
      const x = AREA.x + ci * (colW + 0.3); let y = AREA.y + 0.1;
      gs.forEach(g => {
        T(s, g.titulo, { x, y, w: colW, h: 0.26, fontSize: 10, bold: true, color: COR.texto, valign: 'bottom', objectName: 'SUM_indice' });
        s.addShape(S.LINE, { x, y: y + 0.3, w: colW, h: 0, line: { color: COR.dom, width: 0.75 } });
        y += 0.4;
        g.itens.forEach(it => {
          const run = { text: it.texto, options: { fontSize: 8, color: COR.texto, underline: { style: 'sng' } } };
          if (it.slide) run.options.hyperlink = { slide: it.slide, tooltip: it.texto };
          T(s, [run], { x: x + 0.1, y, w: colW - 0.1, h: 0.2 });
          y += 0.23;
        });
        y += 0.2;
      });
    });
  }

  // ------------------------------------------------------------------ resumo executivo (M&A): 2 faixas de 2 mini-exhibits, uma conclusao em negrito sobre cada faixa
  // itens: [{ cab, sub?, desenhar(s, area) }] (2 ou 4); conclusoes: [frase da 1a faixa, frase da 2a]
  function resumoExecutivo(s, o) {
    const itens = o.itens, linhas = itens.length <= 2 ? 1 : 2, porLinha = Math.ceil(itens.length / linhas);
    const gap = 0.3, hLinha = (AREA.h - 0.1 - (linhas - 1) * 0.15) / linhas, wC = (AREA.w - gap * (porLinha - 1)) / porLinha;
    for (let l = 0; l < linhas; l++) {
      const y = AREA.y + l * (hLinha + 0.15);
      if (o.conclusoes && o.conclusoes[l]) T(s, o.conclusoes[l], { x: AREA.x, y, w: AREA.w, h: 0.3, fontSize: 10, bold: true, align: 'center', color: COR.dom });
      const yq = y + (o.conclusoes && o.conclusoes[l] ? 0.36 : 0), hq = hLinha - (yq - y);
      for (let k = 0; k < porLinha; k++) {
        const i = l * porLinha + k; if (!itens[i]) continue;
        const x = AREA.x + k * (wC + gap), it = itens[i];
        s.addShape(S.RECTANGLE, { x, y: yq, w: wC, h: hq, fill: { type: 'none' }, line: { color: MEDIO, width: 0.75 }, objectName: 'RESUMO_q' + i });
        T(s, [{ text: `${ROM[i]}. ${it.cab}`, options: { bold: true, fontSize: 9, color: COR.texto, breakLine: !!it.sub } }].concat(it.sub ? [{ text: it.sub, options: { fontSize: 8, color: COR.cinza } }] : []),
          { x: x + 0.12, y: yq + 0.06, w: wC - 0.24, h: it.sub ? 0.38 : 0.22, valign: 'top' });
        if (it.desenhar) { const dy = it.sub ? 0.5 : 0.32; it.desenhar(s, { x: x + 0.12, y: yq + dy, w: wC - 0.24, h: hq - dy - 0.08 }); }
      }
    }
  }

  // ------------------------------------------------------------------ esmaecer / pop-up / faixa-pergunta
  // veu branco translucido: sobre o slide inteiro ou sobre um retangulo (bloco que nao e o da vez)
  function esmaecer(s, r, nivel = 0.82) {
    const a = r || { x: 0, y: 0, w: W_SLIDE, h: H_SLIDE };
    s.addShape(S.RECTANGLE, { x: a.x, y: a.y, w: a.w, h: a.h, fill: { color: 'FFFFFF', transparency: Math.round((1 - nivel) * 100) }, line: { type: 'none' }, objectName: 'VEU' });
  }
  // revelacao progressiva: esmaece todos os retangulos menos o(s) ativo(s). ativo: indice ou lista de indices
  function destacar(s, rects, ativo, nivel = 0.78) {
    const on = [].concat(ativo);
    rects.forEach((r, i) => { if (!on.includes(i)) esmaecer(s, r, nivel); });
  }
  // popup(s, { paineis: [{ x, y, w, h, titulo?, subtitulo?, diagonal? }], nivel?, cor? }): esmaece o slide e abre 1 ou 2 paineis brancos
  // com contorno preto fino, sombra dura cinza (deslocada para baixo e para a direita) e etiqueta de titulo na cor, sobre a borda de cima.
  // Devolve as areas internas (uma por painel) para desenhar o conteudo com deck.formas.
  function popup(s, o) {
    esmaecer(s, null, o.nivel || 0.84);
    const cor = o.cor === 'escuro' ? COR.escuro : COR.dom;
    return o.paineis.map((p, i) => {
      s.addShape(S.RECTANGLE, { x: p.x + 0.1, y: p.y + 0.1, w: p.w, h: p.h, fill: { color: MEDIO }, line: { type: 'none' }, objectName: `POPUP_sombra_${i}` });
      s.addShape(S.RECTANGLE, { x: p.x, y: p.y, w: p.w, h: p.h, fill: { color: 'FFFFFF' }, line: { color: '000000', width: 1.25 }, objectName: `POPUP_painel_${i}` });
      let dy = 0.14;
      if (p.titulo) {
        const wt = Math.min(p.w + 0.1, larg(p.titulo, 9.5, true) + 0.45), yt = p.y - 0.14;
        s.addShape(S.RECTANGLE, { x: p.x - 0.05, y: yt, w: wt, h: 0.28, fill: { color: cor }, line: { type: 'none' }, objectName: `POPUP_aba_${i}` });
        if (p.diagonal !== false) s.addShape(S.RIGHT_TRIANGLE, { x: p.x - 0.05 + wt, y: yt, w: 0.2, h: 0.28, flipV: true, fill: { color: cor }, line: { type: 'none' } });
        T(s, p.titulo, { x: p.x + 0.07, y: yt, w: wt - 0.1, h: 0.28, fontSize: 9.5, bold: true, color: 'FFFFFF' });
        dy = 0.3;
      }
      if (p.subtitulo) {   // frase em negrito centralizada com fio embaixo (Agrion, p. 10)
        T(s, p.subtitulo, { x: p.x + 0.15, y: p.y + dy, w: p.w - 0.3, h: 0.28, fontSize: 9, bold: true, align: 'center' });
        s.addShape(S.LINE, { x: p.x + 0.15, y: p.y + dy + 0.31, w: p.w - 0.3, h: 0, line: { color: COR.texto, width: 0.75 } });
        dy += 0.42;
      }
      return { x: p.x + 0.15, y: p.y + dy, w: p.w - 0.3, h: p.h - dy - 0.12 };
    });
  }
  // faixa-pergunta de transicao (Kepler, Nubank): slide anterior esmaecido + faixa larga com a pergunta que o proximo bloco responde
  // estilo 'cinza' (Kepler: faixa cinza, texto grande preto) | 'cor' (Nubank: faixa na cor, italico branco; *palavra* em negrito)
  function faixaPergunta(s, texto, o = {}) {
    esmaecer(s, null, o.nivel || 0.88);
    const h = o.h || 1.3, y = o.y || (H_SLIDE - h) / 2 - 0.2, cor = o.estilo === 'cor';
    s.addShape(S.RECTANGLE, { x: 0, y, w: W_SLIDE, h, fill: { color: cor ? COR.dom : 'D9D9D9', transparency: cor ? 0 : 8 }, line: { type: 'none' }, objectName: 'FAIXA_pergunta' });
    const runs = texto.split(/(\*[^*]+\*)/).filter(Boolean).map(p => /^\*.*\*$/.test(p)
      ? { text: p.slice(1, -1), options: { bold: true } } : { text: p, options: {} });
    T(s, runs, { x: 1.5, y, w: W_SLIDE - 3, h, fontSize: o.tamanho || 20, italic: cor, color: cor ? 'FFFFFF' : '000000', align: 'center' });
  }

  return { indice, resumoExecutivo, esmaecer, destacar, popup, faixaPergunta };
};
