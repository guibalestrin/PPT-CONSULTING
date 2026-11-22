// exhibits.js -- exhibits e anotacoes no formato EXATO dos decks de referencia do usuario (12 PDFs + 1 PPTX; references/gramatica.md
// e references/exhibits.md). Carregado por moldura.js e somado a deck.formas. Tudo nasce na densidade de referencia:
// corpo 9pt, legenda/rotulo 8pt, micro 7pt. Nada aqui e "molde de slide": sao pecas para compor o slide que o conteudo pedir.
//   require('./exhibits.js')(pres, COR, F, formas, { imagem, tmp, aqui })
// Regras de formatacao comuns (copiadas das referencias): contornos finos (0,75pt), tracejado para anotacao e projecao, cinzas
// neutros (F2F2F2 painel, D9D9D9 fio, A6A6A6 apoio, 595959 texto de apoio), uma cor de destaque por exhibit, rotulo direto no dado.
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

module.exports = function (pres, COR, F, formas, ctx = {}) {
  const S = pres.shapes;
  const { tom, larguraTexto } = formas;
  let seq = 0;
  const id = (p) => `${p}_${++seq}`;
  const grad = (nome, ang, stops) => { formas.degrades[nome] = { ang, stops }; return nome; };
  const PAINEL = 'F2F2F2', FIO = 'D9D9D9', MEDIO = 'A6A6A6', APOIO = '595959';
  const ESC = tom(COR.texto, -0.4);
  const texto = (s, c, o) => s.addText(c, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: COR.texto, fontSize: 9 }, o));
  const linha = (s, x, y, w, h, o) => s.addShape(S.LINE, { x, y, w, h, line: Object.assign({ color: MEDIO, width: 0.75 }, o) });
  function seg(s, x1, y1, x2, y2, o) {   // linha de (x1, y1) ate (x2, y2); a ponta de seta (endArrowType) fica sempre em (x2, y2)
    const ln = Object.assign({ color: MEDIO, width: 0.75 }, o);
    // a forma comeca na ponta de cima (ou na esquerda, se horizontal): se o destino for essa ponta, a seta vai para o inicio
    if (ln.endArrowType && (y2 < y1 || (y2 === y1 && x2 < x1))) { ln.beginArrowType = ln.endArrowType; delete ln.endArrowType; }
    s.addShape(S.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      flipH: (x2 < x1) !== (y2 < y1) && x1 !== x2 && y1 !== y2, line: ln });
  }
  const claro = (hex) => { const n = parseInt(hex, 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 165; };
  const sobre = (hex) => claro(hex) ? ESC : 'FFFFFF';
  const mistura = (a, b, t) => { const x = parseInt(a, 16), y = parseInt(b, 16); return [16, 8, 0].map(k => Math.round(((x >> k) & 255) * (1 - t) + ((y >> k) & 255) * t).toString(16).padStart(2, '0')).join('').toUpperCase(); };
  function fmt(v, casas) {
    if (typeof v !== 'number') return v == null ? '' : String(v);
    const c = casas != null ? casas : (Number.isInteger(v) ? 0 : 1);
    const [int, dec] = Math.abs(v).toFixed(c).split('.');
    return (v < 0 ? '-' : '') + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (dec ? ',' + dec : '');
  }
  const soma = (a) => a.reduce((x, y) => x + y, 0);

  // =====================================================================================================================
  // 1. GRAFICO NATIVO com o acabamento das referencias + ajudante de posicao para a camada de anotacao
  // =====================================================================================================================
  // grafico(s, { tipo, x, y, w, h, categorias, series: [{ nome, valores, cor?, tipo?: 'linha' (so no combo) }], ... }) -> plot
  // tipo: 'colunas' | 'empilhado' | 'empilhado100' | 'barras' | 'barrasEmpilhadas' | 'linha' | 'area' | 'rosca' | 'combo'
  // opcoes: max, min (eixo de valores; sem max = 1,18 x o maior valor, para caber rotulo e anotacao), rotulos (true),
  //   formato ('#,##0' | '0.0' | '0%' ...), legenda (auto: so com 2+ series), gap (60), destaque: [i] (categorias em cor; o resto fica
  //   cinza), projecaoDe: i (a partir da categoria i a serie fica em tom claro: projecao), suave (linhas), rotulosLinha: 'caixa' | 'texto',
  //   folgaTopo (fracao extra do eixo reservada para colchete/nota, ex.: 0.25), opcoes: {} (opcoes cruas do pptxgenjs, se precisar)
  // Acabamento fixo (o que as referencias tem em comum): sem eixo de valores, sem grade, eixo de categorias em fio cinza, texto 8pt,
  //   legenda pequena em cima a esquerda, rotulo direto no dado, cores chapadas da paleta (degrade so se voce passar em deck.finalizar).
  // Devolve plot = { cx(i), cy(v), x0, x1, yBase, yTopo, passo }: coordenadas em polegadas para posicionar colcheteCagr, nota,
  //   elipse, marcoEvento e linhaRef exatamente sobre o dado (nao chute coordenadas).
  formas.estilosGraficos = formas.estilosGraficos || {};
  const usados = {};
  function nomeUnico(nome) { usados[nome] = (usados[nome] || 0) + 1; return nome + '​'.repeat(usados[nome] - 1); }
  const PALETA = () => [COR.dom, COR.dest, COR.escuro, MEDIO, COR.clara, tom(COR.dom, 0.35)];
  function grafico(s, o) {
    const { tipo = 'colunas', x, y, w, h, categorias } = o;
    let kCor = 0;   // series sem cor recebem a paleta em ordem (dominante primeiro), pulando as que ja vieram com cor (ex.: o par cinza)
    const series = o.series.map((se) => se.cor ? Object.assign({}, se) : Object.assign({}, se, { cor: PALETA()[kCor++ % 6] }));
    const n = categorias.length, multi = series.length > 1, legenda = o.legenda !== undefined ? o.legenda : (multi && tipo !== 'rosca');
    const emp = ['empilhado', 'empilhado100', 'barrasEmpilhadas'].includes(tipo) || (tipo === 'combo' && o.empilhar);
    const horiz = tipo === 'barras' || tipo === 'barrasEmpilhadas';
    const colS = tipo === 'combo' ? series.filter(se => se.tipo !== 'linha') : series, linS = tipo === 'combo' ? series.filter(se => se.tipo === 'linha') : [];
    const maior = emp ? Math.max(...categorias.map((_, i) => soma(colS.map(se => Math.max(0, se.valores[i] || 0))))) : Math.max(...colS.flatMap(se => se.valores.filter(v => v != null)));
    const menor = Math.min(0, ...colS.flatMap(se => se.valores.filter(v => v != null)));
    const max = o.max != null ? o.max : (tipo === 'empilhado100' ? 1 : maior * (tipo === 'combo' ? 1.62 : 1.18 + (o.folgaTopo || 0)));
    const min = o.min != null ? o.min : (menor < 0 ? menor * 1.2 : 0);
    const lay = o.layout || (horiz ? { x: 0.3, y: legenda ? 0.12 : 0.03, w: 0.62, h: legenda ? 0.84 : 0.94 } : { x: 0.02, y: legenda ? 0.15 : 0.05, w: 0.96, h: legenda ? 0.71 : 0.81 });
    const fmtCode = o.formato || (maior >= 100 ? '#,##0' : (maior <= 1.5 && tipo !== 'empilhado100' ? '0.0%' : '0.0'));
    const dados = (lista) => lista.map(se => {
      const nome = nomeUnico(se.nome), est = {};
      if (o.destaque && se.tipo !== 'linha') { est.pontos = {}; categorias.forEach((_, i) => { if (!o.destaque.includes(i)) est.pontos[i] = { cor: 'BFBFBF' }; }); }
      if (o.projecaoDe != null && se.tipo !== 'linha' && !['linha', 'area'].includes(tipo)) { est.pontos = est.pontos || {}; for (let i = o.projecaoDe; i < n; i++) est.pontos[i] = { cor: tom(se.cor, 0.5) }; }
      if (se.tipo === 'linha' || tipo === 'linha') {
        Object.assign(est, { linha: { cor: se.cor, larg: 1.75, traco: se.tracejada ? 'dash' : undefined }, suave: !!o.suave, marcador: { simbolo: 'circle', tam: 5, fill: se.cor, borda: se.cor } });
        if ((o.rotulosLinha || 'caixa') === 'caixa' && o.rotulos !== false) est.caixa = { fill: se.cor, texto: sobre(se.cor) };
      }
      if (emp && tipo !== 'empilhado100' && o.rotulos !== false) {   // segmento baixo demais nao leva rotulo (as referencias rotulam so o que cabe)
        const manter = se.valores.map((v, i) => [v, i]).filter(([v]) => v != null && Math.abs(v) >= (o.rotuloMin != null ? o.rotuloMin : max * 0.12)).map(([, i]) => i);
        if (manter.length < n) est.rotulos = manter;
      }
      if ((tipo === 'linha') && series.length === 2 && o.rotulos !== false) {   // duas linhas: rotulos de uma em cima, da outra embaixo
        const med = (z) => soma(z.valores.filter(v => v != null)) / z.valores.length, outra = series[1 - series.indexOf(se)];
        est.posRotulo = med(se) >= med(outra) ? 't' : 'b';
      }
      if (tipo === 'area') Object.assign(est, { grad: [[0, se.cor, 80], [100, se.cor, 30]], ang: 90, linha: { cor: se.cor, larg: 1.5 } });   // area translucida: as series nao se escondem
      if (se.estilo) Object.assign(est, se.estilo);
      if (Object.keys(est).length) formas.estilosGraficos[nome] = est;
      return { name: nome, labels: categorias, values: se.valores };
    });
    const comum = {
      x, y, w, h, layout: lay,
      catAxisLabelFontFace: F, catAxisLabelFontSize: 8, catAxisLabelColor: APOIO, catAxisLineShow: true, catGridLine: { style: 'none' },
      valAxisHidden: false, valAxisLabelColor: 'FFFFFF', valAxisLabelFontSize: 6, valAxisLabelFormatCode: ';;;', valAxisLineShow: false, valGridLine: { style: 'none' },
      valAxisMinVal: min, valAxisMaxVal: max,
      showLegend: legenda, legendPos: 't', legendFontFace: F, legendFontSize: 8, legendColor: APOIO,
      showValue: o.rotulos !== false, dataLabelFontFace: F, dataLabelFontSize: 8, dataLabelFontBold: true, dataLabelFormatCode: fmtCode,
    };
    if (tipo === 'rosca') {
      s.addChart(pres.charts.DOUGHNUT, dados([series[0]]), Object.assign({ x, y, w, h, holeSize: o.furo || 58, chartColors: o.cores || categorias.map((_, i) => i === 0 ? COR.dom : [COR.dest, MEDIO, FIO, COR.escuro, COR.clara][(i - 1) % 5]),
        showLegend: o.legenda !== false, legendPos: o.legendaPos || 'r', legendFontFace: F, legendFontSize: 8, legendColor: APOIO, showPercent: o.rotulos !== false, showValue: false, showLeaderLines: false,
        dataLabelFontFace: F, dataLabelFontSize: 8, dataLabelFontBold: true, dataLabelColor: 'FFFFFF', dataBorder: { pt: 1, color: 'FFFFFF' } }, o.opcoes));
      return { x0: x, x1: x + w, yTopo: y, yBase: y + h, cx: () => x + w / 2, cy: () => y + h / 2, passo: 0 };
    }
    if (tipo === 'combo') {
      const lv = linS.flatMap(se => se.valores.filter(v => v != null)), lmin = Math.min(...lv), lmax = Math.max(...lv), span = Math.max(lmax - lmin, Math.abs(lmax) * 0.15, 1e-9);
      // colunas ate ~62% da altura; a linha flutua na faixa de 70% a 86%, com os rotulos em caixa acima dela e abaixo da legenda
      const max2 = o.max2 != null ? o.max2 : lmax + (span / 0.16) * 0.14, min2 = o.min2 != null ? o.min2 : max2 - span / 0.16;
      const eixo = { valAxisHidden: false, valAxisLabelColor: 'FFFFFF', valAxisLabelFontSize: 6, valAxisLabelFormatCode: ';;;', valAxisLineShow: false, valGridLine: { style: 'none' } };
      s.addChart([
        { type: pres.charts.BAR, data: dados(colS), options: { barDir: 'col', barGrouping: emp ? 'stacked' : 'clustered', chartColors: colS.map(se => se.cor), barGapWidthPct: o.gap || 60,
          dataLabelPosition: emp ? 'ctr' : 'outEnd', dataLabelColor: emp ? 'FFFFFF' : ESC } },
        { type: pres.charts.LINE, data: dados(linS), options: { chartColors: linS.map(se => se.cor), secondaryValAxis: true, secondaryCatAxis: true, lineSize: 1.75, lineDataSymbol: 'circle', lineDataSymbolSize: 5,
          dataLabelPosition: 't', dataLabelColor: 'FFFFFF', dataLabelFormatCode: o.formatoLinha || '0.0%' } },
      ], Object.assign({}, comum, { valAxes: [Object.assign({ valAxisMinVal: min, valAxisMaxVal: max }, eixo), Object.assign({ valAxisMinVal: min2, valAxisMaxVal: max2 }, eixo)],
        catAxes: [{ catAxisLabelFontFace: F, catAxisLabelFontSize: 8, catAxisLabelColor: APOIO }, { catAxisHidden: true }] }, o.opcoes));
      const p = plot(x, y, w, h, lay, n, min, max);
      p.cy2 = (v) => y + h * lay.y + h * lay.h * (1 - (v - min2) / (max2 - min2));
      return p;
    }
    const mapa = { colunas: ['BAR', { barDir: 'col', barGrouping: 'clustered' }], empilhado: ['BAR', { barDir: 'col', barGrouping: 'stacked' }], empilhado100: ['BAR', { barDir: 'col', barGrouping: 'percentStacked' }],
      barras: ['BAR', { barDir: 'bar', barGrouping: 'clustered', catAxisOrientation: 'maxMin' }], barrasEmpilhadas: ['BAR', { barDir: 'bar', barGrouping: 'stacked', catAxisOrientation: 'maxMin' }],
      linha: ['LINE', { lineSize: 1.75, lineDataSymbol: 'circle', lineDataSymbolSize: 5 }], area: ['AREA', {}] };
    if (!mapa[tipo]) throw new Error(`grafico: tipo desconhecido "${tipo}". Use: ${Object.keys(mapa).concat(['rosca', 'combo']).join(', ')}`);
    const [ct, extra] = mapa[tipo], ehBarra = ct === 'BAR';
    const ops = Object.assign({}, comum, extra, { chartColors: series.map(se => se.cor), barGapWidthPct: o.gap || (multi && !emp ? 45 : 60) },
      ehBarra ? (emp ? { dataLabelPosition: 'ctr', dataLabelColor: 'FFFFFF' } : { dataLabelPosition: 'outEnd', dataLabelColor: ESC }) : { dataLabelPosition: 't', dataLabelColor: tipo === 'linha' && (o.rotulosLinha || 'caixa') === 'caixa' ? 'FFFFFF' : ESC },
      tipo === 'empilhado100' ? { valAxisMinVal: undefined, valAxisMaxVal: undefined } : {}, o.opcoes);
    if (tipo === 'area') ops.showValue = false;
    if (horiz) ops.catAxisLineShow = false;
    s.addChart(pres.charts[ct], dados(series), ops);
    const p = plot(x, y, w, h, lay, n, min, max, horiz);
    if (o.totais && emp && !horiz) categorias.forEach((_, i) => {   // total em negrito acima da coluna empilhada (Orizon, Kepler, Nubank)
      const tot = soma(series.map(se => se.valores[i] || 0));
      texto(s, typeof o.totais === 'function' ? o.totais(tot, i) : fmt(tot), { x: p.cx(i) - p.passo / 2, y: p.cy(tot) - 0.2, w: p.passo, h: 0.18, fontSize: 8, bold: true, color: ESC, align: 'center' });
    });
    return p;
  }
  function plot(x, y, w, h, lay, n, min, max, horiz) {
    const px = x + w * lay.x, pw = w * lay.w, py = y + h * lay.y, ph = h * lay.h;
    if (horiz) return { x0: px, x1: px + pw, yTopo: py, yBase: py + ph, passo: ph / n, cy: (i) => py + ph * (i + 0.5) / n, cx: (v) => px + pw * (v - min) / (max - min) };
    return { x0: px, x1: px + pw, yTopo: py, yBase: py + ph, passo: pw / n, cx: (i) => px + pw * (i + 0.5) / n, cy: (v) => py + ph * (1 - (v - min) / (max - min)) };
  }

  // =====================================================================================================================
  // 2. CAMADA DE ANOTACAO (o que faz o grafico parecer feito por analista: Kepler, Rede D'Or, Nubank, M&A Bunge, Orizon)
  // =====================================================================================================================
  // colcheteCagr: liga o primeiro e o ultimo ponto com um colchete e escreve a taxa no meio.
  //   estilo 'pinos' (Kepler/M&A): linha tracejada cinza com o rotulo entre dois pinos; 'pilula' (Nubank/Rede D'Or): linha cheia + etiqueta preenchida
  //   x1, x2 = centro das categorias (plot.cx); y = altura do colchete; y1, y2 = topo de cada coluna (plot.cy(valor)): as pernas descem ate la
  function colcheteCagr(s, { x1, x2, y, y1, y2, rotulo, estilo = 'pinos', cor, folga = 0.2 }) {   // folga: espaco do rotulo de dado acima da coluna
    const c = cor || (estilo === 'pilula' ? COR.dom : APOIO), wr = larguraTexto(rotulo, 8, true) + 0.2, xm = (x1 + x2) / 2;
    const tr = estilo === 'pilula' ? { color: c, width: 1 } : { color: c, width: 0.75, dashType: 'sysDash' };
    if (estilo === 'pilula') linha(s, x1, y, x2 - x1, 0, tr);
    else { linha(s, x1, y, xm - wr / 2 - 0.06 - x1, 0, tr); linha(s, xm + wr / 2 + 0.06, y, x2 - xm - wr / 2 - 0.06, 0, tr); }
    [[x1, y1], [x2, y2]].forEach(([xx, yy]) => {
      const yf = yy == null ? null : yy - folga;
      if (yf == null || yf <= y + 0.04) return;
      linha(s, xx, y, 0, yf - y, tr);
      linha(s, xx - 0.05, yf, 0.1, 0, { color: c, width: 1.25 });   // pe do colchete logo acima do rotulo da coluna
    });
    if (estilo === 'pilula') {
      s.addShape(S.RECTANGLE, { x: xm - wr / 2, y: y - 0.1, w: wr, h: 0.2, fill: { color: c }, line: { type: 'none' } });
      texto(s, rotulo, { x: xm - wr / 2, y: y - 0.1, w: wr, h: 0.2, fontSize: 8, bold: true, color: sobre(c), align: 'center' });
    } else {
      [xm - wr / 2 - 0.06, xm + wr / 2 + 0.03].forEach(xp => s.addShape(S.RECTANGLE, { x: xp, y: y - 0.08, w: 0.03, h: 0.16, fill: { color: 'FFFFFF' }, line: { color: c, width: 0.75 } }));
      texto(s, rotulo, { x: xm - wr / 2, y: y - 0.1, w: wr, h: 0.2, fontSize: 8, color: ESC, align: 'center' });
    }
  }
  // nota: a leitura presa ao dado (substitui paragrafo). estilo: 'tracejada' (borda tracejada na cor, fundo branco: Kepler, Rede D'Or) |
  //   'cinza' (painel F2F2F2 sem borda: Vibra, M&A) | 'escura' (etiqueta escura com texto branco: Vivara) | 'clara' (tom claro da cor, italico)
  //   alvo: { x, y } do dado (use plot.cx / plot.cy); ponta: 'seta' | 'ponto' | 'losango' | 'nenhuma'. Texto 8pt, centralizado, 1 a 3 linhas.
  function nota(s, { x, y, w, h, runs, estilo = 'tracejada', alvo, ponta = 'seta', alinhar = 'center', fonte = 8, cor }) {
    const c = cor || COR.dom, tr = { color: estilo === 'cinza' || estilo === 'escura' ? APOIO : c, width: 0.75, dashType: 'sysDash' };
    if (alvo) {
      const fim = (o2) => ponta === 'seta' ? Object.assign({ endArrowType: 'triangle' }, o2) : o2;
      const dentroX = alvo.x >= x + 0.05 && alvo.x <= x + w - 0.05, dentroY = alvo.y >= y && alvo.y <= y + h;
      if (dentroX) seg(s, alvo.x, alvo.y < y ? y : y + h, alvo.x, alvo.y, fim(tr));
      else if (dentroY) seg(s, alvo.x < x ? x : x + w, alvo.y, alvo.x, alvo.y, fim(tr));
      else { const xs = alvo.x < x ? x : x + w, ys = y + h / 2; seg(s, xs, ys, alvo.x, ys, tr); seg(s, alvo.x, ys, alvo.x, alvo.y, fim(tr)); }
      if (ponta === 'ponto') s.addShape(S.OVAL, { x: alvo.x - 0.04, y: alvo.y - 0.04, w: 0.08, h: 0.08, fill: { color: tr.color }, line: { type: 'none' } });
      if (ponta === 'losango') s.addShape(S.DIAMOND, { x: alvo.x - 0.04, y: alvo.y - 0.04, w: 0.08, h: 0.08, fill: { color: tr.color }, line: { type: 'none' } });
    }
    const caixa = { tracejada: { fill: { color: 'FFFFFF' }, line: { color: c, width: 0.75, dashType: 'dash' } }, cinza: { fill: { color: PAINEL }, line: { type: 'none' } },
      escura: { fill: { color: ESC }, line: { type: 'none' } }, clara: { fill: { color: tom(c, 0.86) }, line: { type: 'none' } } }[estilo];
    if (!caixa) throw new Error(`nota: estilo desconhecido "${estilo}" (tracejada, cinza, escura, clara)`);
    s.addShape(S.RECTANGLE, Object.assign({ x, y, w, h }, caixa));
    texto(s, runs, { x: x + 0.08, y, w: w - 0.16, h, fontSize: fonte, align: alinhar, color: estilo === 'escura' ? 'FFFFFF' : ESC, italic: estilo === 'clara' });
  }
  // elipse tracejada destacando um valor (resultado de tabela, coluna, ponto do grafico): Orizon, Vivara, AF Capital
  function elipse(s, { x, y, w, h, cor }) {
    s.addShape(S.OVAL, { x, y, w, h, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: cor || COR.dom, width: 1, dashType: 'dash' } });
  }
  // marcoEvento: linha vertical tracejada sobre a serie com rotulo no topo ("Inicio da pandemia", "IPO"): Vibra, Vivara, Orizon
  function marcoEvento(s, { x, y0, y1, rotulo, lado = 'direita', w = 1.3 }) {
    linha(s, x, y0, 0, y1 - y0, { color: APOIO, width: 0.75, dashType: 'sysDash' });
    s.addShape(S.DIAMOND, { x: x - 0.035, y: y0 - 0.035, w: 0.07, h: 0.07, fill: { color: ESC }, line: { type: 'none' } });
    texto(s, rotulo, { x: lado === 'direita' ? x + 0.07 : x - 0.07 - w, y: y0 - 0.1, w, h: 0.2, fontSize: 7.5, color: ESC, align: lado === 'direita' ? 'left' : 'right' });
  }
  // linhaRef: linha horizontal (ou vertical) tracejada de referencia com rotulo na ponta ("Media: 16,3%", "Valor justo: 147")
  function linhaRef(s, { x, y, w, h, rotulo, cor, lado = 'fim' }) {
    const c = cor || COR.dest, vert = !!h && !w;
    linha(s, x, y, vert ? 0 : w, vert ? h : 0, { color: c, width: 1, dashType: 'dash' });
    if (!rotulo) return;
    const wr = larguraTexto(rotulo, 8, true) + 0.1;
    if (vert) texto(s, rotulo, { x: x - wr / 2, y: y + h + 0.02, w: wr, h: 0.18, fontSize: 8, bold: true, color: ESC, align: 'center' });
    else texto(s, rotulo, { x: lado === 'fim' ? x + w - wr : x, y: y - 0.2, w: wr, h: 0.18, fontSize: 8, bold: true, color: ESC, align: lado === 'fim' ? 'right' : 'left' });
  }
  // faixaConclusao: tira no pe do bloco com a leitura em negrito ("Upside maior que o custo de capital em 76% dos cenarios"): Vibra, FUCAPE, Orizon
  function faixaConclusao(s, { x, y, w, h = 0.3, runs, estilo = 'cor' }) {
    const fill = { cor: COR.dom, escura: ESC, clara: tom(COR.dom, 0.86), cinza: PAINEL }[estilo];
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { type: 'none' } });
    texto(s, runs, { x: x + 0.1, y, w: w - 0.2, h, fontSize: 9, bold: true, align: 'center', color: sobre(fill) });
  }

  // =====================================================================================================================
  // 3. TABELAS (nativas, editaveis): financeira, limpa, rotulo|valor e sensibilidade
  // =====================================================================================================================
  // tabela(s, { x, y, w, cabecalho, linhas, larguras?, estilo, hLinha?, fonte?, totais?: [i], subitens?: [i], destacar?: [i],
  //             colDestaque?: j, projecaoDe?: j, alinhar?, unidade? }) -> altura usada
  //   'financeira' (DRE, fluxo, sinergia: Kepler, Orizon, assetkw): cabecalho preenchido na cor escura com texto branco, anos a direita;
  //       linhas 8pt separadas por fio claro; totais em negrito com fio em cima; subitens recuados em cinza; negativos entre parenteses
  //   'limpa' (ranking, comps, deals: M&A Bunge, Orizon): cabecalho em negrito com fio escuro embaixo, linhas com fio claro, sem preenchimento
  //   'faixa' (comparativos: USP, Vivara): cabecalho cinza escuro, linhas zebradas
  //   'rotuloValor' (key financials, WACC, term sheet: M&A, Rede D'Or, Orizon): 2 colunas, rotulo a esquerda e valor em negrito a direita, zebra F2F2F2
  //   colDestaque: coluna que e a conclusao (ex.: "Pro Forma") com fundo claro e negrito; projecaoDe: colunas projetadas com fundo F7F7F7
  function tabela(s, o) {
    const { x, y, w, linhas, estilo = 'limpa', totais = [], subitens = [], destacar = [] } = o;
    const fonte = o.fonte || 8, hLinha = o.hLinha || 0.22, cab = o.cabecalho;
    const nC = (cab || linhas[0]).length, pesos = o.larguras || (estilo === 'rotuloValor' ? [1.6, 1] : [2.2].concat(Array(nC - 1).fill(1)));
    const colW = pesos.map(p => w * p / soma(pesos)), al = o.alinhar || ['left'].concat(Array(nC - 1).fill(estilo === 'limpa' && nC <= 5 ? 'center' : 'right'));
    const nada = { type: 'none' }, fio = (c, pt = 0.5) => ({ type: 'solid', pt, color: c });
    const cel = (v) => typeof v === 'number' ? (v < 0 ? `(${fmt(-v, o.casas)})` : fmt(v, o.casas)) : (v == null ? '' : String(v));
    const rows = [];
    if (cab) rows.push(cab.map((t, j) => ({ text: String(t), options: Object.assign({ bold: true, align: al[j], fontSize: fonte },
      estilo === 'financeira' ? { color: 'FFFFFF', fill: { color: COR.escuro }, border: [nada, nada, nada, nada] }
        : estilo === 'faixa' ? { color: 'FFFFFF', fill: { color: APOIO }, border: [nada, nada, nada, nada] }
          : { color: ESC, border: [nada, nada, fio(ESC, 1), nada] }) })));
    linhas.forEach((l, i) => rows.push(l.map((v, j) => {
      const tot = totais.includes(i), sub = subitens.includes(i), dest = destacar.includes(i), cd = o.colDestaque === j, ult = i === linhas.length - 1;
      const op = { align: al[j], fontSize: sub ? fonte - 0.5 : fonte, bold: tot || dest || cd || (estilo === 'rotuloValor' && j > 0), color: sub ? COR.cinza : ESC,
        border: [tot && estilo !== 'rotuloValor' ? fio(ESC, 0.75) : nada, nada, estilo === 'rotuloValor' ? nada : (ult && estilo === 'limpa' ? fio(ESC, 0.75) : fio(FIO)), nada] };
      if (dest) { op.fill = { color: tom(COR.dom, 0.86) }; op.color = COR.escuro; }
      else if (cd) op.fill = { color: tom(COR.dom, 0.9) };
      else if ((estilo === 'faixa' || estilo === 'rotuloValor') && i % 2 === 0) op.fill = { color: PAINEL };
      else if (o.projecaoDe != null && j >= o.projecaoDe) op.fill = { color: 'F7F7F7' };
      return { text: (sub && j === 0 ? '   ' : '') + cel(v), options: op };
    })));
    s.addTable(rows, { x, y, w, colW, rowH: hLinha, fontFace: F, fontSize: fonte, margin: [0, 0.05, 0, 0.05], valign: 'middle' });
    if (o.unidade) texto(s, o.unidade, { x, y: y - 0.18, w, h: 0.16, fontSize: 7, italic: true, color: COR.cinza, align: 'right' });
    return rows.length * hLinha;
  }
  // sensibilidade: mapa de calor (premio/upside x duas premissas), celula-base emoldurada: Kepler, Vibra, M&A Bunge, Orizon, Vivara
  //   colunas: { rotulo, valores: [..] }, linhas: { rotulo, valores: [..] }, celulas: [[..]] (numero ou texto), base: [i, j],
  //   formato: (v) => string, corAlta?: cor do maior valor (padrao: dominante). Sem verde/vermelho gritante: escala clara -> cor do deck.
  function sensibilidade(s, { x, y, w, h, colunas, linhas, celulas, base, formato, corAlta, fonte = 8 }) {
    const nL = linhas.valores.length, nC = colunas.valores.length, wRot = 0.22, wCab = Math.max(0.55, larguraTexto(String(linhas.valores[0]), fonte, true) + 0.2), hCab = 0.22, hRot = 0.2;
    const x0 = x + wRot + wCab, y0 = y + hRot + hCab, wc = (w - wRot - wCab) / nC, hc = Math.min(0.3, (h - hRot - hCab) / nL);
    const nums = celulas.flat().filter(v => typeof v === 'number'), mn = Math.min(...nums), mx = Math.max(...nums), alta = corAlta || COR.dom;
    const f = formato || ((v) => fmt(v));
    texto(s, colunas.rotulo, { x: x0, y, w: wc * nC, h: hRot, fontSize: 8, italic: true, color: APOIO, align: 'center' });
    texto(s, linhas.rotulo, { x: x - (hc * nL - wRot) / 2, y: y0 + (hc * nL - wRot) / 2, w: hc * nL, h: wRot, fontSize: 8, italic: true, color: APOIO, align: 'center', rotate: 270 });
    const nada = { type: 'none' }, branco = { type: 'solid', pt: 1, color: 'FFFFFF' };
    const rows = [[{ text: '', options: { border: [nada, nada, nada, nada] } }].concat(colunas.valores.map(v => ({ text: String(v), options: { bold: true, color: 'FFFFFF', fill: { color: COR.escuro }, align: 'center', border: [branco, branco, branco, branco] } })))];
    linhas.valores.forEach((lv, i) => rows.push([{ text: String(lv), options: { bold: true, color: 'FFFFFF', fill: { color: COR.escuro }, align: 'center', border: [branco, branco, branco, branco] } }].concat(celulas[i].map((v, j) => {
      const t = typeof v === 'number' && mx > mn ? (v - mn) / (mx - mn) : 0, cor = mistura('F2F2F2', alta, 0.08 + t * 0.8), eBase = base && base[0] === i && base[1] === j;
      return { text: typeof v === 'number' ? f(v) : String(v), options: { align: 'center', bold: eBase, color: sobre(cor), fill: { color: cor }, border: [branco, branco, branco, branco] } };
    }))));
    s.addTable(rows, { x: x + wRot, y: y + hRot, w: wCab + wc * nC, colW: [wCab].concat(Array(nC).fill(wc)), rowH: [hCab].concat(Array(nL).fill(hc)), fontFace: F, fontSize: fonte, margin: 0, valign: 'middle' });
    if (base) s.addShape(S.RECTANGLE, { x: x0 + base[1] * wc, y: y0 + base[0] * hc, w: wc, h: hc, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: ESC, width: 1.5 } });
    return hRot + hCab + hc * nL;
  }
  // premissas: rotulo em caixa cinza | valor em chip na cor | comentario com marcador (Orizon "Principais Premissas"; Kepler "assumptions")
  //   itens: [{ rotulo, valor, nota? }]; sem nota, ocupa so as duas primeiras colunas
  function premissas(s, { x, y, w, itens, hLinha = 0.26, gap = 0.1, wRotulo, wValor = 0.85, titulos }) {
    const temNota = itens.some(i => i.nota), wR = wRotulo || (temNota ? Math.min(1.9, w * 0.3) : w - wValor - 0.08);
    let yi = y;
    if (titulos) {
      texto(s, titulos[0], { x, y: yi, w: wR + wValor + 0.08, h: 0.2, fontSize: 8, bold: true, color: ESC });
      if (temNota && titulos[1]) texto(s, titulos[1], { x: x + wR + wValor + 0.25, y: yi, w: w - wR - wValor - 0.25, h: 0.2, fontSize: 8, bold: true, color: ESC });
      linha(s, x, yi + 0.22, w, 0, { color: ESC, width: 0.75 }); yi += 0.3;
    }
    itens.forEach((it, i) => {
      const yy = yi + i * (hLinha + gap);
      s.addShape(S.RECTANGLE, { x, y: yy, w: wR, h: hLinha, fill: { color: PAINEL }, line: { type: 'none' } });
      texto(s, it.rotulo, { x: x + 0.08, y: yy, w: wR - 0.12, h: hLinha, fontSize: 8, italic: true, color: ESC });
      s.addShape(S.RECTANGLE, { x: x + wR + 0.08, y: yy, w: wValor, h: hLinha, fill: { color: tom(COR.dom, 0.8) }, line: { type: 'none' } });
      texto(s, it.valor, { x: x + wR + 0.08, y: yy, w: wValor, h: hLinha, fontSize: 8, bold: true, color: COR.escuro, align: 'center' });
      if (it.nota) texto(s, [{ text: it.nota, options: { bullet: { indent: 8 } } }], { x: x + wR + wValor + 0.25, y: yy, w: w - wR - wValor - 0.25, h: hLinha, fontSize: 8, color: ESC });
    });
    return yi - y + itens.length * (hLinha + gap) - gap;
  }

  // =====================================================================================================================
  // 4. DIAGRAMAS DE ANALISE (formas, nao dados em serie): valuation, risco, logica, tempo
  // =====================================================================================================================
  // footballField: faixas de valor por metodologia + linha tracejada de referencia + (opcional) coluna de comentarios. Orizon, Kepler, Vibra, M&A
  //   itens: [{ rotulo, min, max, comentarios?: [string] }], eixo: { min, max, passo? }, referencia?: { valor, rotulo }, unidade?
  function footballField(s, { x, y, w, h, itens, eixo, referencia, titulos, casas = 0 }) {
    const temCom = itens.some(i => i.comentarios), wRot = 1.25, wBar = temCom ? (w - wRot) * 0.52 : w - wRot - 0.1, xB = x + wRot, hCab = titulos ? 0.26 : 0, hEixo = 0.26;
    const hL = (h - hCab - hEixo) / itens.length, px = (v) => xB + wBar * (v - eixo.min) / (eixo.max - eixo.min);
    if (titulos) {
      s.addShape(S.RECTANGLE, { x, y, w, h: hCab - 0.04, fill: { color: COR.escuro }, line: { type: 'none' }, objectName: grad(id('GR_ff'), 0, [[0, COR.escuro, 100], [100, COR.dom, 100]]) });
      texto(s, titulos[0], { x: xB, y, w: wBar, h: hCab - 0.04, fontSize: 8, bold: true, italic: true, color: 'FFFFFF', align: 'center' });
      if (temCom) texto(s, titulos[1] || 'Comentários', { x: xB + wBar + 0.3, y, w: w - wRot - wBar - 0.3, h: hCab - 0.04, fontSize: 8, bold: true, color: 'FFFFFF' });
    }
    itens.forEach((it, i) => {
      const yy = y + hCab + i * hL, hb = Math.min(0.26, hL * 0.42), yb = yy + (hL - hb) / 2;
      if (i > 0) linha(s, x, yy, w, 0, { color: FIO, width: 0.5 });
      texto(s, it.rotulo, { x, y: yy, w: wRot - 0.1, h: hL, fontSize: 8, bold: true, color: ESC });
      s.addShape(S.RECTANGLE, { x: px(it.min), y: yb, w: px(it.max) - px(it.min), h: hb, fill: { color: it.cor || COR.dom }, line: { type: 'none' } });
      texto(s, fmt(it.min, casas), { x: px(it.min) - 0.62, y: yb, w: 0.56, h: hb, fontSize: 8, bold: true, color: ESC, align: 'right' });
      texto(s, fmt(it.max, casas), { x: px(it.max) + 0.06, y: yb, w: 0.56, h: hb, fontSize: 8, bold: true, color: ESC });
      if (it.comentarios) texto(s, it.comentarios.map((t, k) => ({ text: t, options: { bullet: { indent: 8 }, breakLine: k < it.comentarios.length - 1 } })), { x: xB + wBar + 0.3, y: yy, w: w - wRot - wBar - 0.3, h: hL, fontSize: 8, color: ESC });
    });
    const yE = y + h - hEixo;
    linha(s, xB, yE, wBar, 0, { color: MEDIO, width: 0.75 });
    const passo = eixo.passo || (eixo.max - eixo.min) / 4;
    for (let v = eixo.min; v <= eixo.max + 1e-9; v += passo) texto(s, fmt(v, casas), { x: px(v) - 0.3, y: yE + 0.03, w: 0.6, h: 0.16, fontSize: 7.5, color: APOIO, align: 'center' });
    if (referencia) {
      const cr = referencia.cor || COR.dest;
      linha(s, px(referencia.valor), y + hCab, 0, yE - y - hCab, { color: cr, width: 1, dashType: 'dash' });
      texto(s, referencia.rotulo, { x: px(referencia.valor) - 1, y: yE + 0.1, w: 2, h: 0.16, fontSize: 7.5, bold: true, color: claro(cr) ? ESC : cr, align: 'center' });
    }
  }
  // matrizRisco: quadrados rotulados (B1, M2...) numa grade probabilidade x impacto. Vivara, Vibra, Nubank, Rede D'Or, AF Capital
  //   riscos: [{ id, prob: 0..1, impacto: 0..1, cat?: indice da categoria }]; estilo 'grade' (celulas cinza: Vibra) | 'eixos' (cruz tracejada: Vivara)
  function matrizRisco(s, { x, y, w, h, riscos, eixos = ['Probabilidade', 'Impacto'], estilo = 'grade', n = 5, cores }) {
    const m = 0.24, lado = Math.min(w - m, h - m), x0 = x + m, y0 = y, cs = cores || [COR.dom, ESC, COR.dest, MEDIO];
    if (estilo === 'grade') {
      const c = lado / n, g = 0.04;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s.addShape(S.RECTANGLE, { x: x0 + i * c + g / 2, y: y0 + j * c + g / 2, w: c - g, h: c - g, fill: { color: PAINEL }, line: { type: 'none' } });
    } else {
      linha(s, x0, y0 + lado / 2, lado, 0, { color: APOIO, width: 0.75, dashType: 'dash' });
      linha(s, x0 + lado / 2, y0, 0, lado, { color: APOIO, width: 0.75, dashType: 'dash' });
    }
    seg(s, x0, y0 + lado, x0 + lado, y0 + lado, { color: ESC, width: 0.75, endArrowType: 'triangle' });
    seg(s, x0, y0 + lado, x0, y0, { color: ESC, width: 0.75, endArrowType: 'triangle' });
    texto(s, eixos[0], { x: x0, y: y0 + lado + 0.03, w: lado, h: 0.18, fontSize: 8, bold: true, italic: true, color: ESC, align: 'right' });
    texto(s, eixos[1], { x: x - (lado - 0.2) / 2, y: y0 + (lado - 0.2) / 2, w: lado, h: 0.2, fontSize: 8, bold: true, italic: true, color: ESC, align: 'right', rotate: 270 });
    const d = Math.min(0.38, lado / n - 0.06);
    riscos.forEach(r => {
      const cx = x0 + lado * r.prob, cy = y0 + lado * (1 - r.impacto), cor = cs[(r.cat || 0) % cs.length];
      s.addShape(S.RECTANGLE, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: cor }, line: { type: 'none' } });
      texto(s, r.id, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fontSize: 8, bold: true, color: sobre(cor), align: 'center' });
    });
    return { lado, cores: cs };
  }
  // listaCategorias: itens agrupados por categoria ao lado da matriz. titulo 'faixa' (Vivara, Nubank) | 'fio' (Vibra, Kepler). destaque = id marcado
  //   categorias: [{ titulo, itens: [[id, texto]] }]
  function listaCategorias(s, { x, y, w, categorias, estilo = 'fio', destaque, cores, passo = 0.22 }) {
    const cs = cores || [COR.dom, ESC, COR.dest, MEDIO];
    let yy = y;
    categorias.forEach((cat, k) => {
      const cor = cs[k % cs.length];
      if (estilo === 'faixa') { s.addShape(S.RECTANGLE, { x, y: yy, w, h: 0.24, fill: { color: cor }, line: { type: 'none' } }); texto(s, cat.titulo, { x, y: yy, w, h: 0.24, fontSize: 9, bold: true, color: sobre(cor), align: 'center' }); yy += 0.32; }
      else { texto(s, cat.titulo, { x, y: yy, w, h: 0.2, fontSize: 8.5, bold: true, color: ESC }); linha(s, x, yy + 0.22, w, 0, { color: cor, width: 1 }); yy += 0.3; }
      cat.itens.forEach(([idr, t]) => {
        const d = destaque === idr, nl = Math.max(1, Math.ceil(larguraTexto(`${idr}. ${t}`, 8, d) * 0.88 / (w - 0.1))), hh = passo * nl;
        if (d) s.addShape(S.RECTANGLE, { x, y: yy, w, h: hh, fill: { color: tom(COR.dom, 0.82) }, line: { type: 'none' } });
        texto(s, [{ text: idr + '. ', options: { bold: true } }, { text: t, options: { bold: d } }], { x: x + 0.05, y: yy, w: w - 0.1, h: hh, fontSize: 8, color: ESC });
        yy += hh;
      });
      yy += 0.14;
    });
    return yy - y;
  }
  // equacao: termos em blocos ligados por operadores grandes; o ultimo e o resultado (na cor). Vivara (revenue build-up), Nubank, Vibra, Rede D'Or
  //   termos: [{ titulo, valor?, sub? }], ops: ['×', '−', '='] (um a menos que os termos)
  function equacao(s, { x, y, w, h = 0.7, termos, ops, estilo = 'cinza' }) {
    const n = termos.length, wOp = 0.34, wT = (w - wOp * (n - 1)) / n;
    termos.forEach((t, i) => {
      const xi = x + i * (wT + wOp), res = i === n - 1, fill = res ? COR.dom : (estilo === 'escura' ? ESC : PAINEL), cor = sobre(fill);
      s.addShape(S.RECTANGLE, Object.assign({ x: xi, y, w: wT, h, fill: { color: fill } }, estilo === 'tracejada' && !res ? { fill: { color: 'FFFFFF' }, line: { color: COR.dom, width: 0.75, dashType: 'dash' } } : { line: { type: 'none' } }));
      const runs = [{ text: t.titulo, options: { fontSize: 8.5, bold: !t.valor, color: estilo === 'tracejada' && !res ? ESC : cor, breakLine: !!(t.valor || t.sub) } }];
      if (t.valor) runs.push({ text: String(t.valor), options: { fontSize: 11, bold: true, color: res || estilo === 'escura' ? cor : COR.dom, breakLine: !!t.sub } });
      if (t.sub) runs.push({ text: t.sub, options: { fontSize: 7, italic: true, color: estilo === 'tracejada' && !res ? APOIO : (claro(fill) ? APOIO : cor) } });
      texto(s, runs, { x: xi + 0.05, y, w: wT - 0.1, h, align: 'center' });
      if (i < n - 1) texto(s, ops[i], { x: xi + wT, y, w: wOp, h, fontSize: 16, bold: true, color: ESC, align: 'center' });
    });
  }
  // linhaTempo: anos em chips sobre um fio, texto curto acima/abaixo (M&A Bunge, Orizon, Vivara, Vibra, Tech)
  //   marcos: [{ ano, runs }]; alternar: texto alterna acima e abaixo (para 5+ marcos); senao tudo acima
  function linhaTempo(s, { x, y, w, marcos, alternar = false, hTexto = 0.42, wChip = 0.62 }) {
    const n = marcos.length, passo = w / n, yF = y + (alternar ? hTexto + 0.16 : hTexto + 0.16);
    linha(s, x, yF, w, 0, { color: COR.dom, width: 1.25 });
    marcos.forEach((m, i) => {
      const cx = x + passo * (i + 0.5), acima = !alternar || i % 2 === 0;
      s.addShape(S.ROUNDED_RECTANGLE, { x: cx - wChip / 2, y: yF - 0.12, w: wChip, h: 0.24, rectRadius: 0.05, fill: { color: i === n - 1 && m.destaque !== false ? COR.escuro : COR.dom }, line: { color: 'FFFFFF', width: 0.75 } });
      texto(s, String(m.ano), { x: cx - wChip / 2, y: yF - 0.12, w: wChip, h: 0.24, fontSize: 8.5, bold: true, italic: true, color: 'FFFFFF', align: 'center' });
      texto(s, m.runs, { x: cx - passo / 2 + 0.04, y: acima ? yF - 0.16 - hTexto : yF + 0.16, w: passo - 0.08, h: hTexto, fontSize: 8, color: ESC, align: 'center', valign: acima ? 'bottom' : 'top' });
    });
    return (alternar ? 2 * hTexto + 0.32 : hTexto + 0.3);
  }
  // cenarios: colunas pessimista | base | otimista com faixa de titulo, premissas e o resultado em caixa tracejada. Kepler, Rede D'Or, Vivara, Nubank
  //   cenarios: [{ titulo, cor?, itens: [string], resultado?: { rotulo, valor, nota? } }]
  function cenarios(s, { x, y, w, h, cenarios: cs, gap = 0.2 }) {
    const n = cs.length, wc = (w - gap * (n - 1)) / n, padrao = [MEDIO, COR.dom, COR.escuro];
    cs.forEach((c, i) => {
      const xi = x + i * (wc + gap), cor = c.cor || padrao[i % 3], hRes = c.resultado ? 0.62 : 0;
      s.addShape(S.RECTANGLE, { x: xi, y: y + 0.13, w: wc, h: h - 0.13, fill: { color: PAINEL }, line: { type: 'none' } });
      s.addShape(S.RECTANGLE, { x: xi, y, w: wc, h: 0.26, fill: { color: cor }, line: { type: 'none' } });
      texto(s, c.titulo, { x: xi, y, w: wc, h: 0.26, fontSize: 9, bold: true, color: sobre(cor), align: 'center' });
      texto(s, c.itens.map((t, k) => ({ text: t, options: { bullet: { indent: 8 }, breakLine: k < c.itens.length - 1, paraSpaceAfter: 4 } })), { x: xi + 0.14, y: y + 0.34, w: wc - 0.28, h: h - 0.44 - hRes, fontSize: 8, color: ESC, valign: 'top' });
      if (c.resultado) {
        const yr = y + h - hRes - 0.08;
        s.addShape(S.RECTANGLE, { x: xi + 0.14, y: yr, w: wc - 0.28, h: hRes, fill: { color: 'FFFFFF' }, line: { color: cor, width: 0.75, dashType: 'dash' } });
        const r = [{ text: c.resultado.rotulo + '  ', options: { fontSize: 8, color: ESC } }, { text: String(c.resultado.valor), options: { fontSize: 10, bold: true, color: ESC, breakLine: !!c.resultado.nota } }];
        if (c.resultado.nota) r.push({ text: c.resultado.nota, options: { fontSize: 8, bold: true, color: claro(cor) ? ESC : cor } });
        texto(s, r, { x: xi + 0.14, y: yr, w: wc - 0.28, h: hRes, align: 'center' });
      }
    });
  }

  // =====================================================================================================================
  // 5. BLOCOS DE TEXTO ESTRUTURADO (o texto do slide nunca e paragrafo solto)
  // =====================================================================================================================
  // listaPinos: fio vertical com um pino por item (Kepler "Lean Manufacturing", Nubank "Interest Income Breakdown", Vibra marcos)
  //   itens: [runs] ou [{ runs, sub }] (sub = linha derivada, ex.: "Taxa = 5x CDI", com cotovelo pontilhado)
  function listaPinos(s, { x, y, w, itens, passo = 0.44, cor }) {
    const c = cor || COR.dom, n = itens.length;
    linha(s, x + 0.05, y + passo * 0.3, 0, passo * (n - 1) + passo * 0.1, { color: c, width: 1 });
    itens.forEach((it, i) => {
      const o = Array.isArray(it) || typeof it === 'string' ? { runs: it } : it, yy = y + i * passo, hT = o.sub ? passo * 0.55 : passo - 0.06;
      s.addShape(S.OVAL, { x, y: yy + passo * 0.3 - 0.05, w: 0.1, h: 0.1, fill: { color: 'FFFFFF' }, line: { color: c, width: 1 } });
      linha(s, x + 0.1, yy + passo * 0.3, 0.12, 0, { color: c, width: 0.75 });
      texto(s, o.runs, { x: x + 0.28, y: yy + passo * 0.3 - hT / 2, w: w - 0.28, h: hT, fontSize: 8.5, color: ESC });
      if (o.sub) texto(s, o.sub, { x: x + 0.5, y: yy + passo * 0.3 + hT / 2, w: w - 0.5, h: 0.18, fontSize: 8, color: ESC });
    });
    return n * passo;
  }
  // numeroTexto: numero grande na cor + frase curta ao lado, na mesma linha ("85% | dos custos sao fixos"): assetkw, FUCAPE, Vibra, Orizon
  //   NAO e card de KPI: sem caixa, sem icone, um ou dois por bloco, sempre ao lado do exhibit que o prova
  function numeroTexto(s, { x, y, w, h = 0.46, valor, runs, pt = 18, cor }) {
    const wv = larguraTexto(String(valor), pt, true) + 0.12;
    texto(s, String(valor), { x, y, w: wv, h, fontSize: pt, bold: true, color: cor || COR.dom });
    texto(s, runs, { x: x + wv + 0.06, y, w: w - wv - 0.06, h, fontSize: 8.5, color: ESC });
  }
  // tiraFatos: faixa cinza com 3 a 5 fatos lado a lado (numero em negrito + rotulo), no pe do slide ou sob um diagrama: Vibra, assetkw
  function tiraFatos(s, { x, y, w, h = 0.5, itens, fundo = PAINEL }) {
    const n = itens.length, wi = w / n;
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: fundo }, line: { type: 'none' } });
    itens.forEach(([valor, rot], i) => {
      if (i > 0) linha(s, x + i * wi, y + h * 0.2, 0, h * 0.6, { color: MEDIO, width: 0.5 });
      texto(s, [{ text: String(valor) + '  ', options: { fontSize: 11, bold: true, color: COR.dom } }, { text: rot, options: { fontSize: 8, color: ESC } }], { x: x + i * wi + 0.1, y, w: wi - 0.2, h, align: 'center' });
    });
  }
  // citacao: voz externa (executivo, especialista, cliente) como prova. Foto recortada + nome/cargo + faixa escura com a fala em italico
  //   (Orizon, Kepler, M&A Bunge, Nubank, AF Capital). Sem foto autorizada, fica o placeholder: nunca baixe foto de pessoa.
  function citacao(s, { x, y, w, h, foto, nome, cargo, fala, lado = 'esquerda' }) {
    const wf = Math.min(h, w * 0.3), xf = lado === 'esquerda' ? x : x + w - wf, xt = lado === 'esquerda' ? x + wf + 0.12 : x, wt = w - wf - 0.12, hN = 0.36;
    if (ctx.imagem) ctx.imagem(s, { x: xf, y, w: wf, h, caminho: foto, descricao: `foto de ${nome}`, nome: id('foto_citacao') });
    texto(s, [{ text: nome, options: { bold: true, fontSize: 8.5, color: ESC, breakLine: true } }, { text: cargo, options: { fontSize: 8, color: APOIO } }], { x: xt, y, w: wt, h: hN, valign: 'top' });
    s.addShape(S.RECTANGLE, { x: xt, y: y + hN + 0.04, w: wt, h: h - hN - 0.04, fill: { color: COR.escuro }, line: { type: 'none' }, objectName: grad(id('GR_citacao'), 0, [[0, COR.escuro, 100], [100, COR.dom, 100]]) });
    texto(s, fala, { x: xt + 0.12, y: y + hN + 0.04, w: wt - 0.24, h: h - hN - 0.04, fontSize: 8, italic: true, color: 'FFFFFF', align: 'justify' });
  }
  // recorte: noticia como prova (veiculo + manchete em negrito + fio + resumo + data). Orizon, Vibra, Rede D'Or, Vivara
  //   veiculo: texto (vira "logo" tipografico) ou { caminho } da logo do portal
  function recorte(s, { x, y, w, h, veiculo, manchete, resumo, data }) {
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: FIO, width: 0.75 }, shadow: { type: 'outer', blur: 3, offset: 1, angle: 90, color: '000000', opacity: 0.15 } });
    const wv = typeof veiculo === 'string' ? larguraTexto(veiculo, 10, true) + 0.16 : 0.75;
    if (typeof veiculo === 'string') texto(s, veiculo, { x: x + 0.1, y: y + 0.06, w: wv, h: 0.28, fontSize: 10, bold: true, color: ESC });
    else if (ctx.imagem) ctx.imagem(s, { x: x + 0.1, y: y + 0.08, w: wv - 0.1, h: 0.24, caminho: veiculo.caminho, descricao: 'logo do veículo', nome: id('logo_veiculo') });
    texto(s, manchete, { x: x + 0.1 + wv, y: y + 0.06, w: w - wv - 0.2, h: 0.28, fontSize: 8.5, bold: true, color: ESC });
    linha(s, x + 0.1, y + 0.38, w - 0.2, 0, { color: MEDIO, width: 0.5 });
    texto(s, resumo, { x: x + 0.1, y: y + 0.42, w: w - 0.2, h: h - 0.48 - (data ? 0.14 : 0), fontSize: 8, color: ESC, valign: 'top', align: 'justify' });
    if (data) texto(s, data, { x: x + 0.1, y: y + h - 0.18, w: w - 0.2, h: 0.14, fontSize: 7, color: APOIO, align: 'right' });
  }
  // abas: chips de titulo lado a lado que dividem o slide em temas (Orizon "Demanda Voluntaria | Demanda Regulatoria"; 4 colunas-card)
  //   devolve [{ x, w }] de cada coluna para alinhar o conteudo embaixo
  function abas(s, { x, y, w, itens, gap = 0.34, h = 0.26, largura = 0.55 }) {
    const n = itens.length, wc = (w - gap * (n - 1)) / n;
    return itens.map((t, i) => {
      const xi = x + i * (wc + gap), wa = wc * largura;
      s.addShape(S.ROUNDED_RECTANGLE, { x: xi + (wc - wa) / 2, y, w: wa, h, rectRadius: 0.05, fill: { color: COR.escuro }, line: { type: 'none' }, objectName: grad(id('GR_aba'), 0, [[0, COR.escuro, 100], [100, COR.dom, 100]]) });
      texto(s, t, { x: xi + (wc - wa) / 2, y, w: wa, h, fontSize: 8, bold: true, color: 'FFFFFF', align: 'center' });
      linha(s, xi, y + h / 2, (wc - wa) / 2 - 0.05, 0, { color: COR.dom, width: 0.75 }); linha(s, xi + (wc + wa) / 2 + 0.05, y + h / 2, (wc - wa) / 2 - 0.05, 0, { color: COR.dom, width: 0.75 });
      return { x: xi, w: wc };
    });
  }
  // icone de LINHA, pequeno e de uma cor so (como nas referencias: ao lado de um item de lista, dentro do no de uma cadeia de valor).
  //   nome: 'tb/TbTruck', 'lu/LuFactory', 'fi/FiUsers' (react-icons). Nunca em circulo colorido grande, nunca em grade de cards.
  function icone(s, { x, y, d = 0.3, nome, cor }) {
    const c = cor || ESC;
    try {
      const dir = ctx.tmp ? ctx.tmp() : require('os').tmpdir(), out = path.join(dir, `ic_${nome.replace(/\W/g, '_')}_${c}.png`);
      if (!fs.existsSync(out)) execFileSync('node', [path.join(ctx.aqui || __dirname, 'icone.js'), nome, c, out], { stdio: ['ignore', 'ignore', 'pipe'] });
      s.addImage({ path: out, x, y, w: d, h: d });
    } catch (e) {
      console.warn(`icone "${nome}" nao gerado (${String(e.stderr || e.message).trim().split('\n')[0]}): ficou o placeholder`);
      texto(s, `[ICONE: ${nome}]`, { x, y, w: Math.max(d, 0.6), h: d, fontSize: 7, color: 'C0504D' });
    }
  }
  // cadeia: etapas de uma cadeia de valor / processo em nos sobre um fio, com chip embaixo e colchetes de agrupamento em cima (Orizon, Vibra, M&A)
  //   etapas: [{ rotulo, icone?, destaque? }], grupos?: [{ de, ate, rotulo }] (indices), numerar: numeros pequenos entre os nos
  function cadeia(s, { x, y, w, etapas, grupos, numerar = true, d = 0.46 }) {
    const n = etapas.length, passo = w / n, yG = grupos ? 0.34 : 0, cyN = y + yG + d / 2;
    (grupos || []).forEach(g => {
      const xa = x + passo * g.de + passo * 0.12, xb = x + passo * (g.ate + 1) - passo * 0.12;
      linha(s, xa, y + 0.26, xb - xa, 0, { color: APOIO, width: 0.75 }); linha(s, xa, y + 0.22, 0, 0.08, { color: APOIO, width: 0.75 }); linha(s, xb, y + 0.22, 0, 0.08, { color: APOIO, width: 0.75 });
      texto(s, g.rotulo, { x: xa, y, w: xb - xa, h: 0.22, fontSize: 8, bold: true, color: g.cor || ESC, align: 'center' });
    });
    linha(s, x + passo / 2, cyN, w - passo, 0, { color: APOIO, width: 0.75 });
    etapas.forEach((e, i) => {
      const cx = x + passo * (i + 0.5);
      s.addShape(S.OVAL, { x: cx - d / 2, y: cyN - d / 2, w: d, h: d, fill: { color: 'FFFFFF' }, line: { color: ESC, width: 1 } });
      if (e.icone) icone(s, { x: cx - d * 0.3, y: cyN - d * 0.3, d: d * 0.6, nome: e.icone });
      else texto(s, String(i + 1), { x: cx - d / 2, y: cyN - d / 2, w: d, h: d, fontSize: 9, bold: true, color: ESC, align: 'center' });
      if (numerar && e.icone && i < n - 1) { s.addShape(S.RECTANGLE, { x: cx + passo / 2 - 0.09, y: cyN - 0.09, w: 0.18, h: 0.18, fill: { color: 'FFFFFF' }, line: { type: 'none' } }); texto(s, String(i + 1), { x: cx + passo / 2 - 0.09, y: cyN - 0.09, w: 0.18, h: 0.18, fontSize: 7.5, bold: true, color: ESC, align: 'center' }); }
      const wC = Math.min(passo - 0.12, 1.25), fill = e.destaque ? COR.escuro : (e.destaque === false ? tom(COR.dom, 0.55) : COR.dom);
      s.addShape(S.ROUNDED_RECTANGLE, { x: cx - wC / 2, y: cyN + d / 2 + 0.1, w: wC, h: 0.3, rectRadius: 0.04, fill: { color: fill }, line: { type: 'none' } });
      texto(s, e.rotulo, { x: cx - wC / 2 + 0.03, y: cyN + d / 2 + 0.1, w: wC - 0.06, h: 0.3, fontSize: 7.5, bold: true, color: sobre(fill), align: 'center' });
    });
    return yG + d + 0.44;
  }
  // painel: fundo cinza neutro (F2F2F2) com titulo opcional em etiqueta na cor sobreposta ao canto (Kepler "ROIC Calculation", Nubank, Vibra)
  //   devolve a area interna. E o recipiente de um aprofundamento (zoom, premissas, citacao), nao a moldura de todo bloco.
  function painel(s, { x, y, w, h, titulo, estilo = 'etiqueta', fundo = PAINEL }) {
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: fundo }, line: { type: 'none' } });
    if (!titulo) return { x: x + 0.12, y: y + 0.1, w: w - 0.24, h: h - 0.2 };
    if (estilo === 'faixa') {   // faixa cheia na cor em cima (Kepler 3 paineis; FUCAPE)
      s.addShape(S.RECTANGLE, { x, y, w, h: 0.07, fill: { color: COR.dom }, line: { type: 'none' } });
      texto(s, titulo, { x: x + 0.1, y: y + 0.12, w: w - 0.2, h: 0.24, fontSize: 9.5, color: ESC, align: 'center' });
      return { x: x + 0.12, y: y + 0.42, w: w - 0.24, h: h - 0.52 };
    }
    const wt = larguraTexto(titulo, 9, true) + 0.3;
    s.addShape(S.RECTANGLE, { x: x - 0.06, y: y - 0.1, w: wt, h: 0.26, fill: { color: COR.dom }, line: { type: 'none' } });
    texto(s, titulo, { x: x - 0.06, y: y - 0.1, w: wt, h: 0.26, fontSize: 9, bold: true, color: sobre(COR.dom), align: 'center' });
    return { x: x + 0.12, y: y + 0.24, w: w - 0.24, h: h - 0.34 };
  }

  return { grafico, colcheteCagr, nota, elipse, marcoEvento, linhaRef, faixaConclusao, tabela, sensibilidade, premissas, footballField,
    matrizRisco, listaCategorias, equacao, linhaTempo, cenarios, listaPinos, numeroTexto, tiraFatos, citacao, recorte, abas, icone, cadeia, painel };
};
