// capas.js -- modelos de capa copiados dos decks de referencia do usuario (references/capas.md, assets/capas/).
// Regra do usuario: na capa a ESTRUTURA e copiada literalmente; so mudam imagens, logos, cores da paleta e textos do caso.
// Cada modelo recebe o slide (layout 'Capa', em branco) e as opcoes de deck.capa({ modelo, ... }).
//
// Opcoes comuns:
//   modelo:      'foto_lateral' | 'circulo' | 'ondas_foto' | 'recomendacao' | 'radial' | 'fita_padrao' | 'triangulos_fotos' | 'poligonos_centro' | 'foto_onda_base' | 'produto_onda' | 'objeto_marca'   (omitido = sorteio)
//   titulo:      nome do trabalho ("Investment Thesis", "Crédito 2024.1", "Análise mercadológica")
//   subtitulo:   complemento ("Apresentação Final", "AgroInsper", empresa analisada)
//   integrantes: [nomes]
//   creditos:    [[rotulo, nome], ...]   ex.: [['Head', 'Manuel García'], ['Coordenador', 'Adilson Filho']]
//   rotuloIntegrantes: 'Integrantes' (ondas_foto) | rodape: curso, disciplina, data (linha extra)
//   empresas:    [{ nome, logo }]  1 ou 2 empresas (2 so em ondas_foto: "A & B"). Padrao: cfg.logos.analisada
//   logos:       { apresentador?, parceiro? }  padrao: cfg.logos.apresentador / null
//   imagem, tema, imagemDescricao, foco: foto do caso (foto_lateral, ondas_foto, recomendacao)
//   logosNegativos: true (padrao nos modelos escuros): logo PNG escuro com fundo transparente vira branco
//   fita_padrao: marca, fitaDetalhe, monograma | triangulos_fotos: fotos[3], fotosPB | produto_onda: objeto (PNG recortado), objetoDescricao
//   silhueta: objeto do setor (objeto_marca; padrao de fita_padrao) | modelo omitido = sorteio entre os que o caso comporta
//   recomendacao: { ticker, data, recomendacao, precoAlvo, upside, rotulos? }   (so modelo 'recomendacao')
module.exports = function (ctx) {
  const { pres, COR, F, caber, imagem, resolverImagem, degrades, tom, mistura, py, temPillow, tmp, nLinhas, sil } = ctx;
  const SORT = require('./sorteio.js');
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


  // =====================================================================
  // MODELOS 6 a 10 (referencias de 23/11/2026). Cada um tem um ELEMENTO DA MARCA como peca central (slot `elemento`):
  // o que carrega o contexto da referencia e DEVE ser trocado pelo equivalente do caso (ver references/capas.md, "Elemento da marca").
  // Medidas: px da referencia (1037 de largura) x k = polegadas.
  // =====================================================================
  const k = W / 1037, px = (x, y) => P(x * k, y * k), pxs = (a) => a.map(([x, y]) => px(x, y));
  const GRAFITE = '3B3838';
  // foto recortada num poligono (pontos em polegadas do slide): Pillow gera PNG transparente no formato do poligono
  const POLI = 'import sys, json\nfrom PIL import Image, ImageDraw\nsrc, dst, bw, bh, pts, fx, fy, pb = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), json.loads(sys.argv[5]), float(sys.argv[6]), float(sys.argv[7]), sys.argv[8]\n' +
    'R = 200\nim = Image.open(src).convert("RGB")\nif pb == "1":\n    im = im.convert("L").convert("RGB")\nW, H = max(1, int(bw * R)), max(1, int(bh * R))\nsc = max(W / im.width, H / im.height)\nim = im.resize((max(W, int(im.width * sc)), max(H, int(im.height * sc))))\n' +
    'x0 = int((im.width - W) * fx); y0 = int((im.height - H) * fy)\nim = im.crop((x0, y0, x0 + W, y0 + H)).convert("RGBA")\nm = Image.new("L", (W, H), 0)\nImageDraw.Draw(m).polygon([(x * R, y * R) for x, y in pts], fill=255)\nim.putalpha(m)\nim.save(dst)\nprint(dst)';
  let nPoli = 0;
  function fotoPoli(s, arq, pts, o = {}) {
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y), bx = Math.min(...xs), by = Math.min(...ys), bw = Math.max(...xs) - bx, bh = Math.max(...ys) - by;
    const rel = pts.map(p => [p.x - bx, p.y - by]);
    if (arq && temPillow && require('fs').existsSync(arq)) {
      const dst = require('path').join(tmp(), 'poli' + (++nPoli) + '.png');
      const r = py(POLI, arq, dst, String(bw), String(bh), JSON.stringify(rel), String((o.foco || [0.5, 0.5])[0]), String((o.foco || [0.5, 0.5])[1]), o.pb ? '1' : '0');
      s.addImage({ path: r, x: bx, y: by, w: bw, h: bh, objectName: 'IMG_capa_' + (o.nome || 'poli') });
      return true;
    }
    if (arq && !temPillow) alertas.push('sem Pillow: foto em formato de triangulo virou placeholder');
    forma(s, pts, { cor: o.fundoPh || '7F7F7F', nome: 'PH_capa_foto_' + (o.nome || 'poli'), linha: 0.75, corLinha: 'FFFFFF', transpLinha: 40 });
    txt(s, `[IMAGEM: ${o.descricao || 'foto do produto ou do ambiente da marca'}]`, { x: bx + bw * 0.2, y: by + bh * 0.4, w: bw * 0.6, h: 0.6, fontSize: 9.5, align: 'center', color: 'FFFFFF' });
    return false;
  }
  const nomesLinha = (o) => (o.integrantes || []).join(' | ');
  const primeiroNegrito = (t, base) => { const m = String(t).match(/^(\S+)(\s.*)?$/); return m ? [{ text: m[1], options: Object.assign({}, base, { bold: true }) }, { text: m[2] || '', options: Object.assign({}, base) }] : [{ text: t, options: base }]; };

  // 6. fita_padrao (ref: Hermes, AF Capital). ELEMENTO DA MARCA: fitas pretas cruzadas com o nome da marca + padrao de monograma.
  function fitaPadrao(s, o) {
    const neg = o.logosNegativos !== false, d = COR.dom, e = empresasDe(o)[0];
    const marca = String(o.marca || e.nome || 'MARCA').toUpperCase(), det = o.fitaDetalhe ? '  |  ' + String(o.fitaDetalhe).toUpperCase() : '';
    const mono = o.monograma || (o.integrantes || []).map(n => String(n)[0]).join('').slice(0, 2) || '◆';
    ret(s, 0, 0, W, H, d, { objectName: grad([[0, tom(d, 0.05), 100], [100, tom(d, -0.04), 100]], 90) });
    const cl = tom(d, 0.2);
    const silh = sil && !o.monograma ? sil.resolver(o.silhueta || ctx.cfgSilhueta) : null;   // padrao com o objeto do setor em vez do monograma
    if (silh) sil.padrao(s, silh, { x: 0, y: 0, w: W, h: H }, { cor: cl, tam: 0.85, transpLinha: 45, linha: 1 });
    else for (let r = 0; r < 6; r++) for (let c = -1; c < 10; c++) txt(s, mono, { x: c * 1.43 + (r % 2 ? 0.7 : 0), y: 0.25 + r * 1.3, w: 1.2, h: 0.9, fontSize: 34, fontFace: 'Georgia', color: cl, align: 'center', transparency: 55, objectName: 'CAPA_padrao' });
    const fita = (cx, cy, comp, esp, ang) => {
      s.addShape(S.RECTANGLE, { x: cx - comp / 2, y: cy - esp / 2, w: comp, h: esp, rotate: ang, fill: { color: '0D0D0D' }, line: { type: 'none' }, objectName: 'CAPA_fita' });
      s.addShape(S.RECTANGLE, { x: cx - comp / 2, y: cy - esp / 2 + 0.07, w: comp, h: esp - 0.14, rotate: ang, fill: { color: '0D0D0D', transparency: 100 }, line: { color: 'FFFFFF', width: 0.75, dashType: 'dash', transparency: 25 }, objectName: 'CAPA_fita_pesponto' });
      txt(s, Array(6).fill(marca + det).join('          '), { x: cx - comp / 2, y: cy - esp / 2, w: comp, h: esp, rotate: ang, fontSize: 11, charSpacing: 2, align: 'center', fontFace: 'Georgia' });
    };
    fita(6.67, 0.9, 15.2, 0.74, 3.6);
    fita(2.7, 0.95, 8.4, 0.74, -22.5);
    forma(s, [P(0, 7.4), C(2.5, 5.6, 5.0, 4.6, 8.2, 4.2), C(10.8, 3.9, 12.6, 2.8, W, 1.45), C(12.6, 3.3, 10.2, 4.7, 7.7, 5.3), C(5.2, 5.9, 2.2, 6.9, 0.8, H), P(0, H)], { cor: 'FFFFFF', transp: 68 });
    forma(s, [P(0, 7.45), C(2.7, 5.8, 5.2, 4.8, 8.3, 4.4), C(10.9, 4.1, 12.7, 3.0, W, 1.55), C(12.6, 3.0, 10.4, 4.5, 7.8, 5.05), C(5.2, 5.7, 2.4, 6.8, 1.2, H), P(0, H)], { cor: 'FFFFFF', transp: 42 });
    logo(s, e.logo, { x: 7.4, y: 4.45, w: 5.67, h: 0.9 }, { escuro: true, negativo: neg, alinhar: 'direita', rotulo: e.nome, nome: 'empresa' });
    if (o.subtitulo) txt(s, primeiroNegrito(o.subtitulo, { fontSize: 20 }), { x: 6.0, y: 5.55, w: 7.07, h: 0.45, fontSize: 20, align: 'right' });
    txt(s, o.titulo, { x: 3.5, y: 6.05, w: 9.57, h: 0.6, fontSize: caberPt(o.titulo, 30, 18, 9.5, 1, false), align: 'right', objectName: 'CAPA_TITULO' });
    const rod = [nomesLinha(o), o.rodape].filter(Boolean).join('      ');
    if (rod) txt(s, rod, { x: 3.5, y: 7.03, w: 9.57, h: 0.3, fontSize: 11, align: 'right' });
  }

  // 7. triangulos_fotos (ref: Vivara, CFA). ELEMENTO DA MARCA: 3 fotos do produto/ambiente da marca em janelas triangulares, em P&B.
  function triangulosFotos(s, o) {
    const neg = o.logosNegativos !== false, gE = mistura('4A4A4A', COR.escuro, 0.3), gM = mistura('9A9A9A', COR.dom, 0.1), ac = COR.dest, acl = tom(COR.dest, 0.35);
    ret(s, 0, 0, W, H, gE); ret(s, 0, 1.58, W, 3.97, gM);
    ret(s, 0, 0, W, 0.13, acl); ret(s, 0, H - 0.13, W, 0.13, acl);
    ret(s, 0, 1.35, W, 0.06, tom(ac, -0.1)); ret(s, 0, 1.5, W, 0.05, acl); ret(s, 0, 5.58, W, 0.05, acl); ret(s, 0, 5.72, W, 0.06, tom(ac, -0.1));
    const fotos = (o.fotos && o.fotos.length ? o.fotos : [o.imagem]).map(f => f ? resolverImagem(f, o.tema) : null);
    const janelas = [[[535, 10], [1000, 10], [900, 235], [782, 388]], [[1037, 20], [1037, 420], [950, 420], [925, 255]], [[885, 285], [1037, 440], [1037, 568], [708, 568]]];
    const focos = [[0.5, 0.5], [0.8, 0.4], [0.5, 0.7]];
    janelas.forEach((j, i) => {
      const arq = fotos[i] || (fotos.length === 1 ? fotos[0] : null);
      fotoPoli(s, arq, pxs(j), { nome: 'j' + (i + 1), pb: o.fotosPB !== false, foco: o.foco && i === 0 ? o.foco : focos[i], fundoPh: mistura(gM, '000000', 0.2), descricao: o.imagemDescricao || 'foto do produto ou do ambiente da marca (' + (i + 1) + ' de 3)' });
      forma(s, pxs(j), { aberto: false, linha: 1, corLinha: ac });
    });
    const e = empresasDe(o)[0];
    logo(s, e.logo, { x: 0.45, y: 2.05, w: 6.1, h: 1.5 }, { escuro: true, negativo: neg, alinhar: 'esquerda', rotulo: e.nome, nome: 'empresa' });
    s.addShape(S.LINE, { x: 0.35, y: 3.98, w: 6.35, h: 0, line: { color: ac, width: 1 } });
    txt(s, o.titulo, { x: 0.45, y: 4.1, w: 6.0, h: 0.4, fontSize: caberPt(o.titulo, 16, 12, 6, 1, false), italic: true, objectName: 'CAPA_TITULO' });
    const par = parceiroDe(o), ap = apresentadorDe(o);
    logo(s, par, { x: 0.9, y: 4.95, w: 2.3, h: 0.6 }, { escuro: true, negativo: neg, alinhar: 'esquerda', rotulo: 'organizador', nome: 'parceiro' });
    logo(s, ap, { x: 3.55, y: 4.9, w: 1.5, h: 0.7 }, { escuro: true, negativo: neg, rotulo: 'grupo', nome: 'apresentador' });
    const ints = o.integrantes || [], lin = [];
    for (let i = 0; i < ints.length; i += 2) lin.push(ints.slice(i, i + 2).join('   |   '));
    if (o.rodape) lin.push(o.rodape);
    if (lin.length) txt(s, lin.map((t, i) => ({ text: t, options: { breakLine: i < lin.length - 1 } })), { x: 5.5, y: 4.88, w: 4.3, h: 0.8, fontSize: 13, fontFace: 'Georgia' });
  }

  // 8. poligonos_centro (ref: 3R Petroleum). ELEMENTO DA MARCA: o conjunto de logos (empresa | grupo) centralizado; poligonos so enquadram.
  function poligonosCentro(s, o) {
    const neg = o.logosNegativos !== false, esc = COR.escuro, d = COR.dom, lc = tom(COR.dest, 0.3);
    ret(s, 0, 0, W, H, esc, { objectName: grad([[0, tom(esc, -0.1), 100], [55, mistura(esc, d, 0.4), 100], [100, mistura(d, COR.dest, 0.35), 100]], 90) });
    const pf = mistura(esc, d, 0.55);
    forma(s, pxs([[0, 20], [168, 192], [0, 245]]), { cor: pf, transp: 15, linha: 0.75, corLinha: lc });
    forma(s, pxs([[140, 148], [405, 0]]), { aberto: true, linha: 0.75, corLinha: lc });
    forma(s, pxs([[168, 192], [0, 275]]), { aberto: true, linha: 0.75, corLinha: lc });
    forma(s, pxs([[860, 438], [1037, 425], [1037, 578], [600, 578]]), { cor: pf, transp: 10, linha: 0.75, corLinha: lc });
    const tit = o.subtitulo ? `${o.titulo} | ${o.subtitulo}` : o.titulo;
    txt(s, tit, { x: 2.0, y: 2.62, w: 9.33, h: 0.6, fontSize: caberPt(tit, 30, 18, 9.2, 1, true), bold: true, align: 'center', objectName: 'CAPA_TITULO' });
    const emp = empresasDe(o), e = emp[0], dir = emp[1] ? emp[1].logo : (parceiroDe(o) || apresentadorDe(o));
    logo(s, e.logo, { x: 4.3, y: 3.4, w: 2.3, h: 0.95 }, { escuro: true, negativo: neg, alinhar: 'direita', rotulo: e.nome, nome: 'empresa' });
    s.addShape(S.LINE, { x: 6.7, y: 3.38, w: 0, h: 0.95, line: { color: 'FFFFFF', width: 1 } });
    logo(s, dir, { x: 6.85, y: 3.4, w: 2.3, h: 0.95 }, { escuro: true, negativo: neg, alinhar: 'esquerda', rotulo: emp[1] ? emp[1].nome : 'grupo', nome: 'direita' });
    const l = []; if (nomesLinha(o)) l.push(nomesLinha(o)); (o.creditos || []).forEach(c => l.push(c[0] + ': ' + c[1])); if (o.rodape) l.push(o.rodape);
    if (l.length) txt(s, l.map((t, i) => ({ text: t, options: { breakLine: i < l.length - 1 } })), { x: 0.22, y: 6.2, w: 9.5, h: 1.15, fontSize: 16, valign: 'bottom' });
  }

  // 9. foto_onda_base (ref: Mateus, Insper Asset). ELEMENTO DA MARCA: foto da fachada/loja/ativo da empresa em tela cheia.
  function fotoOndaBase(s, o) {
    const neg = o.logosNegativos !== false, d = COR.dom, esc = COR.escuro;
    foto(s, o, { x: 0, y: 0, w: W, h: H }, { x: 3.5, y: 3.0, w: 6.3, descricao: 'foto da fachada, loja ou ativo da empresa (tela cheia)', fundo: mistura(esc, d, 0.5) });
    ret(s, 0, 0, W, 4.0, esc, { objectName: grad([[0, esc, 88], [100, d, 0]], 90) });
    forma(s, [P(0, 5.38), C(2.3, 5.2, 4.4, 5.62, 6.8, 6.0), C(9.2, 6.38, 11.6, 6.2, W, 5.45), P(W, H), P(0, H)], { cor: d, nome: grad([[0, tom(d, 0.12), 100], [100, d, 100]], 90) });
    forma(s, [P(5.2, H), C(6.8, 6.75, 9.4, 6.7, W, 6.2), P(W, H)], { cor: esc, nome: grad([[0, d, 0], [100, esc, 100]], 0) });
    txt(s, o.titulo, { x: 0.17, y: 5.5, w: 8.0, h: 0.48, fontSize: caberPt(o.titulo, 24, 16, 8, 1, true), bold: true, valign: 'bottom', objectName: 'CAPA_TITULO' });
    if (o.subtitulo) txt(s, o.subtitulo, { x: 0.17, y: 5.98, w: 8.0, h: 0.4, fontSize: 18, valign: 'top' });
    const rod = [nomesLinha(o), o.rodape].filter(Boolean).join('      ');
    if (rod) txt(s, rod, { x: 0.17, y: 6.8, w: 8.8, h: 0.35, fontSize: 12 });
    const e = empresasDe(o)[0], par = parceiroDe(o);
    logo(s, e.logo, { x: 10.6, y: 6.75, w: 2.5, h: 0.6 }, { escuro: true, negativo: neg, alinhar: 'direita', rotulo: e.nome, nome: 'empresa' });
    if (par) logo(s, par, { x: 11.6, y: 0.06, w: 1.55, h: 0.4 }, { escuro: true, negativo: neg, alinhar: 'direita', nome: 'parceiro' });
  }

  // 10. produto_onda (ref: Cimed, Private Equity Thesis). ELEMENTO DA MARCA: produto/embalagem recortado em PNG sem fundo, grande, a esquerda.
  function produtoOnda(s, o) {
    const neg = o.logosNegativos !== false, d = COR.dom, e = empresasDe(o)[0];
    const arq = resolverImagem(o.imagem, o.tema);
    if (arq) { imagem(s, { x: 0, y: 0, w: W, h: H, caminho: arq, foco: o.foco, nome: 'capa' }); ret(s, 0, 0, W, H, 'FFFFFF', { transparency: 22 }); ret(s, 0, 0, W, H, d, { transparency: 82 }); }
    else { ret(s, 0, 0, W, H, tom(d, 0.88), { objectName: 'PH_capa_foto' }); txt(s, `[IMAGEM: ${o.imagemDescricao || 'foto aerea ou da fachada da empresa (fica esmaecida ao fundo)'}]`, { x: 5.5, y: 2.6, w: 6.5, h: 0.5, fontSize: 11, align: 'center', color: '7F7F7F' }); }
    forma(s, [P(0, 5.9), C(0.9, 4.7, 3.6, 4.6, 6.0, 5.65), P(2.6, H), P(0, H)], { cor: d });
    const obj = resolverImagem(o.objeto, null), box = { x: 0.7, y: 0.6, w: 3.6, h: 5.9 };
    if (obj) { const b = caber(obj, box, 'centro'); s.addImage({ path: obj, x: b.x, y: box.y + box.h - b.h, w: b.w, h: b.h, objectName: 'IMG_capa_objeto' }); alertas.push('objeto da capa: use PNG recortado (sem fundo)'); }
    else { s.addShape(S.RECTANGLE, { x: box.x + 0.4, y: box.y + 0.3, w: 2.8, h: 5.4, fill: { color: 'FFFFFF', transparency: 30 }, line: { color: 'A6A6A6', width: 1, dashType: 'dash' }, objectName: 'PH_capa_objeto' });
      txt(s, `[IMAGEM: ${o.objetoDescricao || 'embalagem ou produto da marca recortado em PNG sem fundo'}]`, { x: box.x + 0.5, y: 3.0, w: 2.6, h: 1.0, fontSize: 10, align: 'center', color: '7F7F7F' }); }
    forma(s, [P(1.65, 6.45), C(3.5, 6.0, 5.6, 5.55, 7.4, 5.55), C(9.2, 5.55, 10.5, 6.0, 11.2, 6.5), P(11.0, H), P(1.5, H)], { cor: GRAFITE });
    forma(s, [P(10.4, H), C(10.4, 6.6, 11.5, 5.75, W, 5.7), P(W, H)], { cor: d });
    forma(s, pxs([[880, 0], [1037, 0], [1037, 110]]), { cor: GRAFITE, linha: 1, corLinha: tom(d, 0.3) });
    const ap = apresentadorDe(o);
    logo(s, ap, { x: 12.15, y: 0.1, w: 0.9, h: 0.5 }, { escuro: true, negativo: neg, rotulo: 'grupo', nome: 'apresentador' });
    const tit = o.subtitulo ? `${o.titulo} | ${o.subtitulo}` : o.titulo;
    txt(s, tit, { x: 3.8, y: 6.85, w: 6.0, h: 0.4, fontSize: caberPt(tit, 20, 13, 6, 1, false), italic: true, align: 'center', objectName: 'CAPA_TITULO' });
    const l = (o.integrantes || []).concat((o.creditos || []).map(c => c[0] + ': ' + c[1]), o.rodape ? [o.rodape] : []);
    if (l.length) txt(s, l.map((t, i) => ({ text: t, options: { breakLine: i < l.length - 1 } })), { x: 10.55, y: 6.2, w: 2.55, h: 1.2, fontSize: 11.5, color: '1A1A1A', align: 'right', valign: 'bottom' });
    if (e.logo) logo(s, e.logo, { x: 0.3, y: 0.15, w: 1.6, h: 0.5 }, { negativo: false, alinhar: 'esquerda', nome: 'empresa' });
  }

  // 11. objeto_marca (conceito de 23/11/2026: "capa como embalagem"; ref. Hermes). ELEMENTO DA MARCA: o OBJETO DO SETOR da empresa
  // (carrinho, caixa de presente, garrafa... ver silhuetas.js) como heroi num medalhao, com o mesmo objeto em padrao tom sobre tom no fundo.
  function objetoMarca(s, o) {
    const neg = o.logosNegativos !== false, d = COR.dom, e = empresasDe(o)[0], nome = sil && sil.resolver(o.silhueta || ctx.cfgSilhueta);
    if (!nome) throw new Error('objeto_marca: informe "silhueta" (carrinho, sacola, caixa, garrafa, cartao, predio, casa, folha, gota, raio, engrenagem, caminhao, aviao, cruz, celular, livro) ou o setor (supermercado, luxo, vinho...)');
    ret(s, 0, 0, W, H, d, { objectName: grad([[0, tom(d, -0.55), 100], [100, d, 100]], 40) });
    sil.padrao(s, nome, { x: 0, y: 0, w: W, h: H }, { cor: 'FFFFFF', tam: 0.8, transpLinha: 86, linha: 0.75 });
    s.addShape(S.OVAL, { x: 7.15, y: 0.85, w: 5.7, h: 5.7, fill: { color: tom(d, -0.5) }, line: { color: tom(COR.dest, 0.2), width: 1.25 }, objectName: 'CAPA_medalhao' });
    s.addShape(S.OVAL, { x: 7.35, y: 1.05, w: 5.3, h: 5.3, fill: { type: 'none' }, line: { color: 'FFFFFF', width: 0.5, transparency: 60 }, objectName: 'CAPA_medalhao_fio' });
    sil.desenhar(s, nome, { x: 8.0, y: 1.7, w: 4.0, h: 4.0 }, { cor: 'FFFFFF', linha: 3.5, preenche: true, transpPreenche: 88, nome: 'CAPA_objeto' });
    logo(s, e.logo, { x: 0.7, y: 0.6, w: 3.4, h: 0.85 }, { escuro: true, negativo: neg, alinhar: 'esquerda', rotulo: e.nome, nome: 'empresa' });
    const wT = 6.0, pt = caberPt(o.titulo, 38, 24, wT, 2, true), lin = nLinhas(limpo(o.titulo), pt, wT, true);
    txt(s, o.titulo, { x: 0.7, y: 2.45, w: wT, h: lin * pt * 1.25 / 72 + 0.1, fontSize: pt, bold: true, valign: 'top', objectName: 'CAPA_TITULO' });
    const yS = 2.45 + lin * pt * 1.25 / 72 + 0.25;
    s.addShape(S.LINE, { x: 0.7, y: yS, w: 1.6, h: 0, line: { color: tom(COR.dest, 0.3), width: 2.5 } });
    if (o.subtitulo) txt(s, o.subtitulo, { x: 0.7, y: yS + 0.15, w: wT, h: 0.45, fontSize: 18, color: tom(d, 0.8), valign: 'top' });
    const l = []; if (nomesLinha(o)) l.push(nomesLinha(o)); (o.creditos || []).forEach(c => l.push(c[0] + ': ' + c[1])); if (o.rodape) l.push(o.rodape);
    if (l.length) txt(s, l.map((t, i) => ({ text: t, options: { breakLine: i < l.length - 1 } })), { x: 0.7, y: 5.6, w: 6.2, h: 1.4, fontSize: 13, valign: 'bottom' });
    const ap = apresentadorDe(o);
    logo(s, ap, { x: 11.2, y: 6.75, w: 1.9, h: 0.5 }, { escuro: true, negativo: neg, alinhar: 'direita', rotulo: 'grupo', nome: 'apresentador' });
  }

  const MODELOS = { foto_lateral: fotoLateral, circulo, ondas_foto: ondasFoto, recomendacao: recomendacaoCapa, radial,
    fita_padrao: fitaPadrao, triangulos_fotos: triangulosFotos, poligonos_centro: poligonosCentro, foto_onda_base: fotoOndaBase, produto_onda: produtoOnda, objeto_marca: objetoMarca };
  // elementos do caso disponiveis para a capa (decidem quais modelos podem ser sorteados)
  function elementosDe(o) {
    const foto = !!resolverImagem(o.imagem, o.tema), fotos = foto || (o.fotos || []).some(f => resolverImagem(f, null));
    return { foto, fotos, objetoPng: !!resolverImagem(o.objeto, null), recomendacao: !!o.recomendacao, silhueta: !!(sil && sil.resolver(o.silhueta || ctx.cfgSilhueta)) };
  }
  // modelo omitido ou 'sorteio': usa o modelo ja sorteado do projeto (estilo_deck.json, gravado por propor_visual.js) ou sorteia agora entre os elegiveis
  function modeloDoSorteio(o) {
    const salvo = SORT.lerEstilo().modeloCapa, el = elementosDe(o);
    if (salvo && MODELOS[salvo]) return salvo;
    const m = SORT.sortearCapa(el, o.evitar || []);
    SORT.gravarEstilo({ modeloCapa: m });
    console.log(`capa sorteada entre ${SORT.capasElegiveis(el).length} modelos elegiveis: ${m}`);
    return m;
  }
  function desenhar(s, o) {
    if (o && (!o.modelo || o.modelo === 'sorteio')) o = Object.assign({}, o, { modelo: modeloDoSorteio(o) });
    if (!o || !o.modelo) throw new Error(`deck.capa: informe "modelo" (${Object.keys(MODELOS).join(', ')}) ou omita para sortear. Escolha pelo contexto do caso (references/capas.md).`);
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
