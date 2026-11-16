# Questionário: perguntas e regras (aprovado pelo fundador em 16/11/2026)

> Especificação detalhada do questionário inicial. A visão geral dos blocos está em [questionario.md](questionario.md).
> Os textos estão em pt-BR. Depois de aprovados, viram arquivos de tradução (en-US, pt-BR, es).

## Convenções

- **ID estável** em cada pergunta e opção (ex.: `you.english`, `fluent`). O ID nunca muda, mesmo que o texto mude, para não quebrar respostas já salvas.
- **Tipos de pergunta:**
  - `única`: escolhe uma opção
  - `múltipla`: escolhe várias opções
  - `texto`: escrita livre (curta)
  - `número`
  - `mês/ano`
  - `país` / `países`: lista de países com busca
  - `por pessoa`: a pergunta se repete para cada pessoa da família
- **Condição:** quando a pergunta só aparece em certos casos (ex.: "se `goal.purpose` = `work`").
- **(opcional)**: a pessoa pode pular. Toda pergunta delicada tem também **"Prefiro não responder"**.
- **"Por que perguntamos?"**: toda pergunta tem um link curto que explica para que serve a resposta. Isso gera confiança e reduz desistência.
- **Nenhum fato legal no texto das perguntas.** Explicações sobre regras ficam no conteúdo da jornada, com fonte oficial e aviso padrão.

## Experiência do questionário

- **Duas etapas, para não cansar:**
  1. **Essencial** (cerca de 10 minutos): blocos 1, 2, 3 e 10. Com isso, a primeira versão da jornada já é gerada. O Bloco 3 já inclui **autonomia e cuidador** de quem tem deficiência ou depende de cuidados, porque isso gera tarefas importantes desde o início.
  2. **Para completar** (no ritmo da pessoa): blocos 0, 4, 5, 6, 7, 8 e 9. Cada bloco concluído deixa a jornada mais precisa, e o app mostra isso ("Responda o bloco Saúde para incluir as tarefas de medicação e cuidados").
- Barra de progresso por bloco e tempo estimado de cada bloco.
- Salva a cada resposta (no navegador). A pessoa pode sair e voltar.
- Uma pergunta por tela no celular, com botões grandes.
- Sempre dá para voltar e mudar uma resposta. A jornada é recalculada.

---

## Bloco 0 · O seu porquê *(para completar)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `why.reason` | Por que você quer morar nos Estados Unidos? | múltipla + texto | `career` Crescer na carreira · `safety` Mais segurança · `education` Estudo, meu ou dos filhos · `family` Ficar perto da família · `quality` Qualidade de vida · `income` Ganhar mais · `experience` Viver uma experiência nova · `other` Outro (texto). Depois: "Escreva com suas palavras" (texto, opcional) |
| `why.expect` | O que você espera que mude na sua vida? | texto (opcional) | — |
| `why.fears` | O que mais te preocupa nessa mudança? | múltipla + texto (opcional) | `language` O idioma · `money` Dinheiro · `job` Conseguir trabalho · `family_left` Deixar família e amigos · `kids_adapt` Adaptação dos filhos · `health` Saúde e custos médicos · `legal` Fazer algo errado no processo · `loneliness` Solidão · `other` Outro |
| `why.giveUp` | Do que você está disposto(a) a abrir mão? | múltipla (opcional) | `near_family` Morar perto da família · `career_now` A carreira atual · `comfort` Conforto e rotina · `language_daily` Falar meu idioma no dia a dia · `savings` Parte das economias · `none_sure` Ainda não sei |

> O texto de `why.reason` volta para a pessoa na tela inicial e nos check-ins.

---

