# Questionário como norte: caminhos de visto e perfil da família

> Documento vivo. Registra a decisão do fundador (16/11/2026): **o questionário é o norteador de tudo dentro do app.** A jornada, os caminhos de visto que vale a pena conhecer, o orçamento e as prioridades saem das respostas.

## A decisão, nas palavras do fundador

> "esse questionário precisa ser o norteador para tudo dentro do app. como já falamos não vamos dar nenhum tipo de assessoria especializada, mas vamos dar o norte para a pessoa baseado no questionário, a jornada, o tipo de visto precisa ser direcionado bem como a jornada."

## O que significa na prática

- **Tudo sai do questionário:** a jornada (fases, tarefas, prazos), o **perfil da família**, os **caminhos de visto para conhecer**, o orçamento e a tela "Hoje". Nenhuma tela inventa dados próprios: se o app precisa de uma informação, ela vira pergunta (adaptativa) no questionário.
- **Mudou a resposta, muda tudo:** editar uma resposta recalcula a jornada, o perfil e os caminhos.
- **Norte, não assessoria:** o app **indica o que vale a pena conhecer** e **por quê** (qual resposta levou a isso). Ele não diz "você se qualifica", não escolhe o visto pela pessoa e não monta pedidos.

## Caminhos de visto: como o app dá o norte

