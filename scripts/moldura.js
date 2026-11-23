// moldura.js -- moldura fixa do deck (layouts do master, barra lateral, logos, linha, sumario, pagina),
// capa, slide de sumario/transicao, divisao do miolo em quadrantes, imagens e finalizacao do arquivo.
//
// Uso (em build_deck.js, na mesma pasta dos outros scripts da skill):
//   const deck = require('./moldura.js')({
//     fonte: 'Gill Sans MT',                       // da lista aprovada
//     cor: { dom: '2E6B4F', dest: '5FBF8F' },      // do briefing; escuro/clara/fundo/cinza/texto sao derivados se faltarem
//     escopos: ['marketing'],                      // OBRIGATORIO: define o fluxo abaixo da linha de todo slide e gera fluxo_<escopo>.md (fluxos.js)
//     secoes: null,                                // so para ACRESCENTAR etapas ao fluxo padrao (as padrao precisam estar todas, na ordem)
//     descricoes: { 'Diagnóstico': '5Cs da empresa' },  // opcional: linha de apoio de cada topico no slide de sumario
//     logos: { analisada: null, apresentador: null },   // caminho de imagem ou null (vira placeholder)
//     estiloBarra: null,                           // null/'aleatorio' = sorteia entre os estilos implementados (1x por projeto); ou 'G', 'A', 'custom' se o usuario nomear um
//     fonteTtf: null, fonteTtfBold: null,          // .ttf da fonte, se o usuario enviar (medidas fieis)
//     biblioteca: null,                            // pasta com catalogo.json de imagens (padrao: ./imagens)
//     // SORTEIO (sorteio.js): estiloCabecalho, estiloTitulo, corTitulo, corCabecalho e estilosSumario NAO tem padrao. Deixe-os de fora (ou null):
//     // sao sorteados uma vez por projeto e gravados em estilo_deck.json. So preencha um deles se o usuario nomear o estilo.
//     estiloCabecalho: null,                       // null = sorteia | 'marcador' | 'texto' | 'linha' | 'sublinhado' | 'frase' | 'aba' (um por deck)
//     corTitulo: null, corCabecalho: null,         // null = sorteia | 'dom' | 'escuro' (Kepler, M&A, Orizon, Vibra); numerarBlocos: true = "I. Titulo"; corLegenda: 'cinza' no estilo 'frase'
//     estiloTitulo: null,                          // null = sorteia | 'padrao' | 'assunto' ("Assunto: conclusao") | 'italico' (*termo* em italico); 'destaque' (fio vertical) e proibido
//     estiloSumario: null, // um modelo por deck; escolhido antes do primeiro sumario
//     layouts: null,                               // layouts de quadrantes criados no slide master (so com 'marcador'): null = Q4, Q3E, Q3D, Q2T, Q2E | 'todos' | lista de chaves
//                                                  // (com outro cabecalho, novoSlide(secao, { layout }) EMULA a mesma geometria com deck.blocos: o codigo do slide nao muda)
//     historico: null,                             // opcional: caminho do registro_decisoes.json de um deck anterior (avisa se repetir tipo + arranjo)
//   });
//   deck.decidir({ slide, tipo, mensagem, arranjo, divisao, formas, aprendi: 'o que aprendi das referencias e como apliquei', referencias: ['mabg_p048','rdor_p057'] (imagens de assets/referencias abertas com Read, 2+), exhibits: ['colunas + colcheteCagr','mapa'] (2 a 4), alternativas: [{ arranjo, motivo }, ...], motivo });  // 1 por slide de conteudo (2+ alternativas); finalizar grava registro_decisoes.json/.md
//   deck.formas inclui exhibits.js (grafico, colcheteCagr, nota, tabela, footballField...: formato das referencias, 9/8/7pt) + elementos.js + formas.js.
//   deck.fontes(s, 'Fontes: ...');   // rodape, a direita do fluxo; nao ha deck.notas (use apendice ou pop-up)
//   deck.capa({ modelo: 'foto_lateral', titulo, subtitulo, integrantes: [...], creditos: [['Head', 'Nome']], imagem: null });   // modelos em references/capas.md
//   deck.sumario('Overview');                      // slide de transicao: topico atual destacado (estilos e pilares: references/sumarios_popups.md)
//   deck.popup(s, { paineis: [{ x, y, w, h, titulo }] }) / deck.faixaPergunta(s, 'Pergunta?') / deck.indice / deck.resumoExecutivo
//   const s = deck.novoSlide('Overview');                       // layout base (1 quadrante, sem marcador)
//   const s = deck.novoSlide('Overview', { layout: 'Q4' });     // layout de 4 quadrantes do slide master (Q3E, Q3D, Q2T, Q2E...)
//   deck.titulo(s, 'Titulo-conclusao em uma linha', [{ text: 'Apoio com ' }, { text: 'destaque', options: deck.B }]);
//   const [a, b] = deck.blocos(s, '2c', [{ cab: 'Bloco', sub: 'Conclusao' }, { cab: 'Outro', sub: '...' }]);  // devolve areas internas
//   const [a, b, c, d] = deck.blocos(s, [{ cab, sub }, ...]);   // slide com layout de quadrantes: preenche os placeholders do master
//   deck.livre(s);                                              // area dos quadrantes que o layout deixa livres (ex.: faixa larga embaixo), ou null
//   deck.fontes(s, 'Fontes: A; B');
//   await deck.finalizar('deck.pptx', estilosGraficos);
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const pptxgen = require('pptxgenjs');