## Bloco 1 · Sobre você *(essencial)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `you.nationalities` | Qual é a sua nacionalidade? Se tiver mais de uma, marque todas. | países | Obrigatória |
| `you.residence` | Em que país você mora hoje? | país | Pré-preenchida com a primeira nacionalidade |
| `you.birthYear` | Em que ano você nasceu? | número | — |
| `you.languages` | Quais idiomas você fala? | múltipla com busca | Lista de idiomas |
| `you.english` | Como está o seu inglês hoje? | única | `none` Não falo · `basic` Entendo palavras e frases simples · `intermediate` Consigo me virar no dia a dia (mercado, restaurante) · `advanced` Consigo conversar sobre quase tudo · `fluent` Consigo trabalhar e estudar em inglês |
| `you.education` | Qual é a sua escolaridade mais alta (concluída)? | única | `primary` Ensino fundamental · `secondary` Ensino médio · `technical` Curso técnico · `bachelor` Graduação · `postgrad` Especialização/MBA · `master` Mestrado · `doctorate` Doutorado |
| `you.field` | Qual é a sua área de formação? | texto | Condição: `you.education` ≥ `technical` |
| `you.occupation` | Qual é a sua profissão ou ocupação atual? | texto | — |
| `you.experienceYears` | Há quantos anos você trabalha nessa área? | número | — |
| `you.regulated` | A sua profissão exige registro ou licença para exercer? (ex.: medicina, enfermagem, direito, engenharia, contabilidade) | única | `yes` Sim · `no` Não · `unsure` Não sei |
| `you.workStatus` | Qual é a sua situação de trabalho hoje? | única | `employed` Empregado(a) · `business_owner` Tenho empresa · `self_employed` Autônomo(a) · `remote_foreign` Trabalho remoto para empresa de outro país · `student` Estudante · `retired` Aposentado(a) · `unemployed` Sem trabalho no momento |

---

## Bloco 2 · O seu objetivo *(essencial)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `goal.purpose` | Qual é o principal motivo da sua ida? | única | `work` Trabalhar · `transfer` Ser transferido(a) pela empresa onde trabalho · `study` Estudar · `business` Empreender ou investir · `family` Reunir-me com família que mora lá · `marriage` Casar ou viver com cidadão(ã) americano(a) · `retire` Aposentadoria · `academic` Pesquisa ou carreira acadêmica · `talent` Talento extraordinário (artes, esportes, ciência, negócios) · `exchange` Intercâmbio · `lottery` Loteria do Green Card · `protection` Preciso de proteção (perseguição ou risco no meu país) · `unsure` Ainda não sei |
| `goal.duration` | Por quanto tempo você quer ficar? | única | `lt6m` Até 6 meses · `6to12m` De 6 meses a 1 ano · `1to3y` De 1 a 3 anos · `3to5y` De 3 a 5 anos · `permanent` Para sempre · `unsure` Não sei |
| `goal.departure` | Quando você gostaria de ir? | mês/ano | Opção `unsure` Ainda não sei. Base do cronograma |
| `goal.has` | O que você já tem hoje? | múltipla | `job_offer` Oferta de emprego · `school_admission` Aceite de escola ou universidade · `us_relative` Parente que mora nos EUA · `company_branch` Empresa com filial nos EUA · `capital` Dinheiro para investir · `nothing` Nada ainda |
| `goal.sponsorship` | O empregador vai patrocinar qual tipo de visto? | única | `temporary` Visto de trabalho temporário · `greencard` Green Card (residência permanente) · `unsure` Não sei. Condição: `goal.purpose` ∈ {`work`, `transfer`} ou `goal.has` ∋ `job_offer` |
| `goal.familyLink` | Quem é o seu parente nos EUA? | única | `spouse_citizen` Cônjuge cidadão(ã) · `spouse_resident` Cônjuge com Green Card · `parent_citizen` Pai/mãe cidadão(ã) · `parent_resident` Pai/mãe com Green Card · `child_citizen` Filho(a) cidadão(ã) · `sibling_citizen` Irmão(ã) cidadão(ã) · `other` Outro. Condição: `goal.purpose` = `family` ou `goal.has` ∋ `us_relative` |
| `goal.studyLevel` | O que você quer estudar? | única | `language` Curso de inglês · `undergrad` Graduação · `grad` Mestrado/doutorado · `vocational` Curso técnico/profissionalizante · `exchange_hs` Intercâmbio no ensino médio. Condição: `goal.purpose` = `study` |
| `goal.investRange` | Quanto você pensa em investir? (em USD) | única | `lt100k` Até 100 mil · `100to500k` De 100 mil a 500 mil · `500kto1m` De 500 mil a 1 milhão · `gt1m` Mais de 1 milhão · `unsure` Não sei. Condição: `goal.purpose` = `business` |

