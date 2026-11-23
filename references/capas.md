> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Capas (modelos copiados das referencias do usuario)

Leia **sempre** antes de montar a capa. Regra do usuario (2026-11-11): **na capa a estrutura e copiada literalmente**, porque ja funciona. So se adaptam imagens, logos, cores (paleta do deck) e textos do caso. Nao invente capa nova, nao misture modelos, nao "melhore" a composicao. A capa **nao tem barra lateral** nem moldura.

Sao 11 modelos, todos em `scripts/capas.js`; as imagens de referencia ficam em `assets/capas/ref_<modelo>.jpg` (abra com Read para ver o original antes de montar). As marcas que aparecem nas referencias sao so documentacao: nunca entram num deck.

```javascript
deck.capa({
  modelo: 'ondas_foto',                         // obrigatorio
  titulo: 'Mergers & Acquisitions 2025.2',      // nome do trabalho (obrigatorio)
  subtitulo: 'AgroInsper',                      // opcional
  integrantes: ['Nome 1', 'Nome 2'],
  creditos: [['Em parceria com', 'Nome'], ['Coordenador', 'Nome']],   // head, coordenador, parceria...
  empresas: [{ nome: 'Bunge', logo: 'bunge.png' }, { nome: 'Kepler Weber', logo: null }],   // padrao: cfg.logos.analisada
  logos: { apresentador: 'grupo.png', parceiro: 'condere.png' },      // padrao do apresentador: cfg.logos.apresentador
  imagem: 'silos.jpg', tema: null, imagemDescricao: 'silos a noite', foco: [0.5, 0.6],
  rodape: null,                                 // linha extra (curso, data), opcional
  logosNegativos: true,                         // padrao: logo PNG escuro com fundo transparente vira branco nos modelos escuros
});
```

## Como escolher o modelo (pelo contexto do caso)

| Modelo | Referencia | Use quando | Precisa de |
|---|---|---|---|
| `foto_lateral` | Rede D'Or, *Investment Thesis* | O negocio tem uma cena forte para mostrar (hospital, fabrica, loja, operacao); tese ou analise de uma empresa | foto horizontal da operacao; logo da empresa (versao branca) |
| `circulo` | Nu, *Insper Asset Management* | Marca forte e reconhecivel, sem foto boa; empresa digital/servicos; o logo e a imagem | logo da empresa (branca); quem apresenta entra como texto |
| `ondas_foto` | Bunge & Kepler Weber, *M&A AgroInsper* | Duas empresas (M&A, parceria, comparacao) ou ativo fisico grande (silo, porto, planta); muitos creditos (parceria, coordenacao, trainees) | foto do ativo (fica escurecida); 1 ou 2 logos |
| `recomendacao` | Vibra, *CFA Research Challenge* | Relatorio de equity com recomendacao (compra/venda), preco-alvo e upside; fundo branco | ticker, data, recomendacao, preco-alvo, upside; foto de produto **recortada em PNG sem fundo** |
| `radial` | Agrion, *AgroInsper Credito* | Sem foto; credito, consultoria, apresentacao final; visual mais tecnologico | logo da empresa e do grupo (brancas); opcional logo de parceiro |
| `fita_padrao` | Hermes, *LTS Challenge* (AF Capital) | Marca de luxo/varejo com identidade grafica forte (fita, estampa, monograma); fundo na cor da marca | logo da empresa (branca); `marca` (texto da fita); `monograma` (iniciais do grupo) |
| `triangulos_fotos` | Vivara, *CFA Research Challenge* | Marca com produto fotografavel (joia, cosmetico, moda, alimento); logo da empresa grande, sem foto unica forte | ate 3 fotos do produto/ambiente (`fotos`, P&B por padrao); logo da empresa; logo do organizador |
| `poligonos_centro` | 3R Petroleum, *Final Analysis* | Sem foto nem produto; marca so por logo; relatorio final, 1 ou 2 logos (empresa e grupo) | logo da empresa e do grupo (brancas) |
| `foto_onda_base` | Mateus, *Insper Asset* | A empresa tem fachada, loja, planta ou ativo fisico reconhecivel; foto horizontal forte | foto da fachada/ativo em tela cheia; logo da empresa (branca) |
| `produto_onda` | Cimed, *Private Equity Thesis* | Produto/embalagem icone da marca (medicamento, bebida, higiene) e uma foto aerea ou da fabrica ao fundo | `objeto` em PNG recortado sem fundo; `imagem` de fundo (fica esmaecida) |
| `objeto_marca` | Hermes (conceito: capa como embalagem) | O setor tem um objeto reconhecivel (carrinho, garrafa, caixa, predio...) e nao ha foto ou embalagem propria; capa criativa com a cara do negocio | `silhueta` (objeto ou setor, ver `silhuetas.js`); logo da empresa (branca) |

