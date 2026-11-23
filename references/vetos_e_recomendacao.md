> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Liberado e vetado (detalhe) e slide de recomendacoes

Lido quando o deck tiver tabela, conector, icone, sumario ou slide final de recomendacao. Para todos os decks, ler tambem `contraexemplos_starbucks.md` e abrir as duas imagens negativas. Fonte unica no codigo: `scripts/proibicoes.js`.

**LIBERADO em 2026-11-11, so no formato das referencias** (palavras do usuario: "tem que ser usado igual eles usam na apresentacao, na mesma formatacao, diagramacao etc., porque senao fica com cara de Claude"):

1. **Tabelas** (atualizado em 22/11/2026: fora de demonstracao financeira, so `deck.N.tabelaLimpa`, sem fios, bordas, faixa ou fundo e com LOGOS no topo das colunas; o quadro com fios e linha pintada foi reprovado como "generico") nativas (excecao, nao regra: ver Protocolo, item 4): `tabela` (estilos `financeira`, `limpa`, `faixa`, `rotuloValor`), `sensibilidade`, `premissas`. Fonte 8pt, fios finos, sem grade cheia, linha ou coluna de resultado destacada
2. **Setas e conectores**: colchete de CAGR, nota com conector tracejado e ponta pequena, conector de zoom, eixo com seta fina, chevron so em linha do tempo ou metodologia. **Nunca** seta gorda (forma "Arrow") entre caixas
3. **Diagramas de analise com formas**: football field, matriz de risco, equacao em blocos, cadeia de valor, linha do tempo, cenarios, treemap, estrutura acionaria
4. **Icones de linha**, pequenos e de uma cor, onde identificam algo fisico (secao 2)

**Continua vetado** (`scripts/proibicoes.js` barra no build; `qa_deck.py` avisa):

1. **Grafico de dados desenhado com formas** (`barrasPirulito`, `barras100`, `ponteDecomposicao`): serie, composicao e ranking sao sempre grafico NATIVO (`formas.grafico` / `addChart`), como nas referencias editaveis
2. **`listaFitas` e `setaCurva`** (fitas com ponta de seta em serie; arco solto entre colunas): nao existem nas referencias. Use `listaPinos`, `premissas`, `colcheteCagr`
3. **Fio vertical antes do titulo do slide** (`estiloTitulo: 'destaque'`). A barrinha `marcador` dos quadrantes segue liberada; bloco unico (1 quadrante) nao leva marcador
4. **Os habitos de IA** (`gramatica.md` secao 7): grade de cards arredondados identicos, numero gigante em card em serie, icone em circulo colorido, retangulo com faixa colorida numa borda, grafico cru (grade, eixo de valores, cores sortidas, sem anotacao), slide ralo de tres bullets, titulo-rotulo
5. **Sumario: sem veto de cor (liberado em 2026-11-15).** `deck.sumario` aceita `fundo` escuro, claro, dominante, destaque ou qualquer hex (`sumario_cores.js`). O que continua valendo e a construcao fiel as referencias de `assets/referencias/sumario/` (agrion_p002, mabg_p002): item da vez aceso e os demais apagados, contorno fino, numeral romano ou 01/02/03, slide cheio, sem lista pequena alinhada a esquerda com metade do slide vazio. Monte o sumario com a funcao, nao no `build_deck.js`:
   - slide cheio, sem barra nem moldura: `deck.pres.addSlide({ masterName: 'Capa' })`, fundo escuro em degrade da cor dominante (gere um PNG com Pillow, do quase preto no canto superior esquerdo ate a dominante no inferior direito) ou foto do assunto com veu escuro
   - **Moldura do sumario e opcional (nao e regra):** titulo "Sumario", fio fino em cima e embaixo e logo de quem apresenta apareciam so em uma referencia. NAO sao obrigatorios. `molduraSumario = { titulo: 'esquerda'|'centro'|'direita'|'nenhum', texto, fios, logo }` e sorteado uma vez por deck, com o sumario sem moldura mais provavel; `deck.sumario(secao, { moldura: true })` desenha os tres (titulo centralizado, fios, logo) e `{ moldura: false }` nenhum. Se quiser titulo, pode ser outro texto que diga o assunto ("Agenda"), nao so a palavra "Sumario"
   - com foto: imagem a esquerda, a direita ou de fundo (`composicaoSumario`), dissolvida no fundo por degrade; nunca corte seco
   - itens **escalonados** (cada um deslocado ~1,2 pol para a direita e ~1,4 pol para baixo), numeral romano de 20pt dentro de um circulo de contorno fino (~1 pol) ou de um paralelogramo, e um fio fino saindo da base do circulo ate a borda direita
   - titulo da secao em 16pt negrito + uma linha de apoio em 13pt italico com 2 palavras-chave em negrito (a frase diz o que a secao conclui, nao o nome dela)
   - item da vez em branco com contorno mais grosso; demais na dominante clareada (ex.: `7FA58C` para verde), sempre legiveis
   - pedido de "sumario aleatorio": escolha uma destas variacoes cheias para todo o deck (pilulas escalonadas sobre fundo escuro de agrion_p002 ou paralelogramos sobre foto escurecida de mabg_p002; `cartoes` esta vetado; `circulos` voltou em 23/11/2026 com a montagem aprovada do AP), nunca entre os estilos brancos
   - os avisos do `qa_deck.py` de "fora da area util" e "sem titulo" nesse slide sao esperados
6. **Slide de recomendacoes montado com componentes genericos** (vetado em 2026-11-11: "o ultimo slide ta muito cara de Claude"). O conjunto reprovado: tabela de frentes com texto nas celulas (Frente / Evidencia / Acao / Alavanca), `equacao` com blocos cinza e `[DADO]` em dois dos tres termos, `premissas` usado como painel de KPIs em chips, roadmap em chips com 3 fases de duas palavras ("0-6 m / 6-18 m / 18 m+") e `faixaConclusao` verde cheia no pe. Nenhum desses elementos prova nada; e texto arrumado em caixas. Como fazer:
   - cada recomendacao ancorada num **exhibit com dado real** (grafico nativo anotado, estrutura com `cadeia`, mapa, foto) que mostre o problema que ela resolve, ao lado de uma coluna curta "Acao proposta" (rotulo na cor + fio fino + 2 a 3 linhas de 8,5pt com palavras-chave em negrito)
   - arranjo preferido: resumo executivo de mabg_p003 (`deck.resumoExecutivo`): 2 faixas, cada uma com uma frase-conclusao na cor, e 2 exhibits numerados I a IV por faixa, cada um de um tipo diferente (colunas, barras, linha, estrutura)
   - se uma frente nao tem dado que a sustente, ela sai do slide ou vira `[GRAFICO: ...]`; nunca vira linha de tabela
   - `equacao` so entra com os tres termos preenchidos por numero real

Se o usuario mudar uma regra, edite `scripts/proibicoes.js` e registre em `references/aprendizados.md`. A barra lateral e moldura, nao conteudo: nao e afetada. Um slide, uma mensagem.


## Vetos de composicao: Starbucks 5 e 6 (11/11/2026)

Aplicar `contraexemplos_starbucks.md`: **nao reproduzir** tabela descritiva larga + ranking textual + comentario em caixa (slide 5), nem grafico de pesquisa + foto-banner + paragrafos de implicacao sem segunda prova analitica (slide 6). Nao contar nota metodologica apontando uma barra como anotacao de insight. Esse veto se aplica tambem quando cada elemento isolado e permitido acima. Mudar acabamento ou cor nao basta; recompor a relacao entre evidencias.
