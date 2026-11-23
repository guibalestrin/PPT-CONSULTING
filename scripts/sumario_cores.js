// sumario_cores.js -- sumarios de slide CHEIO na cor fixa escolhida da paleta do projeto de fundo (escuro, claro ou hex livre), fieis as referencias da pasta
// assets/referencias/sumario/:
//   circulos       orizon_p012 : numerais romanos em circulos de contorno fino, escalonados, fio saindo da base de cada circulo
//   pilulas        agrion_p002 : pilulas de contorno fino escalonadas, circulo com numeral a esquerda
//   paralelogramos mabg_p002   : paralelogramos escalonados, numeral e titulo em italico (aceita foto de fundo com veu: imagem)
//   cartoes        vivara_p007 : cartoes retos lado a lado 01/02/03; o da vez cheio, os demais so com contorno
// Cor: `fundo` aceita 'escuro' (padrao: degrade da dominante), 'claro', 'dominante', 'destaque' ou qualquer hex ('1F3A5F'); `fundo2` opcional
// forma o degrade. O texto, os fios e o item apagado se ajustam sozinhos ao contraste do fundo escolhido (>= 4:1). Sem limitacao de cor.
// Regra fixa: o item da vez fica aceso (cor de texto cheia, contorno mais grosso) e os demais ficam na dominante ajustada, sempre legiveis.
// Serve para transicao de secao (itens = secoes do deck) e para pilares da tese (itens proprios; ativo null = todos acesos).
// Sem barra lateral nem moldura (slide de layout 'Capa'); os avisos do qa_deck.py de "sem titulo" e "fora da area util" sao esperados.
module.exports = function ({ pres, COR, F, formas, tom, cfg, py, tmp, temPillow, sil }) {
  const S = pres.shapes, W = 13.333, H = 7.5, fs = require('fs');
  const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  let nGr = 0;

  // ---- cores: paleta calculada por chamada (P) a partir do fundo pedido ----
  const mix = (a, b, t) => { const x = parseInt(a, 16), y = parseInt(b, 16); return [16, 8, 0].map(s => Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t).toString(16).padStart(2, '0')).join('').toUpperCase(); };
  const lum = (hex) => { const [r, g, b] = [0, 2, 4].map(i => { const v = parseInt(hex.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contraste = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex6 = (v) => String(v).replace('#', '').toUpperCase();
  const P = {};   // { a, b (fundo), escuro, fg (texto aceso e fios), apagado, cartaoTxt, numOn }
  const HEX = /^#?[0-9a-fA-F]{6}$/;
  function paleta(o = {}) {
    const pedido = o.fundo !== undefined ? o.fundo : cfg.fundoSumario;
    let a, b;
    if (!pedido || pedido === 'escuro') { a = tom(COR.dom, -0.85); b = tom(COR.dom, -0.3); }
    else if (pedido === 'claro') { a = 'FFFFFF'; b = tom(COR.dom, 0.9); }
    else if (pedido === 'dominante') { a = tom(COR.dom, -0.2); b = COR.dom; }
    else if (pedido === 'destaque') { a = tom(COR.dest, -0.15); b = COR.dest; }
    else if (HEX.test(String(pedido))) { a = hex6(pedido); b = mix(a, lum(a) < 0.4 ? 'FFFFFF' : '000000', 0.18); }
    else throw new Error(`sumario: fundo "${pedido}" invalido. Use 'escuro', 'claro', 'dominante', 'destaque' ou um hex de 6 digitos (ex.: '1F3A5F'); fundo2 opcional para o degrade.`);
    if (o.fundo2) { if (!HEX.test(String(o.fundo2))) throw new Error('sumario: fundo2 deve ser um hex de 6 digitos'); b = hex6(o.fundo2); }
    const escuro = (lum(a) + lum(b)) / 2 < 0.35, fg = escuro ? 'FFFFFF' : tom(COR.texto, -0.55);
    const pior = contraste(fg, a) < contraste(fg, b) ? a : b;   // lado do degrade com menos contraste
    // item apagado: dominante clareada (fundo escuro) ou dominante esmaecida na direcao do fundo (fundo claro), sempre com contraste >= 3 (escuro: 4)
    let apagado = escuro ? tom(COR.dom, 0.5) : mix(COR.dom, pior, 0.45);
    for (let t = 0.05; contraste(apagado, pior) < (escuro ? 4 : 3) && t <= 1; t += 0.05) apagado = escuro ? mix(COR.dom, fg, t) : mix(apagado, fg, 0.1);
    const inverso = escuro ? tom(COR.texto, -0.55) : 'FFFFFF';
    Object.assign(P, { a, b, escuro, fg, apagado, cartaoTxt: inverso, numOn: contraste(COR.dom, fg) >= 3 ? COR.dom : inverso });
    P.accent = contraste(COR.dest, pior) >= 3 ? COR.dest : (contraste(COR.dom, pior) >= 3 ? COR.dom : fg);
  }
  paleta();

  const T = (s, c, o) => s.addText(c, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: P.fg, fontSize: 12 }, o));
  // "*palavra*" vira negrito (2 palavras-chave por frase de apoio, como nas referencias)
  const runsApoio = (t, o) => String(t).split(/(\*[^*]+\*)/).filter(Boolean).map(p => /^\*.*\*$/.test(p)
    ? { text: p.slice(1, -1), options: Object.assign({}, o, { bold: true }) } : { text: p, options: Object.assign({}, o) });

  function fundo(s, o) {
    const foto = o.imagem && fs.existsSync(o.imagem) ? o.imagem : null;
    if (foto) {
      s.addImage({ path: foto, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } });
      s.addShape(S.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: P.a, transparency: 22 }, line: { type: 'none' }, objectName: 'SUM_veu' });
      return;
    }
    const nome = 'GR_sumesc_' + (++nGr);
    formas.degrades[nome] = { ang: 45, stops: [[0, P.a, 100], [100, P.b, 100]] };
    s.addShape(S.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: P.b }, line: { type: 'none' }, objectName: nome });
  }
  function moldura(s, o, op = {}) {
    if (!op.semTitulo) T(s, o.titulo || 'Sumário', { x: 0.6, y: 0.42, w: W - 1.2, h: 0.62, fontSize: 26, bold: true, align: op.esquerda ? 'left' : 'center', color: op.corTitulo || P.fg, objectName: 'SUM_titulo' });
    if (!op.semFios) {
      s.addShape(S.LINE, { x: 0.6, y: 1.14, w: W - 1.2, h: 0, line: { color: P.fg, width: 0.75, transparency: 50 }, objectName: 'SUM_fio_topo' });
      s.addShape(S.LINE, { x: 0.6, y: 6.86, w: 10.3, h: 0, line: { color: P.fg, width: 0.75, transparency: 50 }, objectName: 'SUM_fio_base' });
    }
    const lg = cfg.logos && cfg.logos.apresentador;
    if (lg && fs.existsSync(lg)) s.addImage({ path: lg, x: 11.2, y: 6.62, w: 1.55, h: 0.5, sizing: { type: 'contain', w: 1.55, h: 0.5 }, objectName: 'SUM_logo' });
    else {
      s.addShape(S.RECTANGLE, { x: 11.2, y: 6.62, w: 1.55, h: 0.5, fill: { color: P.fg, transparency: 90 }, line: { color: P.fg, width: 0.75, dashType: 'dash', transparency: 40 }, objectName: 'SUM_logo_ph' });
      T(s, '[LOGO: quem apresenta]', { x: 11.2, y: 6.62, w: 1.55, h: 0.5, fontSize: 7, align: 'center', color: P.apagado });
    }
  }

  // Uma célula inclui todo o contorno. Altura e passo não podem ser independentes.
  function layout(estilo, n) {
    if (NOVOS.includes(estilo)) return layoutNovo(estilo, n);
    if (!Number.isInteger(n) || n < 1 || n > 10) throw new Error('Sumario: use 1 a 10 itens.');
    if (estilo === 'cartoes') {
      if(n>5) throw new Error('cartoes aceita ate cinco itens; escolher modelo compativel antes do primeiro sumario.');
      const gap=.24, w=(11.53-gap*(n-1))/n;
      return Array.from({length:n},(_,i)=>({x:.9+i*(w+gap),y:1.7,w,h:4.8}));
    }
    const cols=n>6?2:1, rows=Math.ceil(n/cols), gapY=.14, gapX=.36;
    const h=Math.min(1.12,(5.02-gapY*(rows-1))/rows), cw=(11.53-gapX*(cols-1))/cols;
    return Array.from({length:n},(_,i)=>{
      const col=Math.floor(i/rows), row=i%rows;
      const shift=cols===1?row*Math.min(.55,2.3/Math.max(1,rows-1)):0;
      return {x:.9+col*(cw+gapX)+shift,y:1.44+row*(h+gapY),w:cw-(cols===1?2.3:0),h};
    });
  }
  function validar(rects) {
    rects.forEach((a,i)=>{
      if(a.x<.59 || a.y<1.3 || a.x+a.w>12.75 || a.y+a.h>6.55)throw new Error('Item de sumario fora da area: '+i);
      rects.slice(i+1).forEach(b=>{
        if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>.001 && Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>.001)throw new Error('Itens de sumario sobrepostos.');
      });
    });
  }
  function linhas(t,pt,w,bold) {
    let n=1, atual='';
    String(t||'').replace(/[*]/g,'').trim().split(' ').filter(Boolean).forEach(p=>{const v=atual?atual+' '+p:p;if(atual && formas.larguraTexto(v,pt,bold)>w){n++;atual=p;}else atual=v;});
    return n;
  }
  function conteudo(s,it,r,cor,card=false) {
    const titleLines=card?Math.min(4,linhas(it.titulo,16,r.w,true)):1;
    if(!card && linhas(it.titulo,16,r.w,true)>1)throw new Error('Reescreva o item do sumario para caber a 16pt: '+it.titulo);
    const ht=card?titleLines*.26:.27, yd=r.y+ht+.045, hd=card?r.h-ht-.06:Math.max(.32,r.h-ht-.055);
    if(it.desc && linhas(it.desc,11.5,r.w,false)>(card?6:2))throw new Error('Reescreva a descricao do sumario a 11.5pt: '+it.desc);
    T(s,it.titulo,{x:r.x,y:r.y,w:r.w,h:ht,fontSize:16,bold:true,color:cor,valign:'top',objectName:'SUM_item_titulo'});
    if(it.desc)T(s,runsApoio(it.desc,{fontSize:11.5,color:cor}),{x:r.x,y:yd,w:r.w,h:hd,fontSize:11.5,color:cor,valign:'top',objectName:'SUM_item_desc'});
  }

  // =====================================================================
  // Estilos "do caso" (referencias de 23/11/2026). Cada um monta o sumario com UM ELEMENTO DO CASO (slot `elemento`):
  //   faixas_logo      (Kepler Weber)     inicial/forma da logo da empresa em contorno + faixas que "saem" da forma   -> `marca` (config ou deck.sumario)
  //   hexagonos_arco   (Rede D'Or)        hexagonos numerados sobre um arco, um por pilar                          -> pilares da tese (itens com desc)
  //   trilha_pergunta  (Wine)             trilha vertical + curva pontilhada ate a pergunta; foto do caso ao fundo  -> `imagem` (foto do caso) e `pergunta`
  //   objeto_marcadores (conceito)       OBJETO DO SETOR (carrinho, garrafa...) gigante a direita e o mesmo objeto como marcador de cada item -> `silhueta` (config ou deck.sumario)
  //   losangos_celular (BTG)              losangos numerados + mockup de celular com a tela do PRODUTO da empresa   -> `mockup` e `valor` em cada item
  // Regras iguais as demais: so o item ativo muda; os outros ficam na cor apagada; fontes fixas (16pt titulo, 11,5pt descricao).
  // =====================================================================
  const NOVOS = ['faixas_logo', 'hexagonos_arco', 'trilha_pergunta', 'losangos_celular', 'objeto_marcadores'];
  const MAXN = { circulos: 10, pilulas: 10, paralelogramos: 10, cartoes: 5, faixas_logo: 8, hexagonos_arco: 6, trilha_pergunta: 10, losangos_celular: 5, objeto_marcadores: 8 };
  const HEX_ARCO = { cx: -1.9, cy: 3.95, R: 3.6 };
  function hexPos(i, n) {
    const h = Math.min(1.3, 4.9 / n), yc = 1.55 + h * (i + 0.5), dx = Math.sqrt(Math.max(0, HEX_ARCO.R ** 2 - (yc - HEX_ARCO.cy) ** 2));
    return { h, yc, xc: HEX_ARCO.cx + dx, d: Math.min(0.95, h - 0.2) };
  }
  function layoutNovo(estilo, n) {
    if (!Number.isInteger(n) || n < 1 || n > MAXN[estilo]) throw new Error(`Sumario ${estilo}: use 1 a ${MAXN[estilo]} itens (modelo compativel com a lista).`);
    const L = (f) => Array.from({ length: n }, (_, i) => f(i));
    if (estilo === 'faixas_logo') { const g = 0.1, h = Math.min(0.62, (4.95 - g * (n - 1)) / n); return L(i => ({ x: 5.4, y: 1.55 + i * (h + g), w: 7.3, h })); }
    if (estilo === 'hexagonos_arco') return L(i => { const p = hexPos(i, n); return { x: p.xc + p.d / 2 + 0.3, y: p.yc - (p.h - 0.1) / 2, w: 12.6 - (p.xc + p.d / 2 + 0.3), h: p.h - 0.1 }; });
    if (estilo === 'trilha_pergunta') { const g = Math.min(0.62, 4.9 / n); return L(i => ({ x: 1.25, y: 1.5 + i * g, w: 4.6, h: Math.min(0.5, g - 0.06) })); }
    if (estilo === 'objeto_marcadores') { const g = Math.min(0.7, 4.95 / n); return L(i => ({ x: 1.55, y: 1.5 + i * g, w: 6.5, h: Math.min(0.55, g - 0.06) })); }
    const g = Math.min(1.6, 4.9 / n);   // losangos_celular
    return L(i => ({ x: 1.95, y: 1.55 + i * g, w: 5.9, h: g - 0.12 }));
  }
  // caminho livre em polegadas do slide (pontos absolutos; caixa = slide inteiro, como em capas.js)
  const P2 = (x, y) => ({ x, y });
  const C2 = (x1, y1, x2, y2, x, y) => ({ x, y, curve: { type: 'cubic', x1, y1, x2, y2 } });
  let nGN = 0;
  function formaL(s, pts, o = {}) {
    const nome = o.grad ? 'GR_sumario_n' + (++nGN) : (o.nome || 'SUM_forma');
    if (o.grad) formas.degrades[nome] = o.grad;
    return s.addShape(S.CUSTOM_GEOMETRY, { x: 0, y: 0, w: W, h: H, objectName: nome, points: pts.concat(o.aberto ? [] : [{ close: true }]),
      fill: o.cor ? { color: o.cor, transparency: o.transp || 0 } : (o.grad ? { color: o.grad.stops[0][1] } : { color: 'FFFFFF', transparency: 100 }),
      line: o.linha ? { color: o.corLinha || P.fg, width: o.linha, dashType: o.tracejado, transparency: o.transpLinha || 0 } : { type: 'none' } });
  }


  // inicial da marca como CONTORNO (PNG so com a borda, gerado com Pillow): vale em qualquer leitor, sem depender de texto sem preenchimento
  const CONTORNO = 'import sys\nfrom PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops\nch, dst, ttf, cor, w, h = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]), float(sys.argv[6])\nR = 150\n' +
    'im = Image.new("L", (int(w * R), int(h * R)), 0); d = ImageDraw.Draw(im); f = ImageFont.truetype(ttf, int(h * R * 0.88))\nb = d.textbbox((0, 0), ch, font=f)\n' +
    'd.text(((im.width - (b[2] - b[0])) / 2 - b[0], (im.height - (b[3] - b[1])) / 2 - b[1]), ch, font=f, fill=255)\nedge = ImageChops.subtract(im, im.filter(ImageFilter.MinFilter(5)))\n' +
    'out = Image.new("RGBA", im.size, "#" + cor); out.putalpha(edge); out.save(dst); print(dst)';
  function letraContorno(s, ch, box) {
    const cands = [cfg.fonteTtfBold, 'C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/segoeuib.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf', '/System/Library/Fonts/Helvetica.ttc'];
    const ttf = cands.find(f => f && fs.existsSync(f));
    if (py && tmp && temPillow && ttf) {
      const dst = require('path').join(tmp(), 'marca_forma_' + ch.charCodeAt(0) + '.png');
      py(CONTORNO, ch, dst, ttf, P.accent, String(box.w), String(box.h));
      s.addImage({ path: dst, x: box.x, y: box.y, w: box.w, h: box.h, objectName: 'SUM_marca_forma' });
    } else {   // sem Pillow/fonte: letra com o preenchimento na cor do fundo e borda na cor de destaque
      s.addText(ch, { x: box.x, y: box.y, w: box.w, h: box.h, fontFace: F, fontSize: 300, bold: true, color: mix(P.a, P.b, 0.5), outline: { size: 1.25, color: P.accent }, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: 'SUM_marca_forma' });
    }
  }

  function faixasLogo(s, itens, ativo, o, rects) {
    moldura(s, o, { esquerda: true, semFios: true, corTitulo: P.accent });
    const n = itens.length, yc = (rects[0].y + rects[n - 1].y + rects[n - 1].h) / 2, xTip = 2.9, incl = 0.5;
    const ini = String(o.marca || cfg.marca || cfg.empresa || '').trim().replace(/[^\p{L}\p{N}]/gu, '').slice(0, 1).toUpperCase();
    // forma da marca: inicial gigante em contorno fino (sem preenchimento); sem nome da marca, duas faixas inclinadas genericas
    const silh = sil && sil.resolver(o.silhueta || cfg.silhueta);   // objeto do setor tem prioridade sobre a inicial
    if (silh) sil.desenhar(s, silh, { x: 0.3, y: 1.3, w: 4.7, h: 5.0 }, { cor: P.accent, linha: 3, preenche: true, transpPreenche: 90, nome: 'SUM_marca_forma' });
    else if (ini) letraContorno(s, ini, { x: -0.2, y: 1.0, w: 5.2, h: 5.6 });
    else { formaL(s, [P2(0.4, 1.7), P2(3.9, 1.7), P2(0.4, 4.6)], { cor: P.accent, transp: 55, linha: 1, corLinha: P.accent }); formaL(s, [P2(0.4, 5.0), P2(2.2, 3.7), P2(3.3, 6.5), P2(0.4, 6.5)], { linha: 1, corLinha: P.accent }); }
    itens.forEach((it, i) => {
      const r = rects[i], on = ativo == null || ativo === i, ex = (y) => xTip + incl * Math.abs(y - yc), cor = on ? P.fg : P.apagado;
      if (on) formaL(s, [P2(ex(r.y), r.y), P2(12.7, r.y), P2(12.7, r.y + r.h), P2(ex(r.y + r.h), r.y + r.h)], { grad: { ang: 0, stops: [[22, P.accent, 100], [70, P.accent, 25], [95, P.accent, 0]] } });
      else formaL(s, [P2(ex(r.y), r.y), P2(r.x, r.y), P2(r.x, r.y + r.h), P2(ex(r.y + r.h), r.y + r.h)], { linha: 0.75, corLinha: P.accent, transpLinha: 35 });
      s.addShape(S.ROUNDED_RECTANGLE, { x: r.x, y: r.y, w: r.w, h: r.h, rectRadius: 0.04, fill: { type: 'none' }, line: { color: P.accent, width: on ? 1.25 : 0.75 }, objectName: 'SUM_faixa' + i });
      const t = `${ROM[i]}. ${it.titulo}`;
      if (linhas(t, 16, r.w - 0.5, on) > 1) throw new Error('Reescreva o item do sumario para caber a 16pt: ' + it.titulo);
      T(s, t, { x: r.x + 0.3, y: r.y, w: r.w - 0.5, h: r.h, fontSize: 16, bold: on, color: cor, objectName: 'SUM_item_titulo' });
    });
  }

  function hexagonosArco(s, itens, ativo, o, rects) {
    moldura(s, o, { esquerda: true, semFios: true, semTitulo: !o.titulo });
    const n = itens.length, { cx, cy, R } = HEX_ARCO, y0 = cy - 3.06, pts = [];
    for (let k = 0; k <= 48; k++) { const y = y0 + (2 * 3.06) * k / 48; pts.push(P2(cx + Math.sqrt(Math.max(0, R * R - (y - cy) ** 2)), y)); }
    formaL(s, pts, { aberto: true, linha: 1.25, corLinha: P.accent, nome: 'SUM_arco' });
    itens.forEach((it, i) => {
      const p = hexPos(i, n), on = ativo == null || ativo === i, cor = on ? P.fg : P.apagado;
      s.addShape(S.HEXAGON, { x: p.xc - p.d / 2, y: p.yc - p.d * 0.45, w: p.d, h: p.d * 0.9, fill: on ? { color: P.accent } : { type: 'none' }, line: { color: on ? P.fg : P.apagado, width: on ? 1.5 : 1 }, objectName: 'SUM_hexagono' + i });
      T(s, ROM[i], { x: p.xc - p.d / 2, y: p.yc - p.d * 0.45, w: p.d, h: p.d * 0.9, fontSize: 20, bold: on, color: on ? (contraste(P.accent, P.fg) >= 3 ? P.fg : P.a) : cor, align: 'center', objectName: 'SUM_numero' });
      conteudo(s, it, rects[i], cor);
    });
  }

  function trilhaPergunta(s, itens, ativo, o, rects) {
    moldura(s, o, { semTitulo: true, semFios: true });
    const n = itens.length, a = ativo == null ? 0 : ativo, escuro = tom(COR.dom, -0.45);
    formaL(s, [P2(0, 0), P2(4.4, 0), C2(3.7, 1.8, 3.2, 3.8, 2.4, H), P2(0, H)], { cor: escuro, transp: 22, nome: 'SUM_painel_marca' });
    const y1 = rects[0].y + rects[0].h / 2, y2 = rects[n - 1].y + rects[n - 1].h / 2;
    s.addShape(S.LINE, { x: 0.8, y: y1 - 0.2, w: 0, h: y2 - y1 + 0.55, line: { color: P.apagado, width: 1, dashType: 'sysDot' }, objectName: 'SUM_trilha_fio' });
    s.addShape(S.ISOSCELES_TRIANGLE, { x: 0.73, y: y2 + 0.42, w: 0.14, h: 0.1, flipV: true, fill: { color: P.apagado }, line: { type: 'none' }, objectName: 'SUM_trilha_seta' });
    itens.forEach((it, i) => {
      const r = rects[i], on = i === a, cor = on ? P.fg : P.apagado, yc = r.y + r.h / 2;
      s.addShape(S.RECTANGLE, { x: r.x, y: r.y, w: r.w, h: r.h, fill: { type: 'none' }, line: { type: 'none' }, objectName: 'SUM_trilha' + i });
      if (on) { s.addShape(S.DIAMOND, { x: 0.58, y: yc - 0.19, w: 0.44, h: 0.38, fill: { color: P.fg }, line: { type: 'none' }, objectName: 'SUM_trilha_marca' });
        T(s, String(i + 1), { x: 0.58, y: yc - 0.19, w: 0.44, h: 0.38, fontSize: 11, bold: true, color: P.a, align: 'center', objectName: 'SUM_numero' }); }
      if (linhas(it.titulo, 16, r.w, on) > 1) throw new Error('Reescreva o item do sumario para caber a 16pt: ' + it.titulo);
      T(s, it.titulo, { x: r.x, y: r.y, w: r.w, h: r.h, fontSize: 16, bold: on, color: cor, objectName: 'SUM_item_titulo' });
    });
    const perg = o.pergunta || (itens[a] && itens[a].pergunta) || '';
    if (perg) {   // curva pontilhada ate a ponta da lente; a pergunta que o proximo bloco responde
      const ra = rects[a], xa = ra.x + Math.min(ra.w, larguraTexto(itens[a].titulo, 16, true) + 0.2), ya = ra.y + ra.h / 2, xb = 6.9, yb = 3.9;
      formaL(s, [P2(xa, ya), C2(xa + 1.5, ya - 0.15, xb - 1.1, yb - 1.2, xb, yb)], { aberto: true, linha: 1.5, corLinha: P.fg, tracejado: 'sysDot', nome: 'SUM_conector' });
      [[xa, ya], [xb, yb]].forEach(([x, y], k) => s.addShape(S.OVAL, { x: x - 0.07, y: y - 0.07, w: 0.14, h: 0.14, fill: { color: P.fg }, line: { type: 'none' }, objectName: 'SUM_ponto' + k }));
      formaL(s, [P2(xb, yb), C2(8.2, 2.3, 11.2, 2.2, W + 0.05, 2.8), P2(W + 0.05, 5.0), C2(11.2, 5.6, 8.2, 5.5, xb, yb)].map(p => p.x > W ? Object.assign({}, p, { x: W }) : p), { cor: escuro, transp: 12, linha: 1.5, corLinha: tom(COR.dom, 0.1), nome: 'SUM_lente' });
      T(s, perg, { x: 8.3, y: 3.05, w: 4.4, h: 1.7, fontSize: 20, bold: true, align: 'center', objectName: 'SUM_pergunta' });
    }
  }

  function losangosCelular(s, itens, ativo, o, rects) {
    moldura(s, o, { esquerda: true, semFios: true });
    const n = itens.length, m = Object.assign({ titulo: 'Investimentos', conta: '', rotuloValor: 'Posição' }, o.mockup);
    itens.forEach((it, i) => {
      const r = rects[i], on = ativo == null || ativo === i, cor = on ? P.fg : P.apagado, d = 0.95, yc = r.y + Math.min(0.6, r.h / 2);
      s.addShape(S.DIAMOND, { x: 0.65, y: yc - d / 2, w: d, h: d, fill: on ? { type: 'none' } : { color: P.apagado, transparency: 70 }, line: on ? { color: P.fg, width: 2 } : { type: 'none' }, objectName: 'SUM_losango' + i });
      T(s, ROM[i], { x: 0.65, y: yc - d / 2, w: d, h: d, fontSize: 20, bold: on, color: cor, align: 'center', objectName: 'SUM_numero' });
      conteudo(s, it, { x: r.x, y: yc - 0.45, w: r.w, h: Math.max(0.8, r.h) }, cor);
    });
    // mockup do celular: a tela do PRODUTO/app da empresa, com os pilares como linhas (valor opcional em cada item)
    const x = 8.9, y = 1.3, w = 3.6, h = 5.3;
    s.addShape(S.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.42, fill: { color: '0B0B0B' }, line: { type: 'none' }, objectName: 'SUM_mock_corpo' });
    s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.14, y: y + 0.14, w: w - 0.28, h: h - 0.28, rectRadius: 0.32, fill: { color: tom(COR.dom, -0.05) }, line: { type: 'none' }, objectName: 'SUM_mock_tela' });
    s.addShape(S.ROUNDED_RECTANGLE, { x: x + 1.15, y: y + 0.14, w: 1.3, h: 0.28, rectRadius: 0.12, fill: { color: '0B0B0B' }, line: { type: 'none' }, objectName: 'SUM_mock_notch' });
    const sx = x + 0.34, sw = w - 0.68, lg = cfg.logos && cfg.logos.analisada;
    if (lg && fs.existsSync(lg)) s.addImage({ path: lg, x: sx + sw - 0.9, y: y + 0.6, w: 0.9, h: 0.4, sizing: { type: 'contain', w: 0.9, h: 0.4 }, objectName: 'SUM_mock_logo' });
    else T(s, '[LOGO: empresa]', { x: sx + sw - 1.1, y: y + 0.6, w: 1.1, h: 0.4, fontSize: 7, color: 'FFFFFF', align: 'right', objectName: 'SUM_mock_logo_ph' });
    T(s, m.conta || '[DADO: nome da conta/produto]', { x: sx, y: y + 0.6, w: sw - 1.2, h: 0.4, fontSize: 8, color: 'FFFFFF', objectName: 'SUM_mock_conta' });
    T(s, m.titulo, { x: sx, y: y + 1.2, w: sw, h: 0.25, fontSize: 8, color: 'FFFFFF', objectName: 'SUM_mock_cab' });
    s.addShape(S.RECTANGLE, { x: x + 0.14, y: y + 1.75, w: w - 0.28, h: h - 1.75 - 0.14, fill: { color: 'FFFFFF' }, line: { type: 'none' }, objectName: 'SUM_mock_folha' });
    T(s, m.rotuloValor, { x: sx, y: y + 1.85, w: sw, h: 0.22, fontSize: 7, color: '7F7F7F', align: 'right', objectName: 'SUM_mock_rot' });
    itens.forEach((it, i) => {
      const yy = y + 2.15 + i * 0.5, on = ativo == null || ativo === i;
      T(s, `${ROM[i].toLowerCase()}. ${it.titulo}`, { x: sx, y: yy, w: sw - 0.9, h: 0.3, fontSize: 8, bold: on, color: '333333', objectName: 'SUM_mock_linha' });
      T(s, it.valor || '', { x: sx + sw - 0.9, y: yy, w: 0.9, h: 0.3, fontSize: 8, bold: on, color: '333333', align: 'right', objectName: 'SUM_mock_valor' });
      s.addShape(S.LINE, { x: sx, y: yy + 0.34, w: sw, h: 0, line: { color: on ? COR.dom : 'BFBFBF', width: on ? 1.75 : 1 }, objectName: 'SUM_mock_fio' });
    });
  }
  function objetoMarcadores(s, itens, ativo, o, rects) {
    moldura(s, o, { esquerda: true, semFios: true, corTitulo: P.accent });
    const silh = sil && sil.resolver(o.silhueta || cfg.silhueta);
    if (!silh) throw new Error('objeto_marcadores: informe "silhueta" (config ou deck.sumario): carrinho, sacola, caixa, garrafa... ou o setor');
    sil.desenhar(s, silh, { x: 8.3, y: 1.35, w: 4.6, h: 5.0 }, { cor: P.accent, linha: 3, preenche: true, transpPreenche: 92, transpLinha: 25, nome: 'SUM_objeto_grande' });
    itens.forEach((it, i) => {
      const r = rects[i], on = ativo == null || ativo === i, cor = on ? P.fg : P.apagado, d = Math.min(0.5, r.h);
      s.addShape(S.RECTANGLE, { x: 0.75, y: r.y + (r.h - d) / 2, w: d, h: d, fill: { type: 'none' }, line: { type: 'none' }, objectName: 'SUM_marcador' + i });
      sil.desenhar(s, silh, { x: 0.75, y: r.y + (r.h - d) / 2, w: d, h: d }, { cor: on ? P.accent : P.apagado, linha: on ? 1.75 : 1, preenche: on, transpPreenche: 0, nome: 'SUM_marcador_obj' });
      const t = `${ROM[i]}. ${it.titulo}`;
      if (linhas(t, 16, r.w, on) > 1) throw new Error('Reescreva o item do sumario para caber a 16pt: ' + it.titulo);
      T(s, t, { x: r.x, y: r.y, w: r.w, h: r.h, fontSize: 16, bold: on, color: cor, objectName: 'SUM_item_titulo' });
    });
  }
  const larguraTexto = (t, pt, b) => formas.larguraTexto(String(t), pt, b);
  const DESENHO = { faixas_logo: faixasLogo, hexagonos_arco: hexagonosArco, trilha_pergunta: trilhaPergunta, losangos_celular: losangosCelular, objeto_marcadores: objetoMarcadores };

  let identidadeFixa=null;
  function desenhar(s, estilo, itens, ativo, o={}) {
    if(!['circulos','pilulas','paralelogramos','cartoes',...NOVOS].includes(estilo))throw new Error('Modelo de sumario desconhecido: '+estilo);
    const assinatura=JSON.stringify([estilo,o.fundo||cfg.fundoSumario||'escuro',o.fundo2||null,o.imagem||null]);
    if(identidadeFixa && identidadeFixa!==assinatura)throw new Error('Modelo e fundo do sumario devem ser os mesmos em toda a apresentacao.');
    identidadeFixa=assinatura;
    const rects=layout(estilo,itens.length);validar(rects);
    if(NOVOS.includes(estilo)){paleta(o);fundo(s,o);DESENHO[estilo](s,itens,ativo,o,rects);return;}
    paleta(o);fundo(s,o);moldura(s,o);
    itens.forEach((it,i)=>{
      const r=rects[i],on=ativo==null||ativo===i,cor=on?P.fg:P.apagado;
      if(estilo==='cartoes') {
        s.addShape(S.RECTANGLE,{...r,fill:{color:P.fg,transparency:on?0:94},line:{color:cor,width:on?2:1},objectName:'SUM_cartao'+i});
        const txt=on?P.cartaoTxt:cor;
        T(s,String(i+1).padStart(2,'0'),{x:r.x+.18,y:r.y+.15,w:r.w-.36,h:.45,fontSize:20,bold:true,color:txt});
        conteudo(s,it,{x:r.x+.18,y:r.y+.85,w:r.w-.36,h:r.h-1.03},txt,true);
        return;
      }
      const d=Math.min(.66,r.h-.08),cy=r.y+(r.h-d)/2;
      if(estilo==='circulos') {
        s.addShape(S.OVAL,{x:r.x,y:cy,w:d,h:d,fill:{type:'none'},line:{color:cor,width:on?2:1},objectName:'SUM_circulo'+i});
      } else {
        s.addShape(estilo==='pilulas'?S.ROUNDED_RECTANGLE:S.PARALLELOGRAM,{...r,rectRadius:estilo==='pilulas'?.12:undefined,fill:{color:P.fg,transparency:on?89:100},line:{color:cor,width:on?2:1},objectName:(estilo==='pilulas'?'SUM_pilula':'SUM_paralelogramo')+i});
      }
      T(s,ROM[i],{x:r.x+.08,y:cy,w:d-.04,h:d,fontSize:20,bold:on,color:cor,align:'center',objectName:'SUM_numero'});
      conteudo(s,it,{x:r.x+d+.22,y:r.y+.065,w:r.w-d-.42,h:r.h-.13},cor);
    });
  }
  return {desenhar,layout,validar,MAXN,ESTILOS:['circulos','pilulas','paralelogramos','cartoes',...NOVOS]};
};
