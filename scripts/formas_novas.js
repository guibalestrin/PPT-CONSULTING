// formas_novas.js: formas fieis as referencias do usuario (rodada 3, 16/11/2026). Carregado sozinho pelo moldura.js como deck.N
module.exports = function (pres, COR, F, DEG = {}) {
  const S = pres.shapes;
  const tom = (hex, f) => { const n = parseInt(hex, 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f))); return c.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase(); };
  const txt = (s, t, o) => s.addText(t, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: COR.texto }, o));
  function poly(s, pts, opt) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    const points = pts.map(p => ({ x: p[0] - x0, y: p[1] - y0 })); points.push({ close: true });
    s.addShape(S.CUSTOM_GEOMETRY, Object.assign({ x: x0, y: y0, w: Math.max(Math.max(...xs) - x0, 0.01), h: Math.max(Math.max(...ys) - y0, 0.01), points }, opt));
  }
  function seg(s, x1, y1, x2, y2, line) { s.addShape(S.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (x2 - x1) * (y2 - y1) < 0, line }); }
  // ativo (opcional, revelacao): indice do nivel aceso; os outros sao REDESENHADOS no azul claro da paleta. Nao use retangulo
  // branco por cima (reprovado em 22/11/2026: nao cobre todas as faces e deixa faixas cinza). Devolve as faixas de cada nivel
  // [{ y, h, fim }] para ligar o nivel aceso ao card com sanfonaDegrade({ de: { x: fim, y, h }, para: card }).
  function piramideFacetada(s, { x, y, w, h, niveis, cores, ativo = null }) {
    const n = niveis.length, H = 125, g = 19, m = 0.63, sh = 10, k = 0.18, wt = [], wb = [];
    for (let i = 0; i < n; i++) { wt[i] = i === 0 ? 0 : wb[i - 1] + sh; wb[i] = wt[i] + m * H; }
    const natW = 2 * wb[n - 1], natH = (n - 1) * (H + g) + H + k * wb[n - 1], f = h / natH, cx = x + natW * f / 2;
    cores = cores || [COR.dom, tom(COR.dom, -0.4), COR.escuro, tom(COR.dom, 0.45)].slice(0, n);
    const apagado = (i) => ativo != null && i !== ativo;
    cores = cores.map((c, i) => apagado(i) ? tom(COR.dom, 0.78) : c);
    const X = (u) => cx + u * f, Y = (v) => y + v * f, ytop = (i) => i * (H + g), ybot = (i) => i * (H + g) + H;
    niveis.forEach((nv, i) => {
      const fim = x + w * (n === 1 ? 1 : 0.8 + 0.2 * i / (n - 1)), y0 = Y(ytop(i)), hh = H * f;
      s.addShape(S.RECTANGLE, { x: cx, y: y0, w: fim - cx, h: hh, fill: { color: cores[i] }, line: { type: 'none' } });
      const xt = X(wb[i]) + 0.18;
      txt(s, nv.sub ? [{ text: nv.rot, options: { bold: true, fontSize: 13, breakLine: true } }, { text: nv.sub, options: { fontSize: 10.5 } }] : [{ text: nv.rot, options: { bold: true, fontSize: 13 } }], { x: xt, y: y0, w: fim - xt - 0.15, h: hh, color: 'FFFFFF', align: 'left' });
    });
    const BR = { color: 'FFFFFF', width: 0.75 };
    for (let i = n - 1; i >= 0; i--) {
      const c = cores[i], Lt = [X(-wt[i]), Y(ytop(i))], Rt = [X(wt[i]), Y(ytop(i))], Bt = [X(0), Y(ytop(i) + k * wt[i])], Kt = [X(0), Y(ytop(i) - k * wt[i])];
      const Lb = [X(-wb[i]), Y(ybot(i))], Rb = [X(wb[i]), Y(ybot(i))], Fb = [X(0), Y(ybot(i) + k * wb[i])], Kb = [X(0), Y(ybot(i) - k * wb[i])];
      if (i > 0) poly(s, [Lt, Kt, Rt, Bt], { fill: { color: apagado(i) ? tom(COR.dom, 0.62) : tom(c, -0.3) }, line: BR });
      poly(s, i === 0 ? [Bt, Lb, Fb] : [Lt, Bt, Fb, Lb], { fill: { color: c }, line: BR });
      poly(s, i === 0 ? [Bt, Fb, Rb] : [Bt, Rt, Rb, Fb], { fill: { color: c }, line: BR });
      seg(s, Lb[0], Lb[1], Kb[0], Kb[1], BR); seg(s, Kb[0], Kb[1], Rb[0], Rb[1], BR);
    }
    return niveis.map((_, i) => ({ y: Y(ytop(i)), h: H * f, fim: x + w * (n === 1 ? 1 : 0.8 + 0.2 * i / (n - 1)) }));
  }
  function funilTroncos(s, { x, y, wFunil = 3.4, itens, cores, wLado = 4.2 }) {
    const n = itens.length, esc = [1, 0.812, 0.649, 0.509, 0.40], W0 = wFunil;
    cores = cores || [COR.escuro, tom(COR.dom, -0.25), COR.dom, tom(COR.dom, 0.5), tom(COR.dom, 0.7)].slice(0, n);
    const k = W0 / 687, pit = 203 * k, ry0 = 33 * k;
    itens.forEach((it, i) => {
      const W = W0 * esc[i], ry = ry0, cx = x + W0 / 2, cy = y + ry0 + i * pit, xi = cx - W / 2;
      const drop = 159 * k, wBase = W * 0.76, dx = (W - wBase) / 2, rb = ry0 * 0.75;
      s.addShape(S.CUSTOM_GEOMETRY, { x: xi, y: cy, w: W, h: drop + rb * 1.05, fill: { color: cores[i] }, line: { type: 'none' },
        points: [{ x: 0, y: 0 }, { x: dx, y: drop }, { x: W - dx, y: drop, curve: { type: 'cubic', x1: dx + wBase * 0.06, y1: drop + rb * 1.45, x2: W - dx - wBase * 0.06, y2: drop + rb * 1.45 } }, { x: W, y: 0 }, { close: true }] });
      s.addShape(S.OVAL, { x: xi, y: cy - ry, w: W, h: 2 * ry, fill: { color: tom(cores[i], -0.38) }, line: { type: 'none' } });
      const hw = W * (0.546 + 0.055 * i), hh = Math.max(0.36, 70 * k), yh = cy + drop * 0.56 - hh / 2;
      s.addShape(S.OVAL, { x: cx - hw / 2, y: yh, w: hw, h: hh, fill: { color: 'FFFFFF' }, line: { type: 'none' }, shadow: { type: 'outer', blur: 4, offset: 2, angle: 90, color: '000000', opacity: 0.3 } });
      txt(s, it.rot, { x: cx - hw / 2, y: yh, w: hw, h: hh, fontSize: 11, bold: true, color: COR.escuro, align: 'center' });
      if (it.titulo) {
        const yl = yh + hh / 2, xl = x + W0 + 0.25;
        seg(s, cx + hw / 2 + 0.08, yl, xl - 0.08, yl, { color: COR.cinza || 'A6A6A6', width: 0.75, dashType: 'sysDot' });
        txt(s, [{ text: it.titulo, options: { bold: true, fontSize: 12, color: COR.dom, breakLine: true } }, { text: it.texto || '', options: { fontSize: 10.5 } }], { x: xl, y: yl - 0.38, w: wLado, h: 0.76, align: 'left' });
      }
    });
  }
  function sanfona(s, { x, y, w, h, segmentos, cor = 'E3E3E3', ocultarPrimeiro = false }) {
    const tot = segmentos.reduce((a, b) => a + b.peso, 0), areas = []; let xi = x;
    segmentos.forEach((sg, i) => {
      const wi = w * sg.peso / tot, hi = h * (sg.alt || 1), yi = y + (h - hi) / 2;
      if (sg.dobra) { const a = segmentos[i - 1], b = segmentos[i + 1], ha = h * (a.alt || 1), hb = h * (b.alt || 1);
        poly(s, [[xi, y + (h - ha) / 2], [xi + wi, y + (h - hb) / 2], [xi + wi, y + (h + hb) / 2], [xi, y + (h + ha) / 2]], { fill: { color: tom(cor, 0.35) }, line: { type: 'none' } });
      } else { if (!(ocultarPrimeiro && i === 0)) s.addShape(S.RECTANGLE, { x: xi, y: yi, w: wi, h: hi, fill: { color: cor }, line: { type: 'none' } }); areas.push({ x: xi, y: yi, w: wi, h: hi }); }
      xi += wi;
    });
    return areas;
  }
  function mockupNavegador(s, { x, y, w, h, url, marca, titulo, texto, corMarca = 'C4170C' }) {
    s.addShape(S.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: 'F2F2F2' }, line: { color: 'BFBFBF', width: 0.75 } });
    ['FF5F57', 'FEBC2E', '28C840'].forEach((c, i) => s.addShape(S.OVAL, { x: x + 0.12 + i * 0.17, y: y + 0.1, w: 0.1, h: 0.1, fill: { color: c }, line: { type: 'none' } }));
    s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.12, y: y + 0.3, w: w - 0.4, h: 0.22, rectRadius: 0.05, fill: { color: 'FFFFFF' }, line: { color: 'D0D0D0', width: 0.5 } });
    txt(s, url, { x: x + 0.22, y: y + 0.3, w: w - 0.6, h: 0.22, fontSize: 7.5, color: '595959', align: 'left' });
    s.addShape(S.OVAL, { x: x + w - 0.2, y: y + 0.34, w: 0.12, h: 0.12, fill: { color: corMarca }, line: { type: 'none' } });
    const cy = y + 0.6;
    s.addShape(S.RECTANGLE, { x: x + 0.1, y: cy, w: w - 0.2, h: h - 0.7, fill: { color: 'FFFFFF' }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x: x + w / 2 - 0.22, y: cy + 0.08, w: 0.44, h: 0.26, fill: { color: corMarca }, line: { type: 'none' } });
    txt(s, marca, { x: x + w / 2 - 0.22, y: cy + 0.08, w: 0.44, h: 0.26, fontSize: 10, bold: true, color: 'FFFFFF', align: 'center' });
    txt(s, [{ text: titulo, options: { bold: true, fontSize: 10, breakLine: true } }, { text: texto, options: { fontSize: 8.5 } }], { x: x + 0.2, y: cy + 0.42, w: w - 0.4, h: h - 1.2, valign: 'top', align: 'left' });
  }
  function cardGraficosAlto(s, { x, y, w, h, secoes }) {
    s.addShape(S.RECTANGLE, { x: x + 0.07, y: y + 0.07, w, h, fill: { color: COR.dom }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color: 'FFFFFF' }, line: { color: 'D9D9D9', width: 0.5 } });
    const hs = (h - 0.2) / secoes.length;
    secoes.forEach((sc, i) => {
      const y0 = y + 0.12 + i * hs;
      s.addShape(S.RECTANGLE, { x: x + 0.12, y: y0 + 0.02, w: 0.07, h: 0.22, fill: { color: COR.dom }, line: { type: 'none' } });
      txt(s, sc.titulo, { x: x + 0.26, y: y0, w: w - 0.4, h: 0.26, fontSize: 11, bold: true, color: COR.dom, align: 'left' });
      txt(s, sc.linhas.map(([t, d]) => ({ text: t, options: { color: d ? COR.dom : COR.texto, bold: !!d } })), { x: x + 0.12, y: y0 + 0.28, w: w - 0.24, h: 0.34, fontSize: 9.5, align: 'left', valign: 'top' });
      const gx = x + 0.2, gw = w - 0.4, gy = y0 + 0.78, gh = hs - 1.12, d = sc.dados, mx = Math.max(...d.map(z => z.v)), mn = Math.min(...d.map(z => z.v)), pas = gw / d.length;
      const pill = (cx, cy, v) => { s.addShape(S.ROUNDED_RECTANGLE, { x: cx - 0.2, y: cy - 0.1, w: 0.4, h: 0.2, rectRadius: 0.04, fill: { color: COR.dom }, line: { type: 'none' } });
        txt(s, String(v).replace('.', ','), { x: cx - 0.2, y: cy - 0.1, w: 0.4, h: 0.2, fontSize: 8, bold: true, color: 'FFFFFF', align: 'center' }); };
      if (sc.tipo === 'linha') {
        const pts = d.map((z, j) => [gx + pas * (j + 0.5), gy + gh * 0.3 + (gh * 0.6) * (1 - (z.v - mn) / Math.max(mx - mn, 1e-6))]);
        pts.slice(1).forEach((p, j) => seg(s, pts[j][0], pts[j][1], p[0], p[1], { color: COR.escuro, width: 2 }));
        pts.forEach((p, j) => { s.addShape(S.OVAL, { x: p[0] - 0.04, y: p[1] - 0.04, w: 0.08, h: 0.08, fill: { color: COR.escuro }, line: { type: 'none' } }); pill(p[0], p[1] - 0.2, d[j].v); });
      } else {
        d.forEach((z, j) => { const bh = Math.max(0.12, gh * 0.8 * z.v / mx), bx = gx + pas * j + pas * 0.18;
          s.addShape(S.RECTANGLE, { x: bx, y: gy + gh - bh, w: pas * 0.64, h: bh, fill: { color: COR.escuro }, line: { type: 'none' } }); pill(bx + pas * 0.32, gy + gh - bh - 0.14, z.v); });
      }
      d.forEach((z, j) => txt(s, z.r, { x: gx + pas * j, y: gy + gh + 0.04, w: pas, h: 0.18, fontSize: 7.5, align: 'center' }));
      if (i < secoes.length - 1) seg(s, x + 0.12, y0 + hs - 0.04, x + w - 0.12, y0 + hs - 0.04, { color: 'E0E0E0', width: 0.5 });
    });
  }
  function cardGrande(s, { x, y, w, h, d = 0.1, bb = 0.14 }) {   // UM retangulo alto com os elementos dentro; devolve a area interna
    poly(s, [[x, y + d], [x + d, y], [x + w + d, y], [x + w, y + d]], { fill: { color: COR.escuro }, line: { type: 'none' } });
    poly(s, [[x + w, y + d], [x + w + d, y], [x + w + d, y + h - d], [x + w, y + h]], { fill: { color: 'BFBFBF' }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x, y: y + d, w, h: h - d, fill: { color: 'F2F2F2' }, line: { type: 'none' } });
    s.addShape(S.RECTANGLE, { x, y: y + h - bb, w, h: bb, fill: { color: COR.escuro }, line: { type: 'none' } });
    return { x: x + 0.15, y: y + d + 0.12, w: w - 0.3, h: h - d - bb - 0.24 };
  }
  function linhaTempoFitas(s, { x, y, w, itens, hFita = 0.5, hTexto = 0.6 }) {
    const n = itens.length, sl = 0.2, pas = (w - sl) / n, wf = pas + sl * 0.7;
    itens.forEach((it, i) => {
      const xi = x + i * pas, cor = i % 2 ? tom(COR.dom, -0.2) : COR.dom;
      poly(s, [[xi + sl, y], [xi + wf, y], [xi + wf - sl, y + hFita], [xi, y + hFita]], { fill: { color: cor }, line: { color: 'FFFFFF', width: 0.75 } });
      poly(s, [[xi, y + hFita], [xi + sl * 0.9, y + hFita], [xi + sl * 0.9, y + hFita + 0.1]], { fill: { color: COR.escuro }, line: { type: 'none' } });
      txt(s, it.ano, { x: xi + sl, y, w: wf - 2 * sl, h: hFita, fontSize: 13, bold: true, color: 'FFFFFF', align: 'center' });
      const cxm = xi + wf / 2, cima = i % 2 === 0;
      seg(s, cxm, cima ? y - 0.18 : y + hFita, cxm, cima ? y : y + hFita + 0.18, { color: COR.escuro, width: 1 });
      txt(s, it.texto, { x: cxm - pas * 0.5, y: cima ? y - 0.18 - hTexto : y + hFita + 0.2, w: pas, h: hTexto, fontSize: 9, align: 'center', valign: cima ? 'bottom' : 'top' });
    });
  }

  // ---------- aprovadas no deck Carrefour (22/11/2026) ----------
  let nDeg = 0;
  // sanfonaDegrade: liga o item aceso (lista, faixa da piramide, chip) ao card de detalhe com DUAS dobras em degrade continuo:
  // sai na cor do item, clareia ate a dobra e chega ao card quase no cinza dele. de = borda direita do item { x, y, h };
  // para = borda esquerda do card { x, y, h }. Desenhe ANTES do card (o card fica por cima da ponta da sanfona).
  function sanfonaDegrade(s, { de, para, cor }) {
    const c = cor || COR.dom, xm = (de.x + para.x) / 2, m0 = (de.y + para.y) / 2, m1 = (de.y + de.h + para.y + para.h) / 2, cm = tom(c, 0.5);
    const g1 = 'GR_sanfona_' + (++nDeg) + 'a', g2 = 'GR_sanfona_' + nDeg + 'b';
    DEG[g1] = { ang: 0, stops: [[0, c, 100], [100, cm, 100]] };
    DEG[g2] = { ang: 0, stops: [[0, tom(c, 0.58), 100], [100, 'E6EBF2', 100]] };
    poly(s, [[de.x - 0.01, de.y], [xm, m0], [xm, m1], [de.x - 0.01, de.y + de.h]], { fill: { color: cm }, line: { type: 'none' }, objectName: g1 });
    poly(s, [[xm, m0], [para.x, para.y], [para.x, para.y + para.h], [xm, m1]], { fill: { color: 'E6EBF2' }, line: { type: 'none' }, objectName: g2 });
  }
  // pontePainel: trapezio em degrade entre dois paineis cinza empilhados (kepl3_p044), com rotulo no meio ("Os tres gargalos")
  function pontePainel(s, { xa, xb, y1, x0, x1, y2, rotulo }) {
    const g = 'GR_ponte_' + (++nDeg);
    DEG[g] = { ang: 90, stops: [[0, tom(COR.dom, 0.55), 100], [100, 'E6EBF2', 100]] };
    poly(s, [[xa, y1], [xb, y1], [x1, y2], [x0, y2]], { fill: { color: 'E6EBF2' }, line: { type: 'none' }, objectName: g });
    if (rotulo) txt(s, rotulo, { x: (x0 + x1) / 2 - 1.75, y: y1 + 0.04, w: 3.5, h: y2 - y1 - 0.08, fontSize: 12, bold: true, color: COR.escuro, align: 'center' });
  }
  // linhaProcesso: onda continua que sobe e desce ligando um ponto por etapa, numa FAIXA LIVRE abaixo das fotos, nunca por cima
  // da imagem (usuario: "vai ter uma imagem ali e talvez nao fique visivel"). yFoto = base das fotos: um traco liga cada foto ao ponto.
  function linhaProcesso(s, { centros, y, amp = 0.16, yFoto, cor }) {
    const c = cor || COR.dom, xa = centros[0], xb = centros[centros.length - 1], yTop = y - amp * 1.4;
    const pts = [{ x: 0, y: y - yTop, moveTo: true }];
    for (let i = 1; i < centros.length; i++) {
      const dx = centros[i] - centros[i - 1], sg = i % 2 ? -1 : 1, px = centros[i - 1] - xa;
      pts.push({ x: centros[i] - xa, y: y - yTop, curve: { type: 'cubic', x1: px + dx * 0.35, y1: y - yTop + sg * amp * 1.3, x2: px + dx * 0.65, y2: y - yTop + sg * amp * 1.3 } });
    }
    s.addShape(S.CUSTOM_GEOMETRY, { x: xa, y: yTop, w: xb - xa, h: amp * 2.8, points: pts, fill: { type: 'none' }, line: { color: c, width: 2.25 } });
    centros.forEach(cx => {
      if (yFoto != null && y - 0.12 > yFoto) s.addShape(S.LINE, { x: cx, y: yFoto, w: 0, h: y - 0.12 - yFoto, line: { color: c, width: 1 } });
      s.addShape(S.OVAL, { x: cx - 0.13, y: y - 0.13, w: 0.26, h: 0.26, fill: { color: c }, line: { color: 'FFFFFF', width: 1.5 } });
    });
  }
  // tabelaLimpa: quadro comparativo SEM fios, bordas, faixa de cabecalho ou linha pintada (modelo do usuario, 22/11/2026):
  // LOGO de cada empresa no topo da coluna (placeholder se nao houver arquivo), rotulo da linha em cinza a esquerda, dado em cinza
  // e valor qualitativo em negrito escuro, com respiro entre as linhas. linhas: [[rotulo, [valores], qualitativo?]].
  function tabelaLimpa(s, { x, y, w, colunas, linhas, wRot = 1.55, hLogo = 0.62, dy = 0.66, logos = {} }) {
    const n = colunas.length, wc = (w - wRot) / n, y0 = y + hLogo + 0.4;
    colunas.forEach((nome, j) => {
      const xi = x + wRot + j * wc + 0.18, wl = wc - 0.36;
      if (logos[nome]) s.addImage({ path: logos[nome], x: xi, y, w: wl, h: hLogo, sizing: { type: 'contain', w: wl, h: hLogo } });
      else {
        s.addShape(S.RECTANGLE, { x: xi, y, w: wl, h: hLogo, fill: { color: 'F2F2F2' }, line: { color: 'A6A6A6', width: 1, dashType: 'dash' } });
        txt(s, '[LOGO: ' + nome + ']', { x: xi, y, w: wl, h: hLogo, fontSize: 9.5, color: '7F7F7F', align: 'center' });
      }
    });
    linhas.forEach(([rot, vals, qual], i) => {
      const yi = y0 + i * dy;
      txt(s, rot, { x, y: yi, w: wRot, h: 0.4, fontSize: 12, color: '7F7F7F' });
      vals.forEach((v, j) => txt(s, v, { x: x + wRot + j * wc, y: yi, w: wc, h: 0.4, fontSize: qual ? 12.5 : 12, bold: !!qual, color: qual ? COR.escuro : '595959', align: 'center' }));
    });
    return y0 + linhas.length * dy;
  }
  return { sanfonaDegrade, pontePainel, linhaProcesso, tabelaLimpa, cardGrande, tom, poly, seg, piramideFacetada, funilTroncos, sanfona, mockupNavegador, cardGraficosAlto, linhaTempoFitas };
};
