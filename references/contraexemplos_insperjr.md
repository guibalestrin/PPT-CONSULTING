# Contraexemplos Insper Jr (rodada 1, 15/11/2026): reprovados pelo usuário

O usuário mandou 7 recortes de slides gerados pela skill e disse: "todas essas estruturas de organizar e exibir dados deixam com cara de AI. Os slides de referência estão aí para você encontrar outras maneiras visuais de trazer as mesmas informações, só que de forma mais humanizada". Os recortes estão em `assets/contraexemplos/ij_reprovado_1.png` a `_7.png`. **Abra-os antes de montar slides.**

| Recorte | O que era | Por que parece IA | Função agora vetada | Faça assim (referência) |
|---|---|---|---|---|
| 1 | Lista "1 2 3" com numeral cinza grande e uma linha de texto (motivos para não focar) | Lista numerada genérica, sem imagem e sem hierarquia | `listaPinos`, `listaNumeros` | `blocoIcone` (círculo com ícone + frase com negrito) ou `linhasCausaEfeito` (ícone, "de" → "para"): ijtheo_p047, ijtheo_p066, ijtheo_p070 |
| 2 e 3 | Faixa cinza de KPIs separados por fios (CAPEX, VPL, TIR, -8% / 6 lojas, 2 lojas, receita) | Painel de KPI genérico | `tiraFatos`, `linhaValores` | Número como anotação no gráfico (`nota`), `medidorCirculo` (um por exhibit, ao lado do gráfico que o prova): ijtheo_p088, ijg5_p073 |
| 4 e 5 | Três colunas "Por que focar / Por que não / Como vamos atendê-lo" com cabeçalho sublinhado + faixa cinza de KPIs embaixo | Template de colunas iguais com fio e resumo cinza | cabeçalho de coluna com fio (nunca em Insper Jr) + `tiraFatos` | Um card por ideia com ícone e imagem (`cardIJ` + `blocoIcone`), ou `painelLeitura` com títulos em negrito colados ao texto, ou a revelação mostrando uma ideia por página: ijg5_p073, ijtheo_p085 |
| 6 | Linhas "Loja Cambuí | transação" com etiqueta em itálico e fio fino | Lista de categorias com fio | `listaCategorias` | `blocoIcone` por item, ou mapa/foto com legendas ligadas por conector: ijtheo_p041, ijg7_p047 |
| 7 | Tabela de CAPEX (rótulo + chip cinza de valor) com caixa de TIR e VPL ao lado | Tabela disfarçada de chips + KPI box | `premissas`, `tiraFatos` | Gráfico de cascata ou colunas empilhadas do CAPEX com `nota`; premissa pesada no apêndice; TIR/VPL em `medidorCirculo`: ijtheo_p079, ijtheo_p088 |

## O que as referências fazem no lugar (padrão a imitar)
- **Ícone de linha dentro de círculo cheio**, ao lado de título em negrito + frase curta (ijtheo_p030, p047, p066, p070, p021). Aqui os ícones estão liberados (o veto antigo a ícones era do modo financeiro).
- **Problema → ação** com X vermelho e check verde, e seta fina ligando "de" a "para" (ijtheo_p047).
- **Número grande dentro de círculo** ligado ao gráfico (ijtheo_p088) ou **dentro do gráfico** como callout (ijg5_p073, ijg5_p084).
- **Painel de leitura**: caixa com contorno e sombra dura, títulos em negrito na cor colados ao texto, sem fio (ijg5_p073, ijg5_p084).
- **Imagem do assunto em tamanho grande** (persona, loja, produto, mapa) em vez de mais um bloco de texto (ijtheo_p011, ijg5_p018, ijtheo_p030).
- Ideia por página (revelação) em vez de três colunas iguais empilhadas na mesma página.

## Regras
1. Nunca montar slide com fileira de 3 ou 4 KPIs em faixa. No máximo 1 ou 2 `medidorCirculo` por slide, cada um ao lado do exhibit que prova o número.
2. Nunca usar lista numerada de linhas de texto. Se há uma sequência real, use passos com forma (cadeia, caminho, linha do tempo); se são motivos, use `blocoIcone`.
3. Nenhum cabeçalho de coluna com fio sublinhado: o cabeçalho de bloco é a barrinha (`marcador`).
4. Três colunas iguais com os mesmos rótulos ("Por que / Por que não / Como") são veto de composição, nos moldes do Starbucks.