module.exports = function (cfg) {
  const AQUI = __dirname;
  // Python: config > variavel PYTHON > primeiro que tiver lxml entre python3, py e python (no Windows costuma ser "py").
  const PYTHON = cfg.python || process.env.PYTHON || (['python3', 'py', 'python'].find(c => { try { execFileSync(c, ['-I', '-c', 'import lxml.etree'], { stdio: 'ignore' }); return true; } catch (e) { return false; } }) || 'python3');
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  const F = cfg.fonte;
  // MODO (2026-11-15): 'insperjr' (padrao) segue os decks Insper Jr do usuario (titulo ~26pt, corpo 11-12pt, imagem grande,
  // revelacao progressiva); 'financeiro' mantem a densidade dos decks de mercado financeiro (titulo 20pt, corpo 9pt).
  // 22/11/2026: o modo 'financeiro' (legado de mercado financeiro, corpo 9pt) foi removido. A skill so faz Insper Jr.
  if (cfg.modo && cfg.modo !== 'insperjr') throw new Error(`modo "${cfg.modo}" removido: a skill so gera decks Insper Jr. Tire "modo" do config.`);
  const MODO = 'insperjr';
  // FLUXO DO ESCOPO (obrigatorio, fluxos.js): `escopos` define as etapas do rodape de todo slide (fluxo_<escopo>.md so com cfg.fluxoMd: true)
  const FLUXO = require(path.join(AQUI, 'fluxos.js')).resolver(cfg);
  cfg.secoes = FLUXO.todas;   // todas as etapas (novoSlide valida contra elas)
  const slidesFluxo = [];
  const ESCALA_BASE = MODO === 'insperjr' ? (cfg.escalaTexto || 1.25) : 1;
  pres.theme = { headFontFace: F, bodyFontFace: F };
  if (!['Gill Sans MT', 'Dubai', 'Montserrat'].includes(F)) console.warn(`AVISO: a fonte "${F}" nao esta na lista aprovada (Gill Sans MT, Dubai, Montserrat). So use com aprovacao do usuario.`);

  // ---------- ambiente: falha logo no inicio, nao depois de montar o deck ----------
  // Requisitos: node + pptxgenjs; python3 + lxml (barra, degrades e graficos); Pillow so para recortar imagens e medir com .ttf.
  try { execFileSync(PYTHON, ['-I', '-c', 'import lxml.etree']); }
  catch (e) { throw new Error(`Esta skill precisa de Python com a biblioteca lxml (tentei "${PYTHON}"; instale com: ${PYTHON} -m pip install lxml). Ela aplica barra lateral, degrades e acabamento dos graficos depois do pptxgenjs.`); }
  let temPillow = true;
  try { execFileSync(PYTHON, ['-I', '-c', 'import PIL.Image']); }
  catch (e) { temPillow = false; console.warn('AVISO: Pillow ausente (pip install pillow). Logos PNG/JPG continuam sem distorcer; imagens nao serao recortadas e a medida de texto usa estimativa.'); }

  // ---------- paleta ----------
  const tom = (hex, f) => {
    const n = parseInt(hex, 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f)));
    return c.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  const COR = Object.assign({ cinza: '707070', texto: '333333' }, cfg.cor);
  COR.escuro = COR.escuro || tom(COR.dom, -0.5);
  COR.clara = COR.clara || tom(COR.dest, 0.45);
  COR.fundo = COR.fundo || tom(COR.dom, 0.9);
  const IDENTIDADE = require(path.join(AQUI, 'identidade.js'))(cfg, COR);
  COR.dom = IDENTIDADE.dados.paleta.destaque10;
  COR.dest = IDENTIDADE.dados.paleta.secundaria30;
  COR.escuro = COR.dest;
  COR.clara = tom(COR.dest, 0.75);
  COR.fundo = tom(COR.dom, 0.94);
  cfg.maxItensSumario = Math.max(...FLUXO.escopos.map(e => e.secoes.length));
  const formas = require(path.join(AQUI, 'formas.js'))(pres, COR, F, temPillow ? { fonteTtf: cfg.fonteTtf, fonteTtfBold: cfg.fonteTtfBold, python: PYTHON } : {});
  // elementos dos decks de referencia (painelAba, treemap, conectorZoom...): somados a formas
  const elemPath = path.join(AQUI, 'elementos.js');
  if (fs.existsSync(elemPath)) Object.assign(formas, require(elemPath)(pres, COR, F, formas, { imagem: (...a) => imagem(...a) }));
  else console.warn('AVISO: elementos.js nao encontrado; painelAba, treemap, tabela etc. ficam indisponiveis.');
  // DENSIDADE DE REFERENCIA (decks do usuario: corpo 9pt, legenda 8pt, micro 7pt): as formas antigas (formas.js / elementos.js) foram
  // desenhadas para corpo 10-13pt; aqui o texto delas e reduzido (x0,85, piso 8pt) sem mexer na geometria.
  const ESCALA_ANTIGAS = cfg.escalaFormas || 0.85;
  // As 19 formas do framework (framework_formas.pptx, ja incorporado em formas.js; ver references/formas.md): contamos o uso para avisar no finalizar.
  const FORMAS_FRAMEWORK = ['faixasNumeradasArco', 'kpiLosango', 'gradeKpiLosango', 'lajesEmpilhadas', 'piramide3D', 'funilPrismas', 'caixaEtiqueta', 'caixaFita',
    'cardAba', 'molduraDeslocada', 'chamadaConector', 'chipsHexagonais', 'marcadorHexagonal', 'cardsParalelogramo', 'cubosLinhasGuia', 'tubosTampa',
    'colunasEquacao', 'cartaoCitacao', 'cardsLigados'];
  const USO_FRAMEWORK = {};
  Object.keys(formas).forEach(nome => {
    const fn = formas[nome];
    if (typeof fn !== 'function' || ['tom', 'sombra', 'larguraTexto', 'placeholder', 'linhaGuia', 'fmt'].includes(nome)) return;
    formas[nome] = function (s, ...resto) { if (FORMAS_FRAMEWORK.includes(nome)) USO_FRAMEWORK[nome] = (USO_FRAMEWORK[nome] || 0) + 1; const ant = s && s.__escala; if (s && typeof s === 'object') s.__escala = ESCALA_ANTIGAS * ESCALA_BASE; try { return fn.call(this, s, ...resto); } finally { if (s && typeof s === 'object') s.__escala = ant; } };
  });
  // exhibits.js: elementos e graficos no formato EXATO dos decks de referencia (gramatica.md / exhibits.md); ja nascem em 9/8/7pt
  const exPath = path.join(AQUI, 'exhibits.js');
  if (fs.existsSync(exPath)) Object.assign(formas, require(exPath)(pres, COR, F, formas, { imagem: (...a) => imagem(...a), tmp: () => tmp(), aqui: AQUI }));
  else console.warn('AVISO: exhibits.js nao encontrado; grafico, tabela, colcheteCagr, nota, footballField etc. ficam indisponiveis.');
  // PROIBICOES do usuario (scripts/proibicoes.js): setas, tabelas, linha/barra vertical antes de texto, grafico feito com formas.
  const PROIB = require(path.join(AQUI, 'proibicoes.js'));
  Object.keys(PROIB.funcoes).forEach(nome => {
    const p = PROIB.funcoes[nome];
    formas[nome] = () => { throw new Error(`"${nome}" e PROIBIDO: ${p.motivo}. Alternativa: ${p.alternativa}.`); };
  });
  if (MODO === 'insperjr') Object.keys(PROIB.funcoesInsperJr || {}).forEach(nome => {
    const p = PROIB.funcoesInsperJr[nome];
    formas[nome] = () => { throw new Error(`"${nome}" e PROIBIDO no modo Insper Jr: ${p.motivo}. Use no lugar: ${p.alternativa}. (references/contraexemplos_insperjr.md)`); };
  });
  // um padrao de cabecalho de bloco e um de titulo por deck
  // Sem padrao: cabecalho, titulo, cores e sumarios sao SORTEADOS 1x por projeto (sorteio.js, gravado em estilo_deck.json) a menos que o config nomeie.
  if ((cfg.modo || 'insperjr') === 'insperjr' && !cfg.estiloCabecalho) cfg.estiloCabecalho = 'marcador';   // Insper Jr: sempre a barrinha no inicio dos quadrantes
  const SORT = require(path.join(AQUI, 'sorteio.js'))(cfg, PROIB);
  IDENTIDADE.dados.modeloSumario = SORT.estiloSumario; IDENTIDADE.salvar();
  const EST_CAB = SORT.estiloCabecalho, EST_TIT = SORT.estiloTitulo;
  const CABS = ['linha', 'marcador', 'sublinhado', 'aba', 'frase', 'texto'];

  // contraste da paleta (avisa, nao bloqueia)
  const lum = (hex) => { const [r, g, b] = [0, 2, 4].map(i => { const v = parseInt(hex.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contraste = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  [['texto branco sobre a cor de destaque (lajes, faixas, tubos)', 'FFFFFF', COR.dest, 3],
    ['texto branco sobre a cor dominante', 'FFFFFF', COR.dom, 4.5],
    ['texto da cor dominante sobre o fundo claro', COR.dom, COR.fundo, 4.5],
    ['texto escuro sobre a cor clara', COR.escuro, COR.clara, 4.5]].forEach(([nome, a, b, min]) => {
    const c = contraste(a, b);
    if (c < min) console.warn(`AVISO contraste ${c.toFixed(1)}:1 (minimo ${min}:1): ${nome}.`);
  });

  // ---------- grade ----------
  const W = 0.62, H = 7.5, X0 = 0.9, X1 = 12.73, LOGO_W = 1.53, LOGO_X = 13.08 - LOGO_W, Y_LINHA = 7.14;
  const AREA = { x: X0, y: 1.3, w: X1 - X0, h: 6.68 - 1.3 };   // area util do miolo
  const LOGO_TOPO = { x: LOGO_X, y: 0.25, w: LOGO_W, h: 0.6 }, LOGO_BASE = { x: LOGO_X, y: 6.72, w: LOGO_W, h: 0.55 };
  const B = { bold: true, color: COR.dom };   // run de destaque
  const txt = (s, conteudo, o) => s.addText(conteudo, Object.assign({ fontFace: F, margin: 0, isTextBox: true, valign: 'middle', color: COR.texto }, o));

  // ---------- medidas de texto ----------
  const py = (codigo, ...args) => execFileSync(PYTHON, ['-I', '-c', codigo, ...args]).toString().trim();
  const memo = new Map();
  function larg(t, pt, neg) {   // largura em polegadas; exata com .ttf, senao estimativa conservadora
    const arq = neg ? cfg.fonteTtfBold : cfg.fonteTtf;
    if (arq && temPillow) {
      const k = (neg ? 'B|' : 'R|') + t;
      if (!memo.has(k)) memo.set(k, parseFloat(py('import sys\nfrom PIL import ImageFont\nprint(ImageFont.truetype(sys.argv[1],1000).getlength(sys.argv[2]))', arq, t)));
      return memo.get(k) / 1000 * pt / 72;
    }
    return t.length * pt * (neg ? 0.60 : 0.53) / 72;
  }
  function nLinhas(t, pt, w, neg) {   // quebra gulosa por palavras
    let n = 1, atual = '';
    t.split(/\s+/).forEach(p => { const x = atual ? atual + ' ' + p : p; if (larg(x, pt, neg) > w && atual) { n++; atual = p; } else atual = x; });
    return n;
  }

  // ---------- imagens (logos sem distorcer, recorte, biblioteca) ----------
  let tmpDir = null, nImg = 0;
  const tmp = () => tmpDir || (tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'deckimg-')));
  function dimensoesJs(buf) {   // PNG e JPEG sem depender de biblioteca
    if (buf.length > 24 && buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a') return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) { i++; continue; }
        const m = buf[i + 1];
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
    return null;
  }
  function dimensoes(caminho) {
    try {
      if (/\.(png|jpe?g)$/i.test(caminho)) { const d = dimensoesJs(fs.readFileSync(caminho)); if (d) return d; }
      if (/\.svg$/i.test(caminho)) {
        const t = fs.readFileSync(caminho, 'utf8');
        const vb = t.match(/viewBox="[\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/);
        if (vb) return { w: +vb[1], h: +vb[2] };
        const w = t.match(/\swidth="([\d.]+)/), h = t.match(/\sheight="([\d.]+)/);
        if (w && h) return { w: +w[1], h: +h[1] };
        return null;
      }
      const [w, h] = py('import sys\nfrom PIL import Image\nprint(*Image.open(sys.argv[1]).size)', caminho).split(' ').map(Number);
      return { w, h };
    } catch (e) { console.warn(`AVISO: nao li as dimensoes de ${caminho}; a proporcao pode ficar distorcida.`); return null; }
  }
  function caber(caminho, box, alinhar = 'direita') {   // "contain": cabe na caixa mantendo a proporcao
    const d = dimensoes(caminho);
    if (!d) return box;
    const r = d.w / d.h;
    let w = box.w, h = w / r;
    if (h > box.h) { h = box.h; w = h * r; }
    return { x: alinhar === 'direita' ? box.x + box.w - w : alinhar === 'esquerda' ? box.x : box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
  }
  const CROP = 'import sys\nfrom PIL import Image\nsrc, dst, w, h, fx, fy = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6])\n' +
    'im = Image.open(src); iw, ih = im.size; r = w / h\n' +
    'if iw / ih > r:\n    nw = int(ih * r); l = int((iw - nw) * fx); im = im.crop((l, 0, l + nw, ih))\n' +
    'else:\n    nh = int(iw / r); t = int((ih - nh) * fy); im = im.crop((0, t, iw, t + nh))\n' +
    'im.thumbnail((2400, 2400))\n' +
    'if im.mode in ("RGBA", "LA") or "transparency" in im.info:\n    dst += ".png"; im.convert("RGBA").save(dst)\n' +
    'else:\n    dst += ".jpg"; im.convert("RGB").save(dst, quality=88)\nprint(dst)';
  const DIR_IMG = [cfg.biblioteca, path.join(AQUI, 'imagens'), path.join(AQUI, '..', 'assets', 'imagens')].filter(Boolean).find(d => fs.existsSync(path.join(d, 'catalogo.json')));
  function daBiblioteca(tema) {   // so casa tema exato do catalogo; nao adivinha
    if (!tema || !DIR_IMG) return null;
    const cat = JSON.parse(fs.readFileSync(path.join(DIR_IMG, 'catalogo.json'), 'utf8'));
    const t = tema.trim().toLowerCase();
    const item = cat.find(c => (c.temas || []).some(x => x.trim().toLowerCase() === t));
    return item ? path.join(DIR_IMG, item.arquivo) : null;
  }
  // imagem(s, { x, y, w, h, caminho?, tema?, descricao?, foco?: [fx, fy], modo?: 'cover' | 'contain', nome? })
  // ordem: arquivo informado -> biblioteca (tema exato) -> placeholder. Devolve true se colocou imagem real.
  function imagem(s, o) {
    const { x, y, w, h, nome = 'img' } = o;
    const arq = o.caminho || daBiblioteca(o.tema);
    if (!o.caminho && arq) console.log(`imagem da biblioteca para "${o.tema}": ${path.basename(arq)} (confirmar com o usuario)`);
    if (arq && fs.existsSync(arq)) {
      if ((o.modo || 'cover') === 'cover') {
        const f = o.foco || [0.5, 0.5];
        let rec = null;
        if (temPillow) rec = py(CROP, arq, path.join(tmp(), 'img' + (++nImg)), String(w), String(h), String(f[0]), String(f[1]));
        if (rec) s.addImage({ path: rec, x, y, w, h, objectName: 'IMG_' + nome });
        else s.addImage({ path: arq, ...caber(arq, { x, y, w, h }, 'centro'), objectName: 'IMG_' + nome });   // sem Pillow: cabe inteira, sem recorte
      } else { s.addImage({ path: arq, ...caber(arq, { x, y, w, h }, 'centro'), objectName: 'IMG_' + nome }); }
      return true;
    }
    formas.placeholder(s, { x, y, w, h, texto: `[IMAGEM: ${o.descricao || o.tema || 'o que vai aqui'}]`, nome });
    return false;
  }
  function painel(s, o) {   // imagem com bloco deslocado atras (profundidade)
    s.addShape(pres.shapes.RECTANGLE, { x: o.x + 0.1, y: o.y + 0.1, w: o.w, h: o.h, fill: { color: COR.dest }, line: { type: 'none' } });
    if (imagem(s, o)) s.addShape(pres.shapes.RECTANGLE, { x: o.x, y: o.y, w: o.w, h: o.h, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: COR.escuro, width: 1 } });
  }

  // ---------- logos ----------
  function logo(objs, caminho, box, rotulo) {
    if (caminho) { const b = caber(caminho, box); objs.push({ image: { path: caminho, x: b.x, y: b.y, w: b.w, h: b.h } }); }
    else {
      objs.push({ rect: { x: box.x, y: box.y, w: box.w, h: box.h, fill: { color: 'F2F2F2' }, line: { color: 'A6A6A6', width: 1, dashType: 'dash' } } });
      objs.push({ text: { text: `[LOGO: ${rotulo}]`, options: { x: box.x, y: box.y, w: box.w, h: box.h, fontFace: F, fontSize: 9, color: '7F7F7F', align: 'center', valign: 'middle', margin: 4 } } });
    }
  }
  // Logo de baixo: se ainda nao ha arquivo, o placeholder e um quadro compacto (a logo real pode ser quadrada ou larga).
  // A linha divisoria termina GAP_LINHA_LOGO antes da area que a logo REAL ocupa (calculada com a proporcao dela),
  // e nao antes da caixa maxima: assim a linha fica colada na logo, como no mestre do usuario, qualquer que seja o formato.
  const LOGO_BASE_VAZIA = { x: 13.08 - 1.0, y: 6.72, w: 1.0, h: 0.55 }, GAP_LINHA_LOGO = 0.15;
  const logoBase = (cfg.logos && cfg.logos.apresentador) || null;
  const BASE_BOX = logoBase ? LOGO_BASE : LOGO_BASE_VAZIA;
  const BASE_REAL = logoBase ? caber(logoBase, LOGO_BASE) : LOGO_BASE_VAZIA;
  const X_FIM_LINHA = BASE_REAL.x - GAP_LINHA_LOGO;

  // ---------- layouts do slide master ----------
  // Todo layout de conteudo tem: logos (placeholders se faltar arquivo), linha divisoria, fluxo de topicos, numero da pagina e os
  // placeholders TITULO e APOIO. Com estiloCabecalho 'marcador' ha tambem os layouts de quadrantes (QUAD), que repetem o mestre do
  // usuario: cada quadrante tem a barrinha + placeholder de titulo + placeholder de subtitulo. 1 quadrante nunca leva marcador.
  // A barrinha e desenhada por marcadores.py (retangulos MARC_* viram as duas pecas com corte diagonal e degrade).
  // Quadrantes = recortes da grade 2x2 (0 = topo esq., 1 = topo dir., 2 = base esq., 3 = base dir.); o que sobra fica livre
  // para um exhibit largo (deck.livre).
  const COR_CAB = SORT.corCabecalho === 'escuro' ? tom(COR.texto, -0.4) : COR.dom, COR_TIT = SORT.corTitulo === 'escuro' ? tom(COR.texto, -0.55) : COR.dom;   // titulos na dominante (Nubank, Rede D'Or) ou escuros (Kepler, M&A, Vibra)
  const MARC_W = 0.07, MARC_H = 0.44, MARC_TX = 0.18, TIT_H = 0.24, SUB_DY = 0.25, SUB_H = 0.36, HDR_DY = 0.03 + MARC_H + 0.1;   // barrinha do tamanho do bloco titulo+subtitulo (1 linha cada)   // barrinha; HDR_DY = inicio da area interna do quadrante
  const QUAD = {
    Q4: { nome: '4 quadrantes', cel: [0, 1, 2, 3] },
    Q3E: { nome: '3 quadrantes (base esquerda)', cel: [0, 1, 2] },
    Q3D: { nome: '3 quadrantes (base direita)', cel: [0, 1, 3] },
    Q2T: { nome: '2 quadrantes (topo)', cel: [0, 1] },
    Q2E: { nome: '2 quadrantes (coluna esquerda)', cel: [0, 2] },
    // espelhados (cfg.layouts = 'todos' ou lista com estas chaves)
    Q3TE: { nome: '3 quadrantes (topo esquerda)', cel: [0, 2, 3] },
    Q3TD: { nome: '3 quadrantes (topo direita)', cel: [1, 2, 3] },
    Q2D: { nome: '2 quadrantes (coluna direita)', cel: [1, 3] },
    Q2B: { nome: '2 quadrantes (base)', cel: [2, 3] },
  };
  const QUAD_PADRAO = ['Q4', 'Q3E', 'Q3D', 'Q2T', 'Q2E'];
  const mistura = (a, b, t) => { const x = parseInt(a, 16), y = parseInt(b, 16); return [16, 8, 0].map(s => Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t).toString(16).padStart(2, '0')).join('').toUpperCase(); };
  const MARC = { topo: COR.dom, g0: mistura(COR.dom, COR.dest, 0.5), g1: COR.dest };
  const QUAD_ATIVOS = EST_CAB !== 'marcador' ? [] : (cfg.layouts === 'todos' ? Object.keys(QUAD) : (cfg.layouts || QUAD_PADRAO));
  QUAD_ATIVOS.forEach(k => { if (!QUAD[k]) throw new Error(`layout de quadrantes desconhecido: "${k}". Use: ${Object.keys(QUAD).join(', ')}`); });
  const nomeMaster = (chave) => chave === '1' ? 'Conteudo | 1 quadrante' : `Conteudo | ${QUAD[chave].nome}`;   // nao ha layout por secao
  const celulasDe = (chave) => { const g = linhasDe([[1, 1], [1, 1]]); return QUAD[chave].cel.map(i => g[i]); };
  const livreDe = (chave) => {   // retangulo que envolve as celulas que o layout nao usa (null se usa as 4)
    const g = linhasDe([[1, 1], [1, 1]]), f = [0, 1, 2, 3].filter(i => !QUAD[chave].cel.includes(i)).map(i => g[i]);
    if (!f.length) return null;
    const x0 = Math.min(...f.map(r => r.x)), y0 = Math.min(...f.map(r => r.y));
    return { x: x0, y: y0, w: Math.max(...f.map(r => r.x + r.w)) - x0, h: Math.max(...f.map(r => r.y + r.h)) - y0 };
  };
  function criarLayouts() {
    // NAO passe align aqui: com align no objeto, o pptxgenjs quebra cada run do slide em um paragrafo. O alinhamento a esquerda
    // (o placeholder title herdaria o centralizado do master padrao) e gravado no layout por marcadores.py.
    const ph = (name, type, o, prompt) => ({ placeholder: { options: Object.assign({ name, objectName: name, type, fontFace: F, margin: 0 }, o), text: prompt } });
    const wTit = LOGO_X - X0 - 0.3;
    // UM conjunto de layouts para o deck inteiro (o fluxo de topicos, que muda por secao, e desenhado no slide por fluxo())
    const comum = [];
    logo(comum, cfg.logos && cfg.logos.analisada, LOGO_TOPO, 'empresa analisada');
    logo(comum, logoBase, BASE_BOX, 'quem apresenta');
    comum.push({ line: { x: X0, y: Y_LINHA, w: X_FIM_LINHA - X0, h: 0, line: { color: COR.dom, width: 1 } } });
    const topo = [
      ph('TITULO', 'title', { x: X0, y: 0.2, w: wTit, h: MODO === 'insperjr' ? 0.58 : 0.5, fontSize: TITULO_PT, bold: true, color: COR_TIT, valign: 'middle' }, 'Título-conclusão do slide'),
      ph('APOIO', 'body', { x: X0, y: MODO === 'insperjr' ? 0.78 : 0.72, w: wTit, h: 0.42, fontSize: MODO === 'insperjr' ? 14 : 11, color: '595959', valign: 'top' }, 'Frase de apoio'),
    ];
    const numero = { x: 0, y: 7.1, w: W, h: 0.32, fontFace: F, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0 };
    pres.defineSlideMaster({ title: nomeMaster('1'), background: { color: IDENTIDADE.dados.paleta.base60 }, objects: comum.concat(topo), slideNumber: numero });
    QUAD_ATIVOS.forEach(chave => {
      const q = [];
      celulasDe(chave).forEach((c, i) => {
        const n = i + 1, x = c.x + MARC_TX, w = c.w - MARC_TX, y = c.y + 0.03;
        q.push({ rect: { x: c.x, y, w: MARC_W, h: MARC_H, fill: { color: MARC.topo }, line: { type: 'none' }, objectName: 'MARC_topo_' + n } });
        q.push({ rect: { x: c.x, y, w: MARC_W, h: MARC_H, fill: { color: MARC.g1 }, line: { type: 'none' }, objectName: 'MARC_base_' + n } });
        q.push(ph(`Q${n}_TIT`, 'body', { x, y, w, h: TIT_H, fontSize: 13.5, bold: true, color: COR_CAB, valign: 'bottom' }, 'Título do quadrante'));
        q.push(ph(`Q${n}_SUB`, 'body', { x, y: y + SUB_DY, w, h: SUB_H, fontSize: 11.5, color: COR.cinza, valign: 'top' }, 'Subtítulo: leitura ou legenda (unidade, período)'));
      });
      pres.defineSlideMaster({ title: nomeMaster(chave), background: { color: IDENTIDADE.dados.paleta.base60 }, objects: comum.concat(topo, q), slideNumber: numero });
    });
    // layout da capa: em branco (sem barra, logos, linha, fluxo ou numero). Cada modelo de capa (capas.js) desenha tudo.
    pres.defineSlideMaster({ title: 'Capa', background: { color: 'FFFFFF' }, objects: [] });
  }

  // ---------- barra lateral (desenhada no 1o slide; barra_lateral.py move para os layouts) ----------
  const GRAD = {};
  const cub = (x, y, x1, y1, x2, y2) => ({ x, y, curve: { type: 'cubic', x1, y1, x2, y2 } });
  function caminho(s, nome, pts, o) {
    const p = pts.map(q => Array.isArray(q) ? { x: q[0], y: q[1] } : q);
    if (o.fechar) p.push({ close: true });
    s.addShape(pres.shapes.CUSTOM_GEOMETRY, { x: 0, y: 0, w: W + 0.5, h: H, objectName: nome, points: p,
      fill: o.cor ? { color: o.cor } : { color: 'FFFFFF', transparency: 100 },
      line: o.linha ? { color: o.corLinha || 'FFFFFF', width: o.linha, transparency: o.transp || 0 } : { type: 'none' } });
  }
  // Silhueta organica: a barra NAO precisa ser um retangulo. A base tem largura minima BASE (cobre o numero da
  // pagina) e o contorno avanca ate ~0,74 pol (pelo menos 0,15 de folga do titulo em x 0,9) com diagonais, ondas,
  // lobulos, serrilhado ou concavidades. Nao corte as formas em x = W.
  const BASE = 0.5, XMAX = 0.74;
  const retBarra = (w = BASE) => [[0, 0], [w, 0], [w, H], [0, H]];
  const amostra = (f, y0 = 0, y1 = H, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const y = y0 + (y1 - y0) * i / n; return [f(y), y]; });   // pontos de um contorno x = f(y)
  const BARRAS = {
    G(s) {   // curva com contorno (aprovado pelo usuario)
      Object.assign(GRAD, {
        BL_base: { ang: 90, stops: [[0, COR.dest, 100], [40, COR.dom, 100], [100, COR.escuro, 100]] },
        BL_bolha: { ang: 60, stops: [[0, COR.clara, 100], [100, COR.dest, 100]] },
        BL_brilho: { ang: 90, stops: [[0, 'FFFFFF', 0], [50, 'FFFFFF', 20], [100, 'FFFFFF', 0]] },
        BL_fundo: { ang: 90, stops: [[0, COR.escuro, 90], [100, tom(COR.escuro, -0.4), 100]] },
      });
      caminho(s, 'BL_base', [[0, 0], [W, 0], [W, H], [0, H]], { fechar: true, cor: COR.dom });
      caminho(s, 'BL_brilho', [[W * 0.55, 1.6], cub(W * 0.7, 5.6, W * 0.95, 3.0, W * 0.95, 4.4), cub(W * 0.55, 1.6, W * 0.45, 4.4, W * 0.4, 3.0)], { fechar: true, cor: 'FFFFFF' });
      const bolha = [[0, 0], [0.74, 0], cub(0.62, 0.95, 0.79, 0.45, 0.74, 0.75), cub(0, 1.75, 0.42, 1.18, 0.12, 1.45)];
      caminho(s, 'BL_bolha', bolha, { fechar: true, cor: COR.dest });
      caminho(s, 'BL_linha_bolha', bolha.slice(1), { linha: 1.25 });
      const curva = [[0, 4.7], cub(0.74, H, 0.05, 6.0, 0.62, 6.45)];   // sai pela borda inferior, sem terminar seca na lateral
      caminho(s, 'BL_fundo', [...curva, [0, H]], { fechar: true, cor: COR.escuro });
      caminho(s, 'BL_linha_curva', curva, { linha: 1.25 });
      caminho(s, 'BL_linha_curva2', [[0, 4.95], cub(0.66, H, 0.05, 6.25, 0.55, 6.7)], { linha: 0.5, transp: 50 });
    },
    A(s) {   // facetas low-poly: contorno em cristal, com vertices em alturas e larguras diferentes
      const SIL = [[0, 0], [0.5, 0], [0.72, 1.3], [0.55, 2.7], [0.74, 4.1], [0.52, 5.4], [0.66, 6.6], [0.5, H], [0, H]];
      Object.assign(GRAD, {
        BL_base: { ang: 90, stops: [[0, COR.escuro, 100], [55, COR.dom, 100], [100, COR.escuro, 100]] },
        BL_faceta1: { ang: 70, stops: [[0, COR.dest, 95], [100, COR.clara, 60]] },
        BL_faceta2: { ang: 110, stops: [[0, COR.clara, 85], [100, COR.dest, 95]] },
        BL_faceta3: { ang: 90, stops: [[0, COR.dest, 90], [100, COR.dom, 80]] },
        BL_faceta4: { ang: 90, stops: [[0, COR.dom, 70], [100, COR.escuro, 100]] },
        BL_onda: { ang: 90, stops: [[0, 'FFFFFF', 0], [50, 'FFFFFF', 22], [100, 'FFFFFF', 0]] },
      });
      caminho(s, 'BL_base', SIL, { fechar: true, cor: COR.dom });
      caminho(s, 'BL_faceta1', [[0, 0.3], [0.5, 0], [0.72, 1.3], [0, 2.6]], { fechar: true, cor: COR.dest });
      caminho(s, 'BL_faceta2', [[0, 2.6], [0.72, 1.3], [0.55, 2.7], [0, 4.2]], { fechar: true, cor: COR.clara });
      caminho(s, 'BL_faceta3', [[0, 4.2], [0.55, 2.7], [0.74, 4.1], [0.52, 5.4], [0, 6.0]], { fechar: true, cor: COR.dest });
      caminho(s, 'BL_faceta4', [[0, 6.0], [0.52, 5.4], [0.66, 6.6], [0.5, H], [0, H]], { fechar: true, cor: COR.dom });
      caminho(s, 'BL_onda', [[0, 0.4], cub(0.5, 5.2, 0.05, 2.4, 0.5, 3.4), cub(0, 1.1, W * 0.5, 3.6, 0.02, 2.6)], { fechar: true, cor: 'FFFFFF' });
      caminho(s, 'BL_linha1', [[0.08, 0], [0.72, 1.3]], { linha: 0.75, transp: 45 });
      caminho(s, 'BL_linha2', [[0, 3.4], [0.74, 4.1]], { linha: 0.5, transp: 55 });
    },
    B(s) {   // brilho com riscos: lamina com borda diagonal, faixas de luz e riscos finos
      const xr = y => XMAX - 0.24 * y / H;   // borda diagonal de 0,74 (topo) a 0,5 (base)
      Object.assign(GRAD, {
        BL_base: { ang: 90, stops: [[0, COR.dest, 100], [35, COR.dom, 100], [62, tom(COR.escuro, -0.45), 100], [100, COR.escuro, 100]] },
        BL_luz1: { ang: 0, stops: [[0, 'FFFFFF', 0], [50, 'FFFFFF', 38], [100, 'FFFFFF', 0]] },
        BL_luz2: { ang: 0, stops: [[0, 'FFFFFF', 0], [50, 'FFFFFF', 22], [100, 'FFFFFF', 0]] },
      });
      caminho(s, 'BL_base', [[0, 0], [xr(0), 0], [xr(H), H], [0, H]], { fechar: true, cor: COR.dom });
      caminho(s, 'BL_luz1', [[0, 2.7], [xr(1.5), 1.5], [xr(2.3), 2.3], [0, 3.5]], { fechar: true, cor: 'FFFFFF' });
      caminho(s, 'BL_luz2', [[0, 4.9], [xr(3.6), 3.6], [xr(4.0), 4.0], [0, 5.3]], { fechar: true, cor: 'FFFFFF' });
      for (let i = 0; i < 7; i++) { const y = 0.3 + i * 0.12; caminho(s, 'BL_linha_r' + i, [[0, y + 1.0], [xr(y), y]], { linha: i % 3 === 0 ? 1 : 0.5, transp: 50 }); }
      caminho(s, 'BL_linha_r_ext', [[0.05, 1.9], [0.75, 0]], { linha: 0.75, transp: 35, corLinha: COR.dest });   // um risco escapa pelo topo do slide
    },
    E(s) {   // chevrons: faixas em V alternando tons, cortadas por um contorno ondulado (sem pontas de seta)
      const xr = y => 0.6 + 0.12 * Math.sin(2 * Math.PI * y / 4.8 + 1.2);
      Object.assign(GRAD, { BL_base: { ang: 90, stops: [[0, COR.escuro, 100], [45, COR.dom, 100], [100, COR.escuro, 100]] } });
      caminho(s, 'BL_base', [[0, 0], ...amostra(xr), [0, H]], { fechar: true, cor: COR.dom });
      const xc = 0.3, d = 0.45, th = 0.42, inc = d / xc;                 // apice em x=xc; o braco direito sobe com a mesma inclinacao
      const acha = (yb) => { let a = xc, b = 1.2; for (let k = 0; k < 40; k++) { const m = (a + b) / 2, y = yb - (m - xc) * inc; if (m < xr(y)) a = m; else b = m; } return [(a + b) / 2, yb - ((a + b) / 2 - xc) * inc]; };
      const tons = [COR.dest, COR.dom, COR.clara, COR.dom, COR.dest, COR.escuro, COR.dom, COR.escuro];
      for (let i = 0; i < 8; i++) {
        const y = 0.3 + i * 0.9, c = tons[i], op = i < 5 ? 96 - i * 9 : 100;
        const [xu, yu] = acha(y + d), [xl, yl] = acha(y + d + th);
        GRAD['BL_chev' + i] = { ang: 90, stops: [[0, c, op], [100, c, Math.max(op - 20, 40)]] };
        caminho(s, 'BL_chev' + i, [[0, y], [xc, y + d], [xu, yu], ...amostra(yy => xr(yy), yu, yl, 6).slice(1, -1), [xl, yl], [xc, y + d + th], [0, y + th]], { fechar: true, cor: c });
      }
      caminho(s, 'BL_linha_v1', [[0, 0.3], [xc, 0.75], ...[acha(0.75)]], { linha: 0.75, transp: 40 });
    },
    F(s) {   // camadas que esmaecem: nucleo opaco e camadas externas em onda, cada vez mais claras e transparentes
      const onda = (a, fase) => y => a + 0.08 * Math.sin(2 * Math.PI * y / 5.4 + fase);
      Object.assign(GRAD, { BL_nucleo: { ang: 90, stops: [[0, COR.dest, 100], [30, COR.dom, 100], [70, COR.escuro, 100], [100, tom(COR.escuro, -0.35), 100]] } });
      [[0.66, 3.6, COR.clara, 22], [0.61, 2.7, COR.clara, 34], [0.56, 1.8, COR.dest, 48], [0.51, 0.9, COR.dest, 66]].forEach(([a, fase, c, op], i) => {
        GRAD['BL_cam' + i] = { ang: 90, stops: [[0, c, op], [100, c, Math.round(op * 0.45)]] };
        caminho(s, 'BL_cam' + i, [[0, 0], ...amostra(onda(a, fase)), [0, H]], { fechar: true, cor: c });
      });
      caminho(s, 'BL_nucleo', [[0, 0], ...amostra(onda(0.46, 0)), [0, H]], { fechar: true, cor: COR.dom });
      caminho(s, 'BL_linha_m1', amostra(onda(0.46, 0)), { linha: 0.5, transp: 60 });
    },
    H(s) {   // fuso concavo com borda: a propria faixa e o contorno; a lateral direita se estreita no meio
      const xr = y => 0.66 - 0.36 * Math.sin(Math.PI * y / H);
      Object.assign(GRAD, {
        BL_borda: { ang: 90, stops: [[0, COR.escuro, 100], [100, tom(COR.escuro, -0.4), 100]] },
        BL_banda: { ang: 90, stops: [[0, COR.clara, 100], [50, COR.dest, 100], [78, COR.dom, 100], [100, COR.escuro, 100]] },
      });
      const faixa = d => [[0, 0], ...amostra(y => xr(y) + d), [0, H]];
      caminho(s, 'BL_borda', faixa(0.04), { fechar: true, cor: tom(COR.escuro, -0.3) });
      caminho(s, 'BL_banda', faixa(0), { fechar: true, cor: COR.dest });
      caminho(s, 'BL_linha_h1', amostra(y => xr(y) - 0.07), { linha: 0.75, transp: 45 });
      caminho(s, 'BL_linha_h2', amostra(y => xr(y) + 0.07), { linha: 0.75, corLinha: COR.dom });   // contorno solto, fora da faixa
    },
    I(s) {   // linhas de contorno: borda ondulada e curvas paralelas que seguem para fora, saindo pelo topo e pela base
      const xr = y => 0.5 + 0.1 * Math.sin(2 * Math.PI * y / 4.4 + 4.0);
      Object.assign(GRAD, {
        BL_base: { ang: 90, stops: [[0, COR.dom, 100], [55, COR.escuro, 100], [100, tom(COR.escuro, -0.35), 100]] },
        BL_luz: { ang: 90, stops: [[0, COR.dest, 70], [100, COR.clara, 25]] },
      });
      caminho(s, 'BL_base', [[0, 0], ...amostra(xr), [0, H]], { fechar: true, cor: COR.dom });
      caminho(s, 'BL_luz', [...amostra(y => Math.max(0.04, xr(y) - 0.07), 0, H), ...amostra(y => Math.max(0.03, xr(y) - 0.22), H, 0)], { fechar: true, cor: COR.dest });
      for (let k = 1; k <= 4; k++) caminho(s, 'BL_linha_i' + k, amostra(y => Math.max(0.03, xr(y) - 0.07 * k)), { linha: 0.5, transp: 40 + k * 8 });
      [[1, COR.dest, 1], [2, COR.clara, 0.75], [3, COR.dom, 0.75], [4, COR.dest, 0.5]].forEach(([k, c, w]) =>
        caminho(s, 'BL_linha_x' + k, amostra(y => xr(y) + 0.03 * k), { linha: w, corLinha: c }));   // curvas paralelas fora da base
    },
  };
  if (cfg.barraCustom) BARRAS.custom = cfg.barraCustom;   // (s, { caminho, cub, W, H, COR, GRAD, tom }) para outro estilo do catalogo
  // Estilo da barra: sem padrao. Projeto novo = sorteio entre os estilos implementados em BARRAS
  // (todos os estilos de BARRAS: G, A, B, E, F, H, I e qualquer um que for acrescentado la). O sorteado fica gravado em estilo_barra.txt na pasta
  // do projeto, para que o deck reconstruido (slides acrescentados depois) mantenha a mesma barra.
  // Projeto novo = pasta nova (ou apagar estilo_barra.txt). Estilo nomeado pelo usuario ignora o sorteio.
  function estiloDaBarra() {
    const pedido = cfg.estiloBarra;
    if (pedido && pedido !== 'aleatorio') return pedido;
    const opcoes = Object.keys(BARRAS).filter(k => k !== 'custom');
    const arq = path.join(process.cwd(), 'estilo_barra.txt');
    let est = fs.existsSync(arq) ? fs.readFileSync(arq, 'utf8').trim() : '';
    if (!opcoes.includes(est)) {
      est = opcoes[Math.floor(Math.random() * opcoes.length)];
      fs.writeFileSync(arq, est + '\n');
      console.log('Barra lateral sorteada: ' + est + ' (de ' + opcoes.join(', ') + ')');
    } else console.log('Barra lateral mantida do projeto: ' + est);
    return est;
  }
  let barraFeita = false;
  function garantirBarra(s) {   // a barra e desenhada uma unica vez, no primeiro slide criado (capa ou conteudo)
    if (barraFeita) return;
    const est = estiloDaBarra();
    if (est !== 'custom' && !BARRAS[est]) throw new Error('Estilo de barra inexistente: "' + est + '". Disponiveis: ' + Object.keys(BARRAS).filter(k => k !== 'custom').join(', ') + ' (ou \'custom\' com barraCustom).');
    if (est === 'custom') BARRAS.custom(s, { caminho, cub, W, H, COR, GRAD, tom });
    else BARRAS[est](s);
    barraFeita = true;
  }

  // ---------- API de slide ----------
  let nConteudo = 0;   // slides de conteudo criados (sumarios descontam o proprio): cada um deve ter um deck.decidir
  // novoSlide(secao, { layout? }): layout '1' (padrao, sem marcador) ou uma chave de QUAD ('Q4', 'Q3E', 'Q3D', 'Q2T', 'Q2E'...).
  // Layouts de quadrantes so existem com estiloCabecalho 'marcador'; com eles, deck.blocos(s, itens) preenche os placeholders do master.
  // texto das formas antigas reduzido para a densidade de referencia (ver ESCALA_ANTIGAS)
  function escalavel(s) {
    const add = s.addText.bind(s), esc = (v) => Math.max(8, Math.round(v * s.__escala * 2) / 2);
    // sempre clona os runs: o pptxgenjs ALTERA os objetos de opcoes que recebe; um run compartilhado (deck.B, { bold: true })
    // voltaria com align/fontSize de outro texto e quebraria o paragrafo em linhas ou mudaria de tamanho.
    const clonar = (c) => Array.isArray(c) ? c.map(r => r && typeof r === 'object' ? Object.assign({}, r, { options: r.options ? Object.assign({}, r.options) : r.options }) : r) : c;
    s.addText = (conteudo, o = {}) => {
      const c2 = clonar(conteudo), o2 = Object.assign({}, o);
      if (!s.__escala || s.__escala === 1 || o.placeholder) return add(c2, o2);
      if (o2.fontSize) o2.fontSize = esc(o2.fontSize);
      if (Array.isArray(c2)) c2.forEach(r => { if (r && r.options && r.options.fontSize) r.options.fontSize = esc(r.options.fontSize); });
      return add(c2, o2);
    };
    return s;
  }
  function novoSlide(secao, o = {}) {
    if (!cfg.secoes.includes(secao)) throw new Error('Secao fora do sumario: ' + secao);
    const chave = o.layout || '1';
    let emulado = false;
    if (chave !== '1') {
      if (!QUAD[chave]) throw new Error(`layout desconhecido: "${chave}". Use: 1, ${Object.keys(QUAD).join(', ')}`);
      if (!QUAD_ATIVOS.includes(chave)) {
        // cabecalho sorteado diferente de 'marcador': os layouts com barrinha nao existem; a MESMA geometria e emulada (grade 2x2 recortada)
        // com deck.blocos no estilo do deck, entao o codigo do slide (novoSlide + blocos(s, itens) + livre(s)) nao muda com o sorteio
        if (EST_CAB !== 'marcador') emulado = true;
        else throw new Error(`layout "${chave}" nao foi criado neste deck: acrescente-o em "layouts" no config (ou use layouts: 'todos'). Criados: ${QUAD_ATIVOS.join(', ')}`);
      }
    }
    const s = pres.addSlide({ masterName: emulado ? nomeMaster('1') : nomeMaster(chave) });
    escalavel(s);
    s.__escala = ESCALA_BASE;   // modo insperjr: textos do miolo ~25% maiores (9pt -> 11pt), como nos decks Insper Jr
    fluxo(s, secao);
    slidesFluxo.push({ secao, slide: s });
    s.__quad = chave === '1' ? null : { chave, nome: QUAD[chave].nome, rects: celulasDe(chave), livre: livreDe(chave), emulado };
    garantirBarra(s);
    nConteudo++;
    return s;
  }
  // fluxo de topicos (mini sumario) abaixo da linha: secao atual em negrito na dominante. Fica no slide, e nao no layout,
  // para o master ter um unico conjunto de layouts em vez de um por secao.
  const FLUXO_PT = 9, FLUXO_SEP = '  |  ', Y_RODAPE = 7.17, H_RODAPE = 0.3;   // rodape compacto: fluxo (esq.), fonte (dir.), logo (extrema dir.)
  function fluxo(s, secaoAtual) {
    const lista = FLUXO.porSecao[secaoAtual].secoes, runs = [];   // so o fluxo do escopo a que o slide pertence
    lista.forEach((sec, i) => {
      const atual = sec === secaoAtual;
      runs.push({ text: sec, options: { bold: atual, color: atual ? COR.dom : COR.cinza } });
      if (i < lista.length - 1) runs.push({ text: FLUXO_SEP, options: { color: COR.cinza } });
    });
    const wTexto = lista.reduce((a, sec) => a + larg(sec, FLUXO_PT, sec === secaoAtual), 0) + (lista.length - 1) * larg(FLUXO_SEP, FLUXO_PT, false);
    s.__fluxoW = Math.min(wTexto + 0.22, (X_FIM_LINHA - X0) * 0.78);
    const escFluxo = s.__escala; s.__escala = 1;
    s.addText(runs, { x: X0, y: Y_RODAPE, w: s.__fluxoW, h: H_RODAPE, fontFace: F, fontSize: FLUXO_PT, margin: 0, valign: 'middle', wrap: false, isTextBox: true, objectName: 'FLUXO' });
    s.__escala = escFluxo;
  }
  function livre(s) {   // area dos quadrantes que o layout deixa livres (exhibit largo), ou null (Q4 usa tudo)
    if (!s.__quad) throw new Error('livre(): o slide nao usa um layout de quadrantes (novoSlide(secao, { layout }))');
    return s.__quad.livre;
  }

  // ---------- decisao de organizacao (references/arranjos.md) ----------
  // decidir({ slide, tipo, mensagem, arranjo, divisao?, formas?, alternativas: [{ arranjo, motivo }] (2+), motivo })
  // Registra por que o slide foi organizado assim. Exige 2+ alternativas consideradas, avisa se o arranjo repete o do slide
  // anterior ou, com cfg.historico (registro_decisoes.json de um deck anterior), o ultimo usado para o mesmo tipo.
  // finalizar() grava registro_decisoes.json e .md ao lado do deck.
  const decisoes = [];
  const norm = (t) => String(t || '').trim().toLowerCase();
  let historico = [];
  if (cfg.historico) {
    try { historico = JSON.parse(fs.readFileSync(cfg.historico, 'utf8')); if (!Array.isArray(historico)) historico = []; }
    catch (e) { console.warn(`AVISO: nao consegui ler o historico "${cfg.historico}" (${e.message}); seguindo sem ele.`); }
  }
  function decidir(o) {
    for (const k of ['slide', 'tipo', 'mensagem', 'arranjo', 'motivo']) {
      if (!o || !String(o[k] || '').trim()) throw new Error(`decidir: informe "${k}" (references/arranjos.md, secao 5)`);
    }
    // TRAVA DE REFERENCIA VISUAL: o slide so e aceito se o autor consultou imagens da biblioteca (assets/referencias/INDICE.md)
    const bib = [path.join(process.cwd(), 'referencias'), path.join(AQUI, 'referencias'), path.join(AQUI, '..', 'assets', 'referencias')].find(d => fs.existsSync(d));
    if (!bib && !cfg.semTravaReferencias) throw new Error('decidir: a biblioteca visual nao foi encontrada. Copie para a pasta de trabalho: cp -r <pasta da skill>/assets/referencias ./referencias (SKILL.md, passo 1) e abra as imagens com Read antes de montar os slides.');
    if (bib) {
      const achar = (id) => { const alvo = id.replace(/\.jpg$/, '').split(/[\\/]/).pop() + '.jpg', varre = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) { const r = varre(path.join(d, e.name)); if (r) return r; } else if (e.name === alvo) return path.join(d, e.name); } return null; }; return varre(bib); };   // a biblioteca tem subpastas (insper_jr/<tipo>, mercado_financeiro/<estrutura>, sumario): o id e so o nome do arquivo
      const refs = (o.referencias || []).map(String), ok = refs.filter(r => achar(r));
      if (ok.length < 2) throw new Error(`decidir("${o.slide}"): abra pelo menos 2 imagens de assets/referencias/ (Read; sortear_referencias.py indica quais) para este tipo de informacao (INDICE.md) e cite-as pelo nome do arquivo em "referencias: ['ijtheo_p041', 'orizon_p006']". Recebido: ${JSON.stringify(o.referencias || [])}. Sem olhar as referencias o slide sai com cara de IA.`);
      if (String(o.aprendi || '').trim().length < 40) throw new Error(`decidir("${o.slide}"): informe "aprendi": o que voce extraiu das referencias abertas (como o slide delas e construido) e como aplicou ao SEU conteudo, sem repetir a estrutura delas. Aprender, nao copiar.`);
      if (!Array.isArray(o.exhibits) || o.exhibits.length < 2) throw new Error(`decidir("${o.slide}"): informe "exhibits": a lista dos 2 a 4 exhibits diferentes do slide (ex.: ['colunas + colcheteCagr', 'mapa com cartoes', 'citacao']). Slide de 1 exhibit so quando for demonstracao financeira ou um unico grafico de destaque (diga no motivo).`);
      const soTabela = o.exhibits.every(e => /tabela/i.test(String(e)));
      if (soTabela && !/financ|demonstra|dre|balan|fluxo de caixa|comparaveis|transac|premissa/i.test(o.tipo + ' ' + o.motivo)) throw new Error(`decidir("${o.slide}"): slide so com tabela(s). Tabela e para demonstracao financeira, comparaveis, transacoes ou premissas; para o resto use grafico anotado, mapa, cadeia, citacao... (INDICE.md).`);
      const nTab = o.exhibits.filter(e => /tabela/i.test(String(e))).length;
      if (nTab > 1) console.warn(`AVISO: o slide "${o.slide}" tem ${nTab} tabelas; nas referencias e no maximo 1 por slide.`);
    }
    if (!Array.isArray(o.alternativas) || o.alternativas.filter(a => a && a.arranjo && a.motivo).length < 2) {
      throw new Error(`decidir("${o.slide}"): considere pelo menos 2 arranjos alternativos, cada um com { arranjo, motivo } (por que foi descartado). A organizacao vem do conteudo, nao do molde.`);
    }
    (o.formas || []).forEach(f => { if (PROIB.funcoes[f]) throw new Error(`decidir("${o.slide}"): a forma "${f}" e PROIBIDA (${PROIB.funcoes[f].motivo}). Alternativa: ${PROIB.funcoes[f].alternativa}.`); });
    const ant = decisoes[decisoes.length - 1];
    if (ant && norm(ant.arranjo) === norm(o.arranjo)) console.warn(`AVISO: o slide "${o.slide}" repete o arranjo "${o.arranjo}" do slide anterior ("${ant.slide}"). Varie, ou justifique no motivo.`);
    const prev = historico.find(h => norm(h.tipo) === norm(o.tipo) && norm(h.arranjo) === norm(o.arranjo));
    if (prev) console.warn(`AVISO: o tipo "${o.tipo}" ja usou o arranjo "${o.arranjo}" no deck anterior ("${prev.slide}"). Varie, ou justifique no motivo.`);
    decisoes.push({ revelacao: o.revelacao || 0, aprendi: o.aprendi || '', referencias: o.referencias || [], exhibits: o.exhibits || [], slide: o.slide, tipo: o.tipo, mensagem: o.mensagem, arranjo: o.arranjo, divisao: o.divisao || '', formas: o.formas || [], alternativas: o.alternativas, motivo: o.motivo });
  }
  function gravarRegistro(arquivo) {
    if (nConteudo > decisoes.length) console.warn(`AVISO: ${nConteudo} slide(s) de conteudo e ${decisoes.length} decisao(oes) registrada(s). Registre cada slide com deck.decidir (SKILL.md, secao 4A).`);
    if (!decisoes.length) return;
    const base = path.join(path.dirname(arquivo), 'registro_decisoes');
    fs.writeFileSync(base + '.json', JSON.stringify(decisoes, null, 2));
    const md = ['# Registro de decisoes de organizacao', '', `Deck: ${path.basename(arquivo)}`, '',
      '## Sorteio do deck (estilo_deck.json)', '',
      `- Cabecalho de bloco: ${SORT.estiloCabecalho} [${SORT.origem.estiloCabecalho}]`, `- Estilo de titulo: ${SORT.estiloTitulo} [${SORT.origem.estiloTitulo}]`,
      `- Cor do titulo / dos cabecalhos: ${SORT.corTitulo} / ${SORT.corCabecalho}`, `- Conjunto de sumarios: ${SORT.sumarios.join(', ')} [${SORT.origem.sumarios}]`,
      `- Sumarios desenhados: ${usosSumario.length ? usosSumario.map(u => `${u.secao} (${u.funcao}: ${u.estilo})`).join('; ') : '(nenhum)'}`, ''].concat([
      'Anexe o arquivo `registro_decisoes.json` e o `estilo_deck.json` no proximo pedido para a skill evitar repetir arranjos e estilos.', '']);
    decisoes.forEach((d, i) => {
      md.push(`## ${i + 1}. ${d.slide} (${d.tipo})`, '', `- **Mensagem:** ${d.mensagem}`, `- **Arranjo:** ${d.arranjo}${d.divisao ? ` (divisao \`${d.divisao}\`)` : ''}`,
        d.formas.length ? `- **Formas:** ${d.formas.join(', ')}` : '- **Formas:** (nao informadas)', `- **Por que:** ${d.motivo}`, '- **Alternativas consideradas:**');
      d.alternativas.forEach(a => md.push(`  - ${a.arranjo}: ${a.motivo}`));
      md.push('');
    });
    // 16/11/2026: nenhum .md ao lado do deck (pedido do usuario). O .json fica para o QA e para o historico; nao e entregue.
    if (cfg.registroMd) fs.writeFileSync(base + '.md', md.join('\n'));
    console.log('registro de decisoes (interno, nao entregar): ' + base + '.json');
  }
  // Tamanho fixo: reescrever o titulo longo, nunca encolher a fonte.
  const TITULO_PT = 26;
  // *palavras* entre asteriscos: em 'padrao' escurecem; em 'destaque' (titulo escuro + fio vertical) ficam na dominante.
  const ESCURO_TIT = tom(COR.texto, -0.25);
  // O titulo e a frase de apoio preenchem os placeholders TITULO e APOIO do layout (posicao e estilo vem do slide master);
  // Nao ha reducao automatica do tamanho de fonte.
  // runs do titulo conforme o estilo sorteado (sem fio vertical: 'destaque' segue proibido)
  //  padrao : *palavras* contrastam com o resto (dominante x escuro)
  //  assunto: "Assunto: conclusao": o assunto (ate o primeiro ': ') na dominante, a conclusao em escuro; sem ':' cai em padrao
  //  italico: *termo* em italico na mesma cor do titulo (como o Orizon faz com "Pricing Power", "gate fee")
  function runsTitulo(texto, pt) {
    const base = { bold: true, fontSize: pt };
    const partes = (t, fn) => t.split(/(\*[^*]+\*)/).filter(Boolean).map(p => /^\*.*\*$/.test(p) ? fn(p.slice(1, -1), true) : fn(p, false));
    if (EST_TIT === 'assunto') {
      const m = texto.replace(/\*/g, '').match(/^([^:]{3,45}):\s+(.+)$/);
      if (m) return [{ text: m[1] + ': ', options: Object.assign({}, base, { color: COR.dom }) }, { text: m[2], options: Object.assign({}, base, { color: tom(COR.texto, -0.55) }) }];
    }
    if (EST_TIT === 'italico') return partes(texto, (t, ital) => ({ text: t, options: Object.assign({}, base, { color: COR_TIT, italic: ital }) }));
    return partes(texto, (t, dest) => ({ text: t, options: Object.assign({}, base, { color: dest ? (SORT.corTitulo === 'escuro' ? COR.dom : COR.escuro) : COR_TIT }) }));
  }
  function titulo(s, texto, apoio) {
    const limpo = texto.replace(/\*/g, ''), wBox = LOGO_X - X0 - 0.3;
    const pt = TITULO_PT;
    if (/\r|\n/.test(limpo) || larg(limpo, pt, true) > wBox - 0.05) throw new Error(`Reescreva o titulo para caber em uma linha a ${pt}pt. Nao reduzir a fonte: "${limpo}"`);
    if (apoio && typeof apoio === 'string' && nLinhas(apoio, 14, wBox, false) > 2) throw new Error('Reescreva o subtitulo: maximo de duas linhas a 14pt.');
    const runs = runsTitulo(texto, pt);
    s.addText(runs, { placeholder: 'TITULO', wrap: false });
    if (apoio) s.addText(apoio, { placeholder: 'APOIO', fontSize: 14 });
    return pt;
  }
  // barrinha de duas pecas (topo escuro + base em degrade, corte diagonal) desenhada no proprio slide, para divisoes que nao
  // sao recortes da grade 2x2 (nesses casos nao ha layout no master). Nos layouts quem desenha e marcadores.py.
  let nMarc = 0;
  function marcadorSlide(s, x, y) {
    const n = ++nMarc, w = MARC_W, h = MARC_H;
    const peca = (nome, pts, cor) => s.addShape(pres.shapes.CUSTOM_GEOMETRY, { x, y, w, h, objectName: nome,
      points: pts.map(([px, py]) => ({ x: px * w / 1000, y: py * h / 1000 })).concat([{ close: true }]), fill: { color: cor }, line: { type: 'none' } });
    peca('MARC_topo_s' + n, [[0, 0], [1000, 0], [1000, 140], [0, 380]], MARC.topo);
    formas.degrades['GR_marcador_' + n] = { ang: 90, stops: [[0, MARC.g0, 100], [100, MARC.g1, 100]] };
    peca('GR_marcador_' + n, [[0, 560], [1000, 320], [1000, 1000], [0, 1000]], MARC.g1);
  }
  // cabecalho do bloco no estilo do deck; devolve quanto ele ocupa em altura (sem o respiro)
  function cabecalho(s, x, y, w, t, sub, estilo = EST_CAB) {
    const tt = (conteudo, o) => { const esc = s.__escala; s.__escala = 1; try { return s.addText(conteudo, Object.assign({ fontFace: F, margin: 0, isTextBox: true, objectName: o.bold ? 'CAB_TITULO' : 'CAB_SUBTITULO' }, o)); } finally { s.__escala = esc; } };
    if (typeof t === 'string' && nLinhas(t, 13.5, w - MARC_TX, true) > 1) throw new Error('Reescreva o cabecalho do bloco para caber a 13.5pt: ' + t);
    if (PROIB.estilosCabecalho.includes(estilo)) throw new Error(`estilo de cabecalho "${estilo}" e PROIBIDO. Use marcador, linha, sublinhado, aba ou faixa.`);
    if (estilo === 'marcador') {   // mesma estrutura dos layouts de quadrantes: barrinha + titulo + subtitulo
      marcadorSlide(s, x, y);
      tt(t, { x: x + MARC_TX, y, w: w - MARC_TX, h: TIT_H, fontSize: 13.5, bold: true, color: COR_CAB, valign: 'bottom' });
      if (sub) tt(sub, { x: x + MARC_TX, y: y + SUB_DY, w: w - MARC_TX, h: SUB_H, fontSize: 11.5, color: COR.cinza, valign: 'top' });
      return MARC_H;
    }
    if (estilo === 'texto') {   // titulo e subtitulo sem marcador nem linha (bloco unico em deck 'marcador')
      tt(t, { x, y, w, h: TIT_H, fontSize: 13.5, bold: true, color: COR_CAB, valign: 'bottom' });
      if (sub) tt(sub, { x, y: y + SUB_DY, w, h: SUB_H, fontSize: 11.5, color: COR.cinza, valign: 'top' });
      return MARC_H;
    }
    if (estilo === 'frase') {   // Nubank, Tech, Vivara, Vibra: frase-tese em peso normal com palavras-chave em negrito na cor (runs) + legenda italica pequena
      tt(t, { x, y, w, h: 0.36, fontSize: 10.5, color: tom(COR.texto, -0.4), valign: 'bottom' });
      if (sub) tt(sub, { x, y: y + 0.39, w, h: 0.17, fontSize: 8, italic: true, color: cfg.corLegenda === 'cinza' ? COR.cinza : COR.dom, valign: 'top' });
      return sub ? 0.56 : 0.36;
    }
    if (estilo === 'sublinhado') {
      tt(t, { x, y, w, h: 0.32, fontSize: 13.5, bold: true, color: ESCURO_TIT, valign: 'bottom' });
      const yl = sub ? y + 0.68 : y + 0.36;
      if (sub) tt(sub, { x, y: y + 0.36, w, h: 0.28, fontSize: 11.5, color: COR.cinza, valign: 'middle' });
      s.addShape(pres.shapes.LINE, { x, y: yl, w, h: 0, line: { color: 'A6A6A6', width: 0.75 } });
      return yl - y + 0.02;
    }
    tt(t, { x, y, w, h: 0.3, fontSize: 13.5, bold: true, color: COR_CAB, valign: 'bottom' });
    s.addShape(pres.shapes.LINE, { x, y: y + 0.34, w, h: 0, line: { color: COR.dom, width: 1 } });
    if (sub) tt(sub, { x, y: y + 0.4, w, h: 0.28, fontSize: 11.5, color: COR.cinza, valign: 'middle' });
    return sub ? 0.68 : 0.36;
  }
  function unidade(s, x, y, w, t) {
    s.addText(t, { x, y, w, h: 0.18, fontFace: F, fontSize: 8, italic: true, color: COR.cinza, margin: 0, isTextBox: true, objectName: 'UNIDADE' });
  }
  // Fonte: no rodape, abaixo da linha divisoria, alinhada a direita; comeca depois do fluxo e termina antes da logo (nunca encosta em nenhum).
  function fontes(s, t) {
    const x = X0 + (s.__fluxoW || 0) + 0.35, w = Math.max(2, X_FIM_LINHA - 0.15 - x);
    const escFonte = s.__escala; s.__escala = 1;
    s.addText(t, { x, y: Y_RODAPE, w, h: H_RODAPE, fontFace: F, fontSize: 8, italic: true, color: COR.cinza, margin: 0, align: 'right', valign: 'middle', isTextBox: true, objectName: 'FONTES' });
    s.__escala = escFonte;
  }
  // Sem notas de rodape: ressalva ou informacao adicional vai para o apendice ou para um slide seguinte de pop-up (deck.revelar / popup).
  function notas() {
    throw new Error('deck.notas foi removido: nao ha "Notas:" no rodape. Se a informacao importa, coloque-a no slide (anotacao curta), num slide de pop-up logo depois (deck.revelar) ou no apendice.');
  }

  // ---------- divisao do miolo em quadrantes ----------
  const GX = 0.34, GY = 0.2, soma = (a) => a.reduce((x, y) => x + y, 0);
  function linhasDe(rows, alturas) {   // rows: [[pesos das colunas de cada linha]]; devolve retangulos linha a linha
    const pa = alturas || rows.map(() => 1), hTot = AREA.h - GY * (rows.length - 1), out = [];
    let y = AREA.y;
    rows.forEach((pesos, i) => {
      const h = hTot * pa[i] / soma(pa), wTot = AREA.w - GX * (pesos.length - 1);
      let x = AREA.x;
      pesos.forEach(p => { const w = wTot * p / soma(pesos); out.push({ x, y, w, h }); x += w + GX; });
      y += h + GY;
    });
    return out;
  }
  function colunasDe(cols, larguras) {   // cols: [[pesos dos blocos empilhados em cada coluna]]; devolve coluna a coluna
    const pl = larguras || cols.map(() => 1), wTot = AREA.w - GX * (cols.length - 1), out = [];
    let x = AREA.x;
    cols.forEach((pesos, i) => {
      const w = wTot * pl[i] / soma(pl), hTot = AREA.h - GY * (pesos.length - 1);
      let y = AREA.y;
      pesos.forEach(p => { const h = hTot * p / soma(pesos); out.push({ x, y, w, h }); y += h + GY; });
      x += w + GX;
    });
    return out;
  }
  const grade = (spec) => spec.colunas ? colunasDe(spec.colunas, spec.larguras) : linhasDe(spec.linhas, spec.alturas);
  // tipos: '1' | '2c' | '3c' | '4c' (colunas) | '2f' | '3f' (faixas empilhadas) | '2x2' | '1+2' (1 em cima, 2 embaixo) |
  //        '2+1' | 'L' (bloco alto a esquerda + n empilhados a direita) | 'Linv' (n empilhados a esquerda + bloco alto a direita)
  // opcoes: pesos (larguras relativas), alturas (alturas relativas), n (blocos empilhados no L)
  function divisao(tipo, o = {}) {
    const p = o.pesos, a = o.alturas, n = o.n || 2;
    const T = {
      '1': () => linhasDe([[1]]), '2c': () => linhasDe([p || [1, 1]]), '3c': () => linhasDe([p || [1, 1, 1]]), '4c': () => linhasDe([p || [1, 1, 1, 1]]),
      '2f': () => linhasDe([[1], [1]], a), '3f': () => linhasDe([[1], [1], [1]], a), '2x2': () => linhasDe([[1, 1], [1, 1]], a),
      '1+2': () => linhasDe([[1], p || [1, 1]], a), '2+1': () => linhasDe([p || [1, 1], [1]], a),
      '3+1': () => linhasDe([p || [1, 1, 1], [1]], a || [1.6, 1]),
      'L': () => colunasDe([[1], Array(n).fill(1)], p || [1, 1.2]), 'Linv': () => colunasDe([Array(n).fill(1), [1]], p || [1.2, 1]),
      'Lc': () => colunasDe([[1], Array(n).fill(1), [1]], p || [1, 1.15, 1]),
    };
    if (!T[tipo]) throw new Error(`divisao desconhecida: ${tipo}. Use: ${Object.keys(T).join(', ')}`);
    return T[tipo]();
  }
  // desenha o cabecalho do bloco no estilo do deck (ou no estilo pedido) e devolve a area interna
  function bloco(s, r, cab, sub, estilo = EST_CAB) {
    if (estilo === 'aba') return formas.painelAba(s, { x: r.x, y: r.y, w: r.w, h: r.h, titulo: cab, marcador: sub, estilo: 'aba' });
    if (estilo === 'faixa') return formas.painelAba(s, { x: r.x, y: r.y, w: r.w, h: r.h, titulo: cab, marcador: sub, estilo: 'faixa' });
    const dy = 0.03 + cabecalho(s, r.x, r.y + 0.03, r.w, cab, sub, estilo) + 0.08;
    return { x: r.x, y: r.y + dy, w: r.w, h: r.h - dy };
  }
  // blocos(s, '2x2', [{ cab, sub, estilo? }, ...]): divide, desenha os cabecalhos e devolve as areas internas.
  // Numeral romano so no estilo 'linha'. Item null = bloco sem cabecalho (devolve o retangulo inteiro).
  // { numerar: false } desliga os numerais; item.estilo troca o estilo so daquele bloco ('linha' | 'marcador' | 'sublinhado' | 'aba' | 'faixa').
  // blocos(s, itens) em slide com layout de quadrantes (novoSlide(secao, { layout })): preenche os placeholders de titulo e subtitulo
  // de cada quadrante do master (a barrinha ja esta no layout) e devolve as areas internas, na ordem dos quadrantes do layout.
  function blocosLayout(s, itens) {
    const q = s.__quad;
    if (itens.length !== q.rects.length) throw new Error(`o layout ${q.chave} (${q.nome}) tem ${q.rects.length} quadrantes, mas recebeu ${itens.length} itens`);
    if (q.emulado) {   // sem layout no master: desenha o cabecalho de cada quadrante no estilo sorteado do deck
      const romano = ['I', 'II', 'III', 'IV'];
      return q.rects.map((r, i) => {
        const it = itens[i];
        if (!it || !it.cab) throw new Error(`quadrante ${i + 1} do layout ${q.chave} sem "cab". Use um layout com menos quadrantes.`);
        const est = it.estilo || EST_CAB, numerar = est === 'linha' || (!!cfg.numerarBlocos && est !== 'frase');
        const cab = !numerar || typeof it.cab !== 'string' || /^[IVX]+\./.test(it.cab) ? it.cab : `${romano[i]}. ${it.cab}`;
        return bloco(s, r, cab, it.sub, est);
      });
    }
    return q.rects.map((r, i) => {
      const it = itens[i];
      if (!it || !it.cab) throw new Error(`quadrante ${i + 1} do layout ${q.chave} sem "cab": o marcador ja esta no master. Use um layout com menos quadrantes.`);
      if(typeof it.cab === 'string' && nLinhas(it.cab,13.5,r.w-MARC_TX,true)>1)throw new Error('Reescreva o cabecalho de quadrante a 13.5pt: '+it.cab);
      s.addText(it.cab, { placeholder: `Q${i + 1}_TIT`,fontSize:13.5 });
      if (it.sub) s.addText(it.sub, { placeholder: `Q${i + 1}_SUB`,fontSize:11.5 });
      return { x: r.x, y: r.y + HDR_DY, w: r.w, h: r.h - HDR_DY };
    });
  }
  // areas internas dos quadrantes de cada slide: o QA usa (blocos_deck.json) para achar quadrante com lacuna (1 frase e o resto em branco)
  const AREAS_BLOCOS = [];
  function blocos(s, ...args) {
    const out = blocosBase(s, ...args);
    try { AREAS_BLOCOS.push({ s, rects: out.filter(r => r && r.w && r.h).map(r => ({ x: +r.x.toFixed(3), y: +r.y.toFixed(3), w: +r.w.toFixed(3), h: +r.h.toFixed(3) })) }); } catch (e) { }
    return out;
  }
  function blocosBase(s, tipo, itens, o = {}) {
    if (Array.isArray(tipo)) { o = itens || {}; itens = tipo; tipo = s.__quad ? s.__quad.chave : undefined; }
    if (s.__quad && (tipo === undefined || tipo === s.__quad.chave)) return blocosLayout(s, itens);
    if (!tipo) throw new Error('blocos(s, itens): o slide nao usa layout de quadrantes; informe a divisao: blocos(s, \'2c\', itens)');
    if (s.__quad) throw new Error(`o slide usa o layout ${s.__quad.chave}; blocos(s, '${tipo}', ...) pediria outra divisao. Use blocos(s, itens) ou crie o slide com outro layout.`);
    const rects = divisao(tipo, o), romano = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    if (itens.length !== rects.length) throw new Error(`divisao ${tipo} tem ${rects.length} blocos, mas recebeu ${itens.length} itens`);
    return rects.map((r, i) => {
      const it = itens[i];
      if (!it) return r;
      // 1 quadrante so: sem marcador (regra do usuario); com cab/sub, so o texto
      const est = it.estilo || (EST_CAB === 'marcador' && tipo === '1' ? 'texto' : EST_CAB), numerar = o.numerar !== undefined ? o.numerar : (est === 'linha' || (!!cfg.numerarBlocos && est !== 'frase'));
      const cab = !numerar || typeof it.cab !== 'string' || /^[IVX]+\./.test(it.cab) ? it.cab : `${romano[i]}. ${it.cab}`;
      return bloco(s, r, cab, it.sub, est);
    });
  }

  criarLayouts();   // depois da grade: os layouts de quadrantes usam linhasDe

  // ---------- capa ----------
  // capa({ modelo, titulo, subtitulo?, integrantes, creditos?, empresas?, logos?, imagem?, tema?, recomendacao?, ... })
  // A estrutura de cada modelo e copiada dos decks de referencia do usuario (references/capas.md). Sem barra lateral.
  const resolverImagem = (caminho, tema) => { const a = caminho || daBiblioteca(tema); if (!caminho && a) console.log(`imagem da biblioteca para "${tema}": ${path.basename(a)} (confirmar com o usuario)`); return a && fs.existsSync(a) ? a : null; };
  const CAPAS = require(path.join(AQUI, 'capas.js'))({ pres, COR, F, caber, imagem, resolverImagem, degrades: formas.degrades, tom, mistura, py, temPillow, tmp, nLinhas, contraste, cfgLogos: cfg.logos || {} });
  function capa(o) {
    const s = pres.addSlide({ masterName: 'Capa' });
    garantirBarra(s);   // a barra e desenhada no 1o slide e movida pelo barra_lateral.py so para os layouts de conteudo
    CAPAS.desenhar(s, o);
    return s;
  }

  const SUM = require(path.join(AQUI, 'sumarios.js'))({ pres, COR, F, formas, tom, larg, X0, X1, AREA });
  // ---------- sumario / transicao ----------
  // Sumario: um unico modelo, fundo, imagem e identidade no deck; apenas o item ativo muda.
  // Escolher no config estiloSumario. Qualquer override divergente por slide e rejeitado.
  const SUME = require(path.join(AQUI, 'sumario_cores.js'))({ pres, COR, F, formas, tom, cfg });
  const usosSumario = [];
  function escolherEstiloSumario() { return SORT.estiloSumario; }
  let visualSumario = null;
  function sumario(secao, o = {}) {
    const funcao = o.itens ? 'pilares' : 'transicao';
    const desc0 = Object.assign({}, cfg.descricoes, o.descricoes);
    const lista = (FLUXO.porSecao[secao] || { secoes: cfg.secoes }).secoes;
    const itens = o.itens || lista.map(sec => ({ titulo: sec, desc: desc0[sec] }));
    const ativo = o.ativo !== undefined ? o.ativo : (o.itens ? null : lista.indexOf(secao));
    const estilo = o.estilo || escolherEstiloSumario();
    if (estilo !== SORT.estiloSumario) throw new Error('O modelo de sumario e unico no deck: ' + SORT.estiloSumario);
    // imagem (foto do assunto), composicao (fotoEsquerda|fotoDireita|fotoFundo|cheio), moldura ({ titulo, fios, logo }) e logoEmpresa:
    // sorteados/definidos uma vez e iguais em todos os sumarios do deck (feedback 23/11/2026)
    const imagem = o.imagem || cfg.imagemSumario || null;
    const visual = {fundo:o.fundo || cfg.fundoSumario || IDENTIDADE.dados.paleta.secundaria30, fundo2:o.fundo2 || null, imagem,
      composicao: imagem ? (o.composicao || SORT.composicaoSumario) : 'cheio', moldura: typeof o.moldura === 'boolean' ? o.moldura : Object.assign({}, SORT.molduraSumario, o.moldura || {}),
      logoEmpresa: o.logoEmpresa || (cfg.logos && cfg.logos.analisada) || null};
    if (visualSumario && JSON.stringify(visual)!==JSON.stringify(visualSumario)) throw new Error('Manter o mesmo fundo, cores e imagem em todos os sumarios.');
    visualSumario = visual; o = Object.assign({},o,visual);

    if (!SUME.ESTILOS.includes(estilo)) throw new Error(`estilo de sumario desconhecido: "${estilo}". Use: ${SUME.ESTILOS.join(', ')}`);
    const s = pres.addSlide({ masterName: 'Capa' });
    garantirBarra(s);   // sem barra no slide; se for o 1o slide, a barra e desenhada e movida como na capa
    SUME.desenhar(s, estilo, itens, ativo, o);
    usosSumario.push({ secao, funcao, estilo });
    console.log(`sumario (${funcao}) "${secao}": estilo ${estilo}, composicao ${visual.composicao}, moldura ${JSON.stringify(visual.moldura)}`);
    return s;
  }

  // indice (colunas por tema, itens sublinhados com link): indice(secao, { titulo, grupos: [{ titulo, itens: [{ texto, slide? }] }], colunas? })
  function indice(secao, o) {
    const s = novoSlide(secao);
    nConteudo--;
    titulo(s, o.titulo || 'Índice', o.apoio);
    SUM.indice(s, o.grupos, o);
    return s;
  }
  // resumo executivo: slide de conteudo (pede deck.decidir) com 2 ou 4 mini-exhibits numerados e uma conclusao sobre cada faixa
  function resumoExecutivo(secao, o) {
    const s = novoSlide(secao);
    titulo(s, o.titulo || 'Resumo executivo', o.apoio);
    SUM.resumoExecutivo(s, o);
    return s;
  }

  // ---------- revelacao progressiva (decks Insper Jr) ----------
  // revelar(secao, n, desenhar, o?): cria o MESMO slide varias vezes (copias com estados), como os PDFs Insper Jr exportados com
  // animacao. desenhar(s, estado, ctx) desenha o slide inteiro; estado = null na pagina-base (tudo visivel, opcional) e 0..n-1 nas
  // paginas em que o item `estado` acende (ctx.destacar) ou abre um card ampliado (ctx.popup / ctx.esmaecer).
  // o: { layout?, semBase? (nao gera a pagina-base), max? }. Conta como UM slide de conteudo (um deck.decidir com revelacao: n).
  function revelar(secao, n, desenhar, o = {}) {
    if (!Number.isInteger(n) || n < 1) throw new Error('revelar: informe n (quantidade de itens revelados, 1 a 6)');
    if (n > (o.max || 6)) throw new Error(`revelar: ${n} estados e demais (maximo ${o.max || 6}); as referencias revelam de 2 a 6 itens. Agrupe itens ou divida o slide.`);
    const estados = (o.semBase ? [] : [null]).concat([...Array(n).keys()]);
    return estados.map((e, i) => {
      const s = novoSlide(secao, o);
      if (i > 0) nConteudo--;
      s.__revelacao = { estado: e, total: n };
      const ctx = { estado: e, total: n, base: e === null,
        esmaecer: (r, nivel) => SUM.esmaecer(s, r, nivel), destacar: (rects, ativo, nivel) => SUM.destacar(s, rects, ativo == null ? [] : ativo, nivel),
        popup: (op) => SUM.popup(s, op) };
      desenhar(s, e, ctx);
      return s;
    });
  }

  // ---------- finalizacao ----------
  async function finalizar(arquivo, estilosGraficos) {
    const usadas = Object.keys(USO_FRAMEWORK);
    if (nConteudo >= 5 && usadas.length === 0) console.warn(`AVISO: ${nConteudo} slides de conteudo e nenhuma forma do framework (lajesEmpilhadas, colunasEquacao, cardsLigados, chipsHexagonais...) nem das formas novas (deck.N.piramideFacetada, funilTroncos, sanfona...). Releia a tabela "Formas do framework" do SKILL.md e veja se algum slide e hierarquia, funil, camadas, pilares ou etapas; se nenhum for, siga (nao force).`);
    else console.log(`formas do framework usadas: ${usadas.length} de ${FORMAS_FRAMEWORK.length}${usadas.length ? ' (' + usadas.join(', ') + ')' : ''}`);
    await pres.writeFile({ fileName: arquivo });
    try { const bl = {}; AREAS_BLOCOS.forEach(a => { const n = pres.slides.indexOf(a.s) + 1; if (n > 0) bl[n] = (bl[n] || []).concat(a.rects); }); fs.writeFileSync(path.join(path.dirname(path.resolve(arquivo)), 'blocos_deck.json'), JSON.stringify(bl)); } catch (e) { console.warn('AVISO: nao gravei blocos_deck.json: ' + e.message); }
    if (path.dirname(path.resolve(arquivo)) !== process.cwd()) fs.copyFileSync(path.join(process.cwd(),'identidade_visual.json'),path.join(path.dirname(path.resolve(arquivo)),'identidade_visual.json'));
    const tj = arquivo + '.tema.json';   // tema.py (da propria skill) grava as cores do deck e corrige defeitos do pptxgenjs
    fs.writeFileSync(tj, JSON.stringify({ name: 'Tema do deck', colors: { dk1: '000000', lt1: 'FFFFFF', dk2: COR.dom, lt2: COR.fundo, accent1: COR.dom,
      accent2: COR.dest, accent3: COR.cinza, accent4: COR.escuro, accent5: COR.clara, accent6: 'C0504D', hlink: COR.dom, folHlink: COR.cinza } }));
    execFileSync(PYTHON, [path.join(AQUI, 'tema.py'), arquivo, tj]);
    fs.unlinkSync(tj);
    const tmpJson = arquivo + '.degrades.json';
    fs.writeFileSync(tmpJson, JSON.stringify(Object.assign({}, GRAD, formas.degrades)));
    execFileSync(PYTHON, [path.join(AQUI, 'barra_lateral.py'), arquivo, tmpJson]);
    fs.unlinkSync(tmpJson);
    const tm = arquivo + '.marc.json';   // marcadores.py: barrinha dos quadrantes nos layouts, margens dos placeholders, limpeza de placeholders vazios
    fs.writeFileSync(tm, JSON.stringify(MARC));
    execFileSync(PYTHON, [path.join(AQUI, 'marcadores.py'), arquivo, tm]);
    fs.unlinkSync(tm);
    const tg = arquivo + '.graficos.json';   // sempre roda: tambem troca a fonte Arial dos graficos pela fonte do tema
    fs.writeFileSync(tg, JSON.stringify(Object.assign({}, formas.estilosGraficos || {}, estilosGraficos || {})));
    console.log(execFileSync(PYTHON, [path.join(AQUI, 'graficos.py'), arquivo, tg]).toString().trim());
    fs.unlinkSync(tg);
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
    try { fs.writeFileSync(path.join(path.dirname(arquivo), 'modo_deck.txt'), MODO); } catch (e) {}
    // veto tipografico do usuario (2026-11-15): travessao, meia-risca, sinal de menos e ponto medio dao "cara de IA"
    const achados = execFileSync(PYTHON, ['-I', path.join(AQUI, 'vetos_texto.py'), arquivo]).toString().trim();
    if (achados) { gravarRegistro(arquivo); throw new Error('TEXTO VETADO no deck (o arquivo foi gerado, mas corrija e rode de novo):\n' + achados + '\nSubstitua: faixa "25-40" vira "25 a 40"; "D-60" usa hifen; negativo usa hifen; separador usa virgula, ponto e virgula ou "|"; frase com travessao vira duas frases ou usa dois pontos.'); }
    gravarRegistro(arquivo);
    const ordemSlides = pres.slides.map(x => x);
    require(path.join(AQUI, 'fluxos.js')).gerar(path.dirname(path.resolve(arquivo)), FLUXO, slidesFluxo.map(x => ({ secao: x.secao, n: ordemSlides.indexOf(x.slide) + 1 })), arquivo, { gravarMd: !!cfg.fluxoMd });
    console.log('deck gerado: ' + arquivo);
  }

  // formas novas (rodada 3): carregadas aqui, sem regravar codigo a cada deck. Uso: deck.N.piramideFacetada(s, {...})
  const N = require(path.join(AQUI, 'formas_novas.js'))(pres, COR, F, formas.degrades);   // degrades: sanfona e ponte (aprovadas em 22/11/2026)
  // formas aposentadas (16/11/2026): saiam distorcidas em relacao as referencias
  [['piramide3D', 'deck.N.piramideFacetada'], ['funilPrismas', 'deck.N.funilTroncos']].forEach(([nome, alt]) => { formas[nome] = () => { throw new Error(`"${nome}" foi aposentada (saia distorcida). Use ${alt}.`); }; });
  const api = { N, pres, formas, COR, F, B, tom, X0, X1, LARG: X1 - X0, AREA, txt, novoSlide, titulo, cabecalho, unidade, fontes, notas,
    grade, divisao, bloco, blocos, livre, QUAD, capa, sumario, indice, resumoExecutivo, sorteio: SORT,
    popup: SUM.popup, esmaecer: SUM.esmaecer, destacar: SUM.destacar, faixaPergunta: SUM.faixaPergunta, imagem, painel, caber, decidir, finalizar, revelar, MODO };
  const compPath = path.join(AQUI, 'composicoes.js');
  if (fs.existsSync(compPath)) api.composicoes = require(compPath)(api);
  return api;
};
