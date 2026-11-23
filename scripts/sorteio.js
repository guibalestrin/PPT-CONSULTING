// sorteio.js -- sorteia, UMA vez por projeto, os estilos que o projeto manda variar a cada execucao:
// convencao de cabecalho de bloco, estilo de titulo, cor do titulo, cor dos cabecalhos e o modelo unico de sumario.
// (A barra lateral tem o proprio sorteio em moldura.js, gravado em estilo_barra.txt.)
//
// Regras:
//  - nada tem valor padrao: sem pedido explicito no config, o estilo e SORTEADO (Math.random, sem criterio de contexto);
//  - o resultado fica gravado em estilo_deck.json na pasta do projeto, para que slides acrescentados depois (build refeito)
//    mantenham o mesmo estilo. Projeto novo = pasta nova ou apagar estilo_deck.json;
//  - um valor nomeado no config vence o sorteio so para aquele item (use apenas quando o usuario nomear o estilo);
//  - estilos listados em proibicoes.js nunca entram no sorteio.
const fs = require('fs');
const path = require('path');

const OPCOES = {
  estiloCabecalho: ['linha', 'marcador', 'sublinhado', 'aba', 'frase', 'texto'],
  // 'padrao': titulo na cor (ou escuro), *palavras* contrastam | 'assunto': "Assunto: conclusao" com o assunto na dominante
  // (Kepler/Orizon em slides de panorama) | 'italico': *termo* em italico, mesma cor (Orizon: "Captura do *Pricing Power* ...")
  estiloTitulo: ['padrao', 'assunto', 'italico'],
  corTitulo: ['dom', 'escuro'],
  corCabecalho: ['dom', 'escuro'],
};
// sumarios de slide cheio, na cor fixa escolhida da paleta do projeto (sumario_cores.js), todos fieis a uma referencia (orizon_p012, agrion_p002, mabg_p002, vivara_p007)
// VETADOS pelo usuario: 'cartoes' (16/11/2026: colunas altas so com numero e titulo, quase tudo vazio) e 'circulos' (22/11/2026: a
// referencia orizon_p012 que deu origem a ele foi reprovada). Nao sao sorteados nem aceitos no config.
const SUMARIOS = ['pilulas', 'paralelogramos', 'faixas_logo', 'hexagonos_arco', 'trilha_pergunta', 'losangos_celular', 'objeto_marcadores'];
// capacidade de itens de cada modelo (a lista do sumario precisa caber): o sorteio so considera os que comportam cfg.maxItensSumario
const MAX_ITENS = { pilulas: 10, paralelogramos: 10, faixas_logo: 8, hexagonos_arco: 6, trilha_pergunta: 10, losangos_celular: 5, objeto_marcadores: 8 };
// objeto_marcadores so entra no sorteio quando o caso tem uma silhueta de setor (cfg.silhueta; ver silhuetas.js)
const SUMARIOS_VETADOS = ['cartoes', 'circulos'];

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const amostra = (a, n) => { const c = a.slice(), out = []; while (out.length < n && c.length) out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); return out; };

