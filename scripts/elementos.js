// elementos.js -- elementos de organizacao tirados dos decks de referencia do usuario (ver references/referencias.md).
// Carregado por moldura.js e somado a deck.formas: formas.painelAba(s, {...}), formas.treemap(s, {...}) etc.
//   require('./elementos.js')(pres, COR, F, formas, { imagem })
// Todas as funcoes recebem (slide, { ... }); medidas em polegadas; runs = string ou runs do pptxgenjs.
// Numeros saem no padrao brasileiro (virgula decimal). Nada de icones: texto, numero, forma ou foto.
module.exports = function (pres, COR, F, formas, ctx = {}) {
  const S = pres.shapes;
  const { tom, sombra, larguraTexto } = formas;
  let seq = 0;
  const id = (p) => `${p}_${++seq}`;
  const grad = (nome, ang, stops) => { formas.degrades[nome] = { ang, stops }; return nome; };
  const CINZA_CLARO = 'D9D9D9', CINZA_MEDIO = 'A6A6A6', FUNDO_NEUTRO = 'F2F2F2';
  const ESCURO_TXT = tom(COR.texto, -0.25);

  function texto(s, conteudo, o) {
    s.addText(conteudo, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: COR.texto }, o));
  }
  // numero no padrao brasileiro: 1234.5 -> "1.234,5"
  function fmt(v, casas = 1) {
    if (typeof v === 'string') return v;
    const [int, dec] = Math.abs(v).toFixed(casas).split('.');
    return (v < 0 ? '-' : '') + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (dec ? ',' + dec : '');
  }
  const casasAuto = (vals) => vals.every(v => typeof v !== 'number' || Number.isInteger(v)) ? 0 : 1;
  const linha = (s, x, y, w, h, o) => s.addShape(S.LINE, Object.assign({ x, y, w, h }, { line: Object.assign({ color: COR.cinza, width: 0.75 }, o) }));
  function segmento(s, x1, y1, x2, y2, o) {   // linha entre dois pontos, em qualquer direcao
    s.addShape(S.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      flipH: (x2 < x1) !== (y2 < y1) && x1 !== x2 && y1 !== y2, line: Object.assign({ color: COR.cinza, width: 0.75 }, o) });
  }
  const claro = (hex) => { const n = parseInt(hex, 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 165; };

  // ---------- painelAba: painel com titulo em aba ('aba') ou em faixa escura com bico ('faixa') ----------
  // marcador = frase-tese com losango logo abaixo da aba. Devolve a area interna { x, y, w, h }.
  function painelAba(s, { x, y, w, h, titulo, estilo = 'aba', marcador, fundo }) {
    const hAba = 0.36;
    if (estilo === 'faixa') {
      s.addShape(S.RECTANGLE, { x, y: y + hAba, w, h: h - hAba, fill: { color: fundo || 'FFFFFF' }, line: { color: CINZA_CLARO, width: 0.75 } });
      s.addShape(S.RECTANGLE, { x, y, w, h: hAba, fill: { color: COR.escuro }, line: { type: 'none' },
        objectName: grad(id('GR_faixa_painel'), 0, [[0, tom(COR.escuro, -0.25), 100], [100, COR.dom, 100]]) });
      s.addShape(S.CUSTOM_GEOMETRY, { x: x + 0.3, y: y + hAba - 0.01, w: 0.26, h: 0.13, fill: { color: tom(COR.escuro, -0.25) }, line: { type: 'none' },
        points: [{ x: 0, y: 0 }, { x: 0.26, y: 0 }, { x: 0.13, y: 0.13 }, { close: true }] });   // bico
      texto(s, titulo, { x: x + 0.15, y, w: w - 0.3, h: hAba, fontSize: 11.5, bold: true, color: 'FFFFFF' });
    } else {
      s.addShape(S.RECTANGLE, { x, y: y + hAba, w, h: h - hAba, fill: { color: fundo || COR.fundo }, line: { type: 'none' } });
      const wAba = Math.min(w, larguraTexto(titulo, 11.5, true) + 0.5);
      s.addShape(S.RECTANGLE, { x, y, w: wAba, h: hAba, fill: { color: COR.escuro }, line: { type: 'none' } });
      s.addShape(S.LINE, { x: x + wAba, y: y + hAba, w: w - wAba, h: 0, line: { color: COR.escuro, width: 1.5 } });
      texto(s, titulo, { x: x + 0.15, y, w: wAba - 0.3, h: hAba, fontSize: 11.5, bold: true, color: 'FFFFFF', fit: 'shrink' });
    }
    let yi = y + hAba + 0.14;
    if (marcador) {
      s.addShape(S.DIAMOND, { x: x + 0.15, y: yi + 0.07, w: 0.16, h: 0.16, fill: { color: COR.dom }, line: { type: 'none' } });
      texto(s, marcador, { x: x + 0.42, y: yi, w: w - 0.57, h: 0.3, fontSize: 10.5, bold: true, color: COR.escuro });
      yi += 0.42;
    }
    return { x: x + 0.15, y: yi, w: w - 0.3, h: y + h - yi - 0.12 };
  }

  // ---------- listaFitas: fatos curtos em fitas-seta ----------
  function listaFitas(s, { x, y, w, itens, h = 0.38, gap = 0.12, italico = false }) {
    const bico = Math.min(0.22, h * 0.6);
    itens.forEach((t, i) => {
      const yi = y + i * (h + gap);
      s.addShape(S.CUSTOM_GEOMETRY, { x, y: yi, w, h, fill: { color: COR.escuro }, line: { type: 'none' }, shadow: sombra(),
        objectName: grad(id('GR_fita'), 0, [[0, tom(COR.escuro, -0.2), 100], [80, COR.dom, 100], [100, COR.dom, 100]]),
        points: [{ x: 0, y: 0 }, { x: w - bico, y: 0 }, { x: w, y: h / 2 }, { x: w - bico, y: h }, { x: 0, y: h }, { close: true }] });
      s.addShape(S.RECTANGLE, { x, y: yi, w: 0.06, h, fill: { color: COR.dest }, line: { type: 'none' } });
      texto(s, t, { x: x + 0.18, y: yi, w: w - bico - 0.28, h, fontSize: 10.5, italic: italico, color: 'FFFFFF' });
    });
    return itens.length * (h + gap) - gap;
  }

  // ---------- barrasPirulito: 1 ou 2 series por item (a 2a e a favorecida, na cor dominante) ----------
  function barrasPirulito(s, { x, y, w, itens, series, max, casas = 1, wRotulo = 1.2 }) {
    const nS = Math.max(...itens.map(it => it.valores.length));
    const cores = nS === 1 ? [COR.dom] : [CINZA_MEDIO, COR.dom];
    let yi = y;
    if (series) {
      let xl = x + wRotulo;
      series.forEach((nome, k) => {
        s.addShape(S.OVAL, { x: xl, y: yi + 0.05, w: 0.13, h: 0.13, fill: { color: cores[k] }, line: { type: 'none' } });
        const wn = larguraTexto(nome, 9.5, false) + 0.1;
        texto(s, nome, { x: xl + 0.2, y: yi, w: wn, h: 0.23, fontSize: 9.5, color: COR.cinza });
        xl += wn + 0.45;
      });
      yi += 0.38;
    }
    const mx = max || Math.max(...itens.flatMap(it => it.valores)) * 1.12;
    const x0 = x + wRotulo + 0.1, wB = w - wRotulo - 0.1 - 0.62, hS = 0.26, d = 0.15;
    itens.forEach((it, i) => {
      const hItem = it.valores.length * hS;
      texto(s, it.rotulo, { x, y: yi, w: wRotulo - 0.08, h: hItem, fontSize: 10, bold: true, color: ESCURO_TXT, align: 'right' });
      linha(s, x0, yi - 0.02, 0, hItem + 0.04, { color: COR.cinza, width: 1 });
      it.valores.forEach((v, k) => {
        const cy = yi + k * hS + hS / 2, xv = x0 + wB * v / mx;
        s.addShape(S.LINE, { x: x0, y: cy, w: Math.max(0.01, xv - x0 - d / 2), h: 0, line: { color: cores[k], width: k === nS - 1 ? 2.25 : 1.5 } });
        s.addShape(S.OVAL, { x: xv - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: cores[k] }, line: { color: 'FFFFFF', width: 0.75 } });
        texto(s, fmt(v, casas), { x: xv + d / 2 + 0.06, y: cy - 0.12, w: 0.6, h: 0.24, fontSize: 9.5, bold: k === nS - 1, color: k === nS - 1 ? COR.dom : COR.cinza });
      });
      yi += hItem + 0.2;
    });
    return yi - y - 0.2;
  }

  // ---------- comparativoEspelhado: A (cinza, a esquerda) x B (favorecido, a direita) com piramide central ----------
  function comparativoEspelhado(s, { x, y, w, esquerda, direita, hItem = 0.3, gap = 0.16, wCentro = 1.4 }) {
    const n = Math.max(esquerda.itens.length, direita.itens.length), wl = (w - wCentro - 0.2) / 2;
    const xc = x + wl + 0.1, xr = xc + wCentro + 0.1;
    texto(s, esquerda.titulo, { x, y, w: wl, h: 0.3, fontSize: 11.5, bold: true, color: COR.cinza, align: 'right' });
    texto(s, direita.titulo, { x: xr, y, w: wl, h: 0.3, fontSize: 11.5, bold: true, color: COR.dom });
    linha(s, x, y + 0.34, wl, 0, { color: CINZA_MEDIO, width: 1 });
    linha(s, xr, y + 0.34, wl, 0, { color: COR.dom, width: 1 });
    const y0 = y + 0.48, tons = Array.from({ length: n }, (_, i) => tom(COR.dom, 0.55 - 0.55 * i / Math.max(1, n - 1)));
    for (let i = 0; i < n; i++) {
      const yi = y0 + i * (hItem + gap), meia = wCentro / 2, wt = meia * (0.35 + 0.65 * i / Math.max(1, n - 1)), wb = meia * (0.35 + 0.65 * (i + 1) / n);
      // degrau da piramide central (cresce para baixo)
      s.addShape(S.CUSTOM_GEOMETRY, { x: xc, y: yi - gap / 2, w: wCentro, h: hItem + gap, fill: { color: tons[i] }, line: { color: 'FFFFFF', width: 1 },
        points: [{ x: meia - wt, y: 0 }, { x: meia + wt, y: 0 }, { x: meia + Math.min(meia, wb), y: hItem + gap }, { x: meia - Math.min(meia, wb), y: hItem + gap }, { close: true }] });
      if (esquerda.itens[i] != null) {
        s.addShape(S.RECTANGLE, { x, y: yi, w: wl, h: hItem, fill: { color: FUNDO_NEUTRO }, line: { type: 'none' } });
        texto(s, esquerda.itens[i], { x: x + 0.1, y: yi, w: wl - 0.2, h: hItem, fontSize: 10, color: COR.cinza, align: 'right' });
      }
      if (direita.itens[i] != null) {
        s.addShape(S.RECTANGLE, { x: xr, y: yi, w: wl, h: hItem, fill: { color: COR.fundo }, line: { type: 'none' } });   // sem barra vertical antes do texto (proibida)
        texto(s, direita.itens[i], { x: xr + 0.12, y: yi, w: wl - 0.22, h: hItem, fontSize: 10, bold: true, color: COR.escuro });
      }
    }
    return 0.48 + n * (hItem + gap) - gap;
  }

  // ---------- linhaValores: um valor por categoria, rotulo + valor em etiqueta (substitui icone + valor) ----------
  function linhaValores(s, { x, y, w, itens, h = 1.0 }) {
    const n = itens.length, wc = w / n;
    itens.forEach((it, i) => {
      const xi = x + i * wc;
      // sem divisoria vertical entre os valores (linha antes de texto e proibida pelo usuario)
      texto(s, it.rotulo, { x: xi + 0.08, y, w: wc - 0.16, h: 0.3, fontSize: 10, bold: true, color: ESCURO_TXT, align: 'center' });
      const wv = Math.min(wc - 0.2, larguraTexto(String(it.valor), 14, true) + 0.36);
      s.addShape(S.RECTANGLE, { x: xi + (wc - wv) / 2 + 0.05, y: y + 0.39, w: wv, h: 0.34, fill: { color: COR.escuro }, line: { type: 'none' } });
      s.addShape(S.RECTANGLE, { x: xi + (wc - wv) / 2, y: y + 0.34, w: wv, h: 0.34, fill: { color: COR.dom }, line: { type: 'none' } });
      texto(s, String(it.valor), { x: xi + (wc - wv) / 2, y: y + 0.34, w: wv, h: 0.34, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center' });
      if (it.nota) texto(s, it.nota, { x: xi + 0.08, y: y + 0.76, w: wc - 0.16, h: h - 0.76, fontSize: 9, color: COR.cinza, align: 'center', valign: 'top' });
    });
  }

  // ---------- tabela: 'limpa' (cabecalho na dominante com fio) ou 'faixa' (cabecalho em faixa escura) ----------
  // linhas: [[c1, c2, ...]]; destacar: indices de linhas da empresa analisada; alinhar: ['left', 'right', ...]
  function tabela(s, { x, y, w, cabecalho, linhas, larguras, estilo = 'limpa', hLinha = 0.27, fonte = 10, italicoValores = false, destacar = [], alinhar }) {
    const nC = cabecalho.length, pesos = larguras || [2].concat(Array(nC - 1).fill(1));
    const colW = pesos.map(p => w * p / pesos.reduce((a, b) => a + b, 0));
    const al = alinhar || ['left'].concat(Array(nC - 1).fill('right'));
    const nada = { type: 'none' }, fio = (c, pt = 0.75) => ({ type: 'solid', pt, color: c });
    const cab = cabecalho.map((t, j) => ({ text: String(t), options: estilo === 'faixa'
      ? { bold: true, color: 'FFFFFF', fill: { color: COR.escuro }, align: al[j], border: [nada, nada, nada, nada] }
      : { bold: true, color: COR.dom, align: al[j], border: [nada, nada, fio(COR.dom, 1.25), nada] } }));
    const corpo = linhas.map((l, i) => l.map((t, j) => {
      const dest = destacar.includes(i);
      return { text: typeof t === 'number' ? fmt(t, casasAuto(l.filter(v => typeof v === 'number'))) : String(t), options: {
        bold: dest || j === 0, italic: italicoValores && j > 0, align: al[j], color: dest ? COR.dom : (j === 0 ? ESCURO_TXT : COR.texto),
        fill: dest ? { color: COR.fundo } : (estilo === 'faixa' && i % 2 ? { color: 'F7F7F7' } : undefined),
        border: [nada, nada, i === linhas.length - 1 && estilo === 'limpa' ? fio(COR.dom, 1) : fio(CINZA_CLARO), nada] } };
    }));
    s.addTable([cab].concat(corpo), { x, y, w, colW, rowH: hLinha, fontFace: F, fontSize: fonte, margin: [0, 0.06, 0, 0.06], valign: 'middle' });
    return (linhas.length + 1) * hLinha;
  }

  // ---------- fasesDegrau: fases que sobem e escurecem, com seta de progressao no topo ----------
  // fases: [{ titulo, runs }] (2 a 4)
  function fasesDegrau(s, { x, y, w, h, fases, seta = false, wFase }) {
    // a seta de progressao foi removida: seta e proibida (tem cara de Claude); a progressao e dada pelos degraus que sobem
    if (seta) console.warn('AVISO fasesDegrau: o parametro "seta" foi ignorado (seta proibida pelo usuario).');
    const n = fases.length, g = 0.08, wf = wFase || (w - g * (n - 1)) / n, hSeta = 0;
    const hMax = h - hSeta - 0.06, hMin = hMax * 0.62;
    const tons = Array.from({ length: n }, (_, i) => n === 1 ? COR.dom : [COR.clara, COR.dest, COR.dom, COR.escuro][Math.round(i * 3 / (n - 1))]);
    fases.forEach((f, i) => {
      const hi = hMin + (hMax - hMin) * i / Math.max(1, n - 1), xi = x + i * (wf + g), yi = y + h - hi, c = tons[i];
      const tc = claro(c) ? COR.escuro : 'FFFFFF';
      s.addShape(S.RECTANGLE, { x: xi + 0.06, y: yi + 0.06, w: wf, h: hi - 0.06, fill: { color: tom(c, -0.35) }, line: { type: 'none' } });
      s.addShape(S.RECTANGLE, { x: xi, y: yi, w: wf, h: hi - 0.06, fill: { color: c }, line: { type: 'none' },
        objectName: grad(id('GR_degrau'), 90, [[0, c, 100], [100, tom(c, -0.15), 100]]) });
      texto(s, f.titulo, { x: xi + 0.12, y: yi + 0.08, w: wf - 0.24, h: 0.32, fontSize: 11.5, bold: true, color: tc });
      s.addShape(S.LINE, { x: xi + 0.12, y: yi + 0.44, w: wf - 0.24, h: 0, line: { color: tc, width: 0.75, transparency: 30 } });
      if (f.runs) texto(s, f.runs, { x: xi + 0.12, y: yi + 0.52, w: wf - 0.24, h: hi - 0.66, fontSize: 9.5, color: tc, valign: 'top' });
    });
  }

  // ---------- cardsTracejados: cards com aba em degrade e borda tracejada, ligados por faixa cinza ----------
  function cardsTracejados(s, { x, y, w, h, cards, gap = 0.45 }) {
    const n = cards.length, wc = (w - gap * (n - 1)) / n, hAba = 0.34;
    s.addShape(S.RECTANGLE, { x: x + wc / 2, y: y + h / 2 - 0.14, w: w - wc, h: 0.28, fill: { color: 'E7E7E7' }, line: { type: 'none' } });
    cards.forEach((c, i) => {
      const xi = x + i * (wc + gap);
      s.addShape(S.RECTANGLE, { x: xi, y, w: wc, h, fill: { color: 'FFFFFF' }, line: { color: COR.dom, width: 1, dashType: 'dash' } });
      s.addShape(S.RECTANGLE, { x: xi, y, w: wc, h: hAba, fill: { color: COR.dom }, line: { type: 'none' },
        objectName: grad(id('GR_aba_card'), 0, [[0, COR.escuro, 100], [100, COR.dest, 100]]) });
      texto(s, c.titulo, { x: xi + 0.12, y, w: wc - 0.24, h: hAba, fontSize: 11, bold: true, color: 'FFFFFF' });
      if (c.runs) texto(s, c.runs, { x: xi + 0.14, y: y + hAba + 0.1, w: wc - 0.28, h: h - hAba - 0.18, fontSize: 10, valign: 'top' });
    });
  }

  // ---------- conectorZoom: trapezio cinza ligando um total ao detalhe (desenhe antes do detalhe) ----------
  function conectorZoom(s, { de, para, lado = 'direita', transp = 45, moldura = true }) {
    let pts;
    if (lado === 'baixo') {
      const x0 = Math.min(de.x, para.x), x1 = Math.max(de.x + de.w, para.x + para.w), ya = de.y + de.h, yb = para.y;
      pts = { bx: x0, by: ya, bw: x1 - x0, bh: Math.max(0.02, yb - ya), p: [[de.x - x0, 0], [de.x + de.w - x0, 0], [para.x + para.w - x0, yb - ya], [para.x - x0, yb - ya]] };
    } else {
      const y0 = Math.min(de.y, para.y), y1 = Math.max(de.y + de.h, para.y + para.h), xa = de.x + de.w, xb = para.x;
      pts = { bx: xa, by: y0, bw: Math.max(0.02, xb - xa), bh: y1 - y0, p: [[0, de.y - y0], [xb - xa, para.y - y0], [xb - xa, para.y + para.h - y0], [0, de.y + de.h - y0]] };
    }
    s.addShape(S.CUSTOM_GEOMETRY, { x: pts.bx, y: pts.by, w: pts.bw, h: pts.bh, fill: { color: CINZA_MEDIO, transparency: transp }, line: { type: 'none' },
      points: pts.p.map(([px, py]) => ({ x: px, y: py })).concat([{ close: true }]) });
    if (moldura) {
      s.addShape(S.RECTANGLE, { x: de.x, y: de.y, w: de.w, h: de.h, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: COR.escuro, width: 1, dashType: 'dash' } });
      s.addShape(S.RECTANGLE, { x: para.x, y: para.y, w: para.w, h: para.h, fill: { color: 'FFFFFF' }, line: { color: CINZA_MEDIO, width: 0.75 } });
    }
  }

  // ---------- anotacao: so-what preso ao dado (caixa tracejada ou escura, com conector em cotovelo ate o alvo) ----------
  function anotacao(s, { x, y, w, h, runs, estilo = 'tracejada', alvo, fonte = 10 }) {
    if (alvo) {
      const dentroX = alvo.x >= x && alvo.x <= x + w;
      if (dentroX) segmento(s, alvo.x, alvo.y < y ? y : y + h, alvo.x, alvo.y, { color: COR.escuro, width: 0.75, dashType: 'sysDot' });
      else {
        const xs = alvo.x < x ? x : x + w, ys = y + h / 2;
        segmento(s, xs, ys, alvo.x, ys, { color: COR.escuro, width: 0.75, dashType: 'sysDot' });
        if (Math.abs(alvo.y - ys) > 0.01) segmento(s, alvo.x, ys, alvo.x, alvo.y, { color: COR.escuro, width: 0.75, dashType: 'sysDot' });
      }
      s.addShape(S.OVAL, { x: alvo.x - 0.05, y: alvo.y - 0.05, w: 0.1, h: 0.1, fill: { color: COR.dom }, line: { color: 'FFFFFF', width: 0.75 } });
    }
    if (estilo === 'escura') {
      s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: COR.escuro }, line: { type: 'none' }, shadow: sombra() });
      texto(s, runs, { x: x + 0.12, y, w: w - 0.24, h, fontSize: fonte, color: 'FFFFFF' });
    } else {
      s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: COR.dom, width: 1, dashType: 'dash' } });
      texto(s, runs, { x: x + 0.12, y, w: w - 0.24, h, fontSize: fonte, color: ESCURO_TXT });
    }
  }

  // ---------- faixaPeriodo: periodo sombreado num grafico (desenhe ANTES do grafico) ----------
  function faixaPeriodo(s, { x, y, w, h, rotulo, estilo = 'texto', notas }) {
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'EDEDED' }, line: { type: 'none' } });
    if (estilo === 'etiqueta') {
      const we = Math.min(w + 0.4, larguraTexto(rotulo, 9, true) + 0.24);
      s.addShape(S.RECTANGLE, { x: x + (w - we) / 2, y: y + 0.04, w: we, h: 0.24, fill: { color: COR.escuro }, line: { type: 'none' } });
      texto(s, rotulo, { x: x + (w - we) / 2, y: y + 0.04, w: we, h: 0.24, fontSize: 9, bold: true, color: 'FFFFFF', align: 'center' });
    } else texto(s, rotulo, { x: x - 0.2, y: y + 0.02, w: w + 0.4, h: 0.24, fontSize: 9, italic: true, color: COR.cinza, align: 'center' });
    (notas || []).forEach((n, i) => texto(s, n, { x: x + 0.04, y: y + 0.32 + i * 0.22, w: w - 0.08, h: 0.22, fontSize: 9, color: COR.cinza, align: 'center' }));
  }

  // ---------- manchetes: frase curta em cor + descricao cinza ----------
  function manchetes(s, { x, y, w, itens, pt = 14, gap = 0.18, hDesc = 0.42 }) {
    const hM = pt * 1.3 / 72;
    itens.forEach(([m, d], i) => {
      const yi = y + i * (hM + hDesc + gap);
      // sem barra vertical antes do texto (proibida pelo usuario)
      texto(s, m, { x, y: yi, w, h: hM, fontSize: pt, bold: true, color: COR.dom });
      if (d) texto(s, d, { x, y: yi + hM, w, h: hDesc, fontSize: 10, color: COR.cinza, valign: 'top' });
    });
    return itens.length * (hM + hDesc + gap) - gap;
  }

  // ---------- listaNumeros: numeros de escala em lista (substitui card de KPI) ----------
  function listaNumeros(s, { x, y, w, itens, passo = 0.42, wValor }) {
    const wv = wValor || Math.min(w * 0.45, Math.max(...itens.map(([v]) => larguraTexto(String(v), 14, true))) + 0.12);
    itens.forEach(([v, r], i) => {
      const yi = y + i * passo;
      texto(s, String(v), { x, y: yi, w: wv, h: passo, fontSize: 14, bold: true, color: COR.dom, align: 'right' });
      // sem linha vertical entre o valor e o texto (proibida pelo usuario)
      texto(s, r, { x: x + wv + 0.18, y: yi, w: w - wv - 0.18, h: passo, fontSize: 10, color: COR.texto });
      if (i < itens.length - 1) linha(s, x, yi + passo, w, 0, { color: CINZA_CLARO, width: 0.5, dashType: 'sysDot' });
    });
    return itens.length * passo;
  }

  // ---------- seloVariacao: "2022-2032E | +37%" sobre um grafico ----------
  function seloVariacao(s, { x, y, rotulo, valor, h = 0.3 }) {
    const wr = larguraTexto(rotulo, 9, false) + 0.2, wv = larguraTexto(valor, 10.5, true) + 0.2;
    s.addShape(S.RECTANGLE, { x, y, w: wr, h, fill: { color: COR.fundo }, line: { color: COR.dom, width: 0.75 } });
    texto(s, rotulo, { x, y, w: wr, h, fontSize: 9, color: COR.escuro, align: 'center' });
    s.addShape(S.RECTANGLE, { x: x + wr, y, w: wv, h, fill: { color: COR.dom }, line: { type: 'none' } });
    texto(s, valor, { x: x + wr, y, w: wv, h, fontSize: 10.5, bold: true, color: 'FFFFFF', align: 'center' });
    return wr + wv;
  }

  // ---------- setaCurva: arco de x1 a x2 (seta no fim), com o topo do arco alt acima de y ----------
  function setaCurva(s, { x1, x2, y, alt = 0.3, cor }) {
    const w = Math.abs(x2 - x1), inv = x2 < x1;
    const a = inv ? w : 0, b = inv ? 0 : w;
    s.addShape(S.CUSTOM_GEOMETRY, { x: Math.min(x1, x2), y: y - alt, w, h: alt, fill: { color: 'FFFFFF', transparency: 100 },
      line: { color: cor || COR.escuro, width: 1.25, endArrowType: 'triangle' },
      points: [{ x: a, y: alt }, { x: b, y: alt, curve: { type: 'cubic', x1: a + (b - a) * 0.15, y1: -alt * 0.3, x2: a + (b - a) * 0.85, y2: -alt * 0.3 } }] });
  }

  // ---------- etiqueta: rotulo solto em caixa ----------
  function etiqueta(s, { x, y, texto: t, cor, fonte = 9 }) {
    const c = cor || COR.escuro, w = larguraTexto(t, fonte, true) + 0.24;
    s.addShape(S.RECTANGLE, { x, y, w, h: 0.26, fill: { color: c }, line: { type: 'none' } });
    texto(s, t, { x, y, w, h: 0.26, fontSize: fonte, bold: true, color: claro(c) ? COR.escuro : 'FFFFFF', align: 'center' });
    return w;
  }

  // ---------- colchete: agrupa itens de uma linha sob um nome ----------
  function colchete(s, { x, y, w, rotulo, alt = 0.18, marcas = [] }) {
    const o = { color: COR.dom, width: 1, dashType: 'dash' };
    linha(s, x, y + alt, w, 0, o);
    linha(s, x, y, 0, alt, o);
    linha(s, x + w, y, 0, alt, o);
    marcas.forEach(mx => linha(s, mx, y, 0, alt, o));
    if (rotulo) {
      const we = larguraTexto(rotulo, 9, true) + 0.3;
      s.addShape(S.RECTANGLE, { x: x + (w - we) / 2, y: y + alt - 0.12, w: we, h: 0.24, fill: { color: COR.dom }, line: { type: 'none' } });
      texto(s, rotulo, { x: x + (w - we) / 2, y: y + alt - 0.12, w: we, h: 0.24, fontSize: 9, bold: true, color: 'FFFFFF', align: 'center' });
    }
  }

  // ---------- caixaFormula: formula + legenda + leitura ----------
  function caixaFormula(s, { x, y, w, h, formula, legenda, runs }) {
    s.addShape(S.RECTANGLE, { x: x + 0.08, y: y + 0.08, w, h, fill: { color: COR.dest }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: COR.escuro }, line: { type: 'none' },
      objectName: grad(id('GR_formula'), 90, [[0, COR.escuro, 100], [100, tom(COR.escuro, -0.35), 100]]) });
    texto(s, formula, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.45, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center' });
    linha(s, x + 0.3, y + 0.6, w - 0.6, 0, { color: COR.dest, width: 1 });
    let yi = y + 0.66;
    if (legenda) { texto(s, legenda, { x: x + 0.15, y: yi, w: w - 0.3, h: 0.3, fontSize: 9, italic: true, color: COR.clara, align: 'center' }); yi += 0.34; }
    if (runs) texto(s, runs, { x: x + 0.2, y: yi, w: w - 0.4, h: y + h - yi - 0.08, fontSize: 10, color: 'FFFFFF', valign: 'top' });
  }

  // ---------- estruturaAcionaria: socios -> empresa -> subsidiarias ----------
  // socios: [[nome, pct]]; subsidiarias: [[nome, pct]] (opcional)
  // h? = altura disponivel: comprime espacos e caixas para caber (sem h, usa ~2,1 pol com subsidiarias)
  function estruturaAcionaria(s, { x, y, w, h, socios, empresa, subsidiarias, hCaixa = 0.36 }) {
    const fio = { color: COR.escuro, width: 1 }, nNiv = subsidiarias && subsidiarias.length ? 3 : 2;
    let g1 = 0.55;
    if (h) {
      g1 = Math.min(0.55, (h - nNiv * hCaixa - 0.12) / (nNiv - 1));
      if (g1 < 0.36) { g1 = 0.36; hCaixa = Math.max(0.26, (h - 0.12 - (nNiv - 1) * g1) / nNiv); }
      if (nNiv * hCaixa + 0.12 + (nNiv - 1) * g1 > h + 0.01) console.warn(`estruturaAcionaria: nao cabe em h=${h.toFixed(2)}; precisa ~${(nNiv * hCaixa + 0.12 + (nNiv - 1) * g1).toFixed(2)} pol. Mude a divisao.`);
    }
    const linhaCaixas = (lista, yl, estilo) => {
      const n = lista.length, g = 0.2, wc = Math.min(2.2, (w - g * (n - 1)) / n), tot = n * wc + (n - 1) * g, x0 = x + (w - tot) / 2;
      return lista.map(([nome], i) => {
        const xi = x0 + i * (wc + g);
        s.addShape(S.RECTANGLE, { x: xi, y: yl, w: wc, h: hCaixa, fill: { color: estilo === 'sub' ? COR.fundo : 'FFFFFF' }, line: { color: COR.dom, width: 1 } });
        texto(s, nome, { x: xi + 0.06, y: yl, w: wc - 0.12, h: hCaixa, fontSize: 9.5, bold: true, color: ESCURO_TXT, align: 'center', fit: 'shrink' });
        return xi + wc / 2;
      });
    };
    const pct = (cx, yl, t) => {
      const wp = larguraTexto(t, 9, true) + 0.12;
      s.addShape(S.RECTANGLE, { x: cx - wp / 2, y: yl, w: wp, h: 0.2, fill: { color: 'FFFFFF' }, line: { type: 'none' } });
      texto(s, t, { x: cx - wp / 2, y: yl, w: wp, h: 0.2, fontSize: 9, bold: true, color: COR.dom, align: 'center' });
    };
    const cxE = x + w / 2, yE = y + hCaixa + g1, wE = Math.min(w, Math.max(2.4, larguraTexto(empresa, 11, true) + 0.5));
    const centros = linhaCaixas(socios, y);
    const yBus = y + hCaixa + g1 / 2;
    centros.forEach((cx, i) => { linha(s, cx, y + hCaixa, 0, yBus - y - hCaixa, fio); pct(cx, y + hCaixa + 0.03, typeof socios[i][1] === 'number' ? fmt(socios[i][1], casasAuto([socios[i][1]])) + '%' : socios[i][1]); });
    if (centros.length > 1) linha(s, centros[0], yBus, centros[centros.length - 1] - centros[0], 0, fio);
    linha(s, cxE, yBus, 0, yE - yBus, fio);
    s.addShape(S.RECTANGLE, { x: cxE - wE / 2 + 0.06, y: yE + 0.06, w: wE, h: hCaixa + 0.06, fill: { color: COR.escuro }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x: cxE - wE / 2, y: yE, w: wE, h: hCaixa + 0.06, fill: { color: COR.dom }, line: { type: 'none' } });
    texto(s, empresa, { x: cxE - wE / 2, y: yE, w: wE, h: hCaixa + 0.06, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center' });
    if (!subsidiarias || !subsidiarias.length) return yE + hCaixa + 0.12 - y;
    const ySub = yE + hCaixa + 0.06 + g1, yBus2 = yE + hCaixa + 0.06 + g1 / 2;
    linha(s, cxE, yE + hCaixa + 0.12, 0, yBus2 - yE - hCaixa - 0.12, fio);
    const cs = linhaCaixas(subsidiarias, ySub, 'sub');
    if (cs.length > 1) linha(s, cs[0], yBus2, cs[cs.length - 1] - cs[0], 0, fio);
    cs.forEach((cx, i) => { linha(s, cx, yBus2, 0, ySub - yBus2, fio); if (subsidiarias[i][1] != null) pct(cx, yBus2 + 0.04, typeof subsidiarias[i][1] === 'number' ? fmt(subsidiarias[i][1], casasAuto([subsidiarias[i][1]])) + '%' : subsidiarias[i][1]); });
    return ySub + hCaixa - y;
  }

  // ---------- treemap: participacao de mercado; a empresa destacada na dominante, o resto em cinza ----------
  function treemap(s, { x, y, w, h, itens, destaque = 0, sufixo = '%' }) {
    const lista = itens.map(([r, v], i) => ({ r, v, dest: i === destaque })).sort((a, b) => b.v - a.v);
    const casas = casasAuto(lista.map(it => it.v));
    const cinzas = ['8C8C8C', 'A6A6A6', 'B8B8B8', 'C9C9C9', 'D9D9D9', 'E4E4E4'];
    let k = 0;
    const out = [];
    (function dividir(arr, rx, ry, rw, rh) {   // corte binario equilibrado, sempre no lado maior
      if (arr.length === 1) { out.push({ it: arr[0], x: rx, y: ry, w: rw, h: rh }); return; }
      const tot = arr.reduce((a, b) => a + b.v, 0);
      let acc = 0, corte = 1;
      for (let i = 0; i < arr.length - 1; i++) { acc += arr[i].v; corte = i + 1; if (acc >= tot / 2) break; }
      const f = arr.slice(0, corte).reduce((a, b) => a + b.v, 0) / tot;
      if (rw >= rh) { dividir(arr.slice(0, corte), rx, ry, rw * f, rh); dividir(arr.slice(corte), rx + rw * f, ry, rw * (1 - f), rh); }
      else { dividir(arr.slice(0, corte), rx, ry, rw, rh * f); dividir(arr.slice(corte), rx, ry + rh * f, rw, rh * (1 - f)); }
    })(lista, x, y, w, h);
    out.forEach(({ it, x: rx, y: ry, w: rw, h: rh }) => {
      const c = it.dest ? COR.dom : cinzas[Math.min(k++, cinzas.length - 1)];
      s.addShape(S.RECTANGLE, { x: rx, y: ry, w: rw, h: rh, fill: { color: c }, line: { color: 'FFFFFF', width: 1.5 } });
      const tc = claro(c) ? ESCURO_TXT : 'FFFFFF', val = fmt(it.v, casas) + sufixo;
      if (rw >= 0.55 && rh >= 0.45) {
        const pt = Math.max(9, Math.min(13, Math.min(rw, rh) * 9));
        texto(s, [{ text: val, options: { bold: true, fontSize: pt + 1, breakLine: true } }, { text: it.r, options: { fontSize: Math.max(9, pt - 2) } }],
          { x: rx + 0.06, y: ry + 0.04, w: rw - 0.12, h: rh - 0.08, color: tc, valign: 'top' });
      } else if (rw >= 0.4 && rh >= 0.22) texto(s, val, { x: rx + 0.03, y: ry, w: rw - 0.06, h: rh, fontSize: 9, bold: true, color: tc, align: 'center' });
      else console.warn(`treemap: "${it.r}" ficou pequeno demais para rotulo; cite no subtitulo ou agrupe em "Outros".`);
    });
  }

  // ---------- barras100: composicao comparada (escala comum de 100) com a diferenca da 1a parte em contorno tracejado ----------
  // linhas: [{ rotulo, partes: [v1, v2, ...] }] (2 ou 3); series: nomes das partes (legenda)
  function barras100(s, { x, y, w, linhas, series, wRotulo = 1.4, hBarra = 0.4, gap = 0.45, prefixo = '+', sufixo = '%' }) {
    const nP = Math.max(...linhas.map(l => l.partes.length));
    const cores = [COR.dom, COR.dest, COR.clara, 'BFBFBF', 'D9D9D9'].slice(0, nP);
    const casas = casasAuto(linhas.flatMap(l => l.partes));
    let yi = y;
    if (series) {
      let xl = x + wRotulo;
      series.forEach((n, k) => {
        s.addShape(S.RECTANGLE, { x: xl, y: yi + 0.05, w: 0.14, h: 0.14, fill: { color: cores[k] }, line: { type: 'none' } });
        const wn = larguraTexto(n, 9.5, false) + 0.1;
        texto(s, n, { x: xl + 0.2, y: yi, w: wn, h: 0.24, fontSize: 9.5, color: COR.cinza });
        xl += wn + 0.4;
      });
      yi += 0.4;
    }
    const x0 = x + wRotulo, wB = w - wRotulo, pos = [];
    linhas.forEach((l, i) => {
      const yl = yi + i * (hBarra + gap), tot = l.partes.reduce((a, b) => a + b, 0);
      texto(s, l.rotulo, { x, y: yl, w: wRotulo - 0.12, h: hBarra, fontSize: 10.5, bold: true, color: ESCURO_TXT, align: 'right' });
      let xa = x0;
      l.partes.forEach((v, k) => {
        const wp = wB * v / tot;
        s.addShape(S.RECTANGLE, { x: xa, y: yl, w: wp, h: hBarra, fill: { color: cores[k] }, line: { color: 'FFFFFF', width: 1 } });
        if (wp > 0.42) texto(s, fmt(v, casas) + sufixo, { x: xa, y: yl, w: wp, h: hBarra, fontSize: 9.5, bold: k === 0, color: claro(cores[k]) ? ESCURO_TXT : 'FFFFFF', align: 'center' });
        xa += wp;
      });
      pos.push({ yl, fim: x0 + wB * l.partes[0] / tot, v: l.partes[0] });
    });
    if (pos.length >= 2) {   // diferenca da 1a parte entre a 1a e a 2a linha
      const [a, b] = pos, menor = a.fim < b.fim ? a : b, maior = menor === a ? b : a;
      const dx = maior.fim - menor.fim;
      if (dx > 0.05) {
        s.addShape(S.RECTANGLE, { x: menor.fim, y: menor.yl - 0.03, w: dx, h: hBarra + 0.06, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: COR.escuro, width: 1, dashType: 'dash' } });
        const t = prefixo + fmt(Math.abs(maior.v - menor.v), casas) + (sufixo === '%' ? ' p.p.' : sufixo);
        const we = larguraTexto(t, 9.5, true) + 0.2, ye = menor === a ? menor.yl + hBarra + 0.06 : menor.yl - 0.3;
        s.addShape(S.RECTANGLE, { x: menor.fim + dx / 2 - we / 2, y: ye, w: we, h: 0.24, fill: { color: COR.escuro }, line: { type: 'none' } });
        texto(s, t, { x: menor.fim + dx / 2 - we / 2, y: ye, w: we, h: 0.24, fontSize: 9.5, bold: true, color: 'FFFFFF', align: 'center' });
      }
    }
    return yi - y + linhas.length * (hBarra + gap) - gap;
  }

  // ---------- cardsProduto: produtos/servicos com foto (biblioteca ou placeholder) ----------
  // cards: [{ titulo, runs, imagem?, caminho?, tema? }]
  function cardsProduto(s, { x, y, w, h, cards, cols = 2, deck }) {
    const fotoFn = (deck && deck.imagem) || ctx.imagem;
    const n = cards.length, nl = Math.ceil(n / cols), g = 0.18, wc = (w - g * (cols - 1)) / cols, hc = (h - g * (nl - 1)) / nl;
    cards.forEach((c, i) => {
      const xi = x + (i % cols) * (wc + g), yi = y + Math.floor(i / cols) * (hc + g), wf = Math.min(wc * 0.4, hc * 1.3);
      s.addShape(S.RECTANGLE, { x: xi, y: yi, w: wc, h: hc, fill: { color: 'FFFFFF' }, line: { color: CINZA_CLARO, width: 0.75 } });
      fotoFn(s, { x: xi, y: yi, w: wf, h: hc, caminho: c.caminho || c.imagem, tema: c.tema, descricao: c.descricao || ('foto: ' + c.titulo), nome: id('produto') });
      // sem barra vertical entre a foto e o texto (proibida pelo usuario)
      texto(s, c.titulo, { x: xi + wf + 0.17, y: yi + 0.06, w: wc - wf - 0.27, h: 0.3, fontSize: 11, bold: true, color: COR.dom });
      if (c.runs) texto(s, c.runs, { x: xi + wf + 0.17, y: yi + 0.38, w: wc - wf - 0.27, h: hc - 0.46, fontSize: 9.5, valign: 'top' });
    });
  }

  // ---------- faixaNome: nome e cargo de executivo/entrevistado ----------
  function faixaNome(s, { x, y, w, nome, cargo }) {
    const h1 = 0.36, h2 = 0.26, b = 0.2;
    s.addShape(S.CUSTOM_GEOMETRY, { x, y, w, h: h1, fill: { color: COR.escuro }, line: { type: 'none' },
      objectName: grad(id('GR_faixa_nome'), 0, [[0, tom(COR.escuro, -0.2), 100], [100, COR.dom, 100]]),
      points: [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w - b, y: h1 }, { x: 0, y: h1 }, { close: true }] });
    texto(s, nome, { x: x + 0.14, y, w: w - b - 0.2, h: h1, fontSize: 12, bold: true, color: 'FFFFFF' });
    s.addShape(S.RECTANGLE, { x, y: y + h1, w: w - b, h: h2, fill: { color: COR.fundo }, line: { type: 'none' } });
    texto(s, cargo, { x: x + 0.14, y: y + h1, w: w - b - 0.2, h: h2, fontSize: 10, color: COR.escuro });
  }

  // ---------- ponteDecomposicao: receita -> custos -> despesas -> resultado, com composicao de cada etapa ----------
  // etapas: [{ rotulo, valor, partes?: [[nome, valor]] }]; a 1a e a ultima sao totais (barra a partir do zero);
  // as do meio sao variacoes (negativas reduzem). Valores na mesma unidade (ponha a unidade com deck.unidade).
  function ponteDecomposicao(s, { x, y, w, h, etapas, casas = 1 }) {
    const n = etapas.length, g = 0.35, wc = (w - g * (n - 1)) / n, hR = 0.4, hV = 0.26;
    const yBase = y + h - hR, hUtil = h - hR - hV - 0.05;
    let nivel = 0;
    const barras = etapas.map((e, i) => {
      if (i === 0 || i === n - 1) { nivel = e.valor; return { de: 0, ate: e.valor, total: true }; }
      const de = nivel; nivel += e.valor; return { de, ate: nivel, total: false };
    });
    const mx = Math.max(...barras.map(b => Math.max(b.de, b.ate))), esc = hUtil / mx;
    barras.forEach((b, i) => {
      const e = etapas[i], xi = x + i * (wc + g), topo = Math.max(b.de, b.ate), base = Math.min(b.de, b.ate);
      const yt = yBase - topo * esc, hb = Math.max(0.03, (topo - base) * esc), corBase = b.total ? COR.dom : CINZA_MEDIO;
      if (e.partes && e.partes.length) {
        const tot = e.partes.reduce((a, [, v]) => a + Math.abs(v), 0), tons = b.total ? [COR.escuro, COR.dom, COR.dest, COR.clara] : ['7F7F7F', '9A9A9A', 'B3B3B3', 'CCCCCC'];
        let ya = yt;
        e.partes.forEach(([nome, v], k) => {
          const hp = hb * Math.abs(v) / tot, c = tons[k % tons.length];
          s.addShape(S.RECTANGLE, { x: xi, y: ya, w: wc, h: hp, fill: { color: c }, line: { color: 'FFFFFF', width: 0.75 } });
          if (hp >= 0.3 && wc >= 0.8) texto(s, [{ text: nome + ' ', options: {} }, { text: fmt(v, casas), options: { bold: true } }],
            { x: xi + 0.04, y: ya, w: wc - 0.08, h: hp, fontSize: 9, color: claro(c) ? ESCURO_TXT : 'FFFFFF', align: 'center', fit: 'shrink' });
          else console.warn(`ponteDecomposicao: parte "${nome}" de "${e.rotulo}" sem rotulo (pouca altura).`);
          ya += hp;
        });
      } else s.addShape(S.RECTANGLE, { x: xi, y: yt, w: wc, h: hb, fill: { color: corBase }, line: { type: 'none' },
        objectName: b.total ? grad(id('GR_ponte'), 90, [[0, COR.dest, 100], [100, COR.escuro, 100]]) : undefined });
      texto(s, fmt(e.valor, casas), { x: xi - 0.1, y: yt - hV, w: wc + 0.2, h: hV, fontSize: 10.5, bold: true, color: b.total ? COR.dom : COR.cinza, align: 'center' });
      texto(s, e.rotulo, { x: xi - 0.12, y: yBase + 0.05, w: wc + 0.24, h: hR - 0.05, fontSize: 9.5, bold: b.total, color: ESCURO_TXT, align: 'center', valign: 'top' });
      if (i < n - 1) {   // conector pontilhado no nivel em que a proxima etapa comeca
        const yn = yBase - b.ate * esc;
        linha(s, xi + wc, yn, g, 0, { color: COR.cinza, width: 0.75, dashType: 'sysDot' });
      }
    });
    linha(s, x, yBase, w, 0, { color: CINZA_MEDIO, width: 0.75 });
  }


  // ---------- Insper Jr (15/11/2026): card com faixa de titulo e sombra dura (ijtheo_p085, ijtheo_p047, ijg5_p073) ----------
  // cardIJ(s, { x, y, w, h, titulo?, cor?: 'escuro'|'dom', fundo?: 'F2F2F2'|'FFFFFF', sombra?: true, faixa?: 0.34, contorno? })
  // Devolve a area interna { x, y, w, h } para o conteudo (texto, imagem, grafico).
  function cardIJ(s, { x, y, w, h, titulo, cor = 'escuro', fundo = FUNDO_NEUTRO, sombra: comSombra = true, faixa = 0.34, contorno }) {
    const c = cor === 'dom' ? COR.dom : COR.escuro, nm = id('CARDIJ');
    if (comSombra) s.addShape(S.RECTANGLE, { x: x + 0.07, y: y + 0.07, w, h, fill: { color: tom(c, 0.15) }, line: { type: 'none' }, objectName: nm + '_sombra' });
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: fundo }, line: contorno ? { color: c, width: 1.25 } : { color: 'D0D0D0', width: 0.5 }, objectName: nm });
    let dy = 0.12;
    if (titulo) {
      s.addShape(S.RECTANGLE, { x, y, w, h: faixa, fill: { color: c }, line: { type: 'none' }, objectName: nm + '_faixa' });
      texto(s, titulo, { x: x + 0.12, y, w: w - 0.24, h: faixa, fontSize: 11.5, bold: true, color: 'FFFFFF', objectName: nm + '_tit' });
      dy = faixa + 0.12;
    }
    return { x: x + 0.15, y: y + dy, w: w - 0.3, h: h - dy - 0.12 };
  }
  // ---------- Insper Jr: midia (imagem, ilustracao, video ou mockup) como placeholder grande e descrito ----------
  // midia(s, { x, y, w, h, tipo: 'IMAGEM'|'VIDEO'|'MOCKUP', descricao, moldura?: 'celular'|'notebook' })
  // A skill nao gera imagens: o texto do placeholder e o prompt/briefing para o grupo gerar ou buscar a peca (insperjr_padrao.md, secao 5).
  function midia(s, { x, y, w, h, tipo = 'IMAGEM', descricao, moldura }) {
    const T = String(tipo).toUpperCase(), rot = `[${T}: ${descricao}]`, nm = id('MIDIA_' + T);
    let r = { x, y, w, h };
    if (moldura === 'celular') {
      const wc = Math.min(w, h * 0.5), xc = x + (w - wc) / 2;
      s.addShape(S.ROUNDED_RECTANGLE, { x: xc, y, w: wc, h, rectRadius: 0.18, fill: { color: '1A1A1A' }, line: { type: 'none' }, objectName: nm + '_moldura' });
      r = { x: xc + 0.08, y: y + 0.18, w: wc - 0.16, h: h - 0.36 };
    } else if (moldura === 'notebook') {
      const hb = 0.12;
      s.addShape(S.RECTANGLE, { x: x + w * 0.04, y, w: w * 0.92, h: h - hb, fill: { color: '1A1A1A' }, line: { type: 'none' }, objectName: nm + '_moldura' });
      s.addShape(S.RECTANGLE, { x, y: y + h - hb, w, h: hb, fill: { color: '8C8C8C' }, line: { type: 'none' } });
      r = { x: x + w * 0.04 + 0.08, y: y + 0.08, w: w * 0.92 - 0.16, h: h - hb - 0.16 };
    }
    s.addShape(S.RECTANGLE, { x: r.x, y: r.y, w: r.w, h: r.h, fill: { color: FUNDO_NEUTRO }, line: { color: CINZA_MEDIO, width: 1, dashType: 'dash' }, objectName: 'PH_' + nm });
    if (T === 'VIDEO') {
      const d = Math.min(0.7, r.w * 0.3, r.h * 0.35), cx = r.x + r.w / 2 - d / 2, cy = r.y + r.h * 0.38 - d / 2;
      s.addShape(S.OVAL, { x: cx, y: cy, w: d, h: d, fill: { color: COR.escuro, transparency: 15 }, line: { type: 'none' } });
      s.addShape(S.ISOSCELES_TRIANGLE, { x: cx + d * 0.36, y: cy + d * 0.28, w: d * 0.36, h: d * 0.44, rotate: 90, fill: { color: 'FFFFFF' }, line: { type: 'none' } });
    }
    texto(s, rot, { x: r.x + 0.08, y: T === 'VIDEO' ? r.y + r.h * 0.55 : r.y, w: r.w - 0.16, h: T === 'VIDEO' ? r.h * 0.42 : r.h, fontSize: 9, color: '7F7F7F', align: 'center', objectName: 'PH_' + nm + '_txt' });
    return r;
  }


  // ---------- Insper Jr (15/11/2026, rodada 1): alternativas aos padroes reprovados (tiraFatos, listas numeradas, listas com fio,
  // colunas com cabecalho sublinhado, chips de valor). Todas inspiradas em ijtheo_p047, p066, p070, p088 e ijg5_p073. ----------
  const ic = (s, o) => formas.icone(s, o);
  // blocoIcone: circulo cheio com icone de linha em branco + titulo em negrito + texto, sem fio e sem caixa em volta.
  //   blocoIcone(s, { x, y, w, h, icone: 'tb/TbTruck', titulo, texto, cor?, d? }) ; texto pode ser runs. Devolve nada.
  function blocoIcone(s, { x, y, w, h = 0.9, icone, titulo, texto: t, cor, d = 0.62 }) {
    const c = cor || COR.dom, nm = id('BLOCOICONE');
    s.addShape(S.OVAL, { x, y: y + (h - d) / 2, w: d, h: d, fill: { color: c }, line: { type: 'none' }, objectName: nm + '_circ' });
    ic(s, { x: x + d * 0.2, y: y + (h - d) / 2 + d * 0.2, d: d * 0.6, nome: icone, cor: 'FFFFFF' });
    const xt = x + d + 0.16, wt = w - d - 0.16;
    if (titulo) {
      texto(s, titulo, { x: xt, y, w: wt, h: 0.3, fontSize: 12, bold: true, color: tom(COR.texto, -0.3), valign: 'bottom', objectName: nm + '_tit' });
      texto(s, t, { x: xt, y: y + 0.32, w: wt, h: h - 0.32, fontSize: 10.5, valign: 'top', objectName: nm + '_txt' });
    } else texto(s, t, { x: xt, y, w: wt, h, fontSize: 11, objectName: nm + '_txt' });
  }
  // medidorCirculo: indicador grande dentro de um circulo cheio (ijtheo_p088: "18%" no circulo, rotulo ao lado ou embaixo). Um por exhibit,
  // sempre ao lado do grafico que o prova; nunca em fileira de 4 como painel de KPI.
  //   medidorCirculo(s, { x, y, d = 1.0, valor: '28%', rotulo, lado: 'baixo'|'direita', cor?, w? })
  function medidorCirculo(s, { x, y, d = 1.0, valor, rotulo, lado = 'baixo', cor, w }) {
    const c = cor || COR.dom, nm = id('MEDIDOR');
    s.addShape(S.OVAL, { x, y, w: d, h: d, fill: { color: c }, line: { type: 'none' }, objectName: nm });
    texto(s, valor, { x, y, w: d, h: d, fontSize: Math.max(10, Math.min(20, Math.floor(d * 72 * 0.8 / (Math.max(String(valor).length, 2) * 0.62)))), bold: true, color: 'FFFFFF', align: 'center', objectName: nm + '_val' });
    if (!rotulo) return;
    if (lado === 'direita') texto(s, rotulo, { x: x + d + 0.12, y, w: w || 1.6, h: d, fontSize: 11, bold: true, color: tom(COR.texto, -0.3), objectName: nm + '_rot' });
    else texto(s, rotulo, { x: x - 0.3, y: y + d + 0.05, w: d + 0.6, h: 0.45, fontSize: 10, color: COR.texto, align: 'center', valign: 'top', objectName: nm + '_rot' });
  }
  // linhasCausaEfeito: problema ou acao com icone (X vermelho / check na dominante), titulo em negrito e "de" -> "para" em duas
  // colunas ligadas por uma seta fina (ijtheo_p047: "Quebra da proposta de valor" / "Como mitigar").
  //   linhasCausaEfeito(s, { x, y, w, itens: [{ tipo: 'problema'|'acao', titulo, de, para }], h = 1.05, gap = 0.12 })
  function linhasCausaEfeito(s, { x, y, w, itens, h = 1.05, gap = 0.12 }) {
    itens.forEach((it, i) => {
      const yy = y + i * (h + gap), nm = id('CE'), prob = it.tipo !== 'acao', c = prob ? 'C0504D' : COR.dom;
      ic(s, { x, y: yy, d: 0.3, nome: prob ? 'tb/TbCircleX' : 'tb/TbCircleCheck', cor: c });
      texto(s, it.titulo, { x: x + 0.4, y: yy, w: w - 0.4, h: 0.3, fontSize: 12, bold: true, color: tom(COR.texto, -0.3), objectName: nm + '_tit' });
      const wc = (w - 0.4 - 0.5) / 2, yb = yy + 0.36;
      texto(s, it.de, { x: x + 0.4, y: yb, w: wc, h: h - 0.4, fontSize: 10.5, color: '595959', valign: 'top', objectName: nm + '_de' });
      s.addShape(S.LINE, { x: x + 0.4 + wc + 0.08, y: yb + 0.14, w: 0.34, h: 0, line: { color: CINZA_MEDIO, width: 1, endArrowType: 'triangle' }, objectName: nm + '_seta' });
      texto(s, it.para, { x: x + 0.4 + wc + 0.5, y: yb, w: wc, h: h - 0.4, fontSize: 10.5, color: '595959', valign: 'top', objectName: nm + '_para' });
    });
  }
  // painelLeitura: caixa com contorno, sombra dura e titulos em negrito na cor, colados ao texto (ijg5_p073: "Base de 2025", "Salto de 2026").
  // Sem fio, sem numeracao. itens: [{ titulo, texto }]
  function painelLeitura(s, { x, y, w, h, itens, cor, pt = 10.5 }) {
    const c = cor || COR.dom, nm = id('PAINELLEITURA');
    s.addShape(S.RECTANGLE, { x: x + 0.06, y: y + 0.06, w, h, fill: { color: tom(c, 0.2) }, line: { type: 'none' }, objectName: nm + '_sombra' });
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: c, width: 1.25 }, objectName: nm });
    const runs = [];
    itens.forEach((it, i) => {
      runs.push({ text: it.titulo, options: { bold: true, color: c, fontSize: pt + 1.5, breakLine: true, paraSpaceBefore: i ? 8 : 0 } });
      runs.push({ text: it.texto, options: { color: COR.texto, fontSize: pt, breakLine: i < itens.length - 1 } });
    });
    texto(s, runs, { x: x + 0.18, y: y + 0.12, w: w - 0.36, h: h - 0.24, valign: 'top', objectName: nm + '_txt' });
  }

  return { fmt, cardIJ, midia, blocoIcone, medidorCirculo, linhasCausaEfeito, painelLeitura, painelAba, listaFitas, barrasPirulito, comparativoEspelhado, linhaValores, tabela, fasesDegrau, cardsTracejados,
    conectorZoom, anotacao, faixaPeriodo, manchetes, listaNumeros, seloVariacao, setaCurva, etiqueta, colchete, caixaFormula,
    estruturaAcionaria, treemap, barras100, cardsProduto, faixaNome, ponteDecomposicao };
};