---

## Bloco 3 · Quem vai com você *(essencial)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `household.partner` | Você tem cônjuge ou companheiro(a)? | única | `none` Não · `going` Sim, e vai junto · `not_going` Sim, mas não vai · `undecided` Sim, mas ainda não sabemos se vai |
| `household.partnerUnion` | Como é a união de vocês? | única | `civil_marriage` Casamento civil · `stable_union` União estável · `informal` Moramos juntos sem registro · `other` Outro. Condição: `household.partner` ∈ {`going`, `undecided`} |
| `partner.english` | Como está o inglês do seu cônjuge? | única (opcional) | Mesmas opções de `you.english`. Condição: `household.partner` ∈ {`going`, `undecided`} |
| `partner.occupation` | Qual é a profissão ou ocupação do seu cônjuge? | texto (opcional) | Condição: `household.partner` ∈ {`going`, `undecided`} |
| `household.children` | Quantos filhos vão com você? Conte todos, de qualquer idade, inclusive os adultos. | número (0+) | Filhos adultos entram aqui, não em "outros dependentes" |
| `child.birth` | Mês e ano de nascimento | por pessoa · mês/ano | Para cada filho. Nome ou apelido opcional, só para identificar na jornada. **Data, e não idade:** a jornada dura anos, e o app calcula a idade em qualquer data do cronograma |
| `child.school` | Em que etapa da escola está? | por pessoa · única | `not_school` Ainda não estuda · `preschool` Educação infantil · `elementary` Fundamental · `high` Ensino médio · `college` Faculdade · `finished` Já terminou os estudos · `special` Educação especial |
| `child.specialNeeds` | Tem alguma deficiência ou precisa de cuidados contínuos? | por pessoa · única | `yes` Sim · `no` Não · `skip` Prefiro não responder (o detalhe fica no bloco Saúde) |
| `health.autonomy` | No dia a dia, essa pessoa… | por pessoa · única | `independent` É independente · `supervision` Precisa de supervisão · `help` Precisa de ajuda em atividades diárias (banho, alimentação, vestir) · `full` Depende totalmente de outra pessoa. Condição: `child.specialNeeds` = `yes`. **Fica na parte essencial** porque gera tarefas importantes (ex.: *guardianship*) já na primeira jornada |
| `health.caregiver` | Quem é o cuidador principal? | por pessoa · única | Lista das pessoas da família + `external` Cuidador contratado + `other` Outro. Condição: `health.autonomy` ≠ `independent` |
| `child.english` | Fala inglês? | por pessoa · única | Mesmas opções de `you.english` |
| `household.otherChildren` | Você tem filhos de outro relacionamento que vão junto? | única | `yes` · `no`. Se sim: `household.custody` (abaixo) |
| `household.custody` | O outro pai ou mãe concorda com a viagem? | única | `agrees` Sim, concorda · `disagrees` Não concorda · `unknown` Ainda não conversamos · `sole` Tenho a guarda exclusiva/o outro genitor é falecido |
| `household.dependents` | Além do cônjuge e dos filhos, alguém que depende de você vai junto? (ex.: pai, mãe, avó, irmão) | número (0+) | — |
| `dependent.relation` | Qual é a relação com você? | por pessoa · única | `parent` Pai/mãe · `grandparent` Avô/avó · `sibling` Irmão(ã) · `in_law` Sogro(a) · `other` Outro. (Filhos, de qualquer idade, ficam em `household.children`) |
| `dependent.birth` | Mês e ano de nascimento | por pessoa · mês/ano | — |
| `dependent.dependency` | Como é a dependência? | por pessoa · única | `full` Depende totalmente (cuidados e dinheiro) · `care` Precisa de cuidados, mas tem renda própria · `financial` Só financeira · `partial` Parcial |
| `health.autonomy` / `health.caregiver` | (as mesmas perguntas dos filhos) | por pessoa | Condição: `dependent.dependency` ∈ {`full`, `care`, `partial`} |
| `household.pets` | Vai levar animais de estimação? | múltipla | `none` Não · `dog` Cachorro · `cat` Gato · `bird` Ave · `other` Outro. Depois, quantos |
| `household.leftBehind` | Alguém que depende de você vai ficar no seu país? | única | `yes` Sim · `no` Não. Se sim: quem (texto curto, opcional) |

