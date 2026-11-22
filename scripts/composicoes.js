// composicoes.js -- composicoes de slide aprovadas pelo usuario, como funcoes (em vez de coordenadas refeitas a cada deck).
// Carregado automaticamente por moldura.js: const { overviewEmpresa, financeiro } = deck.composicoes;
// Cada funcao divide o miolo com deck.blocos, desenha os cabecalhos e preenche os blocos com as formas de formas.js.
// ATENCAO: sao UM arranjo entre varios (references/arranjos.md), nao o padrao. Use so quando o conteudo encaixa sem enchimento;
// os limites abaixo sao do molde, nunca motivo para inventar item ou KPI.
module.exports = function (deck) {
  const { formas } = deck;

  // Overview da empresa (2 colunas).
  // o: { cadeia: [[titulo, sub]] (2 a 5 itens reais), destaque: { etiqueta, bullets: [string], imagem?, tema?, imagemDescricao? },
  //      kpis: [{ valor, unidade, rotulo, nota }] (2 a 6), atencao: { rotulo, runs },
  //      cabEsq?, subEsq?, cabDir?, subDir? }
  function overviewEmpresa(s, o) {
    if (o.cadeia.length < 2 || o.cadeia.length > 5) throw new Error('overviewEmpresa: cadeia deve ter de 2 a 5 itens (se tiver menos de 2 itens reais, escolha outro arranjo)');
    if (o.kpis.length < 2 || o.kpis.length > 6) throw new Error('overviewEmpresa: de 2 a 6 KPIs (com menos de 2, escolha outro arranjo; nao invente KPI)');
    const [esq, dir] = deck.blocos(s, '2c', [
      { cab: o.cabEsq || 'Modelo de negocio', sub: o.subEsq }, { cab: o.cabDir || 'Numeros-chave', sub: o.subDir }]);
    // coluna esquerda: faixas numeradas + caixa com etiqueta (imagem + bullets)
    const n = o.cadeia.length, gap = 0.15, hCaixa = 1.25;
    const h = Math.max(0.38, Math.min(0.46, (esq.h - hCaixa - 0.45 - (n - 1) * gap) / n));
    formas.faixasNumeradasArco(s, { x: esq.x, y: esq.y + 0.05, w: esq.w, itens: o.cadeia, h, gap });
    const yc = esq.y + 0.05 + n * h + (n - 1) * gap + 0.4;
    const area = formas.caixaEtiqueta(s, { x: esq.x, y: yc, w: esq.w, h: esq.y + esq.h - yc, etiqueta: o.destaque.etiqueta });
    const wImg = Math.min(1.9, area.w * 0.38), b = o.destaque.bullets || [];
    deck.imagem(s, { x: area.x, y: area.y, w: wImg, h: area.h, caminho: o.destaque.imagem, tema: o.destaque.tema, descricao: o.destaque.imagemDescricao, nome: 'overview_destaque' });
    deck.txt(s, b.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < b.length - 1 } })),
      { x: area.x + wImg + 0.2, y: area.y, w: area.w - wImg - 0.2, h: area.h, fontSize: 10.5 });
    // coluna direita: grade de KPIs + ponto de atencao colado na base
    const linhas = Math.ceil(o.kpis.length / 2), passo = 0.86, defas = 0.2, hC = 1.0;
    formas.gradeKpiLosango(s, { x: dir.x, y: dir.y + 0.05, w: dir.w, kpis: o.kpis, passo, defasagem: defas });
    formas.chamadaConector(s, { x: dir.x, y: Math.max(dir.y + 0.05 + linhas * passo + defas + 0.15, dir.y + dir.h - hC), w: dir.w, h: hC, rotulo: o.atencao.rotulo, runs: o.atencao.runs });
  }

  // Financeiro (grafico largo + coluna estreita de leitura).
  // o: { grafico: (s, { x, y, w, h }) => void  (desenha o grafico na area dada), unidade?: 'Em R$ bi',
  //      leituras: [[titulo, sub]] (2 a 4), conclusao: { fita, runs }, cabEsq?, subEsq?, cabDir?, subDir? }
  function financeiro(s, o) {
    if (o.leituras.length < 2 || o.leituras.length > 4) throw new Error('financeiro: leituras deve ter de 2 a 4 itens');
    const [esq, dir] = deck.blocos(s, '2c', [
      { cab: o.cabEsq || 'Receita e margem', sub: o.subEsq }, { cab: o.cabDir || 'Leitura do grafico', sub: o.subDir }], { pesos: [2, 1] });
    const dy = o.unidade ? 0.24 : 0;
    if (o.unidade) deck.unidade(s, esq.x, esq.y, esq.w, o.unidade);
    o.grafico(s, { x: esq.x, y: esq.y + dy, w: esq.w, h: esq.h - dy });
    formas.lajesEmpilhadas(s, { x: dir.x, y: dir.y + 0.05, w: dir.w, itens: o.leituras });
    const hF = 1.1;
    // -0.08: o bloco de sombra da fita avanca 0,06 abaixo da caixa
    formas.caixaFita(s, { x: dir.x, y: dir.y + dir.h - hF - 0.08, w: dir.w, h: hF, fita: o.conclusao.fita, runs: o.conclusao.runs });
  }

  // Caixa lateral + elementos relacionados (estrutura dos decks de mercado: mercado_financeiro/caixa_esquerda_elementos_direita,
  // ex.: orizon_p006, nubank_p024, mabg_p048, kepl3_p047). A caixa leva a tese em texto; os satelites provam ou desdobram a tese e saem
  // ligados a ela por conector fino. Onde o deck de mercado poe um grafico, aqui entra o que o conteudo pedir: card, midia, bloco com icone
  // ou medidor (um grafico anotado tambem serve: desenhe-o fora e passe so o espaco com tipo 'livre').
  // o: { caixa: { titulo, itens: [{ titulo?, texto }] }   (1 a 3 itens; texto aceita runs)
  //      (caixa.h opcional: altura em pol; padrao pelo texto)
  //      satelites: [{ tipo: 'card', titulo, texto } | { tipo: 'midia', descricao, midia?: 'IMAGEM'|'VIDEO'|'MOCKUP', moldura? }
  //                  | { tipo: 'bloco', icone, titulo, texto } | { tipo: 'medidor', valor, rotulo, texto? } | { tipo: 'livre', desenhar: (s, rect) => void }]   (2 a 4)
  //      lado?: 'esquerda' (padrao) | 'direita', pesos?: [1, 2], cabEsq?, subEsq?, cabDir?, subDir?, ligar?: true }
  // Devolve { caixa, satelites: [rect] }.
  function caixaLateral(s, o) {
    const sat = o.satelites || [];
    if (sat.length < 2 || sat.length > 4) throw new Error('caixaLateral: de 2 a 4 satelites (com menos de 2, a caixa nao tem o que ligar; escolha outro arranjo)');
    const itens = (o.caixa && o.caixa.itens) || [];
    if (!o.caixa || !o.caixa.titulo || itens.length < 1 || itens.length > 3) throw new Error('caixaLateral: caixa precisa de titulo e de 1 a 3 itens de texto');
    const esq = o.lado !== 'direita', pesos = o.pesos || (esq ? [1, 2] : [2, 1]);
    const cabs = esq ? [{ cab: o.cabEsq || 'Tese', sub: o.subEsq }, { cab: o.cabDir || 'O que sustenta', sub: o.subDir }]
                     : [{ cab: o.cabDir || 'O que sustenta', sub: o.subDir }, { cab: o.cabEsq || 'Tese', sub: o.subEsq }];
    const [A, Bq] = deck.blocos(s, '2c', cabs, { pesos });
    let [areaCaixa, areaSat] = esq ? [A, Bq] : [Bq, A];
    // caixa com etiqueta + texto
    const hc = Math.min(areaCaixa.h - 0.25, o.caixa.h || 0.75 + itens.length * 1.45), yc = areaCaixa.y + 0.2 + (areaCaixa.h - 0.25 - hc) / 2;   // altura pelo texto (ou caixa.h), centrada no bloco
    const ic = formas.caixaEtiqueta(s, { x: areaCaixa.x, y: yc, w: areaCaixa.w - 0.1, h: hc, etiqueta: o.caixa.titulo });
    const runs = [];
    itens.forEach((it, i) => {
      if (it.titulo) runs.push({ text: it.titulo, options: { bold: true, color: deck.COR.dom, fontSize: 13, breakLine: true, paraSpaceBefore: i ? 12 : 0 } });
      (Array.isArray(it.texto) ? it.texto : [{ text: it.texto }]).forEach((r, j, arr) => runs.push({ text: r.text, options: Object.assign({ fontSize: 12 }, r.options || {}, j === arr.length - 1 ? { breakLine: i < itens.length - 1 } : {}) }));
    });
    deck.txt(s, runs, { x: ic.x, y: ic.y, w: ic.w, h: ic.h, valign: 'top', fontSize: 12 });
    // satelites empilhados (2 a 3) ou grade 2x2 (4)
    const gap = 0.18, rects = [];
    areaSat = Object.assign({}, areaSat, { w: areaSat.w - 0.1 });   // folga para a sombra do card nao passar da area util
    if (sat.length === 4) { const w = (areaSat.w - gap) / 2, h = (areaSat.h - 0.1 - gap) / 2; sat.forEach((_, i) => rects.push({ x: areaSat.x + (i % 2) * (w + gap), y: areaSat.y + 0.05 + Math.floor(i / 2) * (h + gap), w, h })); }
    else { const h = (areaSat.h - 0.1 - (sat.length - 1) * gap) / sat.length; sat.forEach((_, i) => rects.push({ x: areaSat.x, y: areaSat.y + 0.05 + i * (h + gap), w: areaSat.w, h })); }
    // conector fino da caixa para cada satelite (desenhado antes, fica atras)
    if (o.ligar !== false) {
      const xe = esq ? areaCaixa.x + areaCaixa.w - 0.1 : areaCaixa.x, ym = yc + hc / 2, xs = esq ? areaSat.x : areaSat.x + areaSat.w;
      const xt = (xe + xs) / 2, ln = (x1, y1, x2, y2) => s.addShape(deck.pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color: deck.COR.escuro, width: 0.75, dashType: 'sysDot' } });
      ln(xe, ym, xt, ym);
      const ys = rects.map(r => r.y + r.h / 2);
      ln(xt, Math.min(...ys, ym), xt, Math.max(...ys, ym));
      rects.forEach(r => ln(xt, r.y + r.h / 2, esq ? r.x : r.x + r.w, r.y + r.h / 2));
    }
    sat.forEach((t, i) => {
      const r = rects[i];
      if (t.tipo === 'card') { const a = formas.cardIJ(s, Object.assign({ titulo: t.titulo }, r)); deck.txt(s, t.texto, { x: a.x, y: a.y, w: a.w, h: a.h, valign: 'top', fontSize: 11 }); }
      else if (t.tipo === 'midia') formas.midia(s, { x: r.x, y: r.y, w: r.w, h: r.h, tipo: t.midia || 'IMAGEM', descricao: t.descricao, moldura: t.moldura });
      else if (t.tipo === 'bloco') formas.blocoIcone(s, { x: r.x, y: r.y, w: r.w, h: r.h, icone: t.icone, titulo: t.titulo, texto: t.texto });
      else if (t.tipo === 'medidor') { const d = Math.min(1.1, r.h - 0.1); formas.medidorCirculo(s, { x: r.x + 0.05, y: r.y + (r.h - d) / 2 - (t.texto ? 0 : 0), d, valor: t.valor, rotulo: t.rotulo, lado: 'direita', w: Math.min(2.2, r.w * 0.4) }); if (t.texto) deck.txt(s, t.texto, { x: r.x + d + Math.min(2.2, r.w * 0.4) + 0.3, y: r.y, w: r.w - d - Math.min(2.2, r.w * 0.4) - 0.3, h: r.h, valign: 'middle', fontSize: 11 }); }
      else if (t.tipo === 'livre' && typeof t.desenhar === 'function') t.desenhar(s, r);
      else throw new Error(`caixaLateral: tipo de satelite desconhecido "${t.tipo}" (card, midia, bloco, medidor, livre)`);
    });
    return { caixa: ic, satelites: rects };
  }

  return { overviewEmpresa, financeiro, caixaLateral };
};
