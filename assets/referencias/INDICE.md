# Biblioteca visual de referencia

A pasta `referencias/` (copia de `assets/referencias/`) e **exatamente** o que o sorteio pode abrir: `python3 -I sortear_referencias.py --tipos` lista as pastas com a quantidade de slides, `--listar <pasta>` lista os arquivos. Mover um slide de pasta muda o sorteio. O id de um slide e o nome do arquivo sem `.jpg` (use-o em `deck.decidir({ referencias: [...] })`).

| Grupo | O que e | Como entra no slide |
|---|---|---|
| `insper_jr/<tipo>/` | decks Insper Jr do usuario, por TIPO DE INFORMACAO. Sao o padrao: o slide deve parecer do mesmo deck. | Abra 2 ou mais do tipo que o slide explica. |
| `mercado_financeiro/<estrutura>/` | decks de mercado financeiro, por ESTRUTURA DE ORGANIZACAO. Inspiram so o arranjo (caixa + elementos, blocos numerados, cadeia...), nunca o assunto, o grafico em si, a densidade de 9pt nem a divisao exata. | Abra 1 ou 2 da estrutura que a mensagem pede e troque o exhibit por o que o seu conteudo tem (card, foto, forma). Receitas: `references/estruturas_mercado.md`. |
| `sumario/` | sumarios e transicoes que o usuario separou | Abra 2 antes de `deck.sumario` (o estilo em si sai do sorteio do deck). |

## 1. Insper Jr (`insper_jr/`)

Leia `references/insperjr_padrao.md` antes. `ijtheo` (BellaCompra, verde) e o deck mais proximo do esperado; `ijg5` (Casa Lorenzi/Vulto), `ijg7` (BellaCompra operacional) e `ijcase` (case financeiro). Numeros = pagina do PDF original; paginas vizinhas sao estados da mesma revelacao.

| Pasta | Para slides de | Arquivos |
|---|---|---|
| `insper_jr/abertura` | capa, sumario, contexto e pergunta do cliente | ijtheo_p002, ijtheo_p114 |
| `insper_jr/diagnostico` | 5Cs, macroambiente, variaveis | ijg7_p003, ijtheo_p004, ijtheo_p005, ijtheo_p019, ijtheo_p020 |
| `insper_jr/publico` | perfis, clusters, personas | ijg5_p018, ijg5_p019, ijg5_p029, ijtheo_p007, ijtheo_p009 |
| `insper_jr/concorrencia` | benchmark, mapa competitivo | ijg5_p006, ijg5_p013, ijg5_p014, ijtheo_p014, ijtheo_p087, ijtheo_p099 |
| `insper_jr/posicionamento` | posicionamento, golden circle, valor percebido | ijg5_p043, ijtheo_p021, ijtheo_p026, ijtheo_p027, ijtheo_p076 |
| `insper_jr/oferta_preco` | produto, portfolio, preco | ijtheo_p030, ijtheo_p077 |
| `insper_jr/canais` | praca, processos, jornada, site/app (inclui pares de revelacao progressiva: p041 a p042) | ijg5_p062, ijg7_p047, ijtheo_p041, ijtheo_p042, ijtheo_p044, ijtheo_p047, ijtheo_p111 |
| `insper_jr/promocao` | campanhas, midia, influenciadores, calendario | ijtheo_p066, ijtheo_p067, ijtheo_p068, ijtheo_p070, ijtheo_p072, ijtheo_p074, ijtheo_p112, ijtheo_p113 |
| `insper_jr/experiencia` | pessoas, evidencia fisica, colaboradores | ijtheo_p017 |
| `insper_jr/operacao` | planta da loja, fluxo, estrutura, qualificadores | ijg7_p034, ijg7_p036, ijtheo_p052, ijtheo_p055 |
| `insper_jr/financeiro` | build-up de receita, CAPEX, unit economics, VPL, DRE | ijcase_p004, ijcase_p005, ijtheo_p079, ijtheo_p085 |
| `insper_jr/prova` | entrevista, citacao, video, posts reais | ijcase_p003, ijg7_p044 |
| `insper_jr/revelacao` | as formas de revelacao progressiva | ijg5_p007 |