Varie entre decks quando o contexto permitir mais de um modelo (preferencia do usuario: variacao entre decks, nao 100% diferente). Diga na entrega qual modelo foi usado e por que, em uma linha, para o usuario poder pedir outro. Se o modelo exige algo que nao veio (foto, ticker), use placeholder/`[DADO: ...]` e liste na pendencia; nao troque de modelo so para esconder a lacuna sem avisar.

## Anatomia de cada modelo (o que e copiado)

**`foto_lateral`**: painel escuro em degrade (dominante -> escuro) na esquerda, que se dissolve na foto da direita (foto tingida com a dominante, faixa diagonal translucida). Logo grande da empresa em branco no meio-esquerda (y ~2,6). Logo pequeno de quem apresenta + nome do trabalho (20-22pt, branco) logo abaixo. Integrantes ("A | B") e creditos ("Head: X") em 12pt no canto inferior esquerdo. `subtitulo` aparece sob o titulo, mais claro.

**`circulo`**: fundo do quase-preto para a dominante com ondas organicas na dominante; circulo preto central (4,5 pol) com sombra difusa. Dentro, de cima para baixo: `titulo` (13pt; `*palavra*` vira italico, como "*Insper* Asset Management"), logo grande da empresa, fio fino branco, integrantes ("A | B"), creditos em italico. Logo de quem apresenta, se houver, pequeno na base do circulo.

**`ondas_foto`**: foto em tela cheia escurecida; faixa preta ondulada no topo (diagonal no canto esquerdo, onda que desce ate o centro e sobe ao canto direito, recorte no topo) com as logos ("A & B" ou uma so), fio fino e `titulo | subtitulo` em negrito; faixa preta ondulada na base com o 1o credito ("Em parceria com X", rotulo em negrito italico), linha em branco, demais creditos e "`rotuloIntegrantes`: nomes". Fios brancos finos contornam as ondas. Logo de parceiro no canto superior direito (pequeno), de quem apresenta no inferior direito.

**`recomendacao`**: fundo branco. Canto superior esquerdo: logo do organizador (`logos.parceiro`, ex.: CFA) ou, sem ele, o `titulo` em negrito. Logo da empresa + "(ticker)"; "Ultima atualizacao: data"; espaco; "Recomendacao: **COMPRA**" (24pt, palavra na cor de destaque); "Preco-alvo" e "Upside" lado a lado. A direita, foto de produto em pe, apoiada na faixa de rodape, na frente de um triangulo na dominante. Faixa escura de rodape com integrantes e logo de quem apresenta (branco). Parametro extra: `recomendacao: { ticker, data, recomendacao, precoAlvo, upside, rotulos? }` (rotulos em portugues por padrao; troque para ingles se o deck for em ingles).

**`radial`**: fundo em degrade horizontal do grafite para a dominante escurecida; leques de tracos finos (como onda de audio) na cor de destaque clara: um grande envolvendo o logo da empresa e tres nos cantos. Coluna esquerda centralizada: logo de quem apresenta, fio branco, `titulo` (negrito, 22pt, caixa alta curta funciona melhor) e `subtitulo`. Logo grande da empresa no centro do leque. Canto inferior esquerdo: nomes dos `creditos` em negrito e integrantes em regular, um por linha. Logo de parceiro no inferior direito.

**Modelos 6 a 10 (23/11/2026).** Anatomia, em polegadas medidas na referencia (`assets/capas/ref_*.png`):

**`fita_padrao`**: fundo chapado na cor dominante com **monograma** repetido em tom sobre tom (grade escalonada, linhas alternadas deslocadas). Duas **fitas pretas** com pesponto tracejado branco e o nome da marca repetido: uma quase horizontal descendo levemente (3,6 graus) e outra cruzando em -22,5 graus no canto superior esquerdo. **Onda translucida** branca em duas camadas da base-esquerda ao canto superior direito. Tudo alinhado a direita: logo da empresa (y ~4,5), linha do evento com a 1a palavra em negrito (20pt), `titulo` grande (30pt, regular), integrantes e data em 11pt na base.

**`triangulos_fotos`**: fundo grafite com faixas duplas finas em cor de destaque no topo e na base e painel cinza no meio. A direita, **3 janelas triangulares** com fotos P&B e contorno fino de destaque. Esquerda: logo da empresa grande, fio de destaque, logo do organizador + logo do grupo e integrantes em 2 colunas (serifada).

**`poligonos_centro`**: degrade vertical (escuro -> dominante clara) com poligonos translucidos de contorno fino nos cantos superior esquerdo e inferior direito. `titulo | subtitulo` centralizado em negrito, **logo da empresa | fio vertical | logo do grupo** logo abaixo, integrantes e head no canto inferior esquerdo (16pt).

