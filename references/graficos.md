# Graficos: tipo certo e acabamento humano

> **Use `formas.grafico` (`exhibits.md`) para colunas, barras, empilhados, linhas, areas, roscas e combos**: ja aplica o acabamento das referencias e devolve o `plot` para posicionar as anotacoes. Este arquivo vale para o que ele nao cobre (cascata, dispersao, bolhas) e para degrades e patterns por serie.
>
> **REGRA DO USUARIO: todo grafico de dados e o grafico NATIVO do PowerPoint, nunca desenhado com formas.** Cascata/ponte: colunas empilhadas com serie base invisivel (`vazio` no JSON de estilo). Sem dado confirmado, `[GRAFICO: ...]`.
>
> **Acabamento observado nas 13 referencias:** cores **chapadas** em 9 delas (Kepler, Nubank, Vibra, Vivara, Rede D'Or...) e degrade vertical so em M&A Bunge e Orizon: o degrade e opcional, nao o padrao. Sem eixo de valores, sem grade, rotulo direto, uma cor + cinzas, 1 a 3 anotacoes por grafico (`gramatica.md` secao 5).

Grafico padrao do pptxgenjs (eixo de valores, grade, legenda embaixo, cores sortidas, sem anotacao) tem cara de IA. Decida **qual tipo** prova a mensagem e aplique o **acabamento** abaixo com `scripts/graficos.py` (chamado por `deck.finalizar(arquivo, estilosGraficos)`).

## Tipo pela mensagem (nao pelo habito)

| Mensagem | Tipo preferido |
|---|---|
| Tendencia ao longo do tempo (muitos periodos) | Linha suave, ou area com degrade sob a linha |
| Duas series no tempo (real x projetado, empresa x mercado) | Duas linhas: uma cheia, outra tracejada e mais clara; ou area + linha |
| Valor + indicador relativo (receita e margem, divida e alavancagem) | Combo: colunas em degrade + linha no eixo secundario com rotulos em caixa |
| Poucos periodos discretos (ate ~6) | Colunas em degrade |
| Composicao / mix | Colunas empilhadas ou 100%; rosca so com ate 5 fatias |
| Ponte de variacao | Cascata: colunas empilhadas com serie de base invisivel (`vazio`) |
| Ranking / comparacao entre empresas | Barras horizontais ordenadas, destacando a empresa analisada |
| Antes x depois por item | Slope chart ou dot plot |
| Relacao entre duas variaveis | Dispersao ou bolhas |
| Projecao | Periodo projetado em pattern listrado ou tom claro, anos com "E"/"P", faixa sombreada |
| Um unico % de destaque | Rosca grossa com o numero no centro, ou barra de progresso |

Colunas e barras sao a maioria nas referencias (cerca de 60% dos graficos); o que nao se repete e a **combinacao**: no mesmo slide, cada bloco tem um tipo diferente de exhibit.

## Acabamento

- **Colunas/barras**: chapadas na dominante (padrao) ou, se o deck inteiro adotar, degrade vertical do tom claro no topo ao escuro na base
- **Rotulo da coluna**: dentro, junto a base, branco negrito (`dataLabelPosition: 'inBase'`); ou acima em negrito escuro sem caixa
- **Linha sobreposta**: cor mais escura, 2-2,5pt, suave para tendencia, marcador circular vazado
- **Rotulos da linha em caixa** preenchida na cor da serie (texto branco) ou branca com borda; sem colidir com colunas ou outros rotulos
- **Rotulos seletivos** em series longas (> 6 pontos): primeiro, ultimo, picos, vales, pontos citados
- **Segunda serie**: tracejada, tom mais claro, marcador losango
- **Area**: degrade da cor da serie, ~35% de opacidade no topo a ~5% na base
- **Projecoes**: pattern `wdUpDiag` ou tom claro; linha tracejada no trecho projetado
- **Eixos**: sem eixo de valores, sem grade; eixo de categorias com linha fina cinza; legenda pequena embaixo ou rotulo direto
- **Anotacoes** (formas sobre o grafico): caixa tracejada marcando periodo, linha vertical tracejada de evento, faixa sombreada de projecao, callout com seta
- Mesmo estilo de rotulo, caixa, marcador e degrade em todos os graficos; fonte do tema (`'+mn-lt'`) em todos os textos do grafico

## JSON de estilos (indexado pelo `name` da serie no `addChart`)

```json
{
  "Receita liquida (R$ bi)": { "grad": [[0, "5FBF8F", 100], [55, "2E6B4F", 100], [100, "173D2A", 100]], "ang": 90 },
  "Margem EBITDA ajustada (%)": { "linha": {"cor": "173D2A", "larg": 2.25}, "suave": true,
      "marcador": {"simbolo": "circle", "tam": 8, "fill": "FFFFFF", "borda": "173D2A"},
      "caixa": {"fill": "173D2A", "texto": "FFFFFF"} },
  "Receita projetada": { "pontos": {"4": {"patt": {"prst": "wdUpDiag", "fg": "2E6B4F", "bg": "FFFFFF"}}} },
  "Base cascata": { "vazio": true, "rotulos": [] },
  "Mercado": { "linha": {"cor": "5FBF8F", "larg": 1.75, "traco": "dash"}, "rotulos": [0, 9] }
}
```

Chaves: `grad` + `ang`, `patt`, `cor`, `vazio`, `pontos` (preenchimento por ponto), `linha` (cor, larg, traco), `suave`, `marcador`, `caixa` (fill, texto, borda), `rotulos` (indices que mantem rotulo), `posRotulo` (`t`, `b`, `ctr`, `inEnd`, `outEnd`: posicao do rotulo so daquela serie). O script avisa series nao encontradas.

## Armadilhas

- **Eixo secundario oculto** (`valAxisHidden: true`) faz o renderizador de QA ignorar min/max e a linha cai sobre as colunas. Use eixo visivel e invisivel na pratica: `valAxisHidden: false, valAxisLabelColor: 'FFFFFF', valAxisLineShow: false, valAxisLabelFontSize: 6`
- Para a linha flutuar acima das colunas: eixo primario com maximo ~1,6x a maior coluna; secundario com minimo negativo (ex.: -40 a 72 para margens de 43-57%)
- Se rotulos ainda colidirem, separe em dois graficos empilhados com a mesma largura e o mesmo `layout: { x, w }` de plotagem
- Combo com eixo secundario exige `valAxes` e `catAxes` com duas entradas cada
- O renderizador de QA mostra ponto decimal; no PowerPoint em portugues o formato `0.0` vira virgula. Avise na entrega
