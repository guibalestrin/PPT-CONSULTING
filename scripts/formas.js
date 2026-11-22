// formas.js -- biblioteca de formas do miolo (repertorio do usuario). Uso:
//   const formas = require('./formas.js')(pres, COR, F, { fonteTtf, fonteTtfBold });
//   formas.kpiLosango(slide, { x, y, valor, unidade, rotulo, nota });
// COR precisa de: dom, dest, escuro, clara, fundo, cinza, texto (hex sem #). F = fonte aprovada.
// Medidas em polegadas. Formas com degrade recebem objectName GR_* e a especificacao vai em formas.degrades,
// que deve ser somada ao JSON do barra_lateral.py (Object.assign(GRAD, formas.degrades)).
module.exports = function (pres, COR, F, opts = {}) {
  const S = pres.shapes;
  const degrades = {};
  let seq = 0;
  const id = (p) => `${p}_${++seq}`;

  // ---------- utilitarios ----------
  const sombra = () => ({ type: 'outer', blur: 3, offset: 1.5, angle: 90, color: '000000', opacity: 0.22 });
  function larguraTexto(txt, pt, negrito) {
    const arq = negrito ? opts.fonteTtfBold : opts.fonteTtf;
    if (arq) {
      const { execFileSync } = require('child_process');
      const py = 'import sys;from PIL import ImageFont;print(ImageFont.truetype(sys.argv[1],1000).getlength(sys.argv[2]))';
      return parseFloat(execFileSync(opts.python || process.env.PYTHON || 'python3', ['-c', py, arq, txt]).toString()) / 1000 * pt / 72;
    }
    return txt.length * pt * (negrito ? 0.58 : 0.53) / 72 * 1.15;   // estimativa com folga
  }
  function texto(s, conteudo, o) {
    s.addText(conteudo, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: COR.texto }, o));
  }
  function grad(nome, ang, stops) { degrades[nome] = { ang, stops }; return nome; }
  // texto sobre um preenchimento: branco, ou escuro quando a cor e clara demais (contraste < 3:1 com branco; ex.: destaque 6FBF9B)
  function txtSobre(hex) {
    const l = [0, 2, 4].map(i => { const v = parseInt(hex.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    const lum = 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
    return 1.05 / (lum + 0.05) < 3 ? COR.escuro : 'FFFFFF';
  }
  function tom(hex, f) {   // f > 0 clareia, f < 0 escurece (0..1)
    const n = parseInt(hex, 16), c = [n >> 16, (n >> 8) & 255, n & 255]
      .map(v => Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f)));
    return c.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  function placeholder(s, { x, y, w, h, texto: t, nome }) {
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'F2F2F2' }, line: { color: 'A6A6A6', width: 1, dashType: 'dash' }, objectName: 'PH_' + nome });
    texto(s, t, { x, y, w, h, fontSize: 9.5, color: '7F7F7F', align: 'center', margin: 6, objectName: 'PH_' + nome + '_txt' });
  }
  function linhaGuia(s, x1, y, x2) {   // pontilhado com traco vertical no fim
    s.addShape(S.LINE, { x: x1, y, w: x2 - x1, h: 0, line: { color: COR.texto, width: 0.75, dashType: 'sysDot' } });
    s.addShape(S.LINE, { x: x2, y: y - 0.1, w: 0, h: 0.2, line: { color: COR.texto, width: 1 } });
  }

  // ---------- 1. faixas numeradas em arco ----------
  // itens: [[titulo, subtitulo], ...] (3 a 5)
  function faixasNumeradasArco(s, { x, y, w, itens, h = 0.46, gap = 0.15 }) {
    const n = itens.length, alt = n * h + (n - 1) * gap;
    s.addShape(S.CUSTOM_GEOMETRY, { x, y: y - 0.05, w: 0.3, h: alt + 0.1, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: 'BFBFBF', width: 2.25 },
      points: [{ x: 0.28, y: 0 }, { x: 0.28, y: alt + 0.1, curve: { type: 'cubic', x1: -0.12, y1: alt * 0.33, x2: -0.12, y2: alt * 0.7 } }] });
    const tons = [COR.escuro, COR.dom, tom(COR.dom, 0.2), tom(COR.dom, 0.35), tom(COR.dom, 0.45)];
    itens.forEach(([t, sub], i) => {
      const yi = y + i * (h + gap), xi = x + 0.3, wi = w - 0.3, d = h * 1.12;
      s.addShape(S.OVAL, { x: x + 0.07, y: yi + h / 2 - 0.06, w: 0.12, h: 0.12, fill: { color: COR.dom }, line: { color: 'FFFFFF', width: 1 } });
      const ini = tons[Math.min(i, tons.length - 1)];
      s.addShape(S.ROUNDED_RECTANGLE, { x: xi + h * 0.55, y: yi, w: wi - h * 0.55, h, rectRadius: h / 2, fill: { color: ini }, line: { type: 'none' }, shadow: sombra(),
        objectName: grad(id('GR_faixa'), 0, [[0, ini, 100], [70, tom(ini, 0.15), 100], [100, COR.clara, 60]]) });
      s.addShape(S.DIAMOND, { x: xi, y: yi + h / 2 - d / 2, w: d, h: d, fill: { color: COR.escuro }, line: { color: 'FFFFFF', width: 1.5 }, shadow: sombra() });
      texto(s, String(i + 1).padStart(2, '0'), { x: xi, y: yi + h / 2 - d / 2, w: d, h: d, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center' });
      texto(s, [{ text: t, options: { bold: true, fontSize: 11.5, breakLine: true } }, { text: sub, options: { fontSize: 9.5 } }],
        { x: xi + d + 0.12, y: yi, w: wi - d - 0.3, h, color: 'FFFFFF' });
    });
  }

  // ---------- 2. KPI em losango ----------
  function kpiLosango(s, { x, y, d = 0.72, valor, unidade, rotulo, nota, wTexto = 1.55 }) {
    s.addShape(S.DIAMOND, { x: x - 0.05, y: y - 0.07, w: d, h: d, fill: { color: COR.escuro }, line: { type: 'none' } });
    s.addShape(S.DIAMOND, { x, y, w: d, h: d, fill: { color: COR.fundo }, line: { color: COR.clara, width: 0.75 } });
    texto(s, [{ text: valor, options: { bold: true, fontSize: 14, color: COR.dom, breakLine: true } }, { text: unidade, options: { fontSize: 8 } }],
      { x, y, w: d, h: d, align: 'center' });
    s.addShape(S.LINE, { x: x + d + 0.02, y: y + d / 2, w: 0.26, h: 0, line: { color: COR.dom, width: 1, dashType: 'sysDot' } });
    texto(s, [{ text: rotulo, options: { bold: true, fontSize: 10.5, color: COR.dom, breakLine: true } }, { text: nota, options: { fontSize: 9.5 } }],
      { x: x + d + 0.32, y: y + d / 2 - 0.3, w: wTexto, h: 0.6 });
  }
  // grade de KPIs em 2 colunas defasadas com divisoria
  function gradeKpiLosango(s, { x, y, w, kpis, passo = 0.86, defasagem = 0.2 }) {
    const colW = w / 2, linhas = Math.ceil(kpis.length / 2);
    // sem divisoria vertical entre as colunas (linha antes de texto e proibida pelo usuario)
    kpis.forEach((k, i) => kpiLosango(s, Object.assign({ x: x + (i % 2) * colW + 0.14, y: y + Math.floor(i / 2) * passo + (i % 2 ? defasagem : 0), wTexto: colW - 1.25 }, k)));
  }

  // ---------- 3. lajes empilhadas com linhas-guia ----------
  // itens: [[titulo, subtitulo], ...] de cima para baixo (2 a 4)
  function lajesEmpilhadas(s, { x, y, w, itens, wLaje = 1.3, hLaje = 0.7, passo = 0.66 }) {
    const n = itens.length, cores = [COR.escuro, COR.dom, COR.dest, COR.clara].slice(0, n);
    const xBox = x + wLaje + 0.5, wBox = x + w - xBox;
    const larg = (i) => wLaje - (n - 1 - i) * 0.16;
    for (let i = n - 1; i >= 0; i--) {   // de baixo para cima
      const wl = larg(i);
      s.addShape(S.CUBE, { x: x + (wLaje - wl) / 2, y: y + i * passo, w: wl, h: hLaje, fill: { color: cores[i] }, line: { type: 'none' } });
    }
    itens.forEach(([t, sub], i) => {
      const wl = larg(i), xl = x + (wLaje - wl) / 2, yl = y + i * passo + hLaje * 0.62;
      linhaGuia(s, xl + wl, yl, xBox - 0.08);
      s.addShape(S.RECTANGLE, { x: xBox, y: yl - 0.28, w: wBox, h: 0.56, fill: { color: cores[i] }, line: { type: 'none' }, shadow: sombra() });
      const claro = cores[i] === COR.clara;
      texto(s, [{ text: t, options: { bold: true, fontSize: 11.5, breakLine: true } }, { text: sub, options: { fontSize: 9 } }],
        { x: xBox + 0.12, y: yl - 0.28, w: wBox - 0.2, h: 0.56, color: claro ? COR.escuro : txtSobre(cores[i]) });
    });
  }

  // ---------- 4. piramide 3D com faixas ----------
  // niveis: [rotulo, ...] do topo para a base (3 a 4)
  function piramide3D(s, { x, y, w, h, niveis, wPir }) {
    const n = niveis.length, wp = wPir || Math.min(2.6, w * 0.45), hn = h / n, cx = x + wp / 2;
    const cores = [tom(COR.dest, 0.35), COR.dest, COR.dom, COR.escuro].slice(4 - n);
    niveis.forEach((rot, i) => {
      const yt = y + i * hn, meioT = wp / 2 * (i / n), meioB = wp / 2 * ((i + 1) / n), cor = cores[i];
      // faixa saindo do nivel (atras da piramide)
      const yf = yt + hn * 0.18, hf = hn * 0.64;
      s.addShape(S.CUSTOM_GEOMETRY, { x: cx, y: yf, w: x + w - cx, h: hf, fill: { color: cor }, line: { type: 'none' }, shadow: sombra(),
        points: [{ x: 0, y: 0 }, { x: x + w - cx - 0.22, y: 0 }, { x: x + w - cx, y: hf / 2 }, { x: x + w - cx - 0.22, y: hf }, { x: 0, y: hf }, { close: true }] });
      texto(s, rot, { x: cx + meioB + 0.2, y: yf, w: x + w - cx - meioB - 0.45, h: hf, fontSize: 11, bold: true, color: i < n - 2 ? COR.escuro : 'FFFFFF' });
      // face frontal esquerda e face lateral direita (mais escura)
      s.addShape(S.CUSTOM_GEOMETRY, { x: cx - meioB, y: yt, w: meioB, h: hn, fill: { color: cor }, line: { color: 'FFFFFF', width: 0.75 },
        points: [{ x: meioB - meioT, y: 0 }, { x: meioB, y: 0 }, { x: meioB, y: hn }, { x: 0, y: hn }, { close: true }] });
      s.addShape(S.CUSTOM_GEOMETRY, { x: cx, y: yt, w: meioB, h: hn, fill: { color: tom(cor, -0.25) }, line: { color: 'FFFFFF', width: 0.75 },
        points: [{ x: 0, y: 0 }, { x: meioT, y: 0 }, { x: meioB, y: hn }, { x: 0, y: hn }, { close: true }] });
    });
  }

  // ---------- 5. funil de prismas ----------
  // itens: [[titulo, texto], ...] (3 a 4), afunilando para baixo
  function funilPrismas(s, { x, y, w, itens, hItem = 0.62, gap = 0.12, wFunil = 1.5 }) {
    const n = itens.length, cores = [tom(COR.escuro, 0.1), COR.dom, tom(COR.dom, 0.2), tom(COR.dom, 0.35)];
    itens.forEach(([t, txt], i) => {
      const yi = y + i * (hItem + gap), ww = wFunil * (1 - i * 0.18), xi = x + (wFunil - ww) / 2, cor = cores[i];
      s.addShape(S.RECTANGLE, { x: x + wFunil / 2, y: yi + hItem * 0.12, w: w - wFunil / 2, h: hItem * 0.76, fill: { color: tom(cor, 0.1) }, line: { type: 'none' } });
      texto(s, [{ text: t, options: { bold: true, fontSize: 11, breakLine: true } }, { text: txt, options: { fontSize: 9.5 } }],
        { x: x + wFunil + 0.2, y: yi + hItem * 0.12, w: w - wFunil - 0.3, h: hItem * 0.76, color: 'FFFFFF' });
      // prisma: face frontal (trapezio) + aresta central clara
      s.addShape(S.CUSTOM_GEOMETRY, { x: xi, y: yi, w: ww, h: hItem, fill: { color: tom(cor, -0.2) }, line: { color: 'FFFFFF', width: 0.75 },
        points: [{ x: 0, y: hItem * 0.3 }, { x: ww / 2, y: 0 }, { x: ww, y: hItem * 0.3 }, { x: ww * 0.82, y: hItem }, { x: ww * 0.18, y: hItem }, { close: true }] });
      s.addShape(S.CUSTOM_GEOMETRY, { x: xi, y: yi, w: ww / 2, h: hItem, fill: { color: tom(cor, 0.05) }, line: { color: 'FFFFFF', width: 0.75 },
        points: [{ x: 0, y: hItem * 0.3 }, { x: ww / 2, y: 0 }, { x: ww / 2, y: hItem }, { x: ww * 0.18, y: hItem }, { close: true }] });
    });
  }

  // ---------- 6. caixa com etiqueta ----------
  function caixaEtiqueta(s, { x, y, w, h, etiqueta }) {
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: COR.dom, width: 1 } });
    const we = larguraTexto(etiqueta, 10.5, true) + 0.3;
    s.addShape(S.RECTANGLE, { x: x + 0.18, y: y - 0.14, w: we, h: 0.28, fill: { color: COR.dom }, line: { type: 'none' }, shadow: sombra() });
    texto(s, etiqueta, { x: x + 0.18, y: y - 0.14, w: we, h: 0.28, fontSize: 10.5, bold: true, color: 'FFFFFF', align: 'center' });
    return { x: x + 0.18, y: y + 0.22, w: w - 0.36, h: h - 0.32 };   // area interna
  }

  // ---------- 7. caixa com fita dobrada ----------
  function caixaFita(s, { x, y, w, h, fita, runs }) {
    s.addShape(S.RECTANGLE, { x: x + 0.1, y: y + 0.06, w: w - 0.1, h, fill: { color: COR.escuro }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x: x + 0.1, y, w: w - 0.16, h: h - 0.02, fill: { color: 'EDEDED' }, line: { color: COR.texto, width: 0.75 } });
    const wf = larguraTexto(fita, 10.5, true) + 0.4;
    s.addShape(S.CUSTOM_GEOMETRY, { x: x - 0.04, y: y + 0.32, w: 0.14, h: 0.1, fill: { color: COR.escuro }, line: { type: 'none' },
      points: [{ x: 0, y: 0 }, { x: 0.14, y: 0 }, { x: 0.14, y: 0.1 }, { close: true }] });   // dobra
    s.addShape(S.RECTANGLE, { x: x - 0.04, y: y + 0.06, w: wf, h: 0.26, fill: { color: COR.dom }, line: { type: 'none' }, shadow: sombra() });
    texto(s, fita, { x: x - 0.04, y: y + 0.06, w: wf, h: 0.26, fontSize: 10.5, bold: true, color: 'FFFFFF', align: 'center' });
    if (runs) texto(s, runs, { x: x + 0.25, y: y + 0.36, w: w - 0.45, h: h - 0.42, fontSize: 12 });
  }

  // ---------- 8. card com aba de titulo ----------
  // estilo 'barra' (barra escura no topo) ou 'fita' (fita mais larga com pontas dobradas)
  function cardAba(s, { x, y, w, h, titulo, runs, estilo = 'barra' }) {
    if (estilo === 'barra') {
      s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FAFAFA' }, line: { color: 'D9D9D9', width: 0.5 }, shadow: sombra() });
      s.addShape(S.RECTANGLE, { x: x - 0.03, y: y - 0.05, w: w + 0.06, h: 0.32, fill: { color: COR.escuro }, line: { type: 'none' } });
      texto(s, titulo, { x, y: y - 0.05, w, h: 0.32, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center' });
    } else {
      s.addShape(S.RECTANGLE, { x: x + 0.12, y: y + 0.3, w: w - 0.24, h: h - 0.3, fill: { color: 'EDEDED' }, line: { type: 'none' } });
      [[x, -1], [x + w - 0.12, 1]].forEach(([xd, lado]) => s.addShape(S.CUSTOM_GEOMETRY, { x: xd, y: y + 0.36, w: 0.12, h: 0.08, fill: { color: tom(COR.escuro, -0.3) }, line: { type: 'none' },
        points: lado < 0 ? [{ x: 0, y: 0 }, { x: 0.12, y: 0 }, { x: 0.12, y: 0.08 }, { close: true }] : [{ x: 0, y: 0 }, { x: 0.12, y: 0 }, { x: 0, y: 0.08 }, { close: true }] }));
      s.addShape(S.RECTANGLE, { x, y: y + 0.04, w, h: 0.32, fill: { color: COR.dom }, line: { type: 'none' } });
      texto(s, titulo, { x, y: y + 0.04, w, h: 0.32, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center' });
    }
    if (runs) texto(s, runs, { x: x + 0.2, y: y + 0.4, w: w - 0.4, h: h - 0.5, fontSize: 10.5, valign: 'top' });
  }

  // ---------- 9. moldura deslocada ----------
  // lado: 'baixo' (bloco atras para baixo/direita) ou 'cima' (para cima/esquerda); colchete: linha pontilhada a esquerda
  function molduraDeslocada(s, { x, y, w, h, lado = 'baixo', cor = COR.dest, colchete = false, runs }) {
    const dx = lado === 'baixo' ? 0.09 : -0.09;
    s.addShape(S.RECTANGLE, { x: x + dx, y: y + dx, w, h, fill: { color: cor }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: COR.escuro, width: 1 } });
    if (colchete) console.warn('AVISO molduraDeslocada: "colchete" ignorado (linha vertical antes do texto e proibida pelo usuario).');
    if (runs) texto(s, runs, { x: x + 0.18, y: y + 0.1, w: w - 0.36, h: h - 0.2, fontSize: 11 });
    return { x, y, w, h };
  }

  // ---------- 10. bloco + conector trapezoidal ----------
  function chamadaConector(s, { x, y, wBloco = 1.55, w, h, rotulo, runs }) {
    s.addShape(S.RECTANGLE, { x, y, w: wBloco, h, fill: { color: COR.escuro }, line: { type: 'none' },
      objectName: grad(id('GR_bloco'), 0, [[0, tom(COR.escuro, -0.35), 100], [100, COR.dom, 100]]) });
    texto(s, rotulo, { x: x + 0.1, y, w: wBloco - 0.2, h, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center' });
    const xc = x + wBloco, wc = 0.35, xb = xc + wc, wb = w - wBloco - wc;
    s.addShape(S.CUSTOM_GEOMETRY, { x: xc, y, w: wc, h, fill: { color: COR.dom }, line: { type: 'none' },
      objectName: grad(id('GR_conector'), 0, [[0, COR.dom, 100], [100, COR.escuro, 100]]),
      points: [{ x: 0, y: h * 0.32 }, { x: wc, y: h * 0.12 }, { x: wc, y: h * 0.88 }, { x: 0, y: h * 0.68 }, { close: true }] });
    s.addShape(S.RECTANGLE, { x: xb + 0.07, y: y + 0.07, w: wb - 0.07, h: h - 0.07, fill: { color: COR.dest }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x: xb, y, w: wb - 0.07, h: h - 0.07, fill: { color: 'FFFFFF' }, line: { color: COR.dom, width: 1 } });
    texto(s, runs, { x: xb + 0.15, y, w: wb - 0.37, h: h - 0.07, fontSize: 11 });
  }

  // ---------- 11. chips hexagonais na linha ----------
  function chipsHexagonais(s, { x, y, w, itens, ativo = 0, wChip = 1.45, hChip = 0.42 }) {
    s.addShape(S.LINE, { x, y: y + hChip / 2, w, h: 0, line: { color: COR.dest, width: 1 } });
    const passo = (w - wChip) / Math.max(1, itens.length - 1);
    itens.forEach((t, i) => {
      const on = i === ativo, xi = x + i * passo;
      s.addShape(S.FLOWCHART_PREPARATION, { x: xi, y, w: wChip, h: hChip, fill: { color: on ? COR.dom : COR.fundo }, line: { color: on ? COR.escuro : COR.dest, width: 1.25 }, shadow: sombra() });
      texto(s, t, { x: xi, y, w: wChip, h: hChip, fontSize: 11, bold: on, color: on ? 'FFFFFF' : COR.escuro, align: 'center' });
    });
  }

  // ---------- 12. marcador hexagonal ----------
  function marcadorHexagonal(s, { x, y, wLinha = 1.3, numeral = 'II' }) {
    s.addShape(S.LINE, { x, y, w: wLinha, h: 0, line: { color: COR.escuro, width: 1 } });
    s.addShape(S.HEXAGON, { x: x + wLinha, y: y - 0.15, w: 0.36, h: 0.3, fill: { color: COR.dom }, line: { type: 'none' } });
    texto(s, numeral, { x: x + wLinha, y: y - 0.15, w: 0.36, h: 0.3, fontSize: 9, bold: true, color: 'FFFFFF', align: 'center' });
  }

  // ---------- 13. cards paralelogramo (etapas com foto) ----------
  function cardsParalelogramo(s, { x, y, w, h, itens }) {   // itens: [[rotulo, descricaoDaFoto], ...]
    const n = itens.length, g = 0.2, wc = (w - g * (n - 1)) / n;
    itens.forEach(([rot, foto], i) => {
      const xi = x + i * (wc + g);
      texto(s, rot, { x: xi, y, w: wc, h: 0.25, fontSize: 10.5, bold: true, align: 'center', color: COR.escuro });
      s.addShape(S.PARALLELOGRAM, { x: xi + 0.06, y: y + 0.35, w: wc, h: h - 0.35, fill: { color: COR.dom }, line: { type: 'none' } });
      s.addShape(S.PARALLELOGRAM, { x: xi, y: y + 0.3, w: wc, h: h - 0.37, fill: { color: 'EEEEEE' }, line: { type: 'none' }, objectName: 'PH_foto_' + i });
      texto(s, `[FOTO: ${foto}]`, { x: xi + wc * 0.15, y: y + 0.3, w: wc * 0.7, h: h - 0.37, fontSize: 9, color: '7F7F7F', align: 'center' });
    });
  }

  // ---------- 14. cubos com linhas-guia ----------
  function cubosLinhasGuia(s, { x, y, wTexto = 1.9, itens, lado = 0.75 }) {   // itens: rotulos (2 a 4)
    const n = itens.length, cores = [COR.dom, COR.escuro, COR.dest, COR.clara];
    const xc = x + wTexto + 0.1;
    itens.forEach((t, i) => {
      const yl = y + 0.15 + i * 0.32;
      texto(s, t, { x, y: yl - 0.22, w: wTexto, h: 0.22, fontSize: 10.5, valign: 'bottom' });
      s.addShape(S.LINE, { x, y: yl, w: wTexto + 0.1 + i * lado * 0.55, h: 0, line: { color: cores[i], width: 1 } });
    });
    itens.forEach((t, i) => s.addShape(S.CUBE, { x: xc + i * lado * 0.55, y: y + i * 0.14, w: lado, h: lado * 1.25 - i * 0.14, fill: { color: cores[i] }, line: { type: 'none' } }));
  }

  // ---------- 15. tubos com tampa ----------
  function tubosTampa(s, { x, y, w, itens, hTubo = 0.42 }) {   // itens: [[rotulo, valorTexto], ...]
    const cores = [COR.escuro, COR.dom, COR.dest, COR.clara];
    itens.forEach(([t, v], i) => {
      const yi = y + i * hTubo, cor = cores[i % 4], escuro = tom(cor, -0.3);
      s.addShape(S.RECTANGLE, { x, y: yi, w: w - hTubo, h: hTubo, fill: { color: cor }, line: { color: 'FFFFFF', width: 0.5 },
        objectName: grad(id('GR_tubo'), 90, [[0, tom(cor, 0.15), 100], [100, escuro, 100]]) });
      texto(s, [{ text: t + '  ', options: { bold: true } }, { text: v }], { x: x + 0.15, y: yi, w: w - hTubo * 2 - 0.2, h: hTubo, fontSize: 10.5, color: cor === COR.clara ? COR.escuro : txtSobre(cor) });
    });
    const hT = itens.length * hTubo;   // tampa: semicirculos concentricos na ponta
    const wT = hT * 0.38, xT = x + w - hTubo - wT / 2;
    [[0, COR.escuro], [0.07, COR.dom], [0.15, tom(COR.escuro, -0.4)]].forEach(([enc, c]) =>
      s.addShape(S.OVAL, { x: xT + enc, y: y - 0.06 + enc, w: wT - enc, h: hT + 0.12 - enc * 2, fill: { color: c }, line: { type: 'none' } }));
  }

  // ---------- 16. colunas-equacao ----------
  // pilares: [[titulo, rotuloDaColuna], ...]; resultado: texto da ultima coluna
  // imagens?: [descricao, ...] do que vai no topo de cada coluna (placeholder de imagem; o usuario nao gosta de icones)
  function colunasEquacao(s, { x, y, w, h, pilares, resultado, imagens }) {
    const n = pilares.length + 1, wc = w / n, hTopo = 0.38;
    s.addShape(S.RECTANGLE, { x, y, w, h: hTopo, fill: { color: COR.fundo }, line: { type: 'none' } });
    const tons = [tom(COR.escuro, -0.3), COR.escuro, COR.dom, COR.dest];
    pilares.forEach(([tit, rot], i) => {
      const xi = x + i * wc;
      texto(s, tit, { x: xi, y, w: wc, h: hTopo, fontSize: 9.5, color: COR.dom, align: 'center' });
      s.addShape(S.RECTANGLE, { x: xi, y: y + hTopo, w: wc, h: h - hTopo, fill: { color: tons[i % 4] }, line: { type: 'none' } });
      placeholder(s, { x: xi + wc * 0.25, y: y + hTopo + 0.15, w: wc * 0.5, h: (h - hTopo) * 0.42, texto: imagens && imagens[i] ? `[IMAGEM: ${imagens[i]}]` : '[IMAGEM]', nome: id('imagem') });
      texto(s, rot, { x: xi + 0.08, y: y + h - (h - hTopo) * 0.38, w: wc - 0.16, h: (h - hTopo) * 0.3, fontSize: 9.5, bold: true, color: 'FFFFFF', align: 'center' });
    });
    const xr = x + pilares.length * wc;
    s.addShape(S.RECTANGLE, { x: xr, y: y + hTopo, w: wc, h: h - hTopo, fill: { color: COR.clara }, line: { type: 'none' } });
    texto(s, resultado, { x: xr + 0.08, y: y + hTopo, w: wc - 0.16, h: h - hTopo, fontSize: 13, bold: true, color: COR.escuro, align: 'center' });
    pilares.forEach((p, i) => texto(s, i < pilares.length - 1 ? '+' : '=', {   // operadores por cima, na divisa das colunas
      x: x + (i + 1) * wc - 0.2, y: y + h - 0.5, w: 0.4, h: 0.4, fontSize: 22, bold: true, color: 'FFFFFF', align: 'center' }));
  }

  // ---------- 17. cartao de citacao ----------
  // citacao: runs (palavras-chave com { bold: true, color: COR.dom })
  function cartaoCitacao(s, { x, y, w, h, citacao, nome, cargo }) {
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: 'D9D9D9', width: 0.75 }, shadow: sombra() });
    const wf = Math.min(1.4, h * 1.05);
    placeholder(s, { x: x + 0.15, y: y + 0.1, w: wf, h: h - 0.2, texto: `[FOTO: ${nome}]`, nome: id('foto_citacao') });
    texto(s, citacao.map(r => typeof r === 'string' ? { text: r, options: { italic: true } } : { text: r.text, options: Object.assign({ italic: true }, r.options) }),
      { x: x + wf + 0.35, y: y + 0.12, w: w - wf - 0.55, h: h * 0.55, fontSize: 13, valign: 'top' });
    texto(s, [{ text: nome, options: { bold: true, color: COR.dom } }, { text: '  |  ' + cargo, options: { color: COR.cinza } }],
      { x: x + wf + 0.35, y: y + h - 0.42, w: w - wf - 0.55, h: 0.3, fontSize: 10.5 });
  }

  // ---------- 18. cards ligados por circulos ----------
  function cardsLigados(s, { x, y, w, h, cards }) {   // cards: [[titulo, runs], ...]
    const n = cards.length, g = 0.35, wc = (w - g * (n - 1)) / n;
    for (let i = 0; i < n - 1; i++) {   // meias-luas costurando os cards (atras)
      const cx = x + (i + 1) * wc + i * g + g / 2;
      [[0.85, COR.dom], [0.65, COR.dest], [0.45, COR.escuro]].forEach(([d, c]) =>
        s.addShape(S.OVAL, { x: cx - d / 2, y: y + h * 0.3 - d / 2 + 0.3, w: d, h: d, fill: { color: c }, line: { type: 'none' } }));
    }
    cards.forEach(([t, runs], i) => {
      const xi = x + i * (wc + g);
      s.addShape(S.RECTANGLE, { x: xi + 0.05, y: y + 0.05, w: wc, h, fill: { color: COR.dom }, line: { type: 'none' } });
      s.addShape(S.RECTANGLE, { x: xi, y, w: wc, h, fill: { color: 'F4F4F4' }, line: { color: COR.texto, width: 0.75 } });
      texto(s, t, { x: xi + 0.2, y: y + 0.1, w: wc - 0.4, h: 0.3, fontSize: 11.5, bold: true, color: COR.escuro });
      s.addShape(S.LINE, { x: xi + 0.2, y: y + 0.42, w: wc - 0.4, h: 0, line: { color: COR.escuro, width: 0.75 } });
      if (runs) texto(s, runs, { x: xi + 0.2, y: y + 0.52, w: wc - 0.4, h: h - 0.62, fontSize: 10, valign: 'top' });
    });
  }

  return { degrades, tom, sombra, larguraTexto, placeholder, linhaGuia,
    faixasNumeradasArco, kpiLosango, gradeKpiLosango, lajesEmpilhadas, piramide3D, funilPrismas, caixaEtiqueta, caixaFita,
    cardAba, molduraDeslocada, chamadaConector, chipsHexagonais, marcadorHexagonal, cardsParalelogramo, cubosLinhasGuia,
    tubosTampa, colunasEquacao, cartaoCitacao, cardsLigados };
};
