> Regra vigente (15/11/2026): um único modelo e fundo de sumário em todo o deck; paleta fixa 60/30/10; título 26pt e subtítulo 14pt, sem reduzir fonte. As composições de `contraexemplos_huawei.md` são vetadas; `faixasNumeradasArco` não pode ser usada no modo Insper Jr. Exemplos legados abaixo não substituem estas regras.

# Padrão Insper Jr (modo padrão da skill)

Leia **sempre**, antes do primeiro slide. Este arquivo resume como os decks Insper Jr do usuário apresentam a informação. As imagens estão em `assets/referencias/insper_jr/<tipo>/` (`ij*.jpg`), e o deck que o usuário considera mais próximo do esperado é o **Theo (`ijtheo_*`)**. As imagens ensinam a construir o slide. Não copie assunto, cor nem a composição exata de uma referência.

Origem: 4 decks reais (Theo/BellaCompra marketing, Grupo 5 Casa Lorenzi/Vulto, Grupo 7 operacional, case trainee financeiro), triados com o usuário em 15/11/2026.

## 1. Quem lê e como é apresentado

- É uma entrega de consultoria júnior com consultoria parceira (Kearney, Bain…) para cliente e banca. Ela é **apresentada ao vivo**, com animação: cada slide costuma ter de 2 a 6 páginas de revelação progressiva (seção 4).
- O leitor precisa entender sem esforço. O slide é mais leve que o de mercado financeiro: imagem ou ilustração grande, cards curtos e um gráfico com leitura ao lado.
- O deck conta uma história: **contexto e pergunta do cliente → diagnóstico → escolhas → plano → números → resposta à pergunta**. O Theo abre com "Fomos contratados para responder três perguntas" (ijtheo_p114, p094) e fecha respondendo cada uma (p098 a p100).

## 2. Moldura (todos os decks têm)

- Faixa decorativa na lateral esquerda (curva, onda ou degradê), com o número da página dentro dela. Na skill é a barra lateral sorteada.
- Título fixo de 26pt em negrito e frase de apoio fixa de 14pt logo abaixo. Na skill: `deck.titulo` no modo `insperjr`, que usa 26pt fixos.
- Logo da Insper Jr no topo direito e logo da consultoria parceira embaixo à direita. Ambos ficam como placeholder se não vierem no briefing.
- Rodapé com a navegação das seções (a atual em negrito, na cor) e `Fontes:` à direita, em todo slide.
- Corpo de 11 a 12pt, legendas de 9 a 10pt e no máximo 4 linhas por unidade de texto. Uma página tem de 40 a 220 palavras.

## 3. Vocabulário visual (o que eles usam e onde ver)

