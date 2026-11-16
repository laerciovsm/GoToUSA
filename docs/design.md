# Design

> Documento vivo. Define a identidade visual e o lado lúdico do GoToUSA. Pode mudar conforme a validação.

## Princípios

- **Claro, agradável e com bom contraste**, seguindo o padrão de acessibilidade **WCAG AA** no mínimo.
- **Lúdico, mas simples:** bonito e atrativo, sem exagero e sem estética épica ou de fantasia.
- **Base calma, energia para agir:** o tema mexe com ansiedade (dinheiro, família, visto), então a base passa segurança e as cores quentes aparecem nas ações e conquistas.
- **Neutro para o mundo todo:** sem depender de significados culturais de cores. Evitar a combinação azul + vermelho + branco (bandeira americana), que fica caricata, e o vermelho fora de erros, porque passa alarme.
- **Nunca depender só da cor:** todo estado também tem ícone ou texto (ex.: ✓ em concluído).
- **Modo claro e modo escuro**, gerados da mesma paleta.
- **Respeitar "reduzir movimento"** do sistema: animações curtas e desligáveis.

## Paleta (modo claro)

| Papel | Cor | Uso |
|---|---|---|
| Fundo | `#FAFAF7` | Fundo das telas (branco quente) |
| Cartões | `#FFFFFF` | Tarefas, blocos |
| Texto principal | `#1F2937` | Grafite, contraste muito alto |
| Texto secundário | `#4B5563` | Descrições |
| **Primária** | `#0F766E` | Azul-petróleo: cabeçalho, links, a trilha |
| **Ação** | `#C2410C` | Laranja queimado: botões principais ("Concluir", "Próximo passo") |
| **Celebração** | `#F59E0B` | Âmbar: carimbos, conquistas, recompensas (sempre com texto escuro) |
| **Concluído** | `#15803D` | Verde: tarefas feitas, prontidão |
| Fundos suaves | `#F0FDFA` / `#FFFBEB` | Destaques leves |
| Alerta | `#B45309` | Avisos legais e atenção |
| Erro | `#B91C1C` | Somente erros |

> Os contrastes devem ser conferidos com ferramenta quando forem para o código.

## O lúdico

### Escolhido
1. **A trilha da família** (tela da jornada): um caminho com as fases como paradas.
   - **O avatar é a família**, não uma pessoa: mostra quem vai, segundo o questionário (cônjuge, filhos, dependentes, animais). Todos caminham juntos.
   - **Avatares inclusivos:** tons de pele, cabelo, idade, cadeira de rodas e outros, escolhidos pela própria pessoa.
   - **O ponto de chegada é a cidade escolhida.** Antes da escolha, aparece um horizonte genérico com "?", que convida a decidir.
   - **O cenário muda por fase:** casa no país de origem (Descoberta), mesa com papéis (Planejamento), malas (Preparação), aeroporto (Mudança), cidade nova (Chegada).
2. **A mala da prontidão** (indicador): uma mala que vai enchendo conforme a prontidão cresce. Cada tema é um item (passaporte, dinheiro, livro de inglês…). Também mostra a porcentagem.
3. **Os carimbos do passaporte** (conquistas): um carimbo por fase. Fase concluída mostra um **✓ verde** sobre o carimbo; fase em andamento aparece carimbada sem o ✓; fases futuras aparecem tracejadas.

### Onde cada elemento aparece
A prévia reúne tudo numa página só para avaliação. No app, cada elemento fica na sua tela e no seu momento:
- **Trilha da família:** tela da jornada.
- **Tela "Hoje":** tela inicial, com o próximo passo.
- **Mala da prontidão:** indicador na tela inicial e na jornada.
- **Cartão de tarefa:** ao abrir uma tarefa.
- **Carimbos:** tela de conquistas e na celebração ao concluir uma fase.

### Ideias guardadas (usar com moderação, se fizer sentido)
- **Cartão de embarque por fase** ao concluir uma fase.
- **Clima do destino** na tela inicial (ex.: "Seattle, 12°C"), como lembrete do porquê.

> **Cuidado com excesso:** trilha + família, mala e carimbos já bastam. Somar tudo vira poluição visual.

## Estilo de ilustração

- Ilustração **plana**, cantos arredondados, sombras suaves.
- Animações curtas: concluir tarefa, ganhar carimbo, avançar na trilha.
- Sem texto dentro das ilustrações (por causa da tradução).

## Prévia visual
- Página de prévia (privada) com a paleta aplicada, a trilha da família, a tela "Hoje", a mala da prontidão, um cartão de tarefa e os carimbos: https://claude.ai/artifact/3QvtHYeGLGDXmAKWppporE
- Fontes usadas na prévia (gratuitas, Google Fonts): **Fredoka** nos títulos e **Nunito** nos textos.
