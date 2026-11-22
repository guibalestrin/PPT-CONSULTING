> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Estruturas aprendidas dos decks de mercado financeiro

Os slides de `assets/referencias/mercado_financeiro/` entram na skill **so pela organizacao da informacao**. O usuario pediu isso de forma explicita: eles organizam muito bem o conteudo, e a estrutura vale mesmo quando o deck de origem usa um grafico e o seu slide nao precisa de grafico. Substitua o exhibit pelo que o seu conteudo tem (card, foto ou placeholder descrito, forma do framework, bloco com icone, medidor) e mantenha a logica de organizacao.

Nunca copie: o assunto, os dados, a densidade de 8 a 9pt (vale `insperjr_padrao.md`, secao 2), o grafico em si, a combinacao exata de exhibits nem a divisao exata. Tudo o que o QA e as proibicoes barram continua barrado (veto Starbucks, listas e KPIs reprovados, sumario claro).

## Como escolher a estrutura (por slide)

1. Escreva a mensagem do slide em uma frase.
2. Veja qual pergunta a mensagem responde e escolha a pasta:

| Se a mensagem e... | Pasta | Funcao ou divisao da skill |
|---|---|---|
| uma tese que precisa de provas de naturezas diferentes | `caixa_esquerda_elementos_direita` | `deck.composicoes.caixaLateral` |
| 2 ou 3 argumentos paralelos, cada um com a propria prova | `blocos_numerados_lado_a_lado` | `deck.blocos(s, '2c' ou '3c', [...])` |
| algo que se entende vendo o lugar, o ativo, a marca ou o recorte | `mapa_foto_e_elemento_do_assunto` | `deck.imagem`, `formas.midia`, `formas.caixaEtiqueta`, `formas.nota` |
| etapas, cadeia de valor, ciclo, historia ou formula | `fluxo_cadeia_e_linha_do_tempo` | `formas.cadeia`, `formas.linhaTempo`, `formas.faixasNumeradasArco`, `formas.equacao` |
| um numero ou serie cuja leitura e o ponto do slide | `leitura_do_dado_e_destaque` | `formas.grafico` + 1 a 3 anotacoes |

3. Abra 1 ou 2 slides da pasta (`python3 -I sortear_referencias.py --estrutura <pasta> --n 2`), mais 2 do tipo Insper Jr da informacao (`--tipo <pasta>`). Cite todos em `deck.decidir`.
4. A estrutura entra como **um dos 2 arranjos candidatos** do `deck.decidir`; se o conteudo nao encaixa, nao force.

## 1. `caixa_esquerda_elementos_direita` (orizon_p006, nubank_p024, mabg_p048, kepl3_p047, orizon_p021)

**O que o slide faz:** a esquerda, uma caixa com titulo e a tese em poucas frases (quem e a empresa, qual a vantagem, qual a premissa). A direita, os elementos que provam ou desdobram a tese; cada um tem a propria conclusao. A caixa responde "o que", os elementos respondem "como sabemos".

**Como replicar sem grafico:** `deck.composicoes.caixaLateral(s, { caixa: { titulo, itens }, satelites: [...] })`. Cada satelite e `card` (cardIJ com faixa), `midia` (foto ou ilustracao descrita), `bloco` (icone + titulo + texto), `medidor` (um numero em circulo com rotulo) ou `livre` (area onde voce desenha um grafico anotado, uma tabela pequena ou uma forma do framework). Use 2 a 4 satelites de **tipos diferentes** e ligue-os a caixa (conector fino, ja desenhado pela funcao). `lado: 'direita'` inverte; `pesos` muda a proporcao.

**Quando usar:** apresentar a empresa, um mercado ou uma tese de canal com 2 a 4 provas distintas. **Quando nao:** itens iguais e sem hierarquia (vira grade de cards) ou conteudo que cabe em uma frase.

**Cuidado:** a caixa nao e lista de pinos; texto corrido curto com titulo em negrito. Nao repita a mesma composicao em slides vizinhos.

## 2. `blocos_numerados_lado_a_lado` (afcap_p008, afcap_p013, cje_p084, cje_p020, mabg_p025, mabg_p061, orizon_p015, orizon_p018, orizon_p030, assetkw_p004)