### Regras de linguagem (obrigatórias)
- **Sempre:** "Pelas suas respostas, vale a pena conhecer este caminho", "Estes são os requisitos oficiais", "Converse com um advogado de imigração para avaliar o seu caso".
- **Nunca:** "você se qualifica", "você vai conseguir", "este é o seu visto", "suas chances são de X%".
- Cada caminho mostra: **por que apareceu** (as respostas que levaram a ele), os **requisitos oficiais resumidos** com link da fonte e data de verificação, e o **aviso padrão** ([conteudo.md](conteudo.md#aviso-ao-final-de-cada-conteúdo-oficial)).
- Também mostra **"o que você pode fazer agora"**: tarefas de preparação legais (juntar provas da carreira, melhorar o inglês, avaliar o diploma), que entram na jornada.
- Quando nenhum caminho aparece com clareza, a Fase 0 começa por **"explorar os caminhos possíveis"**, e isso também é um resultado válido.

### Fontes de referência
| Fonte | O que é | Verificado em |
|---|---|---|
| [USCIS: Immigration and Nationality Act](https://www.uscis.gov/laws-and-policy/legislation/immigration-and-nationality-act) | Página do USCIS sobre a lei de imigração (INA, de 1952, emendada muitas vezes). Organiza a lei em 5 títulos e liga cada seção ao texto oficial no U.S. Code, Título 8 (uscode.house.gov). A página diz "Last Reviewed/Updated: 07/10/2019" | 16/11/2026 |
| [USCIS: Permanent Workers](https://www.uscis.gov/working-in-the-united-states/permanent-workers) | Categorias de Green Card por emprego (EB-1 a EB-5). "Last Reviewed/Updated: 08/20/2026" | 16/11/2026 |
| [USCIS: EB-1](https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-first-preference-eb-1) | Habilidade extraordinária (critérios de evidência), professores e pesquisadores de destaque, gerentes e executivos multinacionais. "Last Reviewed/Updated: 01/24/2025" | 16/11/2026 |
| [USCIS: EB-2](https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2) | Grau avançado, habilidade excepcional (critérios) e *national interest waiver*. "Last Reviewed/Updated: 01/15/2025" | 16/11/2026 |
| [USCIS: Temporary (Nonimmigrant) Workers](https://www.uscis.gov/working-in-the-united-states/temporary-nonimmigrant-workers) | Classificações de trabalho temporário (H-1B, L-1, O-1, TN, E-3, entre outras). "Last Reviewed/Updated: 08/20/2026" | 16/11/2026 |

> A lei (INA) é a base; o conteúdo do app resume sempre a **página oficial mais específica** do USCIS ou do Departamento de Estado e cita a seção da INA quando a página oficial citar. O resumo é feito a partir da fonte, nunca de memória.

### O que as fontes listam (resumo para orientar o mapeamento, não é conteúdo final)
Conferido nas páginas acima em 16/11/2026:
- **EB-1:** pessoas de habilidade extraordinária em ciências, artes, educação, negócios ou esportes; professores ou pesquisadores de destaque; certos gerentes e executivos multinacionais. Para habilidade extraordinária, o USCIS lista 10 tipos de evidência (prêmios, associações que exigem conquistas, material publicado sobre a pessoa, julgar o trabalho de outros, contribuições originais, artigos acadêmicos, exposições, papel de liderança, salário alto, sucesso comercial nas artes cênicas), pedindo 3 deles ou uma conquista única.
- **EB-2:** profissionais com grau avançado; pessoas com habilidade excepcional em ciências, artes ou negócios (6 critérios, pedindo 3); o *national interest waiver* dispensa a oferta de emprego quando é do interesse dos EUA e permite que a própria pessoa faça o pedido.
- **EB-3:** profissionais, trabalhadores qualificados e outros trabalhadores.
- **EB-4:** imigrantes especiais, entre eles certos trabalhadores religiosos.
- **EB-5:** investidores (valores e condições na página oficial).
- **Temporários (exemplos da lista oficial):** H-1B (ocupação especializada), L-1A/L-1B (transferência dentro da empresa), O-1 (habilidade extraordinária), TN (profissionais do México e do Canadá), E-3 (profissionais da Austrália), E-1/E-2 (tratados de comércio e investimento), R-1 (religiosos).

### Mapeamento: respostas → caminhos para conhecer (rascunho)
> A tabela mostra só **quando um caminho aparece para a pessoa conhecer**. Requisitos, valores e prazos vêm do conteúdo com fonte oficial. Será completada no Marco 3, junto com o motor da jornada.

| Se… | Caminho para conhecer |
|---|---|
| `goal.sponsorship` = `greencard`, ou oferta de emprego e `goal.duration` = `permanent` | Green Card por emprego (EB-2/EB-3), conforme escolaridade e experiência |
| `goal.sponsorship` = `temporary`, ou oferta de emprego e duração temporária | Vistos de trabalho temporário (ex.: H-1B), conforme a área e a escolaridade |
| `you.education`/`career.education` ∈ {`master`, `doctorate`}, ou graduação com muitos anos de experiência | EB-2 (grau avançado) e, se houver conquistas marcadas, o *national interest waiver* |
| 3 ou mais itens em `career.achievements` (sem `none`) | EB-2 por habilidade excepcional; com conquistas de destaque, EB-1 e O-1 |
| `career.multinational` = `yes` e `career.companyTime` ≠ `lt1y`, ou `goal.purpose` = `transfer` | Transferência dentro da empresa (L-1) e, para gerentes e executivos, EB-1 multinacional |
| `career.level` ∈ {`manager`, `executive`} com empresa multinacional | Destaque para o caminho de gerentes e executivos |
| `goal.purpose` ∈ {`academic`, `talent`}, ou `career.achievements` ∋ `publications` | Professores e pesquisadores de destaque (EB-1), O-1 |
| Nacionalidade de algum adulto (`you.nationalities`, `career.nationalities`) com acordo próprio na lista oficial (ex.: México e Canadá para TN, Austrália para E-3, países de tratado para E-1/E-2) | O caminho específico daquela nacionalidade, conferido na lista oficial |
| `goal.purpose` = `business` | Investidor (EB-5) e tratados de investimento (E-2), conforme a nacionalidade |
| `career.principal` = `partner` ou `both` | Mostra os caminhos **pelos dois adultos**, deixando claro quem seria o titular em cada um |
| `you.regulated`/`career.regulated` = `yes` | Junto com o caminho, tarefas de validação de diploma e licença no estado |
| `career.sameField` = `change` | Avisa que mudar de área pode mudar os caminhos e inclui tarefas de requalificação |
| Qualquer caminho | Recomenda conversar com um advogado de imigração antes de decidir, e a pessoa informa esse custo no orçamento ([orcamento.md](orcamento.md#custos-personalizados)) |

## Caminhos publicados (levantamento de 17/11/2026)

> **Decisão do fundador (17/11/2026):** dar toda a informação possível das fontes oficiais do governo americano, sem revisão caminho a caminho, mas **sempre** citando a fonte e deixando claro que o GoToUSA é um **apoio à jornada** e que a condução do processo legal é feita por **advogado de imigração ou profissional especializado**. Cada caminho termina com essa recomendação, e a tarefa essencial **"Conversar com um advogado de imigração"** entra na Fase 0 para todos (fonte: USCIS, Find Legal Services).

Os 20 caminhos ficam em `content/journey/paths/<id>/` (`path.json` + 3 idiomas). Todos foram resumidos das páginas do USCIS abaixo, conferidas em 17/11/2026; nenhum fato foi escrito de memória.

| Caminho (`id`) | Tipo · grupo | Aparece quando (resumo) | Fonte oficial (última atualização na página) |
|---|---|---|---|
| `eb1-extraordinary` | permanente · mérito | 3+ conquistas marcadas, ou propósito "talento" | USCIS EB-1 (24/01/2025) |
| `eb1-researcher` | permanente · mérito | propósito acadêmico, ou publicações + mestrado/doutorado | USCIS EB-1 |
| `eb1-multinational` | permanente · transferência | multinacional há 1 ano+ e cargo de gerência, executivo ou dono | USCIS EB-1 |
| `eb2-professional` | permanente · trabalho | mestrado/doutorado, graduação + 5 anos de experiência, ou 3+ conquistas | USCIS EB-2 (15/01/2025) · Permanent Workers (20/08/2026) |
| `eb2-niw` | permanente · mérito | base do EB-2 e alguma conquista marcada (ou propósito talento/acadêmico) | USCIS EB-2 |
| `eb3-workers` | permanente · trabalho | oferta de emprego, ou preferência por Green Card | USCIS EB-3 (20/08/2026) · Permanent Workers |
| `h1b-specialty` | temporário · trabalho | curso superior e oferta, busca de emprego ou propósito trabalho | USCIS H-1B (21/09/2026) |
| `l1-intracompany` | temporário · transferência | multinacional há 1 ano+, propósito transferência ou empresa com filial | USCIS L-1A e L-1B (31/08/2026) |
| `o1-extraordinary` | temporário · mérito | 3+ conquistas, ou propósito talento | USCIS O-1 (03/03/2023) |
| `eb5-investor` | permanente · investimento | propósito empreender/investir ou dinheiro para investir | USCIS Permanent Workers (valores) · EB-5 (01/03/2023) |
| `e2-treaty-investor` | temporário · investimento | idem | USCIS E-2 (20/08/2026) |
| `tn-usmca` | temporário · trabalho | nacionalidade Canadá ou México (lista `tn-nationalities`) | USCIS TN (04/06/2025) |
| `e3-australia` | temporário · trabalho | nacionalidade Austrália (lista `e3-nationalities`) | USCIS E-3 (29/07/2024) |
| `h1b1-chile-singapore` | temporário · trabalho | nacionalidade Chile ou Singapura (lista `h1b1-nationalities`) | USCIS Temporary Workers (20/08/2026) · H-1B |
| `family-immediate-relative` | permanente · família | cônjuge, pai/mãe ou filho cidadão americano | USCIS Immediate Relatives (30/01/2026) · Family Preference |
| `family-preference` | permanente · família | pai/mãe ou irmão cidadão; cônjuge ou pai/mãe com Green Card | USCIS Family Preference (08/07/2025) |
| `k1-fiance` | temporário · família | propósito casamento | USCIS K-1 (23/03/2018 — o texto avisa que a página é antiga) |
| `student-f1-m1` | temporário · estudo | propósito estudo, aceite de escola, ou adulto da família que pretende estudar | USCIS Students and Exchange Visitors (24/01/2025) · Students and Employment (20/11/2025) |
| `j1-exchange` | temporário · estudo | propósito intercâmbio ou acadêmico, ou intercâmbio de ensino médio | USCIS Exchange Visitors (13/01/2025) |
| `diversity-visa` | permanente · outros | propósito loteria | USCIS Diversity Visa (08/07/2025) |

**Peça nova de condição `w`:** resposta de carreira do adulto da vez, lida de `you.<w>` para você e de `career.<w>` para os outros (ex.: `{ "w": "education", "in": ["master", "doctorate"] }`). Em respostas de várias escolhas, `gte`/`lte` contam os itens marcados (ex.: 3 ou mais conquistas).

**Limites do levantamento (honestidade):**
- As páginas do **Departamento de Estado** (travel.state.gov) recusam o acesso automático. Por isso: a lista de **países com tratado E-1/E-2** não foi usada (o caminho E-2 aparece por investimento e manda conferir a lista oficial), e a **loteria** não filtra por país nem cita os requisitos de escolaridade (o texto manda conferir as instruções oficiais do ano). O E-1 (comércio) ficou de fora, porque o questionário não pergunta sobre comércio internacional.
- **Aposentadoria:** nas páginas oficiais conferidas não há uma categoria específica; nenhum caminho aparece por esse propósito (a tarefa "Conhecer os caminhos" continua valendo).
- A página geral do EB-5 é de 2023 e fala de uma regra anulada; os valores atuais vêm da página **Permanent Workers** (20/08/2026).
- Os caminhos ainda **não aparecem na tela**: a tela de Família e Caminho é a parte 4 do Marco 5.

## Perfil da família

Uma tela-resumo, gerada só a partir das respostas, que mostra **quem é essa família** e serve de "capa" da jornada. Não dá nota nem diagnóstico.

- **Quem vai:** pessoas, idades na data de partida (calculadas por mês/ano de nascimento), relação.
- **Perfil profissional:** para você e o cônjuge, área, nível, escolaridade, inglês, conquistas marcadas e quem tem o perfil mais forte para liderar o pedido.
- **Cuidados e saúde:** quem precisa de apoio, quem é o cuidador, medicação contínua (sem detalhes sensíveis na tela-resumo).
- **Dinheiro:** fontes de renda hoje e nos EUA; destaque para o **fator de risco "renda única"** quando houver.
- **Preferências:** clima, tamanho de cidade, ritmo, prioridades da família (ex.: serviços para pessoas com deficiência).
- **Pontos de atenção:** alertas gerados pelas regras (ex.: filho que fará 21 anos, união sem registro, histórico que exige advogado), cada um com fonte oficial.
- **Caminhos para conhecer:** a lista acima, com "por que apareceu".
- Fica no navegador, como todo o resto, e entra no arquivo de baixar e importar.

## Como o motor gera o perfil e os caminhos (Marco 3, passo 5 · aprovado em 17/11/2026)

> Segue as regras já aprovadas da jornada: [modelo](jornada.md#modelo-da-jornada-marco-3-passo-1--aprovado-em-17112026), [formato do conteúdo](jornada.md#formato-do-conteúdo-marco-3-passo-2--aprovado-em-17112026) e [regras de geração](jornada.md#regras-de-geração-marco-3-passo-3--aprovado-em-17112026). **Premissa reforçada pelo fundador em 17/11/2026: todo fato sobre visto vem de fonte oficial, sempre.** Este documento define só a **lógica** (que resposta leva a qual caminho). Descrições, requisitos, valores e prazos entram no conteúdo de cada caminho, resumidos da fonte oficial e com data de verificação.

### Perfil da família: como é gerado

- **Calculado na hora** a partir das respostas, como a jornada (camada 2 do modelo). Não precisa ser salvo e muda sozinho quando uma resposta muda.
- **Seções:** as listadas em [Perfil da família](#perfil-da-família) (quem vai, perfil profissional, cuidados, dinheiro, preferências, pontos de atenção, caminhos para conhecer).
- **Idades na data de ida** (a meta). Com a ida em "ainda não sei", usa a idade de hoje.
- **Pontos de atenção = os alertas da jornada.** O perfil não tem regras próprias de alerta: mostra as tarefas do tipo **alerta legal** que se aplicam à família. Assim existe uma fonte só, com fonte oficial, e o perfil e a jornada nunca se contradizem. O tom segue a premissa 6: positivo, mas claro sobre o risco.
- **Sem detalhes sensíveis na tela-resumo:** mostra "medicação contínua" ou "precisa de apoio", nunca nomes de remédios ou diagnósticos.
- **Cada informação tem o atalho "mudar resposta"**, que leva direto à pergunta. Ao voltar, o perfil e a jornada já estão recalculados.
- **Bloco não respondido:** "Responda o bloco Perfil profissional para ver os caminhos de visto que vale a pena conhecer" (positivo, sem cobrança).

### Caminhos de visto: o catálogo

Cada caminho fica em `content/journey/paths/<id>/`, no mesmo formato aprovado das tarefas: um `path.json` com a estrutura e um Markdown por idioma (**os 3 idiomas obrigatórios**), com as fontes oficiais.

| Campo do `path.json` | O que guarda |
|---|---|
| `id` | ID estável (ex.: `eb2-advanced-degree`) |
| `status` | `draft` ou `published`. **Só é publicado com o resumo feito da fonte oficial** |
| `kind` | `permanent` (residência permanente) ou `temporary` (temporário) |
| `group` | trabalho · mérito e talento · transferência na empresa · investimento · família · estudo e intercâmbio · outros |
| `showWhen` | Quando o caminho aparece para conhecer (mesmo formato de condição das tarefas) |
| `reasons` | Lista de "por que apareceu": cada motivo tem a sua condição e o seu texto, e só aparece o motivo cuja condição vale (ex.: "você marcou 3 conquistas na carreira") |
| `byWorker` | `true` quando o caminho é avaliado **por adulto** (você e o cônjuge separadamente), mostrando quem seria o titular |
| `tasks` | Tarefas da jornada de "o que você pode fazer agora" (ex.: juntar provas das conquistas) |
| `sources` | Fontes oficiais com órgão, link e data de verificação. **Obrigatório: pelo menos uma** |

**Peças novas de condição** (somam-se às aprovadas no passo 3):
- `{ "path": "eb2-advanced-degree" }`: o caminho está sendo mostrado. Serve para as tarefas de "o que fazer agora" entrarem na jornada só quando o caminho aparece.
- `{ "nationalityIn": "e2-treaty-countries" }`: alguma nacionalidade do adulto da vez está numa **lista oficial** guardada em `content/data/`, com fonte e data de verificação. Nenhuma lista de países é escrita de memória.

### Como os caminhos aparecem

- **Simples, funcional e sem nada negativo.** Os caminhos aparecem **agrupados** (permanentes e temporários, e por grupo), sem ranking, sem nota e sem "melhor" ou "pior". Ordenar por "quantos motivos bateram" passaria a ideia de chance, que é proibida pelas [regras de linguagem](#regras-de-linguagem-obrigatórias).
- **Por adulto:** nos caminhos `byWorker`, o motor avalia **cada adulto que vai** separadamente (você, o cônjuge e também filhos e dependentes com 18 anos ou mais na data de ida) e mostra por quem o caminho aparece. `career.principal` não esconde caminhos; só destaca o que a pessoa indicou.
- **Adultos além do casal:** um filho ou dependente adulto pode precisar do **próprio caminho** (a regra geral de dependentes tem limite de idade, sempre explicada com fonte oficial). O perfil e a jornada mostram isso como ponto de atenção. Para avaliar caminhos de trabalho ou estudo desses adultos, o questionário precisa conhecê-los melhor: ver [Adultos além do casal no questionário](#adultos-além-do-casal-no-questionário-proposta).
- **Cada caminho mostra:** por que apareceu · requisitos oficiais resumidos com a fonte e a data · o que você pode fazer agora (tarefas) · recomendação de advogado de imigração · aviso padrão.
- **Nenhum caminho apareceu:** entra na Fase 0 a tarefa essencial "explorar os caminhos possíveis", com as páginas oficiais gerais. É um resultado válido, mostrado de forma positiva.
- **Asilo e refúgio ficam fora do app** (decisão do fundador em 17/11/2026): não é o objetivo do GoToUSA. A opção "Preciso de proteção" foi retirada do questionário.

### Mapeamento: grupos ainda sem fonte conferida

O mapeamento de trabalho, mérito, transferência e investimento está na tabela acima, com as fontes conferidas em 16/11/2026. Para os outros propósitos do questionário, o caminho só é escrito depois de conferido na fonte oficial (USCIS ou Departamento de Estado):

| Se… | Grupo para conhecer | Situação |
|---|---|---|
| `goal.purpose` = `family` ou `goal.familyLink` respondida | Família (conforme o parentesco em `goal.familyLink`) | Conferir as categorias na fonte oficial |
| `goal.purpose` = `marriage` | Família (casamento com cidadão americano) | Conferir na fonte oficial |
| `goal.purpose` = `study` | Estudo (conforme `goal.studyLevel`) | Conferir na fonte oficial |
| `goal.purpose` = `exchange` | Intercâmbio | Conferir na fonte oficial |
| `goal.purpose` = `lottery` | Loteria do Green Card | Conferir na fonte oficial |
| `goal.purpose` = `retire` | Explorar caminhos para quem se aposenta | Conferir na fonte oficial se há categoria específica antes de mostrar qualquer caminho |
| Filho ou dependente com 18 anos ou mais na data de ida | Ponto de atenção: pode precisar do próprio caminho | Regra geral de dependentes explicada com fonte oficial |

### Garantias (testes automáticos)

1. Todo caminho publicado tem fonte oficial, os 3 idiomas e condições que citam só perguntas e opções existentes.
2. Toda lista de países usada em condição tem fonte e data de verificação.
3. Cenários testados, começando pelo [cenário inicial](mvp.md#cenário-inicial-de-validação): para cada família de exemplo, o teste confere quais caminhos aparecem e com quais motivos.
4. Nenhum texto de caminho usa as expressões proibidas ("você se qualifica", "suas chances" e equivalentes nos 3 idiomas): o teste procura essas palavras.

### Decisões tomadas (17/11/2026)

1. ✅ **Nada negativo, funcional e simples:** caminhos agrupados, sem ranking e sem nota.
2. ✅ **Avaliação por adulto:** você, o cônjuge e **todo filho ou dependente maior de idade** que vai.
3. ✅ **Pontos de atenção do perfil = alertas da jornada**, uma fonte só.
4. ✅ **Asilo e refúgio fora do app:** não é o objetivo do GoToUSA; a opção saiu do questionário.

### Adultos além do casal no questionário (proposta)

Hoje o perfil profissional (Bloco 11) só pergunta sobre você e o cônjuge. Para considerar os outros adultos:
- Para cada filho ou dependente com 18 anos ou mais na data de ida, uma pergunta: **"Essa pessoa pretende trabalhar ou estudar nos EUA?"** (trabalhar · estudar · as duas coisas · não · ainda não sei).
- Se trabalhar: as perguntas de carreira do Bloco 11 (escolaridade, área, experiência, conquistas). Se estudar: o nível de estudo pretendido.
- Se não (ex.: um filho que depende de cuidados): nenhuma pergunta a mais. A jornada mostra os pontos de atenção e as tarefas de cuidado, como já acontece.
- A implementação entra junto com a do motor, com a aprovação do fundador.

## Perguntas novas (Bloco 11 · Perfil profissional)

Incluídas em 16/11/2026 para aprofundar a carreira **de você e do cônjuge**. Detalhes em [questionario-perguntas.md](questionario-perguntas.md#bloco-11--perfil-profissional-para-completar--por-pessoa-você-e-cônjuge). As opções de conquistas espelham, em linguagem simples, os tipos de evidência listados pelo USCIS, sem afirmar que a pessoa se qualifica.

## Pendências
- [x] Revisar e aprovar [Como o motor gera o perfil e os caminhos](#como-o-motor-gera-o-perfil-e-os-caminhos-marco-3-passo-5--aprovado-em-17112026) (Marco 3, passo 5), aprovado em 17/11/2026
- [ ] Aprovar a proposta de [adultos além do casal no questionário](#adultos-além-do-casal-no-questionário-proposta)
- [x] Completar o mapeamento com o conteúdo de cada caminho resumido da fonte oficial (20 caminhos em 17/11/2026, ver [Caminhos publicados](#caminhos-publicados-levantamento-de-17112026))
- [x] Conferir na fonte oficial os grupos de família, estudo, intercâmbio, loteria e aposentadoria (USCIS, 17/11/2026)
- [x] Nacionalidades de TN, E-3 e H-1B1 conferidas no USCIS (listas em `content/data/`)
- [ ] Lista de países de tratado (E-1/E-2) e instruções anuais da loteria: o site do Departamento de Estado recusa o acesso automático; buscar outra forma oficial (ex.: Federal Register, 9 FAM)
- [ ] Tela de Família e Caminho (Marco 5, parte 4) para mostrar os caminhos
- [ ] Desenhar a tela do perfil da família