module.exports = function sortear(cfg, PROIB, cwd = process.cwd()) {
  const arq = path.join(cwd, 'estilo_deck.json');
  let salvo = {};
  try { salvo = JSON.parse(fs.readFileSync(arq, 'utf8')) || {}; } catch (e) { salvo = {}; }
  const proibidos = { estiloCabecalho: PROIB.estilosCabecalho || [], estiloTitulo: PROIB.estilosTitulo || [] };
  const r = { origem: {}, opcoes: {} };
  Object.keys(OPCOES).forEach(k => {
    const validas = OPCOES[k].filter(o => !(proibidos[k] || []).includes(o));
    r.opcoes[k] = validas;
    const pedido = cfg[k];
    if (pedido && pedido !== 'aleatorio') {
      if (!validas.includes(pedido)) {
        const vetado = (proibidos[k] || []).includes(pedido);
        throw new Error(`${k} ${vetado ? 'PROIBIDO' : 'desconhecido'}: "${pedido}". Use: ${validas.join(', ')} (ou omita para sortear)`);
      }
      r[k] = pedido; r.origem[k] = 'informado';
    } else if (validas.includes(salvo[k])) { r[k] = salvo[k]; r.origem[k] = 'mantido'; }
    else { r[k] = pick(validas); r.origem[k] = 'sorteado'; }
  });
  // Um único modelo por apresentação. Filtrar pela maior lista ANTES de sortear.
  const nMax = Math.max(1, Number(cfg.maxItensSumario) || 1);
  const validos = SUMARIOS.filter(e => (MAX_ITENS[e] || 10) >= nMax && (e !== 'objeto_marcadores' || cfg.silhueta));
  const leg = Array.isArray(cfg.estilosSumario) ? [...new Set(cfg.estilosSumario)] : [];
  if (leg.length > 1) throw new Error('estilosSumario: use apenas UM modelo por apresentacao; nao alternar estilos.');
  const pedido = cfg.estiloSumario || leg[0];
  if (SUMARIOS_VETADOS.includes(pedido)) throw new Error(`estiloSumario "${pedido}" foi VETADO pelo usuario. Use: ${SUMARIOS.join(', ')} (ou omita para sortear).`);
  if (pedido && !validos.includes(pedido)) throw new Error('Modelo de sumario desconhecido ou incompativel com a maior lista: ' + pedido);
  const antigo = salvo.estiloSumario || (salvo.sumarios || []).find(e => validos.includes(e));
  r.estiloSumario = pedido || (validos.includes(antigo) ? antigo : pick(validos));
  r.sumarios = [r.estiloSumario];
  r.origem.sumarios = pedido ? 'informado' : (r.estiloSumario === antigo ? 'mantido/migrado' : 'sorteado');
  r.todosSumarios = SUMARIOS;
  const grava = Object.assign({}, salvo, { estiloCabecalho: r.estiloCabecalho, estiloTitulo: r.estiloTitulo, corTitulo: r.corTitulo, corCabecalho: r.corCabecalho, sumarios: r.sumarios, estiloSumario: r.estiloSumario });
  try { fs.writeFileSync(arq, JSON.stringify(grava, null, 2) + '\n'); } catch (e) { console.warn('AVISO: nao consegui gravar estilo_deck.json: ' + e.message); }
  console.log('Sorteio do deck (estilo_deck.json): ' + Object.keys(grava).map(k => `${k}=${Array.isArray(grava[k]) ? grava[k].join('+') : grava[k]} [${r.origem[k === 'sumarios' || k === 'estiloSumario' ? 'sumarios' : k] || 'proposto'}]`).join(' | '));
  return r;
};
module.exports.SUMARIOS = SUMARIOS;
module.exports.MAX_ITENS = MAX_ITENS;

// ---------- capa e sumario: elegibilidade pelo que o CASO tem e sorteio ----------
// elementos = o que existe para esta empresa: { foto, fotos, objetoPng, recomendacao, silhueta } (booleanos ou nome da silhueta).
// Um modelo so entra no sorteio se o elemento da marca que ele exige existe (references/capas.md, "Elemento da marca").
const CAPAS = { foto_lateral: ['foto'], circulo: [], ondas_foto: ['foto'], recomendacao: ['recomendacao'], radial: [], fita_padrao: [],
  triangulos_fotos: ['fotos'], poligonos_centro: [], foto_onda_base: ['foto'], produto_onda: ['objetoPng'], objeto_marca: ['silhueta'] };
const capasElegiveis = (el = {}) => Object.keys(CAPAS).filter(m => CAPAS[m].every(k => el[k]));
const sumariosElegiveis = (nItens, el = {}) => SUMARIOS.filter(e => (MAX_ITENS[e] || 10) >= nItens && (e !== 'objeto_marcadores' || el.silhueta));
// evitar = modelos usados no deck anterior (variacao entre decks); so e respeitado se sobrar alternativa
function sortearEntre(lista, evitar = []) { const livres = lista.filter(m => !evitar.includes(m)); return pick(livres.length ? livres : lista); }
const sortearCapa = (el, evitar) => sortearEntre(capasElegiveis(el), evitar);
const sortearSumario = (nItens, el, evitar) => sortearEntre(sumariosElegiveis(nItens, el), evitar);
// persistencia por projeto (estilo_deck.json): o modelo de capa fica gravado junto com o resto do sorteio
function lerEstilo(cwd = process.cwd()) { try { return JSON.parse(fs.readFileSync(path.join(cwd, 'estilo_deck.json'), 'utf8')) || {}; } catch (e) { return {}; } }
function gravarEstilo(extra, cwd = process.cwd()) { const o = Object.assign(lerEstilo(cwd), extra); fs.writeFileSync(path.join(cwd, 'estilo_deck.json'), JSON.stringify(o, null, 2) + '\n'); return o; }
Object.assign(module.exports, { CAPAS, capasElegiveis, sumariosElegiveis, sortearCapa, sortearSumario, lerEstilo, gravarEstilo });
module.exports.OPCOES = OPCOES;
