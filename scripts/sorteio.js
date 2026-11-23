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
// 'circulos' VOLTOU em 23/11/2026: o sumario Audemars Piguet em circulos com foto recortada a direita foi aprovado ("tava perfeito").
// VETADO pelo usuario: 'cartoes' (16/11/2026: colunas altas so com numero e titulo, quase tudo vazio). Historico: 'circulos' foi vetado em 22/11/2026 (a
// referencia orizon_p012 que deu origem a ele foi reprovada). Nao sao sorteados nem aceitos no config.
const SUMARIOS = ['pilulas', 'paralelogramos', 'circulos'];
const SUMARIOS_VETADOS = ['cartoes'];
// Feedback 23/11/2026: a foto do sumario nao fica sempre a direita, e titulo "Sumario", fios em cima/embaixo e logo nao sao obrigatorios.
// Sorteados uma vez por deck (gravados em estilo_deck.json) e mantidos em todas as transicoes. Sem foto, a composicao vira 'cheio'.
const COMPOSICOES_SUMARIO = ['fotoEsquerda', 'fotoDireita', 'fotoFundo'];
const TITULOS_SUMARIO = ['esquerda', 'centro', 'direita', 'nenhum'];

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
  const validos = SUMARIOS.filter(e => e !== 'cartoes' || nMax <= 5);
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
  const comp = cfg.composicaoSumario;
  if (comp && !COMPOSICOES_SUMARIO.concat('cheio', 'fotoDireitaFio').includes(comp)) throw new Error('composicaoSumario desconhecida: ' + comp + '. Use: ' + COMPOSICOES_SUMARIO.join(', ') + ', cheio');
  // fotoDireitaFio so com circulos (aprovado no AP; com pilulas foi reprovado no Bluefit); com circulos ela tem peso dobrado no sorteio
  const compValidas = r.estiloSumario === 'circulos' ? COMPOSICOES_SUMARIO.concat('fotoDireitaFio', 'fotoDireitaFio') : COMPOSICOES_SUMARIO;
  if (comp === 'fotoDireitaFio' && r.estiloSumario !== 'circulos') throw new Error('composicaoSumario fotoDireitaFio so com estiloSumario circulos (com pilulas foi reprovada).');
  r.composicaoSumario = comp || (compValidas.includes(salvo.composicaoSumario) ? salvo.composicaoSumario : pick(compValidas));
  const ms = salvo.molduraSumario && TITULOS_SUMARIO.includes(salvo.molduraSumario.titulo) ? salvo.molduraSumario : null;
  r.molduraSumario = Object.assign({}, ms || { titulo: pick(TITULOS_SUMARIO), fios: Math.random() < 0.35, logo: Math.random() < 0.5 }, cfg.molduraSumario || {});
  if (!TITULOS_SUMARIO.includes(r.molduraSumario.titulo)) throw new Error('molduraSumario.titulo: ' + TITULOS_SUMARIO.join(', '));
  r.origem.composicaoSumario = comp ? 'informado' : (r.composicaoSumario === salvo.composicaoSumario ? 'mantido' : 'sorteado');
  r.origem.molduraSumario = cfg.molduraSumario ? 'informado' : (ms ? 'mantido' : 'sorteado');
  const grava = { estiloCabecalho: r.estiloCabecalho, estiloTitulo: r.estiloTitulo, corTitulo: r.corTitulo, corCabecalho: r.corCabecalho, sumarios: r.sumarios, estiloSumario: r.estiloSumario, composicaoSumario: r.composicaoSumario, molduraSumario: r.molduraSumario };
  try { fs.writeFileSync(arq, JSON.stringify(grava, null, 2) + '\n'); } catch (e) { console.warn('AVISO: nao consegui gravar estilo_deck.json: ' + e.message); }
  console.log('Sorteio do deck (estilo_deck.json): ' + Object.keys(grava).map(k => `${k}=${Array.isArray(grava[k]) ? grava[k].join('+') : grava[k]} [${r.origem[k === 'sumarios' || k === 'estiloSumario' ? 'sumarios' : k]}]`.replace('[object Object]', JSON.stringify(grava[k]))).join(' | '));
  return r;
};
module.exports.SUMARIOS = SUMARIOS;
module.exports.COMPOSICOES_SUMARIO = COMPOSICOES_SUMARIO;
module.exports.OPCOES = OPCOES;
