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
  // Moldura (titulo "Sumário", fios e logo) e OPCIONAL: so desenha com { moldura: true }. Nao e regra; era detalhe de uma referencia.
  function moldura(s, o) {
    if (!o.moldura) return;
    T(s, o.titulo || 'Sumário', { x: 0.6, y: 0.42, w: W - 1.2, h: 0.62, fontSize: 26, bold: true, align: 'center', objectName: 'SUM_titulo' });
    s.addShape(S.LINE, { x: 0.6, y: 1.14, w: W - 1.2, h: 0, line: { color: P.fg, width: 0.75, transparency: 50 }, objectName: 'SUM_fio_topo' });
    s.addShape(S.LINE, { x: 0.6, y: 6.86, w: 10.3, h: 0, line: { color: P.fg, width: 0.75, transparency: 50 }, objectName: 'SUM_fio_base' });
    const lg = cfg.logos && cfg.logos.apresentador;
    if (lg && fs.existsSync(lg)) s.addImage({ path: lg, x: 11.2, y: 6.62, w: 1.55, h: 0.5, sizing: { type: 'contain', w: 1.55, h: 0.5 }, objectName: 'SUM_logo' });
    else {
      s.addShape(S.RECTANGLE, { x: 11.2, y: 6.62, w: 1.55, h: 0.5, fill: { color: P.fg, transparency: 90 }, line: { color: P.fg, width: 0.75, dashType: 'dash', transparency: 40 }, objectName: 'SUM_logo_ph' });
      T(s, '[LOGO: quem apresenta]', { x: 11.2, y: 6.62, w: 1.55, h: 0.5, fontSize: 7, align: 'center', color: P.apagado });
    }
  }

  // Uma célula inclui todo o contorno. Altura e passo não podem ser independentes.
  function layout(estilo, n) {
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
  let identidadeFixa=null;
  function desenhar(s, estilo, itens, ativo, o={}) {
    if(!['circulos','pilulas','paralelogramos','cartoes'].includes(estilo))throw new Error('Modelo de sumario desconhecido: '+estilo);
    const assinatura=JSON.stringify([estilo,o.fundo||cfg.fundoSumario||'escuro',o.fundo2||null,o.imagem||null]);
    if(identidadeFixa && identidadeFixa!==assinatura)throw new Error('Modelo e fundo do sumario devem ser os mesmos em toda a apresentacao.');
    identidadeFixa=assinatura;
    const rects=layout(estilo,itens.length);validar(rects);
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
  return {desenhar,layout,validar,ESTILOS:['circulos','pilulas','paralelogramos','cartoes']};
};