> **Autonomia e cuidador** são perguntados aqui para quem tem deficiência ou depende de cuidados. O **restante da saúde** (condições, medicação, terapias) fica no Bloco 4.

---

## Bloco 4 · Saúde *(para completar · opcional · por pessoa)*

> Antes do bloco: "Estas respostas ficam só neste aparelho e servem para incluir na jornada as tarefas de saúde, medicação e cuidados e para estimar custos nos EUA. Você pode pular qualquer pergunta."

Repetido para cada pessoa: você, cônjuge (se vai), cada filho e cada dependente.

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `health.conditions` | Alguma destas situações se aplica? | múltipla | `none` Nenhuma · `autism` Autismo · `intellectual` Deficiência intelectual · `adhd` TDAH · `chronic` Doença crônica (ex.: diabetes, cardiopatia, doença renal) · `mental` Saúde mental (ex.: depressão, ansiedade, bipolaridade) · `mobility` Mobilidade reduzida ou cadeira de rodas · `vision` Deficiência visual · `hearing` Deficiência auditiva · `other` Outra |
| `health.autismLevel` | Nível de suporte do autismo | única | `1` Nível 1 · `2` Nível 2 · `3` Nível 3 · `unknown` Não sei. Condição: `autism` |
| `health.intellectualDegree` | Grau da deficiência intelectual | única | `mild` Leve · `moderate` Moderado · `severe` Grave · `profound` Profundo · `unknown` Não sei. Condição: `intellectual` |
| `health.autonomy` | No dia a dia, essa pessoa… | única | Mesmas opções do Bloco 3. **Só aparece para quem ainda não respondeu no Bloco 3** (a resposta é a mesma, com o mesmo ID) |
| `health.caregiver` | Quem é o cuidador principal? | única | Igual ao Bloco 3. Condição: `health.autonomy` ≠ `independent` e ainda não respondida |
| `health.medications` | Toma medicação contínua? | lista | Para cada remédio: **nome** (texto) · **dose** (texto, ex.: "3 mg") · **frequência** (texto, ex.: "1 vez ao dia") · **precisa de receita especial no seu país?** `yes`/`no`/`unsure` (termo neutro, que serve para qualquer país) |
| `health.therapies` | Faz algum tratamento ou terapia regular? | múltipla | `none` · `speech` Fonoaudiologia · `occupational` Terapia ocupacional · `physio` Fisioterapia · `psych` Psicologia/psiquiatria · `aba` Terapia comportamental (ex.: ABA) · `dialysis` Diálise · `other` Outra |
| `health.equipment` | Usa algum equipamento? (ex.: cadeira de rodas, aparelho auditivo, CPAP) | texto (opcional) | — |
| `health.specialists` | É acompanhado(a) por quais especialistas? | texto (opcional) | — |
| `health.pregnancy` | Gravidez atual ou planejada para os próximos 2 anos? | única | `current` Grávida agora · `planned` Planejada · `no` Não. Condição: pessoa adulta |
| `health.vaccines` | As vacinas estão em dia? | única | `yes` Sim · `no` Não · `unsure` Não sei |

---

## Bloco 5 · Dinheiro *(para completar)*