**O que o slide faz:** o titulo afirma uma conclusao e o miolo se divide em 2 ou 3 blocos com cabecalho numerado. Cada bloco tem seu exhibit (foto, mapa, cadeia, citacao, grafico) e sua propria conclusao em uma linha. O leitor percorre da esquerda para a direita como argumentos.

**Como replicar:** `deck.blocos(s, '2c' | '3c', [{ cab: 'Conclusao do bloco 1', sub: 'unidade ou contexto' }, ...], { pesos })`. Pesos desiguais mostram qual argumento pesa mais. Troque o tipo do exhibit entre blocos (um card com foto, uma cadeia, uma citacao). O estilo do cabecalho vem do sorteio do deck (`marcador` e a barrinha); numeral romano so no estilo `linha`.

**Quando usar:** 2 ou 3 argumentos paralelos que se sustentam sozinhos. **Quando nao:** 4 ou mais itens (divida em dois slides) ou argumentos em sequencia (use fluxo).

## 3. `mapa_foto_e_elemento_do_assunto` (afcap_p037, assetkw_p018, mabg_p017, nubank_p091, tech_p043, orizon_p024, orizon_p009, orizon_p040)

**O que o slide faz:** o proprio assunto aparece como exhibit principal: mapa com pontos e legenda, foto do ativo com chamadas, logos dos concorrentes, recorte de noticia, citacao com foto. Texto e numeros entram como legendas e caixas pequenas presas ao elemento.

**Como replicar:** `deck.imagem` ou `formas.midia({ descricao })` grande (nunca desenho improvisado; prototipo e mapa sem arquivo viram `[IMAGEM: ...]` descrito), `formas.caixaEtiqueta` para a legenda, `formas.nota` para a chamada ligada a um ponto, `formas.cartaoCitacao` para fala de especialista. Regra da skill: a imagem prova algo, nao preenche meia pagina.

**Quando usar:** localizacao, estrutura fisica, concorrentes reconheciveis, pesquisa de campo. **Quando nao:** nao ha imagem nem descricao concreta do que mostrar.

## 4. `fluxo_cadeia_e_linha_do_tempo` (cje_p062, cje_p078, orizon_p036, tech_p018, agrion_p035, kepl3_p044)

**O que o slide faz:** processo, cadeia de valor, ciclo ou historia desenhados com formas finas e conectores, cada etapa com titulo curto e uma linha de texto; as vezes a formula (A / B = C) ou a linha do tempo com eventos acima e dados abaixo. O cabecalho em chevrons de orizon_p036 mostra a etapa da cadeia que o slide trata.

**Como replicar:** `formas.cadeia`, `formas.linhaTempo`, `formas.faixasNumeradasArco` (etapas numeradas), `formas.equacao`, `formas.cardsParalelogramo` (fases com foto). Vetado: fluxograma de caixas coloridas e seta gorda (`proibicoes.js`); use conector fino com ponta.

**Quando usar:** sequencia real (jornada, cadeia de fornecimento, historico, calculo). **Quando nao:** itens sem ordem (use blocos).

## 5. `leitura_do_dado_e_destaque` (rdor_p057, kepl3_p021, nubank_p131, agrion_p010, agrion_p021, tech_p007, orizon_p027)

**O que o slide faz:** o dado e o protagonista e a leitura vem presa a ele: colchete de CAGR, elipse no valor, nota tracejada, faixa de referencia, celula emoldurada, chip de variacao. Nunca ha paragrafo explicando o grafico.

**Como replicar:** `formas.grafico` nativo (sem grade e sem eixo de valores) + 1 a 3 anotacoes (`colcheteCagr`, `nota`, `elipse`, `linhaRef`, `faixaPeriodo`) posicionadas pelo `plot` devolvido; varie o tipo de anotacao entre graficos. Em consultoria isso vale para Diagnostico e Financeiro; em marca, mix, canais e recomendacoes prefira as estruturas 1 a 4.

## Variacao entre decks

O sorteio escolhe as pastas de estudo; a estrutura final continua sendo decisao do conteudo. Slides vizinhos nao repetem estrutura nem divisao, e o deck deve usar pelo menos 3 das 5 estruturas quando tiver 8 ou mais slides de conteudo. Se o mesmo pedido fosse repetido, a sequencia de estruturas sairia diferente.
