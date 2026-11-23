// silhuetas.js -- objetos do SETOR da empresa analisada, desenhados com formas nativas (sem imagem, sem internet, sem react-icons).
// Servem de "elemento da marca" nas capas (objeto_marca, padrao de fita_padrao) e nos sumarios (faixas_logo, objeto_marcadores):
// supermercado = carrinho, luxo = caixa de presente, vinho = garrafa etc. Sao objetos GENERICOS do setor: nunca a logo nem o produto
// registrado de uma marca. Quando a empresa tem um objeto proprio (embalagem, produto), use o PNG recortado dela no lugar.
//   const SIL = require('./silhuetas.js')(pres);
//   SIL.desenhar(s, 'carrinho', { x, y, w, h }, { cor: 'FFFFFF', linha: 2.5, preenche: true, transpPreenche: 85, nome: 'CAPA_obj' });
//   SIL.padrao(s, 'carrinho', { x: 0, y: 0, w: 13.333, h: 7.5 }, { cor: 'FFFFFF', transpLinha: 80, tam: 0.9 });
// Cada objeto e uma lista de tracos numa grade 100 x 100: ponto [x, y] = reta; [x1, y1, x2, y2, x, y] = curva cubica; `fecha` fecha o traco;
// `cheio` deixa o traco receber preenchimento translucido.
module.exports = function (pres) {
  const S = pres.shapes, W = 13.333, H = 7.5;
  const circ = (cx, cy, r, n = 20) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)]);
  const t = (pts, o = {}) => Object.assign({ pts }, o);
  const OBJ = {};

  // ---- varejo e consumo ----
  OBJ.carrinho = [
    t([[3, 10], [15, 10], [29, 62], [87, 62]]),
    t([[19, 24], [96, 24], [86, 52], [27, 52]], { fecha: true, cheio: true }),
    t([[40, 24], [42, 52]]), t([[62, 24], [62, 52]]), t([[22, 38], [91, 38]]),
    t(circ(37, 80, 6.5), { fecha: true }), t(circ(79, 80, 6.5), { fecha: true })];
  OBJ.sacola = [
    t([[18, 34], [82, 34], [90, 94], [10, 94]], { fecha: true, cheio: true }),
    t([[34, 34], [34, 8, 66, 8, 66, 34]]), t([[18, 48], [82, 48]])];
  OBJ.caixa = [   // embalagem com laco (a "capa como embalagem" da referencia Hermes)
    t([[12, 40], [88, 40], [88, 92], [12, 92]], { fecha: true, cheio: true }),
    t([[8, 28], [92, 28], [92, 40], [8, 40]], { fecha: true, cheio: true }),
    t([[44, 28], [44, 92]]), t([[56, 28], [56, 92]]),
    t([[50, 28], [40, 6, 16, 8, 26, 24], [32, 32, 44, 30, 50, 28]], { fecha: true }),
    t([[50, 28], [60, 6, 84, 8, 74, 24], [68, 32, 56, 30, 50, 28]], { fecha: true })];
  OBJ.garrafa = [
    t([[42, 4], [58, 4], [58, 28], [58, 40, 72, 44, 72, 62], [72, 94], [28, 94], [28, 62], [28, 44, 42, 40, 42, 28]], { fecha: true, cheio: true }),
    t([[28, 62], [72, 62], [72, 84], [28, 84]], { fecha: true }), t([[42, 12], [58, 12]])];
  OBJ.cartao = [
    t([[6, 24], [94, 24], [94, 78], [6, 78]], { fecha: true, cheio: true }), t([[6, 38], [94, 38]]),
    t([[14, 56], [34, 56], [34, 68], [14, 68]], { fecha: true }), t([[60, 66], [86, 66]])];
  // ---- espaco fisico ----
  OBJ.predio = [
    t([[24, 10], [76, 10], [76, 94], [24, 94]], { fecha: true, cheio: true }),
    t([[6, 42], [24, 42]]), t([[6, 42], [6, 94]]), t([[76, 32], [94, 32], [94, 94]]),
    ...[0, 1, 2, 3].flatMap(r => [0, 1, 2].map(c => t([[32 + c * 14, 20 + r * 13], [40 + c * 14, 20 + r * 13], [40 + c * 14, 28 + r * 13], [32 + c * 14, 28 + r * 13]], { fecha: true }))),
    t([[43, 76], [57, 76], [57, 94], [43, 94]], { fecha: true })];
  OBJ.casa = [
    t([[50, 8], [94, 46], [82, 46], [82, 92], [18, 92], [18, 46], [6, 46]], { fecha: true, cheio: true }),
    t([[42, 64], [58, 64], [58, 92], [42, 92]], { fecha: true }), t([[26, 54], [38, 54], [38, 66], [26, 66]], { fecha: true }), t([[62, 54], [74, 54], [74, 66], [62, 66]], { fecha: true })];
  // ---- campo, energia, industria ----
  OBJ.folha = [
    t([[50, 93], [8, 70, 8, 30, 52, 7], [92, 30, 92, 70, 50, 93]], { fecha: true, cheio: true }),
    t([[50, 93], [52, 22]]), t([[50, 70], [30, 56]]), t([[50, 70], [70, 56]]), t([[51, 48], [34, 36]]), t([[51, 48], [68, 36]])];
  OBJ.gota = [t([[50, 6], [50, 6, 16, 46, 16, 64], [16, 82, 32, 94, 50, 94], [68, 94, 84, 82, 84, 64], [84, 46, 50, 6, 50, 6]], { fecha: true, cheio: true }), t([[32, 66], [32, 76, 38, 82, 46, 84]])];
  OBJ.raio = [t([[58, 4], [22, 56], [46, 56], [40, 96], [78, 40], [54, 40]], { fecha: true, cheio: true })];
  OBJ.engrenagem = [
    t(Array.from({ length: 12 }, (_, k) => { const a = 2 * Math.PI * k / 12, p = (r, d) => [50 + r * Math.cos(a + d), 50 + r * Math.sin(a + d)]; return [p(34, -0.26), p(46, -0.15), p(46, 0.15), p(34, 0.26)]; }).flat(), { fecha: true, cheio: true }),
    t(circ(50, 50, 14), { fecha: true })];
  OBJ.caminhao = [
    t([[3, 26], [56, 26], [56, 72], [3, 72]], { fecha: true, cheio: true }),
    t([[56, 40], [78, 40], [95, 56], [95, 72], [56, 72]], { fecha: true, cheio: true }), t([[66, 46], [78, 46], [88, 56], [66, 56]], { fecha: true }),
    t(circ(24, 78, 9), { fecha: true }), t(circ(76, 78, 9), { fecha: true })];
  OBJ.aviao = [t([[50, 4], [58, 34], [94, 56], [94, 66], [58, 56], [56, 80], [70, 90], [70, 96], [50, 90], [30, 96], [30, 90], [44, 80], [42, 56], [6, 66], [6, 56], [42, 34]], { fecha: true, cheio: true })];
  // ---- servicos ----
  OBJ.cruz = [t([[36, 6], [64, 6], [64, 36], [94, 36], [94, 64], [64, 64], [64, 94], [36, 94], [36, 64], [6, 64], [6, 36], [36, 36]], { fecha: true, cheio: true })];
  OBJ.celular = [
    t([[28, 4], [72, 4], [72, 96], [28, 96]], { fecha: true, cheio: true }), t([[40, 10], [60, 10]]), t([[33, 18], [67, 18], [67, 80], [33, 80]], { fecha: true }), t(circ(50, 88, 3), { fecha: true })];
  OBJ.livro = [
    t([[50, 22], [30, 14, 14, 16, 6, 20], [6, 78], [14, 74, 30, 72, 50, 80]], { fecha: true, cheio: true }),
    t([[50, 22], [70, 14, 86, 16, 94, 20], [94, 78], [86, 74, 70, 72, 50, 80]], { fecha: true, cheio: true }), t([[50, 22], [50, 80]])];

  const NOMES = Object.keys(OBJ);
  // sinonimos para quem escreve o setor em vez do nome do objeto (usado por resolver)
  const SINONIMOS = {
    supermercado: 'carrinho', varejo: 'carrinho', atacado: 'carrinho', mercado: 'carrinho', loja: 'sacola', moda: 'sacola', 'e-commerce': 'caixa', luxo: 'caixa', joalheria: 'caixa', presente: 'caixa', embalagem: 'caixa',
    vinho: 'garrafa', bebida: 'garrafa', cerveja: 'garrafa', banco: 'cartao', fintech: 'celular', pagamentos: 'cartao', app: 'celular', tecnologia: 'celular',
    imobiliario: 'predio', construcao: 'predio', shopping: 'predio', moradia: 'casa', agro: 'folha', agricola: 'folha', alimentos: 'folha', sustentabilidade: 'folha',
    petroleo: 'gota', oleo: 'gota', saneamento: 'gota', agua: 'gota', energia: 'raio', eletrica: 'raio', industria: 'engrenagem', manufatura: 'engrenagem',
    logistica: 'caminhao', transporte: 'caminhao', aereo: 'aviao', aviacao: 'aviao', turismo: 'aviao', saude: 'cruz', hospital: 'cruz', farmacia: 'cruz', educacao: 'livro', editora: 'livro',
  };
  const resolver = (n) => { const k = String(n || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); return OBJ[k] ? k : (SINONIMOS[k] || null); };

  let seq = 0;
  // desenha o objeto dentro da caixa (mantem a proporcao 1:1, centralizado). o.cor, o.linha (pt), o.preenche, o.transpPreenche, o.transpLinha, o.nome
  function desenhar(s, nome, box, o = {}) {
    const chave = resolver(nome);
    if (!chave) throw new Error(`silhueta desconhecida: "${nome}". Objetos: ${NOMES.join(', ')} (ou setor: ${Object.keys(SINONIMOS).slice(0, 8).join(', ')}...)`);
    const sc = Math.min(box.w, box.h) / 100, ox = box.x + (box.w - 100 * sc) / 2, oy = box.y + (box.h - 100 * sc) / 2;
    const X = (v) => ox + v * sc, Y = (v) => oy + v * sc;
    OBJ[chave].forEach((tr) => {
      const pts = tr.pts.map((p, i) => p.length === 2 ? { x: X(p[0]), y: Y(p[1]) }
        : { x: X(p[4]), y: Y(p[5]), curve: { type: 'cubic', x1: X(p[0]), y1: Y(p[1]), x2: X(p[2]), y2: Y(p[3]) } });
      // pontos de curva no 1o lugar nao existem; o primeiro ponto e sempre reta
      const cheio = tr.cheio && o.preenche;
      s.addShape(S.CUSTOM_GEOMETRY, { x: 0, y: 0, w: W, h: H, objectName: (o.nome || 'OBJ_marca') + '_' + (++seq),
        points: pts.concat(tr.fecha ? [{ close: true }] : []),
        fill: cheio ? { color: o.cor || 'FFFFFF', transparency: o.transpPreenche == null ? 85 : o.transpPreenche } : { color: 'FFFFFF', transparency: 100 },
        line: { color: o.cor || 'FFFFFF', width: o.linha || 2, transparency: o.transpLinha || 0 } });
    });
    return chave;
  }
  // padrao escalonado de objetos pequenos (tom sobre tom), como o monograma da referencia Hermes. area = retangulo; tam = lado de cada objeto (pol).
  function padrao(s, nome, area, o = {}) {
    const tam = o.tam || 0.9, passoX = o.passoX || tam * 1.9, passoY = o.passoY || tam * 1.6;
    const colunas = Math.ceil(area.w / passoX) + 1, linhas = Math.ceil(area.h / passoY) + 1;
    for (let r = 0; r < linhas; r++) for (let c = 0; c < colunas; c++) {
      const x = area.x + c * passoX + (r % 2 ? passoX / 2 : 0) - passoX / 2, y = area.y + r * passoY;
      if (x + tam < area.x || x > area.x + area.w || y + tam < area.y || y > area.y + area.h) continue;
      desenhar(s, nome, { x, y, w: tam, h: tam }, { cor: o.cor, linha: o.linha || 0.75, transpLinha: o.transpLinha == null ? 78 : o.transpLinha, nome: o.nome || 'CAPA_padrao' });
    }
  }
  return { NOMES, SINONIMOS, resolver, desenhar, padrao };
};