**`foto_onda_base`**: foto em tela cheia com degrade da cor escura no topo; **onda** na cor dominante cobrindo a base, com cunha escura a direita. Esquerda da onda: `titulo` (24pt negrito), `subtitulo` (18pt), integrantes (12pt). Logo da empresa em branco no canto inferior direito; logo de parceiro pequeno no topo direito.

**`produto_onda`**: foto aerea/da fachada esmaecida ao fundo (veu branco + tinta da marca). **Objeto recortado** grande a esquerda sobre uma mancha na cor dominante; faixa grafite curva na base com `titulo` em italico branco; mancha dominante no canto inferior direito com integrantes alinhados a direita; cunha grafite no canto superior direito com o logo do grupo.

**`objeto_marca`**: degrade da cor escura para a dominante com o **objeto do setor em padrao** tom sobre tom (a ideia da estampa da Hermes). Medalhao escuro a direita com o objeto como heroi em linha grossa branca e fio fino. Esquerda: logo da empresa, `titulo` (38pt, ate 2 linhas), traço de destaque, `subtitulo`, integrantes e creditos na base, logo do grupo no canto.

## Sorteio da capa (23/11/2026)

`deck.capa` **sem `modelo`** usa o modelo sorteado do projeto (`estilo_deck.json`, gravado por `scripts/propor_visual.js`; sem arquivo, sorteia na hora). O sorteio so considera os modelos cujo elemento existe: `foto_lateral`, `ondas_foto`, `foto_onda_base` pedem `foto`; `triangulos_fotos` pede `fotos`; `produto_onda` pede `objeto` (PNG recortado); `recomendacao` pede `recomendacao`; `objeto_marca` pede `silhueta`; `circulo`, `radial`, `fita_padrao` e `poligonos_centro` so pedem o logo. Em `fita_padrao`, `silhueta` troca o monograma por um padrao do objeto do setor (caixas, carrinhos). Detalhes e tabela setor > objeto em `references/conceito_marca.md`. Passar `modelo` explicito continua valendo quando o usuario nomear a capa.

## Elemento da marca (regra para TODOS os modelos)

Toda capa de referencia tem **uma peca que e da marca dela** (e so dela). Na capa nova essa peca precisa existir **e ser da empresa do caso**; copiar a estrutura sem trocar a peca e o erro mais comum. Antes de escolher o modelo, defina qual e o elemento da marca do caso e se ele existe (arquivo ou possibilidade de montar):

| Modelo | Elemento da marca na referencia | Equivalente no caso | Se nao houver |
|---|---|---|---|
| `fita_padrao` | fita com "HERMES | PARIS" + monograma AF | fita/faixa com o NOME da empresa analisada (`marca`, `fitaDetalhe` = cidade ou segmento); monograma = iniciais do grupo que apresenta | nome da empresa na fita ja basta; nao copie o cavalinho |
| `triangulos_fotos` | fotos de joias e vitrine | fotos do produto, da loja ou do cliente da empresa do caso | trocar de modelo (`poligonos_centro`/`circulo`) ou placeholder `[IMAGEM: ...]` x3 |
| `poligonos_centro` | lockup de logos 3R + grupo | logo da empresa + logo do grupo | 1 logo so: centralizar sozinho e avisar |
| `foto_onda_base` | render da fachada Mateus | foto da fachada, loja, planta ou ativo da empresa | `foto_lateral` com foto neutra ou placeholder |
| `produto_onda` | caixa do remedio Cimed + foto aerea da fabrica | embalagem/produto recortado + foto da operacao | sem objeto recortado, nao use este modelo |
| `objeto_marca` | padrao de caixas/objetos na estampa da Hermes | objeto generico do setor (carrinho, garrafa) via `silhueta`; nunca a marca de outra empresa | escolher outro modelo |
| `foto_lateral` / `ondas_foto` | cena da operacao / ativo fisico | foto da operacao ou ativo do caso | |
| `recomendacao` / `circulo` / `radial` | placa BR / logo Nu / logo Agrion | objeto ou logo do caso | |

No resumo do briefing, diga em uma linha qual e o elemento da marca da capa e de onde vem (arquivo, pesquisa ou placeholder). **Varie entre decks**: ao escolher, se mais de um modelo encaixa, prefira o que nao foi usado no deck anterior do usuario (ver `feedback_slides.jsonl`/historico) em vez de repetir o primeiro da tabela.

## O que e estrutura (copiar) e o que e do caso (trocar)

