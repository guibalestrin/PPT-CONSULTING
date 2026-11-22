// capas.js -- modelos de capa copiados dos decks de referencia do usuario (references/capas.md, assets/capas/).
// Regra do usuario: na capa a ESTRUTURA e copiada literalmente; so mudam imagens, logos, cores da paleta e textos do caso.
// Cada modelo recebe o slide (layout 'Capa', em branco) e as opcoes de deck.capa({ modelo, ... }).
//
// Opcoes comuns:
//   modelo:      'foto_lateral' | 'circulo' | 'ondas_foto' | 'recomendacao' | 'radial'   (obrigatorio; escolha pelo contexto)
//   titulo:      nome do trabalho ("Investment Thesis", "Crédito 2024.1", "Análise mercadológica")
//   subtitulo:   complemento ("Apresentação Final", "AgroInsper", empresa analisada)
//   integrantes: [nomes]
//   creditos:    [[rotulo, nome], ...]   ex.: [['Head', 'Manuel García'], ['Coordenador', 'Adilson Filho']]
//   rotuloIntegrantes: 'Integrantes' (ondas_foto) | rodape: curso, disciplina, data (linha extra)
//   empresas:    [{ nome, logo }]  1 ou 2 empresas (2 so em ondas_foto: "A & B"). Padrao: cfg.logos.analisada
//   logos:       { apresentador?, parceiro? }  padrao: cfg.logos.apresentador / null
//   imagem, tema, imagemDescricao, foco: foto do caso (foto_lateral, ondas_foto, recomendacao)
//   logosNegativos: true (padrao nos modelos escuros): logo PNG escuro com fundo transparente vira branco
//   recomendacao: { ticker, data, recomendacao, precoAlvo, upside, rotulos? }   (so modelo 'recomendacao')
module.exports = function (ctx) {
  const { pres, COR, F, caber, imagem, resolverImagem, degrades, tom, mistura, py, temPillow, tmp, nLinhas } = ctx;
  const W = 13.333, H = 7.5, S = pres.shapes;
  let nGr = 0, nNeg = 0;

  // ---------- utilitarios ----------
  const txt = (s, conteudo, o) => s.addText(conteudo, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: 'FFFFFF' }, o));
  const grad = (stops, ang) => { const n = 'GR_capa_' + (++nGr); degrades[n] = { ang, stops }; return n; };
  const ret = (s, x, y, w, h, cor, extra = {}) => { const { transparency, ...resto } = extra;   // transparencia vai dentro de fill
    return s.addShape(S.RECTANGLE, Object.assign({ x, y, w, h, fill: transparency ? { color: cor, transparency } : { color: cor }, line: { type: 'none' } }, resto)); };
  // caminho livre em coordenadas do slide (pptxgenjs: pontos relativos a caixa 0,0,W,H)
  const forma = (s, pts, o = {}) => s.addShape(S.CUSTOM_GEOMETRY, { x: 0, y: 0, w: W, h: H, objectName: o.nome,
    points: pts.concat(o.aberto ? [] : [{ close: true }]),
    fill: o.cor ? { color: o.cor, transparency: o.transp || 0 } : { color: 'FFFFFF', transparency: 100 },
    line: o.linha ? { color: o.corLinha || 'FFFFFF', width: o.linha, transparency: o.transpLinha || 0 } : { type: 'none' } });
  const P = (x, y) => ({ x, y });
  const C = (x1, y1, x2, y2, x, y) => ({ x, y, curve: { type: 'cubic', x1, y1, x2, y2 } });
  // *palavra* em italico (ex.: "*Insper* Asset Management")
  const italico = (t, base = {}) => String(t).split(/(\*[^*]+\*)/).filter(Boolean).map(p => /^\*.*\*$/.test(p)
    ? { text: p.slice(1, -1), options: Object.assign({}, base, { italic: true }) } : { text: p, options: Object.assign({}, base) });
  const limpo = (t) => String(t || '').replace(/\*/g, '');
  function caberPt(t, ptMax, ptMin, w, maxLin, neg) {   // maior tamanho em que o texto cabe em maxLin linhas
    let pt = ptMax;
    while (pt > ptMin && nLinhas(limpo(t), pt, w, neg) > maxLin) pt -= 0.5;
    return pt;
  }
  const alertas = [];
  const DADO = (o) => Object.assign({ color: 'C00000', bold: true }, o);

  // logo branco para fundo escuro: so recolore PNG com transparencia e cor escura (logo claro fica como esta)
  const NEG = 'import sys\nfrom PIL import Image\nsrc, dst = sys.argv[1], sys.argv[2]\nim = Image.open(src).convert("RGBA")\na = im.getchannel("A")\n' +
    'if a.getextrema()[0] >= 250:\n    print("SEMALFA")\nelse:\n    from PIL import ImageStat\n    m = a.point(lambda v: 255 if v > 128 else 0)\n' +
    '    lum = ImageStat.Stat(im.convert("L"), mask=m).mean[0]\n' +
    '    if lum > 200:\n        print(src)\n    else:\n        branco = Image.new("RGBA", im.size, (255, 255, 255, 255)); branco.putalpha(a); branco.save(dst); print(dst)';
  function negativo(caminho) {
    if (!/\.png$/i.test(caminho)) { alertas.push(`logo ${caminho}: para fundo escuro, envie a versao branca/negativa (PNG transparente)`); return caminho; }
    if (!temPillow) { alertas.push(`logo ${caminho}: sem Pillow nao recolori para branco; confira o contraste`); return caminho; }
    const r = py(NEG, caminho, require('path').join(tmp(), 'neg' + (++nNeg) + '.png'));
    if (r === 'SEMALFA') { alertas.push(`logo ${caminho}: PNG sem transparencia, ficou com o fundo; envie a versao negativa`); return caminho; }
    return r;
  }
  // logo dentro da caixa, sem distorcer. escuro = fundo escuro (placeholder claro tracejado e logo em negativo)
  function logo(s, caminho, box, o = {}) {
    const fs = require('fs');
    if (caminho && fs.existsSync(caminho)) {
      const arq = o.escuro && o.negativo !== false ? negativo(caminho) : caminho;
      const b = caber(arq, box, o.alinhar || 'centro');
      s.addImage({ path: arq, x: b.x, y: b.y, w: b.w, h: b.h, objectName: 'CAPA_LOGO_' + (o.nome || 'x') });
      return b;
    }
    if (caminho) alertas.push(`logo nao encontrado: ${caminho}`);
    s.addShape(S.RECTANGLE, { x: box.x, y: box.y, w: box.w, h: box.h, objectName: 'PH_capa_logo_' + (o.nome || 'x'),
      fill: o.escuro ? { color: 'FFFFFF', transparency: 88 } : { color: 'F2F2F2' },
      line: { color: o.escuro ? 'FFFFFF' : 'A6A6A6', width: 1, dashType: 'dash', transparency: o.escuro ? 30 : 0 } });
    txt(s, `[LOGO: ${o.rotulo || 'logo'}]`, { x: box.x, y: box.y, w: box.w, h: box.h, fontSize: 9, align: 'center', color: o.escuro ? 'FFFFFF' : '7F7F7F', margin: 3 });
    return box;
  }
  // foto do caso em "cover"; sem arquivo, placeholder escuro com o texto num ponto visivel
  function foto(s, o, box, ph) {
    const arq = resolverImagem(o.imagem, o.tema);
    if (arq) { imagem(s, { ...box, caminho: arq, foco: o.foco, nome: 'capa' }); return true; }
    ret(s, box.x, box.y, box.w, box.h, ph.fundo || COR.escuro, { objectName: 'PH_capa_foto' });
    txt(s, `[IMAGEM: ${o.imagemDescricao || ph.descricao}]`, { x: ph.x, y: ph.y, w: ph.w, h: 0.5, fontSize: 11, align: 'center', color: 'FFFFFF', transparency: 20 });
    return false;
  }
  const empresasDe = (o) => o.empresas && o.empresas.length ? o.empresas : [{ nome: 'empresa analisada', logo: ctx.cfgLogos.analisada }];
  const apresentadorDe = (o) => (o.logos && o.logos.apresentador !== undefined) ? o.logos.apresentador : ctx.cfgLogos.apresentador;
  const parceiroDe = (o) => (o.logos && o.logos.parceiro) || null;
  const credito = (c, base) => [{ text: c[0] + ': ', options: Object.assign({}, base, { bold: true }) }, { text: c[1], options: Object.assign({}, base) }];

  // =====================================================================
  // 1. foto_lateral (ref: Rede D'Or, "Investment Thesis")
  // Painel escuro em degrade na esquerda que se dissolve na foto da direita; logo grande da empresa em branco
  // no meio-esquerda; embaixo dele a marca de quem apresenta + nome do trabalho; integrantes e head no rodape esquerdo.
  // =====================================================================
  function fotoLateral(s, o) {
    const neg = o.logosNegativos !== false;
    ret(s, 0, 0, W, H, COR.escuro);
    foto(s, o, { x: 4.9, y: 0, w: W - 4.9, h: H }, { x: 6.5, y: 3.5, w: 6.4, descricao: 'foto do negocio (operacao, produto, fachada)', fundo: tom(COR.escuro, -0.2) });
    if (o.tingir !== false) ret(s, 4.9, 0, W - 4.9, H, COR.dom, { transparency: 72 });   // foto puxada para a cor do deck
    const meio = mistura(COR.dom, COR.escuro, 0.55);
    ret(s, 0, 0, 5.05, H, COR.dom, { objectName: grad([[0, tom(COR.dom, 0.08), 100], [55, meio, 100], [100, COR.escuro, 100]], 80) });
    ret(s, 5.0, 0, 3.4, H, meio, { objectName: grad([[0, meio, 100], [45, meio, 70], [100, meio, 0]], 0) });
    forma(s, [P(6.55, 0), P(7.45, 0), P(5.55, H), P(4.65, H)], { cor: tom(COR.dom, 0.25), transp: 86 });   // faixa diagonal clara da referencia
    const e = empresasDe(o)[0];
    logo(s, e.logo, { x: 0.22, y: 2.62, w: 3.9, h: 1.0 }, { escuro: true, negativo: neg, alinhar: 'esquerda', rotulo: e.nome, nome: 'empresa' });
    const ap = apresentadorDe(o);
    const b = logo(s, ap, { x: 0.22, y: 3.78, w: ap ? 0.72 : 0.95, h: 0.42 }, { escuro: true, negativo: neg, alinhar: 'esquerda', rotulo: 'grupo', nome: 'apresentador' });
    const xT = b.x + b.w + 0.14, wT = 4.75 - xT, pt = caberPt(o.titulo, 22, 15, wT, 1, false);
    txt(s, o.titulo, { x: xT, y: 3.74, w: wT, h: 0.5, fontSize: pt, objectName: 'CAPA_TITULO' });
    if (o.subtitulo) txt(s, o.subtitulo, { x: xT, y: 4.22, w: wT, h: 0.32, fontSize: 13, color: tom(COR.dom, 0.75), valign: 'top' });
    const linhas = [];
    if ((o.integrantes || []).length) linhas.push([{ text: o.integrantes.join(' | '), options: {} }]);
    (o.creditos || []).forEach(c => linhas.push([{ text: c[0] + ': ' + c[1], options: {} }]));
    if (o.rodape) linhas.push([{ text: o.rodape, options: {} }]);
    const runs = []; linhas.forEach((l, i) => { l[l.length - 1].options.breakLine = i < linhas.length - 1; runs.push(...l); });
    if (runs.length) txt(s, runs, { x: 0.22, y: 5.4, w: 4.6, h: 2.0, fontSize: 12, valign: 'bottom', paraSpaceAfter: 1 });
  }

  // =====================================================================
  // 2. circulo (ref: Nu, Insper Asset Management)
  // Fundo do quase-preto para a cor dominante com ondas organicas; circulo preto central com sombra difusa;
  // dentro: grupo/trabalho (italico parcial), logo grande da empresa, fio fino, integrantes, head em italico.
  // =====================================================================
  function circulo(s, o) {
    const neg = o.logosNegativos !== false, preto = '050507', d = COR.dom;
    ret(s, 0, 0, W, H, preto, { objectName: grad([[0, preto, 100], [35, mistura(preto, d, 0.35), 100], [70, mistura(preto, d, 0.75), 100], [100, d, 100]], 40) });
    // onda escura da esquerda (desce do meio-esquerdo ate a base)
    forma(s, [P(0, 1.45), C(1.3, 1.45, 2.05, 2.1, 2.3, 3.15), C(2.55, 4.35, 2.95, 4.75, 4.1, 5.15), C(5.3, 5.6, 5.3, 6.6, 5.6, H), P(0, H)],
      { cor: d, nome: grad([[0, mistura(preto, d, 0.25), 100], [100, mistura(preto, d, 0.55), 100]], 90) });
    // faixa clara que entra por tras do circulo pela esquerda
    forma(s, [P(2.3, 3.15), C(3.3, 3.3, 4.3, 3.5, 5.2, 3.75), P(5.6, 5.4), C(4.6, 5.15, 3.0, 4.9, 2.6, 4.2), C(2.45, 3.9, 2.35, 3.5, 2.3, 3.15)],
      { cor: tom(d, 0.12) });
    // lobulo claro da direita (desce do topo e contorna o circulo)
    forma(s, [P(8.9, 0), P(W, 0), P(W, 0.85), C(12.2, 1.55, 11.65, 2.3, 11.25, 3.15), C(10.55, 4.6, 10.3, 5.45, 9.45, 5.45),
      C(8.7, 5.45, 8.2, 5.2, 7.6, 5.0), P(7.6, 1.75), C(8.25, 1.6, 8.6, 1.0, 8.9, 0)], { cor: d, nome: grad([[0, tom(d, 0.1), 100], [100, d, 100]], 90) });
    ret(s, 11.2, 0, W - 11.2, H, preto, { objectName: grad([[0, preto, 0], [100, preto, 70]], 0) });   // escurece a borda direita
    const D = 4.53, cx = W / 2, cy = 3.72;
    s.addShape(S.OVAL, { x: cx - D / 2, y: cy - D / 2, w: D, h: D, fill: { color: '000000' }, line: { type: 'none' }, objectName: 'CAPA_circulo',
      shadow: { type: 'outer', color: '000000', opacity: 0.65, blur: 40, offset: 0, angle: 90 } });
    const wI = 3.5, xI = cx - wI / 2;
    txt(s, italico(o.titulo), { x: xI, y: 2.22, w: wI, h: 0.34, fontSize: caberPt(o.titulo, 13.5, 11, wI, 1, false), align: 'center', objectName: 'CAPA_TITULO' });
    if (o.subtitulo) txt(s, o.subtitulo, { x: xI, y: 2.5, w: wI, h: 0.26, fontSize: 10.5, align: 'center', color: 'D9D9D9' });
    const e = empresasDe(o)[0];
    logo(s, e.logo, { x: cx - 1.3, y: 2.8, w: 2.6, h: 1.2 }, { escuro: true, negativo: neg, rotulo: e.nome, nome: 'empresa' });
    s.addShape(S.LINE, { x: cx - 1.41, y: 4.17, w: 2.82, h: 0, line: { color: 'FFFFFF', width: 0.75 } });
    const nomes = (o.integrantes || []).join(' | '), wN = 3.7, ptN = caberPt(nomes, 13, 10.5, wN, 2, false), linN = nLinhas(nomes, ptN, wN, false);
    if (nomes) txt(s, nomes, { x: cx - wN / 2, y: 4.27, w: wN, h: linN * ptN * 1.25 / 72 + 0.05, fontSize: ptN, align: 'center', valign: 'top' });
    const cred = (o.creditos || []).map(c => c[0] + ': ' + c[1]).concat(o.rodape ? [o.rodape] : []);
    if (cred.length) txt(s, cred.map((t, i) => ({ text: t, options: { breakLine: i < cred.length - 1 } })),
      { x: cx - wN / 2, y: 4.27 + linN * ptN * 1.25 / 72 + 0.3, w: wN, h: 0.27 * cred.length, fontSize: 12, italic: true, align: 'center', valign: 'top' });
    const ap = apresentadorDe(o);
    if (ap) logo(s, ap, { x: cx - 0.5, y: 5.45, w: 1.0, h: 0.32 }, { escuro: true, negativo: neg, nome: 'apresentador' });
  }

  // =====================================================================
  // 3. ondas_foto (ref: Bunge & Kepler Weber, M&A AgroInsper)
  // Foto escurecida em tela cheia; faixa preta ondulada no topo com as logos ("A & B"), fio fino e o nome do trabalho;
  // faixa preta ondulada na base com parceria, coordenacao e integrantes; fios brancos finos contornam as ondas;
  // logo de parceiro no canto superior direito e de quem apresenta no inferior direito.
  // =====================================================================
  function ondasFoto(s, o) {
    const neg = o.logosNegativos !== false, preto = mistura('000000', COR.escuro, 0.12);
    foto(s, o, { x: 0, y: 0, w: W, h: H }, { x: 3.5, y: 3.9, w: 6.3, descricao: 'foto do ativo ou da operacao (fabrica, armazem, loja), fica escurecida', fundo: mistura(COR.escuro, '000000', 0.4) });
    ret(s, 0, 0, W, H, '000000', { transparency: 58 });
    ret(s, 0, 0, W, H, COR.escuro, { transparency: 70 });
    // faixa de cima: diagonal no canto esquerdo, onda que desce ate o centro e sobe ate o canto direito, com um recorte no topo
    const topo = [P(1.35, 0), P(0, 1.1), P(0, 1.38), C(2.6, 1.15, 4.6, 2.75, 6.85, 2.73), C(9.4, 2.7, 11.3, 1.3, 12.55, 0), C(11.3, 0.78, 9.4, 0.6, 8.1, 0)];
    forma(s, topo, { cor: preto, transp: 4 });
    forma(s, [P(0, 1.1), P(1.35, 0)], { aberto: true, linha: 1.25 });
    forma(s, [P(0, 1.38), C(2.6, 1.15, 4.6, 2.75, 6.85, 2.73), C(9.4, 2.7, 11.3, 1.3, 12.55, 0)], { aberto: true, linha: 1.25 });
    forma(s, [P(12.55, 0), C(11.3, 0.78, 9.4, 0.6, 8.1, 0)], { aberto: true, linha: 1.25 });
    // faixa de baixo
    const base = [P(0, 6.25), C(2.4, 5.9, 5.4, 7.2, 7.6, 7.25), C(8.7, 7.27, 9.6, 7.05, 10.3, 6.72), P(9.15, H), P(0, H)];
    forma(s, base, { cor: preto, transp: 4 });
    forma(s, [P(0, 6.25), C(2.4, 5.9, 5.4, 7.2, 7.6, 7.25), C(8.7, 7.27, 9.6, 7.05, 10.3, 6.72)], { aberto: true, linha: 1.25 });
    forma(s, [P(10.3, 6.72), P(9.15, H)], { aberto: true, linha: 1.25 });
    // logos das empresas
    const emp = empresasDe(o).slice(0, 2);
    if (emp.length === 2) {
      logo(s, emp[0].logo, { x: 3.7, y: 0.78, w: 2.6, h: 0.62 }, { escuro: true, negativo: neg, alinhar: 'direita', rotulo: emp[0].nome, nome: 'empresa1' });
      txt(s, '&', { x: 6.37, y: 0.8, w: 0.6, h: 0.62, fontSize: 30, align: 'center' });
      logo(s, emp[1].logo, { x: 7.05, y: 0.78, w: 2.6, h: 0.62 }, { escuro: true, negativo: neg, alinhar: 'esquerda', rotulo: emp[1].nome, nome: 'empresa2' });
    } else logo(s, emp[0].logo, { x: 4.67, y: 0.72, w: 4.0, h: 0.74 }, { escuro: true, negativo: neg, rotulo: emp[0].nome, nome: 'empresa' });
    s.addShape(S.LINE, { x: 4.6, y: 1.62, w: 4.43, h: 0, line: { color: 'FFFFFF', width: 0.75 } });
    const tit = o.subtitulo ? `${o.titulo} | ${o.subtitulo}` : o.titulo;
    txt(s, tit, { x: 3.4, y: 1.68, w: 6.53, h: 0.36, fontSize: caberPt(tit, 16, 12, 6.4, 1, true), bold: true, align: 'center', objectName: 'CAPA_TITULO' });
    const par = parceiroDe(o), ap = apresentadorDe(o);
    if (par) logo(s, par, { x: 12.62, y: 0.08, w: 0.65, h: 0.32 }, { escuro: true, negativo: neg, alinhar: 'direita', nome: 'parceiro' });
    logo(s, ap, { x: 12.25, y: 6.98, w: 0.95, h: 0.42 }, { escuro: true, negativo: neg, alinhar: 'direita', rotulo: 'grupo', nome: 'apresentador' });
    // textos da base: 1o credito sozinho, linha em branco, demais creditos e integrantes
    const base0 = { italic: true }, cred = o.creditos || [], runs = [];
    if (cred[0]) { runs.push({ text: cred[0][0] + ' ', options: { bold: true, italic: true } }, { text: cred[0][1], options: Object.assign({ breakLine: true }, base0) }); runs.push({ text: ' ', options: { breakLine: true, fontSize: 6 } }); }
    cred.slice(1).forEach(c => runs.push({ text: c[0] + ': ', options: { bold: true, italic: true } }, { text: c[1], options: { italic: true, breakLine: true } }));
    if ((o.integrantes || []).length) runs.push({ text: (o.rotuloIntegrantes || 'Integrantes') + ': ', options: { bold: true } }, { text: o.integrantes.join(' | '), options: { breakLine: !!o.rodape } });
    if (o.rodape) runs.push({ text: o.rodape, options: { color: 'D9D9D9' } });
    if (runs.length) { const last = runs[runs.length - 1]; last.options = Object.assign({}, last.options, { breakLine: false }); txt(s, runs, { x: 0.18, y: 6.1, w: 7.9, h: 1.3, fontSize: 12, valign: 'bottom', paraSpaceAfter: 2 }); }
  }

  // =====================================================================
  // 4. recomendacao (ref: Vibra, CFA Institute Research Challenge)
  // Fundo branco; logo do organizador (ou nome do trabalho) no canto superior esquerdo; logo da empresa + ticker;
  // data; "Recomendacao: COMPRA" com a palavra na cor de destaque; preco-alvo e upside lado a lado; foto de produto
  // recortada (PNG sem fundo) em pe a direita sobre um triangulo na cor dominante; faixa escura de rodape com os nomes.
  // =====================================================================
  function recomendacaoCapa(s, o) {
    const r = o.recomendacao || {}, rot = Object.assign({ data: 'Última atualização', rec: 'Recomendação', alvo: 'Preço-alvo', upside: 'Upside' }, r.rotulos);
    const corRec = ctx.contraste(COR.dest, 'FFFFFF') >= 2.5 ? COR.dest : COR.dom;
    ret(s, 0, 0, W, H, 'FFFFFF');
    const par = parceiroDe(o), ap = apresentadorDe(o);
    if (par) {
      logo(s, par, { x: 0.38, y: 0.3, w: 2.0, h: 0.56 }, { alinhar: 'esquerda', nome: 'parceiro' });
      txt(s, o.titulo, { x: 0.86, y: 6.58, w: 0.1, h: 0.1, fontSize: 9, color: 'FFFFFF', objectName: 'CAPA_TITULO' });   // marcador invisivel (QA)
    } else txt(s, o.titulo, { x: 0.38, y: 0.32, w: 6.5, h: 0.52, fontSize: caberPt(o.titulo, 18, 13, 6.4, 1, true), bold: true, color: COR.dom, objectName: 'CAPA_TITULO' });
    if (par && o.titulo) { /* o organizador ja nomeia o trabalho; o titulo vai abaixo da data */ }
    forma(s, [P(7.9, 6.98), P(W, 4.15), P(W, 6.98)], { cor: COR.dom });
    // foto em pe: cabe na caixa e assenta na faixa de rodape
    const arq = resolverImagem(o.imagem, o.tema), box = { x: 8.35, y: 1.05, w: 3.9, h: 5.93 };
    if (arq) {
      const b = caber(arq, box, 'centro');
      s.addImage({ path: arq, x: b.x, y: box.y + box.h - b.h, w: b.w, h: b.h, objectName: 'IMG_capa' });
      alertas.push('foto da capa: use PNG recortado (sem fundo), como o produto da referencia; foto retangular fica com cara de caixa');
    } else {
      s.addShape(S.RECTANGLE, { x: 9.1, y: 1.3, w: 2.5, h: 5.68, fill: { color: 'F2F2F2' }, line: { color: 'A6A6A6', width: 1, dashType: 'dash' }, objectName: 'PH_capa_foto' });
      txt(s, `[IMAGEM: ${o.imagemDescricao || 'produto ou marca recortado em PNG sem fundo (placa, embalagem, equipamento)'}]`, { x: 9.15, y: 3.4, w: 2.4, h: 1.2, fontSize: 9.5, color: '7F7F7F', align: 'center' });
    }
    ret(s, 0, 6.98, W, H - 6.98, COR.escuro);
    const e = empresasDe(o)[0];
    const b = logo(s, e.logo, { x: 0.86, y: 1.5, w: 2.7, h: 0.82 }, { alinhar: 'esquerda', rotulo: e.nome, nome: 'empresa' });
    if (r.ticker) txt(s, `(${r.ticker})`, { x: b.x + b.w + 0.15, y: b.y + b.h - 0.42, w: 3.6, h: 0.42, fontSize: 20, color: COR.dom, valign: 'bottom' });
    let y = 2.38;
    if (par && o.titulo) { txt(s, o.titulo, { x: 0.86, y, w: 6.5, h: 0.34, fontSize: 15, bold: true, color: COR.dom }); y += 0.36; }
    txt(s, [{ text: rot.data + ': ', options: {} }, r.data ? { text: r.data, options: {} } : { text: '[DADO: data]', options: DADO() }], { x: 0.86, y, w: 6.5, h: 0.34, fontSize: 15, color: '1A1A1A' });
    if (o.subtitulo) txt(s, o.subtitulo, { x: 0.86, y: y + 0.38, w: 6.5, h: 0.3, fontSize: 12, color: COR.cinza });
    txt(s, [{ text: rot.rec + ': ', options: {} }, r.recomendacao ? { text: r.recomendacao, options: { color: corRec } } : { text: '[DADO: recomendação]', options: DADO() }],
      { x: 0.86, y: 4.68, w: 6.8, h: 0.55, fontSize: 24, color: '1A1A1A' });
    txt(s, [{ text: rot.alvo + ': ', options: {} }, r.precoAlvo ? { text: r.precoAlvo, options: {} } : { text: '[DADO: preço-alvo]', options: DADO() }], { x: 0.86, y: 5.42, w: 3.3, h: 0.34, fontSize: 15, color: '1A1A1A' });
    txt(s, [{ text: rot.upside + ': ', options: {} }, r.upside ? { text: r.upside, options: {} } : { text: '[DADO: upside]', options: DADO() }], { x: 4.25, y: 5.42, w: 3.0, h: 0.34, fontSize: 15, color: '1A1A1A' });
    const nomes = (o.integrantes || []).join(' | ') + (o.rodape ? '   ' + o.rodape : '');
    if (nomes.trim()) txt(s, nomes, { x: 0.38, y: 6.98, w: 10.6, h: 0.52, fontSize: caberPt(nomes, 13, 10, 10.5, 1, false) });
    logo(s, ap, { x: 11.35, y: 7.04, w: 1.75, h: 0.4 }, { escuro: true, negativo: o.logosNegativos !== false, alinhar: 'direita', rotulo: 'grupo', nome: 'apresentador' });
  }

  // =====================================================================
  // 5. radial (ref: Agrion, AgroInsper Credito)
  // Fundo em degrade horizontal do grafite para a cor escura do deck; leques de tracos finos irradiando (como onda de
  // audio) no centro e nos cantos; coluna esquerda com logo de quem apresenta, fio, nome do trabalho e subtitulo;
  // logo grande da empresa no centro do leque; nomes no canto inferior esquerdo; logo de parceiro no inferior direito.
  // =====================================================================
  let semente = 7;
  const rnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };
  function cortar(x1, y1, x2, y2) {   // Liang-Barsky: segmento dentro do slide
    let t0 = 0, t1 = 1; const dx = x2 - x1, dy = y2 - y1;
    for (const [p, q] of [[-dx, x1], [dx, W - x1], [-dy, y1], [dy, H - y1]]) {
      if (p === 0) { if (q < 0) return null; continue; }
      const t = q / p;
      if (p < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
    }
    return [x1 + t0 * dx, y1 + t0 * dy, x1 + t1 * dx, y1 + t1 * dy];
  }
  function leque(s, { cx, cy, r, a0, a1, n, len, cor, larg = 1.25 }) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180;
      const onda = 0.5 + 0.5 * Math.sin(i * 0.35) * Math.cos(i * 0.11);   // variacao suave + ruido = cara de onda de audio
      const L = len[0] + (len[1] - len[0]) * (0.55 * onda + 0.45 * rnd());
      const r0 = r + rnd() * 0.08;
      const seg = cortar(cx + r0 * Math.cos(a), cy - r0 * Math.sin(a), cx + (r0 + L) * Math.cos(a), cy - (r0 + L) * Math.sin(a));
      if (seg) pts.push({ x: seg[0], y: seg[1], moveTo: true }, { x: seg[2], y: seg[3] });
    }
    if (pts.length) forma(s, pts, { aberto: true, linha: larg, corLinha: cor, nome: 'CAPA_leque' });
  }
  function radial(s, o) {
    const neg = o.logosNegativos !== false, grafite = '292929', fim = tom(COR.dom, -0.25);
    semente = 7;
    ret(s, 0, 0, W, H, grafite, { objectName: grad([[0, grafite, 100], [40, grafite, 100], [100, fim, 100]], 0) });
    const cor = tom(COR.dest, 0.35);
    leque(s, { cx: 9.05, cy: 3.75, r: 5.0, a0: 102, a1: 258, n: 150, len: [0.15, 1.9], cor });        // grande, envolve a logo
    leque(s, { cx: 3.6, cy: 3.4, r: 3.7, a0: 118, a1: 152, n: 34, len: [0.15, 1.1], cor });           // canto superior esquerdo
    leque(s, { cx: 11.0, cy: 3.4, r: 2.85, a0: 20, a1: 78, n: 44, len: [0.2, 1.4], cor });            // canto superior direito
    leque(s, { cx: 12.95, cy: 7.75, r: 1.5, a0: 100, a1: 190, n: 60, len: [0.15, 1.0], cor });        // canto inferior direito
    const ap = apresentadorDe(o), xc = 1.95, wc = 3.0;
    logo(s, ap, { x: xc - 1.2, y: 2.55, w: 2.4, h: 1.0 }, { escuro: true, negativo: neg, rotulo: 'grupo que apresenta', nome: 'apresentador' });
    s.addShape(S.LINE, { x: xc - wc / 2, y: 3.78, w: wc, h: 0, line: { color: 'FFFFFF', width: 1.5 } });
    txt(s, o.titulo, { x: xc - 1.85, y: 3.84, w: 3.7, h: 0.42, fontSize: caberPt(o.titulo, 22, 14, 3.6, 1, true), bold: true, align: 'center', objectName: 'CAPA_TITULO' });
    if (o.subtitulo) txt(s, o.subtitulo, { x: xc - 1.85, y: 4.24, w: 3.7, h: 0.3, fontSize: 14, align: 'center' });
    const e = empresasDe(o)[0];
    logo(s, e.logo, { x: 9.05 - 1.5, y: 3.75 - 1.25, w: 3.0, h: 2.5 }, { escuro: true, negativo: neg, rotulo: e.nome, nome: 'empresa' });
    const runs = [];
    (o.creditos || []).forEach(c => runs.push({ text: c[1], options: { bold: true, breakLine: true } }));
    (o.integrantes || []).forEach(n => runs.push({ text: n, options: { breakLine: true } }));
    if (o.rodape) runs.push({ text: o.rodape, options: { color: 'BFBFBF', breakLine: true } });
    if (runs.length) { runs[runs.length - 1].options.breakLine = false; txt(s, runs, { x: 0.1, y: 4.9, w: 4.6, h: 2.5, fontSize: 13, valign: 'bottom' }); }
    const par = parceiroDe(o);
    if (par) logo(s, par, { x: 10.85, y: 6.75, w: 2.3, h: 0.5 }, { escuro: true, negativo: neg, alinhar: 'direita', nome: 'parceiro' });
  }

  const MODELOS = { foto_lateral: fotoLateral, circulo, ondas_foto: ondasFoto, recomendacao: recomendacaoCapa, radial };
  function desenhar(s, o) {
    if (!o || !o.modelo) throw new Error(`deck.capa: informe "modelo" (${Object.keys(MODELOS).join(', ')}). Escolha pelo contexto do caso (references/capas.md).`);
    const f = MODELOS[o.modelo];
    if (!f) throw new Error(`modelo de capa desconhecido: "${o.modelo}". Use: ${Object.keys(MODELOS).join(', ')}`);
    if (!o.titulo) throw new Error('deck.capa: informe "titulo" (nome do trabalho)');
    f(s, o);
    console.log(`capa: modelo ${o.modelo}`);
    alertas.forEach(a => console.warn('AVISO capa: ' + a));
    alertas.length = 0;
  }
  return { desenhar, MODELOS: Object.keys(MODELOS) };
};