> **Capacidade de gerar renda da família:** quantas pessoas sustentam a casa hoje e quantas poderão trabalhar nos EUA é um **fator de risco** importante. Uma família com uma única fonte de renda fica mais exposta se essa renda parar (demissão, doença, atraso no visto). A jornada leva isso em conta na reserva de emergência, no orçamento e num "plano B".

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `money.earnersNow` | Quem gera renda na sua família hoje? | múltipla | `me` Eu · `partner` Cônjuge · `adult_child` Filho(a) adulto(a) · `other_member` Outra pessoa da família · `passive` Renda que não depende de trabalho (aluguel, aposentadoria) |
| `money.earnersUS` | Quem pretende trabalhar nos EUA? | múltipla | `me` Eu · `partner` Cônjuge · `adult_child` Filho(a) adulto(a) · `unsure` Ainda não sei. **Observação:** a autorização de trabalho de cada pessoa depende do tipo de visto. A jornada mostra a regra geral com fonte oficial |
| `money.partnerAvailability` | O seu cônjuge teria disponibilidade para trabalhar? | única | `yes` Sim · `partial` Parcialmente · `no` Não, é cuidador(a) em tempo integral · `no_other` Não, por outro motivo. Condição: `household.partner` = `going` |
| `money.otherSources` | Vocês têm ou poderiam ter outras fontes de renda? | múltipla | `remote_home` Trabalho remoto para empresa ou clientes do meu país · `freelance` Serviços como autônomo/freelancer · `online_business` Negócio online · `rent_home` Alugar imóvel no meu país · `investments` Rendimentos de investimentos · `none` Não vejo outras possibilidades agora · `unsure` Gostaria de ideias |
| `money.saved` | Quanto você já tem guardado para a mudança? | número (opcional) | Pode digitar na moeda do seu país; o app converte para USD (cotação marcada como estimativa, com data) |
| `money.monthlySaving` | Quanto você consegue guardar por mês? | número (opcional) | Mesma regra de moeda. Com `money.saved`, o app calcula quanto falta e em quanto tempo a meta é alcançada (ver [orcamento.md](orcamento.md#3-a-conta-fecha)) |
| `money.bring` | Quanto você pretende levar? (em USD) | número | Mostra a conversão aproximada na moeda do país da pessoa (dado marcado como estimativa). O app compara com a **meta sugerida** pelo orçamento |
| `money.expectedIncomeUS` | Se já tem oferta de emprego: qual é o salário anual oferecido? (em USD, antes dos impostos) | número (opcional) | Condição: `goal.has` ∋ `job_offer` ou `goal.purpose` = `transfer`. Sem oferta, o orçamento usa uma faixa da profissão (estimativa, de fonte oficial quando houver, ex.: BLS) |
| `money.employerBenefits` | O que o empregador oferece além do salário? | múltipla (opcional) | `health` Plano de saúde · `relocation` Ajuda de custo para a mudança · `housing` Moradia · `visa_fees` Paga as taxas do visto · `lawyer` Paga o advogado · `unsure` Ainda não sei. Condição: igual a `money.expectedIncomeUS` |
| `money.income` | Vai continuar tendo alguma renda depois da mudança? | múltipla | `none` Não · `remote_job` Trabalho remoto · `rent` Aluguel de imóvel · `pension` Aposentadoria/pensão · `business` Lucro de empresa · `other` Outra. Depois: valor mensal aproximado em USD (opcional) |
| `money.housingPlan` | Como pretende morar nos EUA no começo? | única | `rent` Alugar · `buy_cash` Comprar à vista · `buy_financed` Comprar com financiamento · `family` Morar com família ou amigos · `employer` Moradia oferecida pelo empregador · `unsure` Não sei |
| `money.carPlan` | E o carro? | única | `none` Não vou ter carro · `buy_cash` Comprar à vista · `buy_financed` Financiar · `lease` *Leasing* (aluguel de longo prazo) · `unsure` Não sei. Depois: quantos carros (número) |
| `money.scoutingTrips` | Pretende visitar os EUA antes da mudança, para conhecer o destino? | única | `none` Não · `one` Uma vez · `two_plus` Duas vezes ou mais · `unsure` Não sei. Depois: quem vai nessas viagens (lista das pessoas da família) |
| `money.moveBelongings` | O que pretende levar na mudança? | única | `suitcases` Só malas · `some_boxes` Malas e algumas caixas · `shipment` Mudança despachada (móveis e muitos objetos) · `unsure` Não sei |
| `money.assets` | O que vai fazer com seus bens (imóvel, carro)? | única | `sell` Vender · `rent` Alugar · `keep` Manter · `mixed` Um pouco de cada · `none` Não tenho bens relevantes |
| `money.debts` | Tem dívidas ou financiamentos ativos? | única | `yes` · `no` · `skip` Prefiro não responder |
| `money.debtsContinue` | Elas vão continuar sendo pagas depois da mudança? Quanto por mês, aproximadamente? | única + número (opcional) | `yes` Sim · `no` Vou quitar antes · `unsure` Não sei. Condição: `money.debts` = `yes` |
| `money.runway` | Por quantos meses o dinheiro precisa durar até você ter renda nos EUA? | única | `lt3` Menos de 3 · `3to6` De 3 a 6 · `6to12` De 6 a 12 · `gt12` Mais de 12 · `unsure` Não sei |

> **Orçamento:** as respostas deste bloco, junto com a família (bloco 3), a saúde (bloco 4) e o destino (bloco 7), alimentam o cálculo de **custos até a mudança**, **custo mensal nos EUA** (incluindo impostos e taxas obrigatórias do estado) e **"a conta fecha?"**. Ver [orcamento.md](orcamento.md).

---

## Bloco 6 · Preferências e estilo de vida *(para completar)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `pref.climate` | Que clima você prefere? | única | `cold` Frio · `mild` Ameno, sem extremos · `hot` Quente · `seasons` Quatro estações bem definidas · `any` Tanto faz |
| `pref.heat` | Como você lida com calor forte e úmido? | única | `love` Adoro · `ok` Tolero · `hate` Não suporto |
| `pref.snow` | E com neve e frio intenso? | única | `love` Adoro · `ok` Tolero · `hate` Não suporto |
| `pref.placeSize` | Onde você se imagina morando? | única | `big_city` Cidade grande · `mid_city` Cidade média · `suburb` Subúrbio · `small_town` Cidade pequena · `rural` Interior/campo · `any` Tanto faz |
| `pref.leisure` | O que você gosta de ter por perto? | múltipla | `beach` Praia · `mountains` Montanhas · `outdoors` Natureza e vida ao ar livre · `culture` Vida cultural · `nightlife` Vida noturna · `quiet` Tranquilidade |
| `pref.car` | Pretende viver sem carro? | única | `yes` Sim, quero transporte público · `no` Não, vou ter carro · `unsure` Não sei |
| `pref.pace` | Que ritmo de vida combina com você? | única | `fast` Agitado · `balanced` Equilibrado · `calm` Tranquilo |
| `pref.community` | Quer morar perto de pessoas do seu país ou que falam seu idioma? | única | `yes` Sim, é importante · `some` Seria bom, mas não essencial · `immersion` Prefiro imersão total |
| `pref.familyPriorities` | Para a sua família, o que é prioridade? | múltipla | `schools` Boas escolas · `special_ed` Educação especial · `safety` Segurança · `hospitals` Hospitais e especialistas por perto · `disability_services` Serviços para pessoas com deficiência · `elder_care` Cuidados para idosos · `none` Nenhuma em especial |

---

## Bloco 7 · Destino *(para completar)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `dest.known` | Você já sabe para onde quer ir? | única | `yes` Sim · `some` Tenho algumas opções · `no` Ainda não |
| `dest.places` | Quais estados ou cidades? | múltipla com busca | Lista dos 50 estados + D.C., com campo de cidade opcional. Condição: `dest.known` ∈ {`yes`, `some`} |
| `dest.why` | Por que esse lugar? | texto (opcional) | Condição: `dest.known` ∈ {`yes`, `some`} |
| `dest.criteria` | O que mais pesa na escolha? (escolha até 3) | múltipla, máx. 3 | `cost` Custo de vida · `climate` Clima · `safety` Segurança · `schools` Escolas · `community` Comunidade do meu país/idioma · `jobs` Emprego na minha área · `taxes` Impostos do estado · `transit` Transporte público · `near_people` Perto de família ou amigos · `services` Serviços de saúde e deficiência |

> Com as respostas dos blocos 6 e 7, o app compara os destinos com as preferências e aponta conflitos (ex.: `pref.heat` = `hate` e um destino de verão longo e úmido).

---

## Bloco 8 · Histórico com os EUA *(para completar)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `history.visited` | Você já esteve nos EUA? | única | `never` Nunca · `once` Uma vez · `several` Várias vezes |
| `history.visa` | Você tem ou já teve visto americano? | única | `valid` Tenho um válido · `expired` Já tive, está vencido · `never` Nunca tive |
| `history.network` | Você conhece alguém que mora nos EUA? | múltipla | `family` Família · `friends` Amigos · `colleagues` Colegas de trabalho · `nobody` Ninguém |
| `history.complication` | Existe algo no histórico de **você ou de alguém da família que vai** que possa complicar? (ex.: visto negado, ter ficado além do prazo permitido, antecedentes criminais) | única | `no` Não · `yes` Sim · `skip` Prefiro não dizer. **Sem pedir detalhes.** Se `yes`, a jornada recomenda advogado na Fase 0 |

---

## Bloco 9 · Documentos *(para completar · só sim/não, sem envio de arquivos)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `docs.passport` | Passaporte | por pessoa · única | `valid_long` Válido por mais de 2 anos · `valid_short` Vence em menos de 2 anos · `expired` Vencido · `none` Não tenho |
| `docs.certificates` | Quais destes documentos você já tem em mãos? | múltipla | `birth` Certidões de nascimento · `marriage` Certidão de casamento/união · `diplomas` Diplomas · `transcripts` Históricos escolares · `criminal` Antecedentes criminais · `medical_reports` Laudos médicos · `none` Nenhum ainda |
| `docs.driverLicense` | Você tem carteira de motorista? | única | `yes` · `no` |

---

## Bloco 10 · Seu ritmo *(essencial)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `rhythm.cadence` | Com que frequência você quer acompanhar a sua jornada? | única | `daily` Todo dia, 5 minutos · `3week` 3 vezes por semana · `weekly` Uma vez por semana · `biweekly` A cada 15 dias |
| `rhythm.weeklyTime` | Quanto tempo por semana você consegue dedicar? | única | `lt1h` Menos de 1 hora · `1to3h` De 1 a 3 horas · `3to5h` De 3 a 5 horas · `gt5h` Mais de 5 horas |
| `rhythm.rewards` | Que pequenas recompensas te motivam? | múltipla + texto | `snack` Meu lanche favorito · `movie` Um filme ou série · `free_time` Um tempo livre só meu · `walk` Um passeio · `game` Um jogo · `call` Ligar para alguém querido · `other` Outra (texto) |

> O idioma do app já vem da escolha feita no topo da tela.

---

## Regras: o que cada resposta muda na jornada

> Primeiras regras, para validar a lógica. A lista completa será construída junto com o conteúdo da jornada. Toda regra que gera um **alerta legal** mostra a regra geral **com fonte oficial e o aviso padrão** (ver [conteudo.md](conteudo.md)).

| Se… | Então a jornada… |
|---|---|
| Algum filho com 21 anos ou mais **hoje ou até a data prevista de ida** (calculado por `child.birth` e `goal.departure`), ou existe qualquer `household.dependents` | Mostra na **Fase 0** o alerta sobre quem pode ir como dependente do visto, com a regra geral, a fonte oficial e a recomendação de advogado |
| `household.partnerUnion` ∈ {`stable_union`, `informal`} | Mostra alerta sobre o reconhecimento do tipo de união para fins de visto (fonte oficial) |
| `household.otherChildren` = `yes` e `household.custody` ≠ `sole` | Inclui tarefas de autorização de viagem do outro genitor |
| `health.autonomy` ∈ {`help`, `full`} para um adulto | Inclui tarefas de *guardianship* (representação legal de adulto nos EUA) e de planejamento de cuidados |
| `health.medications` com remédio controlado | Inclui tarefas: estoque inicial com receita e laudo traduzidos, regras de entrada de medicamentos (fonte oficial), médico nos EUA antes do estoque acabar |
| `health.conditions` ≠ `none` ou `pref.familyPriorities` ∋ `disability_services` | Inclui serviços para pessoas com deficiência no **perfil dos estados** e no orçamento |
| `you.regulated` = `yes` | Inclui tarefas de validação de diploma e licença profissional no estado de destino |
| `you.english` ∈ {`none`, `basic`} | Coloca o plano de inglês como prioridade na Fase 1 |
| `goal.sponsorship` = `unsure` | Inclui conteúdo explicando a diferença entre visto temporário e Green Card |
| `goal.duration` = `lt6m` | Remove a fase de Estabelecimento e foca em estadia curta |
| `goal.duration` ∈ {`6to12m`, `1to3y`, `3to5y`} | Inclui o tema "manter o status" e, em vistos temporários, a prova de intenção de retorno |
| `goal.departure` em menos de 12 meses | Avisa que o cronograma está apertado e reorganiza prioridades |
| `history.complication` = `yes` | Recomenda advogado de imigração **antes** de qualquer outra tarefa |
| `docs.passport` ∈ {`valid_short`, `expired`, `none`} | Cria tarefa de passaporte com prioridade alta para aquela pessoa |
| `pref.heat` = `hate` (ou `pref.snow` = `hate`) e destino em conflito | Mostra o conflito na comparação de destinos |
| `household.pets` ≠ `none` | Inclui tarefas de transporte e regras de entrada de animais |
| `household.leftBehind` = `yes` | Inclui tarefas de plano para quem fica (cuidados, procurações, envio de dinheiro) |
| `money.runway` = `lt3` ou `money.bring` baixo para o tamanho da família | Coloca o orçamento e a reserva de emergência como prioridade |
| `money.earnersUS` tem só uma pessoa (renda única) | Marca **fator de risco "renda única"**: recomenda reserva de emergência maior, seguro (saúde e, se fizer sentido, de vida) e um "plano B" caso a renda pare |
| `money.partnerAvailability` = `no` porque é cuidador(a), ou algum dependente com `health.autonomy` ∈ {`help`, `full`} | Considera no orçamento que o cuidado consome a disponibilidade de trabalho de alguém da família e inclui a pesquisa de apoio a cuidadores no estado |
| `money.earnersUS` inclui `partner` ou `adult_child` | Mostra a regra geral sobre autorização de trabalho de dependentes para o tipo de visto, com fonte oficial e aviso padrão |
| `money.otherSources` ∋ `unsure` ou `none`, ou renda única | Inclui o tema **"Outras fontes de renda"**: possibilidades legais de renda complementar e de **trabalho temporário** (ver [conteudo.md](conteudo.md#outras-fontes-de-renda-e-trabalho-temporário)) |
| `goal.purpose` = `unsure` | A Fase 0 começa por "explorar os caminhos possíveis" |
| `docs.passport` ∈ {`valid_short`, `expired`, `none`} para alguém | Soma a taxa oficial do passaporte (do país de origem) daquela pessoa nos **custos até a mudança** |
| `money.scoutingTrips` ≠ `none` | Soma as viagens exploratórias (passagens e hospedagem das pessoas escolhidas) nos custos até a mudança e cria a tarefa de planejar a visita |
| `money.housingPlan` ∈ {`buy_cash`, `buy_financed`} | Inclui no custo mensal o imposto sobre a propriedade do estado/condado e o seguro do imóvel, e cria tarefas de pesquisa sobre compra de imóvel por recém-chegados (fonte oficial) |
| `money.carPlan` ≠ `none` | Inclui seguro, registro e taxas do veículo (DMV do estado) e a tarefa de tirar a carteira de motorista no estado |
| `money.saved` e `money.monthlySaving` respondidas | Mostra **quanto falta** para a meta e **quando** ela será alcançada, comparando com `goal.departure`; se não der tempo, sugere rever a data ou o orçamento, sem culpa |
| Orçamento com despesa mensal maior que a renda prevista | Mostra o resultado com clareza e cria tarefas: rever o orçamento, comparar estados e ver outras fontes de renda legais |
| `money.debtsContinue` = `yes` | Soma a parcela nas despesas mensais (compromissos no país de origem) |

## Pendências
- [x] Aprovar a lista de perguntas e opções (aprovada em 16/11/2026, com os ajustes: autonomia na parte essencial, filhos de qualquer idade num só lugar, data de nascimento em vez de idade, perguntas de poupança, cônjuge, orçamento)
- [x] Aprovar a divisão entre "essencial" e "para completar"
- [ ] Traduzir os textos para en-US e es
- [ ] Completar a tabela de regras junto com o conteúdo da jornada