Copiar = posicoes, proporcoes, ondas, circulo, leques, faixas, hierarquia de textos, tipo de elemento em cada lugar. **Trocar = todo elemento que carrega o contexto da referencia.** Nada da referencia vai para o deck: nem marca, nem foto, nem texto, nem o objeto que identifica o negocio dela.

| Modelo | Copiar (estrutura) | Trocar pelo caso (nunca manter o da referencia) |
|---|---|---|
| `foto_lateral` | painel em degrade que se dissolve na foto, logo grande a esquerda, titulo, creditos no rodape | foto (cena do negocio do caso, nao cirurgia), logo da empresa e do grupo, titulo, nomes |
| `circulo` | circulo preto com sombra, ondas, ordem dos textos dentro dele | logo da empresa, nome do grupo/trabalho, nomes; cores das ondas vem da paleta do caso |
| `ondas_foto` | faixas onduladas com fios, "A & B" no topo, creditos na base | foto do ativo do caso (nao silos), 1 ou 2 logos, parceiro, coordenacao, trainees |
| `recomendacao` | logo do organizador, ticker, recomendacao, preco-alvo/upside, objeto em pe sobre o triangulo, faixa de rodape | **o objeto em pe e o elemento visual do negocio do caso** (embalagem, produto, equipamento, fachada recortada, mascote da marca): a placa da BR so faz sentido para a Vibra. Cor do triangulo e do rodape = paleta do caso. Logo do organizador, ticker, data, valores |
| `radial` | degrade grafite, leques de tracos, coluna esquerda, logo grande no centro | logos, titulo, nomes; cor dos leques e do degrade vem da paleta |
| `fita_padrao` | duas fitas pretas cruzadas, monograma em grade, onda translucida, bloco de texto a direita | texto da fita (marca do caso), monograma, logo da empresa, titulo, nomes, cor de fundo |
| `triangulos_fotos` | faixas duplas, painel cinza, 3 janelas triangulares, logo grande a esquerda | as 3 fotos (produto/ambiente do caso), logos, nomes; cores de destaque vem da paleta |
| `poligonos_centro` | degrade vertical, poligonos de contorno fino, titulo centralizado, lockup de logos | logos, titulo, nomes; cores do degrade vem da paleta |
| `foto_onda_base` | foto tela cheia, degrade no topo, onda na base com texto, logo no canto | foto do caso, logos, titulo, nomes; cor da onda vem da paleta |
| `produto_onda` | foto esmaecida, objeto recortado a esquerda, faixa grafite com titulo, manchas amarelas | objeto recortado e foto de fundo do caso, logos, nomes; cor das manchas = dominante |

**Elemento visual sem equivalente no caso.** Em `recomendacao`, sem um objeto recortado que represente a empresa, nao force: use outro modelo (`circulo` ou `radial` se so ha logo; `foto_lateral` se ha foto) e avise. Se o usuario ainda vai mandar o arquivo, deixe o placeholder descrito com o que serve naquele lugar ("embalagem do produto em PNG sem fundo"), nunca a imagem da referencia.

**As imagens em `assets/capas/ref_*.jpg` sao so para comparar a estrutura.** Nunca use, recorte ou recolora nada delas no deck. Em testes da skill, use logos e fotos neutros, nunca os da referencia.

## Logos e fotos

- Nos modelos escuros os logos precisam ser brancos. Com `logosNegativos: true` (padrao), PNG escuro com fundo transparente e recolorido para branco; JPG ou PNG sem transparencia fica como esta e gera aviso: peca ao usuario a versao negativa. Logo multicolorido recolorido vira silhueta branca: confirme com o usuario.
- `recomendacao` usa os logos nas cores originais (fundo branco), exceto o de quem apresenta, no rodape escuro.
- Fotos seguem a ordem de `deck.imagem` (arquivo -> biblioteca por tema exato -> placeholder). Placeholders da capa sao escuros nos modelos escuros, para nao estragar a composicao.
- `foco: [fx, fy]` escolhe a parte da foto que fica no recorte.

## Novos exemplos de capa

Se o usuario pedir para adicionar um novo modelo de capa a esta skill: (1) salve a imagem em `assets/capas/ref_<nome>.jpg`; (2) escreva a funcao do modelo em `scripts/capas.js` copiando a estrutura (posicoes medidas na imagem: px / 119,4 = polegadas no slide de 13,33 x 7,5), com as cores vindas da paleta (`COR.dom`, `COR.dest`, `COR.escuro`) e os textos/logos como parametros; (3) registre no `MODELOS`, nesta tabela e na anatomia; (4) teste com e sem arquivos (placeholders) e renderize; (5) salve a atualizacao da skill; entregue ZIP somente se solicitado. Se o pedido for apenas aplicar a capa em um deck, entregue o `.pptx` sem alterar esta skill.
