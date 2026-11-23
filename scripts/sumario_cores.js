// sumario_cores.js -- sumarios de slide CHEIO na cor fixa escolhida da paleta do projeto de fundo (escuro, claro ou hex livre), fieis as referencias da pasta
// assets/referencias/sumario/:
//   circulos       orizon_p012 : numerais romanos em circulos de contorno fino, escalonados, fio saindo da base de cada circulo
//   pilulas        agrion_p002 : pilulas de contorno fino escalonadas, circulo com numeral a esquerda
//   paralelogramos mabg_p002   : paralelogramos escalonados, numeral e titulo em italico
// Foto (imagem) entra pela composicao: fotoEsquerda | fotoDireita | fotoFundo | cheio; titulo, fios e logo sao opcionais (moldura).
//   cartoes        vivara_p007 : cartoes retos lado a lado 01/02/03; o da vez cheio, os demais so com contorno
// Cor: `fundo` aceita 'escuro' (padrao: degrade da dominante), 'claro', 'dominante', 'destaque' ou qualquer hex ('1F3A5F'); `fundo2` opcional
// forma o degrade. O texto, os fios e o item apagado se ajustam sozinhos ao contraste do fundo escolhido (>= 4:1). Sem limitacao de cor.
// Regra fixa: o item da vez fica aceso (cor de texto cheia, contorno mais grosso) e os demais ficam na dominante ajustada, sempre legiveis.
// Serve para transicao de secao (itens = secoes do deck) e para pilares da tese (itens proprios; ativo null = todos acesos).
// Sem barra lateral nem moldura (slide de layout 'Capa'); os avisos do qa_deck.py de "sem titulo" e "fora da area util" sao esperados.
module.exports = function ({ pres, COR, F, formas, tom, cfg }) {
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
  }
  paleta();

  const T = (s, c, o) => s.addText(c, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: P.fg, fontSize: 12 }, o));
  // "*palavra*" vira negrito (2 palavras-chave por frase de apoio, como nas referencias)
  const runsApoio = (t, o) => String(t).split(/(\*[^*]+\*)/).filter(Boolean).map(p => /^\*.*\*$/.test(p)
    ? { text: p.slice(1, -1), options: Object.assign({}, o, { bold: true }) } : { text: p, options: Object.assign({}, o) });

  // ---- composicao (feedback 23/11/2026): a foto NAO precisa ficar a direita. Sorteada uma vez por deck entre
  // fotoEsquerda (imagem a esquerda, itens em arco a direita: kepl3_p010, ex_sumario), fotoDireita (itens a esquerda),
  // fotoFundo (foto em tela cheia com veu em degrade: mabg_p002) e cheio (sem foto: agrion_p002). A foto nunca termina
  // em corte seco: um degrade com transparencia a dissolve no fundo, e o fundo do lado da foto tem a mesma cor do degrade.
  // fotoDireitaFio (APROVADO 23/11/2026, deck Audemars Piguet com circulos: "tava perfeito"): foto recortada na direita a partir de
  // x 8,55, fio fino vertical na cor dominante, logo da empresa numa faixa escura no pe da foto. Ver assets/referencias/sumario/aprovado_ap_circulos_foto.jpg.
  // Com pilulas a mesma montagem foi REPROVADA (Bluefit): por isso o sorteio so a combina com circulos.
  const COMPOSICOES = ['fotoEsquerda', 'fotoDireita', 'fotoDireitaFio', 'fotoFundo', 'cheio'];
  const XF_D = 7.75, XF_E = 5.55, FADE = 2.4;
  function geo(o) {
    const comp = o.foto ? o.composicao : 'cheio', m = o.moldura;
    const topo = m.titulo === 'nenhum' ? 0.75 : 1.44, base = m.logo || m.fios ? 6.5 : 6.9;
    if (comp === 'fotoDireita') return { comp, x0: 0.9, x1: XF_D - 0.45, topo, base };
    if (comp === 'fotoDireitaFio') return { comp, x0: 0.9, x1: 8.55 - 0.45, topo, base };
    if (comp === 'fotoEsquerda') return { comp, x0: XF_E + 0.25, x1: W - 0.7, topo, base };
    return { comp, x0: 0.9, x1: W - 0.9, topo, base };
  }
  function grad(s, r, ang, stops, nomeBase) {
    const nome = 'GR_' + nomeBase + '_' + (++nGr);
    formas.degrades[nome] = { ang, stops };
    s.addShape(S.RECTANGLE, Object.assign({}, r, { fill: { color: stops[0][1] }, line: { type: 'none' }, objectName: nome }));
  }
  function fundo(s, o, g) {
    if (g.comp === 'cheio') { grad(s, { x: 0, y: 0, w: W, h: H }, 45, [[0, P.a, 100], [100, P.b, 100]], 'sumesc'); return; }
    if (g.comp === 'fotoDireitaFio') {   // montagem aprovada (AP): recorte limpo com fio, sem degrade
      const XL = 8.55;
      grad(s, { x: 0, y: 0, w: W, h: H }, 45, [[0, P.a, 100], [100, P.b, 100]], 'sumesc');
      s.addImage({ path: o.foto, x: XL, y: 0, w: W - XL, h: H, sizing: { type: 'cover', w: W - XL, h: H }, objectName: 'SUM_foto' });
      s.addShape(S.RECTANGLE, { x: XL - 0.06, y: 0, w: 0.06, h: H, fill: { color: o.corFio || COR.dom }, line: { type: 'none' }, objectName: 'SUM_fio_lateral' });
      if (o.logoEmpresa && fs.existsSync(o.logoEmpresa)) {
        s.addShape(S.RECTANGLE, { x: XL, y: H - 1.25, w: W - XL, h: 1.25, fill: { color: '000000', transparency: 12 }, line: { type: 'none' }, objectName: 'SUM_faixa_logo' });
        const b = fs.readFileSync(o.logoEmpresa), ar = b.readUInt32BE(16) / b.readUInt32BE(20), lw = Math.min(W - XL - 0.9, 0.8 * ar), lh = lw / ar;
        s.addImage({ path: o.logoEmpresa, x: XL + (W - XL - lw) / 2, y: H - 0.625 - lh / 2, w: lw, h: lh, objectName: 'SUM_logo_empresa' });
      }
      return;
    }
    if (g.comp === 'fotoFundo') {
      s.addImage({ path: o.foto, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H }, objectName: 'SUM_foto' });
      grad(s, { x: 0, y: 0, w: W, h: H }, 0, [[0, P.a, 94], [55, P.a, 82], [100, P.a, 45]], 'sumveu');   // denso onde esta o texto
      return;
    }
    const dir = g.comp === 'fotoDireita', xf = dir ? XF_D : 0, wf = dir ? W - XF_D : XF_E;
    // fundo em degrade horizontal que termina na cor do lado da foto (P.a): o degrade da foto cai na mesma cor, sem emenda
    // o degrade do fundo vai de P.b (borda oposta) ate P.a exatamente na borda da foto; sob a foto, P.a solido
    s.addShape(S.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: P.a }, line: { type: 'none' }, objectName: 'SUM_base' });
    grad(s, dir ? { x: 0, y: 0, w: xf, h: H } : { x: wf, y: 0, w: W - wf, h: H }, 0, dir ? [[0, P.b, 100], [100, P.a, 100]] : [[0, P.a, 100], [100, P.b, 100]], 'sumesc');
    s.addImage({ path: o.foto, x: xf, y: 0, w: wf, h: H, sizing: { type: 'cover', w: wf, h: H }, objectName: 'SUM_foto' });
    s.addShape(S.RECTANGLE, { x: xf, y: 0, w: wf, h: H, fill: { color: P.a, transparency: 70 }, line: { type: 'none' }, objectName: 'SUM_tinta' });
    grad(s, { x: dir ? xf : xf + wf - FADE, y: 0, w: FADE, h: H }, 0, dir ? [[0, P.a, 100], [100, P.a, 0]] : [[0, P.a, 0], [100, P.a, 100]], 'sumfade');
    if (o.logoEmpresa && fs.existsSync(o.logoEmpresa)) {   // logo da empresa sobre a foto, numa sombra em degrade (sem faixa recortada)
      grad(s, { x: xf, y: H - 2.2, w: wf, h: 2.2 }, 90, [[0, P.a, 0], [100, P.a, 92]], 'sumbase');
      const b = fs.readFileSync(o.logoEmpresa), ar = b.readUInt32BE(16) / b.readUInt32BE(20);
      const lw = Math.min(wf - FADE - 0.6, 0.75 * ar, 3.2), lh = lw / ar, cx = dir ? xf + FADE / 2 + (wf - FADE / 2) / 2 : (wf - FADE / 2) / 2;
      s.addImage({ path: o.logoEmpresa, x: cx - lw / 2, y: H - 0.55 - lh, w: lw, h: lh, objectName: 'SUM_logo_empresa' });
    }
  }
  // moldura opcional (feedback 23/11/2026): titulo, fios e logo NAO sao obrigatorios. o.moldura = { titulo: 'esquerda'|'centro'|
  // 'direita'|'nenhum', texto, fios: bool, logo: bool }, sorteado uma vez por deck (sorteio.js) e mantido em todos os sumarios.
  function moldura(s, o, g) {
    const m = o.moldura;
    if (m.titulo !== 'nenhum') T(s, m.texto || o.titulo || 'Sumário', { x: g.x0, y: 0.42, w: g.x1 - g.x0, h: 0.62, fontSize: 26, bold: true, align: { esquerda: 'left', centro: 'center', direita: 'right' }[m.titulo], objectName: 'SUM_titulo' });
    if (m.fios && m.titulo !== 'nenhum') s.addShape(S.LINE, { x: g.x0 - 0.3, y: 1.14, w: g.x1 - g.x0 + 0.3, h: 0, line: { color: P.fg, width: 0.75, transparency: 50 }, objectName: 'SUM_fio_topo' });
    const lgx = g.x1 - 1.55;
    if (m.fios) s.addShape(S.LINE, { x: g.x0 - 0.3, y: 6.86, w: (m.logo ? lgx - 0.3 : g.x1) - g.x0 + 0.3, h: 0, line: { color: P.fg, width: 0.75, transparency: 50 }, objectName: 'SUM_fio_base' });
    if (!m.logo) return;
    const lg = cfg.logos && cfg.logos.apresentador;
    if (lg && fs.existsSync(lg)) s.addImage({ path: lg, x: lgx, y: 6.62, w: 1.55, h: 0.5, sizing: { type: 'contain', w: 1.55, h: 0.5 }, objectName: 'SUM_logo' });
    else {
      s.addShape(S.RECTANGLE, { x: lgx, y: 6.62, w: 1.55, h: 0.5, fill: { color: P.fg, transparency: 90 }, line: { color: P.fg, width: 0.75, dashType: 'dash', transparency: 40 }, objectName: 'SUM_logo_ph' });
      T(s, '[LOGO: quem apresenta]', { x: lgx, y: 6.62, w: 1.55, h: 0.5, fontSize: 7, align: 'center', color: P.apagado });
    }
  }

  // Uma célula inclui todo o contorno. Altura e passo não podem ser independentes. Os itens ocupam a altura livre (centralizados);
  // escalonamento: diagonal (fotoDireita, cheio, fotoFundo) ou em arco convexo, afastando-se da foto (fotoEsquerda, como kepl3_p010).
  function layout(estilo, n, g) {
    g = g || { comp: 'cheio', x0: 0.9, x1: 12.43, topo: 1.44, base: 6.46 };
    if (!Number.isInteger(n) || n < 1 || n > 10) throw new Error('Sumario: use 1 a 10 itens.');
    const LU = g.x1 - g.x0, AH = g.base - g.topo;
    if (estilo === 'cartoes') {
      if(n>5) throw new Error('cartoes aceita ate cinco itens; escolher modelo compativel antes do primeiro sumario.');
      const gap=.24, w=(LU-gap*(n-1))/n;
      return Array.from({length:n},(_,i)=>({x:g.x0+i*(w+gap),y:g.topo+.26,w,h:AH-.3}));
    }
    const cols=n>6?2:1, rows=Math.ceil(n/cols), gapY=rows<=3?.3:.16, gapX=.36;
    const h=Math.min(1.2,(AH-gapY*(rows-1))/rows), cw=(LU-gapX*(cols-1))/cols, desl=(AH-(rows*h+gapY*(rows-1)))/2;
    const recuo=Math.min(2.3,LU*.2), arco=g.comp==='fotoEsquerda';
    return Array.from({length:n},(_,i)=>{
      const col=Math.floor(i/rows), row=i%rows, t=rows>1?row/(rows-1):0;
      const shift=cols>1?0:arco?recuo*Math.sin(Math.PI*t):row*Math.min(.55,recuo/Math.max(1,rows-1));
      return {x:g.x0+col*(cw+gapX)+shift,y:g.topo+desl+row*(h+gapY),w:cw-(cols===1?recuo:0),h};
    });
  }
  function validar(rects) {
    rects.forEach((a,i)=>{
      if(a.x<.59 || a.y<.7 || a.x+a.w>12.75 || a.y+a.h>6.95)throw new Error('Item de sumario fora da area: '+i);
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
  let identidadeFixa=null;
  function desenhar(s, estilo, itens, ativo, o={}) {
    if(!['circulos','pilulas','paralelogramos','cartoes'].includes(estilo))throw new Error('Modelo de sumario desconhecido: '+estilo);
    o=Object.assign({},o,{foto:(o.imagem&&fs.existsSync(o.imagem))?o.imagem:null,composicao:o.composicao||'cheio',moldura:Object.assign({titulo:'centro',fios:true,logo:true},o.moldura||{})});
    if(!COMPOSICOES.includes(o.composicao))throw new Error('composicao de sumario desconhecida: '+o.composicao+'. Use: '+COMPOSICOES.join(', '));
    if(!['esquerda','centro','direita','nenhum'].includes(o.moldura.titulo))throw new Error('moldura.titulo do sumario: esquerda, centro, direita ou nenhum');
    const assinatura=JSON.stringify([estilo,o.fundo||cfg.fundoSumario||'escuro',o.fundo2||null,o.foto,o.composicao,o.moldura,o.logoEmpresa||null]);
    if(identidadeFixa && identidadeFixa!==assinatura)throw new Error('Modelo, fundo, foto, composicao e moldura do sumario devem ser os mesmos em toda a apresentacao.');
    identidadeFixa=assinatura;
    const g=geo(o), rects=layout(estilo,itens.length,g);validar(rects);
    paleta(o);fundo(s,o,g);moldura(s,o,g);
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
  return {desenhar,layout,validar,geo,COMPOSICOES,ESTILOS:['circulos','pilulas','paralelogramos','cartoes']};
};