| Peça | Como é feita | Ver |
|---|---|---|
| **Card com faixa de título** | Faixa escura com título branco em negrito, corpo cinza-claro, cantos retos e sombra dura deslocada (bloco escuro atrás, sem desfoque). Use para explicar itens: canais, perfis, cidades, iniciativas. | ijtheo_p085, ijtheo_p047, ijtheo_p065, ijg5_p073 |
| **Imagem protagonista + explicação** | Ilustração ou foto ocupa de 40% a 60% do card ou do slide, com texto curto embaixo ou ao lado. A imagem demonstra a escolha (loja, embalagem, entregador, campanha) e não é decoração. | ijtheo_p047, ijtheo_p049, ijtheo_p030, ijg5_p038 |
| **Problema → consequência / ação → efeito** | Dois textos curtos ligados por seta fina, com ícone ✗ "quebra da proposta de valor" e ✓ "como mitigar". | ijtheo_p047 |
| **Gráfico + painel de leitura** | Gráfico nativo grande à esquerda com título do bloco e unidade. À direita, painel cinza com 3 a 4 blocos curtos de título colorido ("Base de 2025", "Salto de 2026", "Até 2035") que explicam o número. Colchete ou nota no gráfico ("3x"). | ijg5_p073, ijg5_p076, ijg5_p084, ijg5_p121 |
| **Perfis e personas** | Foto da pessoa + nome, idade, renda, rotina + comportamento de compra; ou 4 perfis lado a lado com "por que focar / por que não focar". | ijtheo_p007, ijtheo_p009, ijtheo_p011, ijg5_p018, ijg5_p020 |
| **Comparação de concorrentes** | Colunas com o logo no topo e as mesmas linhas para todos (posicionamento, diferencial, disponibilidade, produtos), mais uma coluna de insights. | ijtheo_p014, ijg5_p006, ijg5_p014 |
| **Mapa de posicionamento** | Dois eixos nomeados, logos posicionados e caixa tracejada com a leitura. | ijtheo_p099 |
| **Caminho / processo** | Estrada, passos numerados (chevrons) ou setas finas entre etapas. Cada etapa tem ícone ou ilustração e uma linha de texto. | ijtheo_p041, ijtheo_p079, ijtheo_p098, ijg7_p047 |
| **Linha do tempo de ações** | Marcos com ícone (início da obra → inauguração) e o conteúdo de cada fase embaixo, com peças reais (post, jornal, influenciador). | ijtheo_p067, ijtheo_p068 |
| **Tabela de critérios por horizonte** | Colunas curto / médio / longo prazo com ícones agrupados por relevância. | ijtheo_p070 |
| **Planta / ambiente explicado** | Ilustração isométrica da loja; cada área ganha zoom (lupa) e um card com a lógica. | ijtheo_p052, ijtheo_p055, ijg7_p034, ijg7_p036 |
| **Prova externa** | Entrevista com especialista (print da call + resumo), citação com foto do autor, vídeos ou posts reais, números de pesquisa com fonte. | ijg7_p044, ijg7_p045, ijcase_p003, ijtheo_p026, ijtheo_p068 |
| **Números financeiros** | Gráficos de colunas com rótulo direto, curva de VPL/fluxo de caixa com destaque do VPL e da TIR em blocos escuros ao lado, unit economics por unidade. | ijtheo_p088, ijtheo_p089, ijcase_p004, ijcase_p005, ijg5_p117 |

Com as funções da skill: card com faixa = `formas.painelAba({ estilo: 'faixa' })`; gráfico = `formas.grafico`; colchete = `formas.colcheteCagr`; nota = `formas.nota`; imagem = `deck.imagem` / `deck.painel`; revelação = `deck.revelar` (seção 4); destaque e zoom = `ctx.destacar` / `ctx.popup` / `formas.conectorZoom`. Se faltar uma peça, desenhe com formas simples seguindo a referência, e não invente outra estética.

## 4. Revelação progressiva (decisão do usuário: cópias do slide com estados)

É a técnica mais usada nos 4 decks. Um slide vira de 3 a 6 páginas, e em cada página um item acende ou abre um card ampliado. Use `deck.revelar(secao, n, (s, estado, ctx) => {...})`, que desenha o mesmo slide várias vezes: `estado === null` é a página-base, com tudo visível, e `estado = 0..n-1` é o item da vez.

Quatro formas (varie entre os slides):
1. **Acender um item da lista ou grade**: os outros ficam esmaecidos (`ctx.destacar(rects, estado)`). Ver ijg7_p003 → ijg7_p004, ijtheo_p021.
2. **Abrir um card ampliado** ligado ao item por um cone/feixe na cor clara: o item continua aceso e o resto esmaece (`ctx.popup` ou card + `formas.conectorZoom`). Ver ijtheo_p042, ijg5_p007, ijtheo_p009.
3. **Zoom na ilustração**: lupa circular sobre a área e card com a explicação (ijg7_p035, ijg7_p036, ijtheo_p055).
4. **Passo a passo de uma conta**: a seta do processo acende uma etapa por vez e um card mostra o cálculo daquela etapa (ijtheo_p079, ijtheo_p081).

Regras:
- Revele só o que tem explicação própria. Se o card ampliado repetiria o texto da base, não revele.
- No máximo de 2 a 4 slides revelados por seção, e nem todo slide revela. Slides de números normalmente não revelam.
- O título fica o mesmo em todas as páginas do slide, e todas as páginas mantêm `Fontes:`.
- Registre um único `deck.decidir` para o slide, com `revelacao: n`.

## 5. Imagens, ilustrações, vídeos e mockups