## 2. Mercado financeiro (`mercado_financeiro/`), por estrutura

Escolha a pasta pelo que a MENSAGEM do slide pede, nao pelo assunto do deck de origem.

| Pasta | Estrutura | Como replicar com a skill | Arquivos |
|---|---|---|---|
| `mercado_financeiro/caixa_esquerda_elementos_direita` | Uma caixa a esquerda com a tese em texto e, a direita, os elementos que a provam ou desdobram (grafico, foto, tabela pequena, card). | `deck.composicoes.caixaLateral` | kepl3_p047, mabg_p048, nubank_p024, orizon_p006, orizon_p021 |
| `mercado_financeiro/blocos_numerados_lado_a_lado` | Dois ou tres blocos com cabecalho numerado (I., II., III. ou 1, 2, 3), cada um com o proprio exhibit e a propria conclusao. | `deck.blocos(s, "2c"|"3c")` + cabecalho de bloco | afcap_p008, afcap_p013, assetkw_p004, cje_p020, cje_p084, mabg_p025, mabg_p061, orizon_p015, orizon_p018, orizon_p030 |
| `mercado_financeiro/mapa_foto_e_elemento_do_assunto` | O elemento do proprio assunto (mapa, foto do ativo, logos, recorte) como exhibit principal, com legenda e chamadas. | `deck.imagem` / `formas.midia` + `formas.caixaEtiqueta` + `formas.nota` | afcap_p037, assetkw_p018, mabg_p017, nubank_p091, orizon_p009, orizon_p024, orizon_p040, tech_p043 |
| `mercado_financeiro/fluxo_cadeia_e_linha_do_tempo` | Etapas, cadeia de valor, ciclo ou linha do tempo desenhados com chevrons, conectores finos e formulas. | `formas.cadeia`, `formas.linhaTempo`, `formas.faixasNumeradasArco`, `formas.equacao` | agrion_p035, cje_p062, cje_p078, kepl3_p044, orizon_p036, tech_p018 |
| `mercado_financeiro/leitura_do_dado_e_destaque` | Um dado com uma unica leitura destacada (colchete, elipse, nota tracejada, faixa de referencia, celula emoldurada). | `formas.grafico` + `colcheteCagr`, `nota`, `elipse`, `footballField` | agrion_p010, agrion_p021, kepl3_p021, nubank_p131, orizon_p027, rdor_p057, tech_p007 |

## 3. Sumarios (`sumario/`)

agrion_p002, ijg5_p002, ijg7_p002, kepl3_p010, mabg_p002, tech_p004

Detalhe de pop-up, faixa-pergunta e indice: `references/sumarios_popups.md`.

## Como usar: APRENDER, nao copiar

Ao abrir cada imagem, responda por escrito (isso vira o `aprendi` do `deck.decidir`): qual a mensagem e como o titulo a diz; como o espaco e dividido e por que; qual exhibit prova a mensagem e por que esse tipo; o que e destacado e como; que elemento do assunto substitui um grafico generico. O seu slide nunca repete a divisao nem a combinacao de exhibits de uma referencia: o conteudo decide, e voce combina o que aprendeu de varias pastas.

## O que as imagens ensinam em comum

1. Cada bloco tem o proprio exhibit e a propria conclusao; raramente uma tabela so.
2. Quando ha grafico, ele vem anotado (colchete, nota tracejada, elipse, chip).
3. Cabecalho de bloco com a conclusao + legenda cinza; nada de caixa em volta de tudo.
4. Uma cor + cinzas; destaque em uma unica barra, serie ou celula.
5. Elemento visual do assunto (mapa, foto, logo, recorte, citacao) sempre que o assunto tiver.
6. Os decks de mercado sao mais densos (8 a 9pt) que o padrao Insper Jr: copie a organizacao, nao a densidade (limites em `insperjr_padrao.md`, secao 2).
