# Telas da jornada (Marco 5 · rascunho de 17/11/2026, para revisão)

> Como a pessoa vê e usa a jornada gerada pelo motor ([jornada.md](jornada.md#implementação-do-motor-marco-3--17112026)). Segue as premissas do projeto: **celular primeiro**, **fácil de usar**, **positivo, mas baseado em fatos**, **sem culpa**, **quem executa é a pessoa**, **nenhum texto fixo no código** (3 idiomas, inclusive da direita para a esquerda) e a identidade visual de [design.md](design.md) (paleta, trilha da família, mala da prontidão, carimbos).
>
> Os desenhos abaixo são esboços em texto, só para mostrar a organização. O visual final segue a [prévia visual](design.md#prévia-visual).

## Mapa das telas

```
Questionário (essencial concluído) ──► Hoje  ◄──┐
                                         │      │  barra inferior
                    ┌────────────────────┼──────┤  (sempre visível)
                    ▼                    ▼      │
                 Jornada              Família   │
                    │                    │      │
                    ▼                    ▼      │
                 Tarefa               Caminho ──┘
```

**Barra inferior** (celular), com ícone e texto, áreas de toque grandes:

| Aba | O que é |
|---|---|
| **Hoje** | Tela inicial: o próximo passo e como está a jornada |
| **Jornada** | Todas as fases, etapas e tarefas, por fase ou por tema |
| **Família** | O perfil da família e os caminhos de visto para conhecer |
| **Mais** | Questionário (rever respostas), baixar e importar, idioma, aviso legal |

No computador, a mesma navegação vira uma barra lateral.

## 1. Hoje (tela inicial)

Depois de concluir a parte essencial do questionário, o app passa a abrir aqui.

```
┌──────────────────────────────────┐
│ Meta: março de 2027              │
│ faltam 16 meses                  │
├──────────────────────────────────┤
│ SEU PRÓXIMO PASSO                │
│ Conversar em família sobre a     │
│ mudança                          │
│ Família · peso médio · 1 a 2 h   │
│ [ Começar ]                      │
├──────────────────────────────────┤
│ 🧳 Mala da prontidão  12%        │
│ (itens por tema enchendo a mala) │
├──────────────────────────────────┤
│ "O seu porquê: ..."              │
└──────────────────────────────────┘
```

- **Meta e contagem:** "Meta: março de 2027 · faltam 16 meses". Sem data de ida, aparece o convite positivo "Que tal definir a sua meta?", que leva à tarefa "Definir a data de ida".
- **Um único próximo passo** (o que o motor escolhe). Abaixo, "Ver os passos desta semana" mostra mais alguns, na quantidade que combina com o ritmo escolhido (`rhythm.cadence` e `rhythm.weeklyTime`).
- **Mala da prontidão** (versão compacta): toque para ver por tema.
- **O seu porquê**, quando respondido, como lembrete.
- **Cartões que só aparecem quando fazem sentido**, sempre positivos e baseados em fatos:
  - **Conferência de realidade apertada:** "Para chegar pronto em março de 2027, você precisaria de cerca de 6 horas por semana, e hoje tem de 1 a 3. Que tal rever a meta ou reservar mais tempo?", com os botões **Rever a meta** e **Reservar mais tempo**.
  - **Prioridades:** "Você tem 3 prioridades. Vamos organizar?", que abre a lista das tarefas com prazo vencido, da mais importante para a menos.
  - **Blocos do questionário que acrescentam tarefas:** "Responda o bloco Saúde para incluir as tarefas de medicação e cuidados."
  - **Novidades:** "2 tarefas novas por causa da sua resposta."
  - **Data de ida que já passou:** "Você já se mudou?" (informar a chegada) ou "Escolher uma nova meta".

## 2. Jornada

```
┌──────────────────────────────────┐
│ [ Por fase ]  Por tema           │
├──────────────────────────────────┤
│ ●───●───○───○───○───○───○        │  ← trilha (fases como paradas)
│ Descoberta  (você está aqui)     │
├──────────────────────────────────┤
│ ▾ Família                 1 de 2 │
│   ✓ Conversar em família         │
│   ○ Plano de cuidados · Pedro    │
│     ⏳ aguardando: conversar...  │
│ ▸ Caminhos de visto       0 de 1 │
├──────────────────────────────────┤
│ [ + Nova tarefa ]                │
└──────────────────────────────────┘
```

- **Por fase** (padrão): a **trilha da família** no topo, com as 7 fases como paradas (feitas, atual e futuras). Tocar numa parada mostra a fase. **Todas as fases aparecem desde o início**, para a pessoa ver o todo, inclusive as futuras.
- Dentro da fase, as **etapas** abrem e fecham, cada uma com "x de y concluídas".
- **Cartão de tarefa (compacto):** título · para quem (quando é por pessoa: "Pedro") · prazo em mês e ano ("até mar/2027") · ícone de situação.
- **Selos positivos:** **Prioridade** (prazo vencido), **Destaque** (o motor destacou), **Aguardando** (com o nome da tarefa que vem antes). Nunca "atrasada".
- **Por tema:** os temas (Imigração, Idioma, Finanças…) com a prontidão de cada um e as tarefas daquele tema.
- **Filtro por pessoa** (opcional): "Ver só as tarefas do Pedro".
- **+ Nova tarefa:** abre o formulário de tarefa própria.
- **Carimbos do passaporte:** no topo da trilha, um carimbo por fase ([design.md](design.md#escolhido)).

## 3. Tarefa (detalhe)

```
┌──────────────────────────────────┐
│ ← Conversar em família           │
│ Descoberta · Família             │
│ Peso médio · 1 a 2 h · até dez/26│
├──────────────────────────────────┤
│ Por que importa                  │
│ Decidir juntos evita surpresas...│
├──────────────────────────────────┤
│ ☐ Marcar um momento sem pressa   │
│ ☐ Contar o seu porquê            │
│ ☐ Ouvir as dúvidas de cada um    │
│ ☐ Anotar o que ficou combinado   │
├──────────────────────────────────┤
│ Passo a passo                    │
│ Escolha um momento tranquilo...  │
├──────────────────────────────────┤
│ Quando e onde? [terças, 20h    ] │
├──────────────────────────────────┤
│ REGISTRO                         │
│ Data · Quem participou ·         │
│ O que foi decidido · Próximos    │
│ passos · Todos de acordo?        │
├──────────────────────────────────┤
│ [ Concluí ]   Não se aplica      │
└──────────────────────────────────┘
```

- **Topo:** título, fase e etapa, para quem, **peso** (baixo, médio, alto), tempo estimado e prazo.
- **Por que importa**, **subtarefas** (cada uma é uma pequena vitória e já move a prontidão) e **passo a passo**.
- **Fontes oficiais:** quando a tarefa tem fatos, cada marca de fonte vira um link com o órgão e a data de verificação, e o **aviso padrão** aparece no fim ([conteudo.md](conteudo.md#aviso-ao-final-de-cada-conteúdo-oficial)).
- **Quando e onde?** (opcional): transforma a intenção em plano (premissa 3).
- **Registro** ([jornada.md](jornada.md#registro-da-tarefa-decisão-do-fundador-em-17112026)), conforme o tipo da tarefa:
  - **Alinhamento:** data, quem participou (escolhe as pessoas), o que foi decidido, próximos passos e "todos de acordo?".
  - **Documentação:** para cada documento e pessoa, a situação (tenho · pedi · falta), a validade (mês e ano) e uma observação. Com o lembrete fixo: "não anote números de documentos nem senhas".
  - **Anotações:** texto livre.
- **Anotação pessoal** (texto livre, só da pessoa).
- **Botões:** **Comecei** (vira "em andamento"), **Concluí** e **Não se aplica** (um toque, sem pedir motivo). Tudo pode ser desfeito.
- **Tarefa aguardando:** mostra "Antes desta, conclua: [tarefa]", com o atalho. Ela pode ser lida, mas os botões de concluir ficam para depois.
- **Ao concluir:** uma comemoração curta e discreta, com uma sugestão de recompensa escolhida pela própria pessoa (`rhythm.rewards`, `pref.feelGood`).

## 4. Família (perfil)

As seções do [perfil da família](caminhos-visto.md#perfil-da-família): quem vai (com as idades na meta) · perfil profissional · cuidados (sem detalhes sensíveis) · dinheiro (com o fator "renda única" explicado de forma positiva, quando houver) · preferências · **pontos de atenção** (os alertas da jornada) · **caminhos para conhecer**.

- Cada informação tem o atalho **"mudar resposta"**, que leva direto à pergunta. Ao voltar, tudo já está recalculado.
- Blocos não respondidos aparecem como convite: "Responda o Perfil profissional para ver os caminhos de visto".

## 5. Caminho de visto (detalhe)

- Título, permanente ou temporário, e **por quem aparece** ("por você", "pelo cônjuge", "por Pedro").
- **Por que apareceu:** os motivos que vieram das respostas.
- **Requisitos oficiais resumidos**, com a fonte, a data de verificação e o aviso padrão.
- **O que você pode fazer agora:** as tarefas ligadas ao caminho, com atalho.
- **Recomendação de advogado de imigração**, sempre.
- Sem ranking, sem nota e sem "você se qualifica" ([regras de linguagem](caminhos-visto.md#regras-de-linguagem-obrigatórias)).

## 6. Fim de fase (check-in)

Ao concluir a última tarefa de uma fase: a comemoração maior, o **carimbo** da fase e o check-in ([jornada.md](jornada.md#pontos-de-reflexão)):

> "Depois do que você viu, ainda faz sentido para você?"
> **Continuar** · **Pausar** (a jornada fica salva) · **Ajustar o plano** (rever respostas) · **Encerrar** (decisão consciente, com o resumo do que você aprendeu).

## 7. Tarefa própria

Formulário curto: **título** (obrigatório) e, opcionalmente, etapa, tema, pessoa(s), peso (padrão: baixo) e prazo (mês e ano). Conta no progresso geral e no da etapa e do tema escolhidos.

## 8. Ajustes da jornada (em "Mais")

- **Meta (data de ida):** leva à pergunta do questionário.
- **Data de chegada real**, quando a pessoa já se mudou.
- **Prazo da Descoberta** (padrão: 1 mês a partir do início).

## Regras de tela (valem para todas)

- **Celular primeiro:** a partir de 360 px, uma coluna, botões de no mínimo 44 × 44 px, campos com letra de 16 px, sem depender de passar o mouse por cima.
- **Acessível:** a situação nunca é mostrada só por cor (sempre com ícone e texto), foco visível, leitores de tela, respeito a "reduzir movimento".
- **Idiomas:** todos os textos nos arquivos de tradução; datas e números no formato do idioma; layout espelhado para idiomas da direita para a esquerda.
- **Linguagem:** "você concluiu", "seu próximo passo". Nada negativo: "Prioridade", "Vamos organizar?", nunca "atrasada" ou "falhou". Mas sem esconder riscos.
- **Leve:** o conteúdo da jornada vem num pacote por idioma, gerado no build; a tela só baixa o idioma da pessoa.

## Como os dados chegam à tela (técnico)

- **Progresso:** um repositório novo, `apps/web/src/lib/storage/journey-repository.ts`, no mesmo padrão do questionário (IndexedDB hoje, API depois), validado por `parseProgress`. Entra no arquivo de baixar e importar.
- **Conteúdo:** um script gera, no build, um pacote por idioma com o catálogo publicado e os textos (só depois que os testes de conteúdo passam).
- **Jornada:** a tela chama `generateJourney`, `computeReadiness` e `buildFamilyProfile` de `@gotousa/shared` sempre que as respostas ou o progresso mudam.
- **Passo a passo em Markdown:** mostrado por um leitor simples e seguro (parágrafos, negrito, listas e links), sem aceitar HTML, para que um erro no conteúdo nunca quebre a página.

## Ordem de construção

1. **Dados:** repositório do progresso e pacote do conteúdo.
2. **Jornada** (por fase) e **Tarefa** (com subtarefas, botões e registro).
3. **Hoje** (próximo passo, meta, cartões).
4. **Família** e **Caminho**.
5. **Prontidão** (mala), **carimbos** e **check-in de fase**.
6. **Por tema**, **filtro por pessoa** e **tarefa própria**.

Cada parte é testada no celular pelo fundador antes da próxima.

## Decisões para o fundador

1. **Barra inferior com 4 abas** (Hoje · Jornada · Família · Mais)?
2. **Depois do essencial, o app abre direto em "Hoje"** (o questionário continua em "Mais" e nos convites)?
3. **Trilha da família em versão simples no MVP:** fases como paradas com ícones. Os avatares da família, personalizados e inclusivos ([design.md](design.md#escolhido)), ficam para depois do MVP.
4. **Comemoração:** discreta em toda tarefa concluída e maior no fim de cada fase, com a sugestão de recompensa nas duas?