- **Ilustração isométrica 3D, personas geradas e ícones coloridos são aceitos** (decisão do usuário, 15/11). Como a skill não gera imagens, cada uma vira um placeholder grande e descrito, com o prompt pronto para o grupo gerar: `[IMAGEM: ilustração isométrica 3D, fundo branco, de <cena>; estilo dos decks Insper Jr]`. Fotos reais (concorrente, campanha, loja) também viram placeholder descrito, a menos que existam no catálogo (`imagens_tipografia.md`).
- **Vídeo**: quando o conteúdo for um vídeo real (campanha, depoimento, demonstração), use o placeholder `[VÍDEO: <o que mostra, duração>]` com moldura 16:9 e ícone de play, dentro do layout como uma imagem.
- **Protótipos de site, app, checkout ou campanha configurada**: sempre `[MOCKUP: <tela e o que ela demonstra>]` em moldura de celular, notebook ou print. Não desenhe a interface (decisão do usuário). O slide explica o que a tela resolve.
- A imagem tem de provar algo: o slide perde sentido sem ela. Foto genérica de "pessoas felizes" não entra.

## 6. Títulos

- O usuário quer título que conclui quando a conclusão está demonstrada. O formato "Assunto: conclusão" é bem-vindo ("Praça: a loja física puxa 80% da venda no 1º ano"), e o rótulo puro ("5C's: Consumidores") não é.
- Em seção exploratória vale uma pergunta precisa ("Em quais cidades o plano é viável?", ijtheo_p098), como pede a base de conteúdo.
- A frase de apoio diz o recorte ou como ler o slide, sem repetir o título.

## 7. O que NÃO copiar desses decks (triagem do usuário)

- Título-rótulo sem conclusão (vários slides do Theo e do Grupo 7).
- Vários slides quase iguais em sequência só para trocar fotos (Theo 29 a 40: 12 páginas de Produtos). Junte as categorias ou revele.
- Planilha colada como print (Theo 105 a 107). Use gráfico ou tabela nativa resumida.
- O mesmo organograma repetido em 16 páginas para mostrar cada cargo (Grupo 7, 81 a 96). Agrupe os cargos em cards.
- Slide com um ícone e uma palavra (Grupo 7, 10) e número gigante isolado no meio do slide (Grupo 5, 198).
- Balanço como tabela solta sem leitura (case, 8).

## 8. Como garantir variação (100 execuções = 100 decks diferentes, todos no padrão)

O padrão está nas regras acima, e a variação vem destas escolhas, decididas pelo conteúdo e registradas em `deck.decidir`:
- tipo de revelação (seção 4) e quais slides revelam;
- imagem à esquerda, à direita, no topo do card ou como fundo do bloco;
- cards em linha, em L, em escada ou em torno de uma ilustração central;
- gráfico com painel de leitura, com notas no próprio gráfico ou dividido em dois menores;
- prova externa escolhida (entrevista, citação, post, pesquisa);
- sorteio do deck (barra, cabeçalho, título, sumários) feito pelo `moldura.js`.

Antes de entregar, pergunte: "se eu rodasse este pedido de novo, a sequência de slides sairia igual?" Se sim, troque o arranjo de pelo menos um terço dos slides.


## 9. Regras do usuário da rodada 1 (2026-11-15)

- **Barrinha no início de todo cabeçalho de quadrante.** No modo Insper Jr o cabeçalho de bloco é sempre `marcador` (barrinha diagonal com degradê + título + subtítulo). Não sortear `linha`, `aba`, `frase` ou `sublinhado`.
- **Proibido travessão (—), meia-risca (–), sinal de menos (−) e ponto médio (·).** Dão cara de IA. Faixas: "25 a 40 anos". Rótulos: "D-60", "-8%". Separador: vírgula, ponto e vírgula ou "|". Frase com travessão: duas frases ou dois pontos. `finalizar` falha e o QA acusa erro se sobrar algum (inclui rótulos de gráfico).
- **Rodapé compacto**: linha divisória perto da borda (y 7,14), fluxo de seções à esquerda (9pt) e fonte à direita da mesma faixa, sem encostar no fluxo nem na logo; logo de quem apresenta sobe e fica ao lado da linha. O miolo vai até y 6,68.
- **Sem notas de rodapé.** Informação adicional vai para o apêndice ou para um slide seguinte de pop-up.
- **Estruturas vetadas e substitutas** (tiraFatos, listas numeradas, colunas com fio, chips): `references/contraexemplos_insperjr.md`. Icones de linha estao liberados no modo Insper Jr.
