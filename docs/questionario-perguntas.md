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
- **Condição de opção:** algumas opções só aparecem quando fazem sentido (ex.: "Filho(a) adulto(a)" só se algum filho tiver 18 anos ou mais).
- **Sexo:** só `male` Masculino e `female` Feminino, **como consta no passaporte ou documento** (decisão do fundador em 16/11/2026: é o que vale para visto e processos). Serve para mostrar só as perguntas e tarefas que se aplicam (ex.: gravidez).
- **Textos com gênero:** com o sexo informado, os textos se ajustam ("Filha 1", "área dela", "Aposentado"), usando `select` do ICU MessageFormat nos arquivos de tradução. Variáveis disponíveis em todo texto de pergunta: `sex` (de quem a pergunta fala: a pessoa da vez, o cônjuge nas perguntas `partner.*` ou você), `partnerSex` e `adultChildSex` (dos filhos adultos). Sem a informação (ou filhos de sexos diferentes), vale a forma neutra `other`, como "Filho(a)".
- **(opcional)**: a pessoa pode pular. Toda pergunta delicada tem também **"Prefiro não responder"**.
- **"Por que perguntamos?"**: toda pergunta tem um link curto que explica para que serve a resposta. Isso gera confiança e reduz desistência.
- **Digitar o mínimo e padronizar** (decisão do fundador em 17/11/2026): sempre que possível, a resposta é uma **opção para escolher**, não texto livre. Respostas padronizadas podem ser lidas pelas regras da jornada, aparecem traduzidas em qualquer idioma e são mais fáceis de responder no celular. Texto livre só onde a palavra da pessoa é o valor (o "porquê"), em apelidos e no campo "Outro".
- **Nenhum fato legal no texto das perguntas.** Explicações sobre regras ficam no conteúdo da jornada, com fonte oficial e aviso padrão.

## Experiência do questionário

- **Duas etapas, para não cansar:**
  1. **Essencial** (cerca de 10 minutos): blocos 1, 2, 3, 12 (Seu momento, todo opcional) e 10. Com isso, a primeira versão da jornada já é gerada. O Bloco 3 já inclui **autonomia e cuidador** de quem tem deficiência ou depende de cuidados, porque isso gera tarefas importantes desde o início.
  2. **Para completar** (no ritmo da pessoa): blocos 0, 11 (perfil profissional), 4, 5, 6, 7, 8 e 9. Cada bloco concluído deixa a jornada mais precisa, e o app mostra isso ("Responda o bloco Saúde para incluir as tarefas de medicação e cuidados").
- Barra de progresso por bloco e tempo estimado de cada bloco.
- Salva a cada resposta (no navegador). A pessoa pode sair e voltar.
- Uma pergunta por tela no celular, com botões grandes.
- Sempre dá para voltar e mudar uma resposta. A jornada é recalculada.
- **Recomeçar do zero:** no fim da lista de blocos, a pessoa pode apagar todas as respostas (com confirmação) e começar de novo.
- Um bloco **sem nenhuma pergunta que se aplique** à família não aparece (ex.: perfil profissional quando você é do lar e não tem cônjuge).

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
| `you.sex` | Qual é o seu sexo, como consta no passaporte? | única | `male` Masculino · `female` Feminino |
| `you.languages` | Quais idiomas você fala? | múltipla com busca | Lista de idiomas |
| `you.english` | Como está o seu inglês hoje? | única | `none` Não falo · `basic` Entendo palavras e frases simples · `intermediate` Consigo me virar no dia a dia (mercado, restaurante) · `advanced` Consigo conversar sobre quase tudo · `fluent` Consigo trabalhar e estudar em inglês |
| `you.education` | Qual é a sua escolaridade mais alta (concluída)? | única | `primary` Ensino fundamental · `secondary` Ensino médio · `technical` Curso técnico · `bachelor` Graduação · `postgrad` Especialização/MBA · `master` Mestrado · `doctorate` Doutorado |
| `you.field` | Qual é a sua área de formação? | texto | Condição: `you.education` ≥ `technical` |
| `you.workStatus` | Qual é a sua situação de trabalho hoje? | única | `employed` Empregado(a) · `business_owner` Tenho empresa · `self_employed` Autônomo(a) · `remote_foreign` Trabalho remoto para empresa de outro país · `student` Estudante · `retired` Aposentado(a) · `unemployed` Sem trabalho no momento · `homemaker` Do lar |
| `you.occupation` | Qual é a sua profissão ou ocupação atual? | texto | Condição: `you.workStatus` ≠ `homemaker` |
| `you.experienceYears` | Há quantos anos você trabalha nessa área? | número | Condição: `you.workStatus` ≠ `homemaker` |
| `you.regulated` | A sua profissão exige registro ou licença para exercer? (ex.: medicina, enfermagem, direito, engenharia, contabilidade) | única | `yes` Sim · `no` Não · `unsure` Não sei. Condição: `you.workStatus` ≠ `homemaker` |

---

## Bloco 2 · O seu objetivo *(essencial)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `goal.purpose` | Qual é o principal motivo da sua ida? | única | `work` Trabalhar · `transfer` Ser transferido(a) pela empresa onde trabalho · `study` Estudar · `business` Empreender ou investir · `family` Reunir-me com família que mora lá · `marriage` Casar ou viver com cidadão(ã) americano(a) · `retire` Aposentadoria · `academic` Pesquisa ou carreira acadêmica · `talent` Talento extraordinário (artes, esportes, ciência, negócios) · `exchange` Intercâmbio · `lottery` Loteria do Green Card · `unsure` Ainda não sei |
| `goal.duration` | Por quanto tempo você quer ficar? | única | `lt6m` Até 6 meses · `6to12m` De 6 meses a 1 ano · `1to3y` De 1 a 3 anos · `3to5y` De 3 a 5 anos · `permanent` Para sempre · `unsure` Não sei |
| `goal.departure` | Quando você gostaria de ir? | mês/ano | Opção `unsure` Ainda não sei. Base do cronograma |
| `goal.has` | O que você já tem hoje? | múltipla | `job_offer` Oferta de emprego · `school_admission` Aceite de escola ou universidade · `us_relative` Parente que mora nos EUA · `company_branch` Empresa com filial nos EUA · `capital` Dinheiro para investir · `nothing` Nada ainda |
| `goal.sponsorship` | O empregador vai patrocinar qual tipo de visto? | única | `temporary` Visto de trabalho temporário · `greencard` Green Card (residência permanente) · `unsure` Não sei. Condição: `goal.purpose` ∈ {`work`, `transfer`} ou `goal.has` ∋ `job_offer` |
| `goal.familyLink` | Quem é o seu parente nos EUA? | única | `spouse_citizen` Cônjuge cidadão(ã) · `spouse_resident` Cônjuge com Green Card · `parent_citizen` Pai/mãe cidadão(ã) · `parent_resident` Pai/mãe com Green Card · `child_citizen` Filho(a) cidadão(ã) · `sibling_citizen` Irmão(ã) cidadão(ã) · `other` Outro. Condição: `goal.purpose` = `family` ou `goal.has` ∋ `us_relative` |
| `goal.studyLevel` | O que você quer estudar? | única | `language` Curso de inglês · `undergrad` Graduação · `grad` Mestrado/doutorado · `vocational` Curso técnico/profissionalizante · `exchange_hs` Intercâmbio no ensino médio (só para quem tem menos de 21 anos). Condição: `goal.purpose` = `study` |
| `goal.investRange` | Quanto você pensa em investir? (em USD) | única | `lt100k` Até 100 mil · `100to500k` De 100 mil a 500 mil · `500kto1m` De 500 mil a 1 milhão · `gt1m` Mais de 1 milhão · `unsure` Não sei. Condição: `goal.purpose` = `business` |

---

## Bloco 3 · Quem vai com você *(essencial)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `household.partner` | Você tem cônjuge ou companheiro(a)? | única | `none` Não · `going` Sim, e vai junto · `not_going` Sim, mas não vai · `undecided` Sim, mas ainda não sabemos se vai |
| `household.partnerUnion` | Como é a união de vocês? | única | `civil_marriage` Casamento civil · `stable_union` União estável · `informal` Moramos juntos sem registro · `other` Outro. Condição: `household.partner` ∈ {`going`, `undecided`} |
| `partner.sex` | Qual é o sexo do seu cônjuge, como consta no passaporte? | única | Mesmas opções de `you.sex`. Condição: `household.partner` ∈ {`going`, `undecided`} |
| `partner.birthYear` | Em que ano o seu cônjuge nasceu? | número | Condição: `household.partner` ∈ {`going`, `undecided`} |
| `partner.english` | Como está o inglês do seu cônjuge? | única (opcional) | Mesmas opções de `you.english`. Condição: `household.partner` ∈ {`going`, `undecided`} |
| `partner.workStatus` | Qual é a situação de trabalho do seu cônjuge hoje? | única | Mesmas opções de `you.workStatus` (inclui `homemaker` Do lar). Condição: `household.partner` ∈ {`going`, `undecided`} |
| `partner.occupation` | Qual é a profissão ou ocupação do seu cônjuge? | texto (opcional) | Condição: cônjuge vai (ou indeciso) e `partner.workStatus` ≠ `homemaker` |
| `household.children` | Quantos filhos vão com você? Conte todos, de qualquer idade, inclusive os adultos. | número (0+) | Filhos adultos entram aqui, não em "outros dependentes" |
| `child.birth` | Mês e ano de nascimento | por pessoa · mês/ano | Para cada filho. Nome ou apelido opcional, só para identificar na jornada. **Data, e não idade:** a jornada dura anos, e o app calcula a idade em qualquer data do cronograma |
| `child.sex` | Qual é o sexo, como consta no documento? | por pessoa · única | Mesmas opções de `you.sex` |
| `child.school` | Em que etapa da escola está? | por pessoa · única | `not_school` Ainda não estuda · `preschool` Educação infantil · `elementary` Fundamental · `high` Ensino médio · `college` Faculdade · `finished` Já terminou os estudos · `special` Educação especial. **Opções pela idade** (faixas largas, porque variam entre países): `preschool` até 7 anos · `elementary` 5 a 17 · `high` 11 a 21 · `college` 16+ · `finished` 14+. `not_school` e `special` aparecem sempre |
| `child.specialNeeds` | Tem alguma deficiência ou precisa de cuidados contínuos? | por pessoa · única | `yes` Sim · `no` Não · `skip` Prefiro não responder (o detalhe fica no bloco Saúde) |
| `health.autonomy` | No dia a dia, essa pessoa… | por pessoa · única | `independent` É independente · `supervision` Precisa de supervisão · `help` Precisa de ajuda em atividades diárias (banho, alimentação, vestir) · `full` Depende totalmente de outra pessoa. Condição: `child.specialNeeds` = `yes`. **Fica na parte essencial** porque gera tarefas importantes (ex.: *guardianship*) já na primeira jornada |
| `health.caregiver` | Quem é o cuidador principal? | por pessoa · única | Lista das pessoas da família + `external` Cuidador contratado + `other` Outro. Condição: `health.autonomy` ≠ `independent` |
| `child.english` | Fala inglês? | por pessoa · única | Mesmas opções de `you.english`. Condição: 3 anos ou mais |
| `household.otherChildren` | Você tem filhos de outro relacionamento que vão junto? | única | `yes` · `no`. Se sim: `household.custody` (abaixo) |
| `household.custody` | O outro pai ou mãe concorda com a viagem? | única | `agrees` Sim, concorda · `disagrees` Não concorda · `unknown` Ainda não conversamos · `sole` Tenho a guarda exclusiva/o outro genitor é falecido |
| `household.dependents` | Além do cônjuge e dos filhos, alguém que depende de você vai junto? (ex.: pai, mãe, avó, irmão) | número (0+) | — |
| `dependent.relation` | Qual é a relação com você? | por pessoa · única | `parent` Pai/mãe · `grandparent` Avô/avó · `sibling` Irmão(ã) · `in_law` Sogro(a) · `other` Outro. (Filhos, de qualquer idade, ficam em `household.children`) |
| `dependent.birth` | Mês e ano de nascimento | por pessoa · mês/ano | — |
| `dependent.sex` | Qual é o sexo, como consta no documento? | por pessoa · única | Mesmas opções de `you.sex` |
| `dependent.dependency` | Como é a dependência? | por pessoa · única | `full` Depende totalmente (cuidados e dinheiro) · `care` Precisa de cuidados, mas tem renda própria · `financial` Só financeira · `partial` Parcial |
| `health.autonomy` / `health.caregiver` | (as mesmas perguntas dos filhos) | por pessoa | Condição: `dependent.dependency` ∈ {`full`, `care`, `partial`} |
| `household.pets` | Vai levar animais de estimação? | múltipla | `none` Não · `dog` Cachorro · `cat` Gato · `bird` Ave · `other` Outro. Depois, quantos |
| `household.leftBehind` | Alguém que depende de você vai ficar no seu país? | única | `yes` Sim · `no` Não |
| `household.leftBehindList` | Quem vai ficar no seu país? | múltipla (opcional) | `parent` Pai ou mãe · `grandparent` Avô ou avó · `child` Filho ou filha · `sibling` Irmão ou irmã · `partner` Cônjuge · `in_law` Sogro ou sogra · `other` Outra pessoa. Condição: `household.leftBehind` = `yes`. (Substituiu o texto livre `household.leftBehindWho`) |

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
| `health.medications` | Toma medicação contínua? | lista | Para cada remédio: **nome** (único campo digitado) · **quantidade** (número) · **unidade** (escolha: `mg` · `mcg` · `g` · `ml` · `drops` gotas · `tablet` comprimido · `capsule` cápsula · `iu` UI · `puff` jato · `patch` adesivo · `application` aplicação · `other` outra) · **frequência** (escolha: `daily_1` a `daily_4` 1 a 4 vezes ao dia · `daily_more` mais de 4 vezes ao dia · `weekly` semanal · `monthly` mensal · `as_needed` só quando precisa · `other` outra) · **precisa de receita especial no seu país?** `yes`/`no`/`unsure`. O nome continua digitado porque os nomes comerciais mudam de país para país e não há lista oficial gratuita que cubra todos. Dados salvos no formato antigo (dose e frequência digitadas) são migrados automaticamente (versão 2 do formato) |
| `health.therapies` | Faz algum tratamento ou terapia regular? | múltipla | `none` · `speech` Fonoaudiologia · `occupational` Terapia ocupacional · `physio` Fisioterapia · `psych` Psicologia/psiquiatria · `aba` Terapia comportamental (ex.: ABA) · `dialysis` Diálise · `other` Outra |
| `health.equipmentList` | Usa algum destes equipamentos? | múltipla | `none` Nenhum · `wheelchair` Cadeira de rodas · `walker` Andador ou muletas · `hearing_aid` Aparelho auditivo · `glasses_special` Óculos ou lentes especiais (baixa visão) · `cpap` CPAP · `oxygen` Oxigênio · `insulin_pump` Bomba de insulina · `glucose_monitor` Sensor de glicose · `prosthesis` Prótese ou órtese · `feeding_tube` Sonda de alimentação · `communication_device` Comunicação alternativa · `other` Outro (abre `health.equipmentOther`, texto). (Substituiu o texto livre `health.equipment`) |
| `health.specialistsList` | É acompanhado(a) por algum destes especialistas? | múltipla | `none` Nenhum · `neurologist` Neurologista · `psychiatrist` Psiquiatra · `developmental_pediatrician` Neuropediatra ou pediatra do desenvolvimento (só até 20 anos) · `cardiologist` · `endocrinologist` · `pulmonologist` · `nephrologist` · `oncologist` · `rheumatologist` · `gastroenterologist` · `orthopedist` · `ophthalmologist` · `otolaryngologist` · `geriatrician` Geriatra (só a partir de 55 anos) · `other` Outro (abre `health.specialistsOther`, texto). (Substituiu o texto livre `health.specialists`) |
| `health.pregnancy` | Gravidez atual ou planejada para os próximos 2 anos? | única | `current` Grávida agora · `planned` Planejada · `no` Não. Condição: sexo feminino e de 18 a 55 anos (faixa de bom senso do app, não regra oficial) |
| `health.vaccines` | As vacinas estão em dia? | única | `yes` Sim · `no` Não · `unsure` Não sei |

---

## Bloco 5 · Dinheiro *(para completar)*

> **Capacidade de gerar renda da família:** quantas pessoas sustentam a casa hoje e quantas poderão trabalhar nos EUA é um **fator de risco** importante. Uma família com uma única fonte de renda fica mais exposta se essa renda parar (demissão, doença, atraso no visto). A jornada leva isso em conta na reserva de emergência, no orçamento e num "plano B".

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `money.earnersNow` | Quem gera renda na sua família hoje? | múltipla | `me` Eu · `partner` Cônjuge · `adult_child` Filho(a) adulto(a) · `other_member` Outra pessoa da família · `passive` Renda que não depende de trabalho (aluguel, aposentadoria). `partner` só aparece se houver cônjuge; `adult_child` só se algum filho tiver 18 anos ou mais |
| `money.earnersUS` | Quem pretende trabalhar nos EUA? | múltipla | `me` Eu · `partner` Cônjuge · `adult_child` Filho(a) adulto(a) · `unsure` Ainda não sei. `partner` só se o cônjuge vai; `adult_child` só se algum filho tiver 18 anos ou mais. **Observação:** a autorização de trabalho de cada pessoa depende do tipo de visto. A jornada mostra a regra geral com fonte oficial |
| `money.partnerAvailability` | O seu cônjuge teria disponibilidade para trabalhar? | única | `yes` Sim · `partial` Parcialmente · `no` Não, é cuidador(a) em tempo integral · `no_other` Não, por outro motivo. Condição: `household.partner` = `going` |
| `money.otherSources` | Vocês têm ou poderiam ter outras fontes de renda? | múltipla | `remote_home` Trabalho remoto para empresa ou clientes do meu país · `freelance` Serviços como autônomo/freelancer · `online_business` Negócio online · `rent_home` Alugar imóvel no meu país · `investments` Rendimentos de investimentos · `none` Não vejo outras possibilidades agora · `unsure` Gostaria de ideias |
| `money.saved` | Quanto você já tem guardado para a mudança? | número (opcional) | Pode digitar na moeda do seu país; o app converte para USD (cotação marcada como estimativa, com data) |
| `money.monthlySaving` | Quanto você consegue guardar por mês? | número (opcional) | Mesma regra de moeda. Com `money.saved`, o app calcula quanto falta e em quanto tempo a meta é alcançada (ver [orcamento.md](orcamento.md#3-a-conta-fecha)) |
| `money.bring` | Quanto você pretende levar? (em USD) | número | Mostra a conversão aproximada na moeda do país da pessoa (dado marcado como estimativa). O app compara com a **meta sugerida** pelo orçamento |
| `money.expectedIncomeUS` | Se já tem oferta de emprego: qual é o salário anual oferecido? (em USD, antes dos impostos) | número (opcional) | Condição: `goal.has` ∋ `job_offer` ou `goal.purpose` = `transfer`. Sem oferta, o orçamento usa uma faixa da profissão (estimativa, de fonte oficial quando houver, ex.: BLS) |
| `money.employerBenefits` | O que o empregador oferece além do salário? | múltipla (opcional) | `health` Plano de saúde · `relocation` Ajuda de custo para a mudança · `housing` Moradia · `visa_fees` Paga as taxas do visto · `lawyer` Paga o advogado · `unsure` Ainda não sei. Condição: igual a `money.expectedIncomeUS` |
| `money.income` | Vai continuar tendo alguma renda depois da mudança? | múltipla | `none` Não · `remote_job` Trabalho remoto · `rent` Aluguel de imóvel · `pension` Aposentadoria/pensão · `business` Lucro de empresa · `other` Outra. Depois: valor mensal aproximado em USD (opcional) |
| `money.housingPlan` | Como pretende morar nos EUA no começo? | única | `rent` Alugar · `buy_cash` Comprar à vista · `buy_financed` Comprar com financiamento · `family` Morar com família ou amigos · `employer` Moradia oferecida pelo empregador (só com oferta de emprego ou transferência) · `unsure` Não sei |
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

### Hobbies, bem-estar e passeios *(implementado em 17/11/2026)*

> Pedido do fundador: saber os hobbies da pessoa, o que a faz se sentir bem, os lugares e passeios de que gosta e se gosta de viajar pelo próprio país. **Para que serve:**
> 1. **Escolha do lugar:** quem ama trilha, praia ou vida cultural tem um estado e uma cidade que combinam melhor (soma a `pref.leisure`, `pref.climate` e `pref.placeSize`).
> 2. **Adaptação:** hobbies são o jeito mais natural de fazer amigos e criar rotina num país novo. A jornada pode sugerir, por exemplo, procurar um grupo de corrida ou de música na cidade de destino.
> 3. **Bem-estar nos dias difíceis:** o que faz a pessoa se sentir bem vira lembrete e sugestão de recompensa (soma a `rhythm.rewards`), sem culpa.
> 4. **Orçamento:** os hobbies dão uma ideia da linha de lazer no custo mensal.
>
> **Cuidados:** poucas perguntas, todas opcionais e de múltipla escolha (digitar o mínimo). **Não perguntar religião**: é dado sensível pela LGPD e GDPR. Para não repetir perguntas, `pref.leisure` continua sendo "o que gosta de ter por perto" e as novas perguntas falam do que a pessoa **faz**.

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `pref.hobbies` | O que você gosta de fazer no tempo livre? | múltipla, por pessoa (você e cônjuge; filhos depois, se fizer sentido) | `walking_running` Caminhar ou correr · `gym` Academia · `team_sports` Esportes em grupo · `hiking` Trilhas e natureza · `water` Praia, piscina ou esportes na água · `cycling` Pedalar · `fishing` Pescar · `music` Música (tocar, cantar, ouvir ao vivo) · `arts_crafts` Artes e trabalhos manuais · `reading` Ler · `cooking` Cozinhar · `gardening` Jardinagem · `games` Jogos e videogame · `volunteering` Trabalho voluntário · `pets` Cuidar de animais · `tech` Tecnologia e projetos pessoais · `other` Outro |
| `pref.feelGood` | O que faz você se sentir bem quando está cansado(a) ou desanimado(a)? | múltipla | `family_time` Tempo com a família · `friends` Encontrar amigos · `nature` Estar na natureza · `exercise` Fazer exercício · `quiet_home` Ficar em casa, no sossego · `hobby` Dedicar tempo a um hobby · `travel` Viajar ou passear · `learning` Aprender algo novo · `food` Uma boa refeição · `other` Outro |
| `pref.outings` | Que passeios você mais gosta? | múltipla | `parks` Parques · `museums` Museus e exposições · `shows` Shows, teatro e cinema · `restaurants` Restaurantes e cafés · `shopping` Compras · `sports_events` Eventos esportivos · `theme_parks` Parques temáticos · `road_trips` Viagens de carro · `historic` Lugares históricos · `nightlife` Vida noturna |
| `pref.domesticTravel` | Você gosta de viajar dentro do seu país para conhecer lugares novos? | única | `often` Sim, viajo sempre que posso · `sometimes` De vez em quando · `rarely` Raramente · `not_interested` Não é algo que eu procure |

**Regras na jornada (rascunho):**

| Resposta | O que muda na jornada |
|---|---|
| `pref.hobbies` e `pref.outings` | Entram na comparação de estados e cidades e geram tarefas de adaptação ("procure um grupo de … na cidade de destino") |
| `pref.feelGood` | Vira sugestão de recompensa e lembrete nos dias difíceis e nos check-ins |
| `pref.domesticTravel` = `often` ou `sometimes` | Sugere conhecer os EUA como parte da adaptação e entra na linha de lazer do orçamento |

**Implementação:** `pref.hobbies` é perguntada para você e para o cônjuge (grupo "workers"); as outras três, uma vez para a família. Todas opcionais.

---

## Bloco 7 · Destino *(para completar)*

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `dest.known` | Você já sabe para onde quer ir? | única | `yes` Sim · `some` Tenho algumas opções · `no` Ainda não |
| `dest.places` | Quais estados? | múltipla com busca | Lista dos 50 estados + D.C. Condição: `dest.known` ∈ {`yes`, `some`} |
| `dest.cityList` | Alguma cidade em mente? | cidades por estado | Para cada estado escolhido: as **3 maiores cidades em destaque** (com a população estimada), **busca por qualquer outra cidade** do estado e **"Ainda não sei a cidade neste estado"**. Com 1 ou 2 estados, tudo aberto; com mais, cada estado abre e fecha. Valor salvo: `UF-código do lugar no Census` (ex.: `WA-63000`) ou `UF-unsure`. Condição: estados escolhidos em `dest.places`. (Substituiu o texto livre `dest.cities`). Detalhes em [Cidades dos EUA](#cidades-dos-eua-fonte-e-capitais) |
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

## Bloco 12 · Seu momento *(essencial · todo opcional)*

> Decisão do fundador em 17/11/2026. Uma mudança dessas exige força de vontade, e a pessoa precisa estar minimamente bem para começar e não desistir. **Como não virar interrogatório psicológico:** perguntar sobre a **situação de vida**, não sobre o estado psicológico; poucas perguntas, todas opcionais e com "Prefiro não responder"; explicar para que servem; **sem escalas clínicas** (seria diagnóstico, que não é papel do app, e dado sensível de saúde mental pela LGPD); **nunca mostrar nota** de "prontidão". As respostas só ajustam o ritmo e o começo da jornada.

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `moment.life` | Como está a sua vida neste momento? | única | `calm` Tranquila · `busy` Corrida, mas sob controle · `hard` Passando por uma fase difícil · `skip` Prefiro não responder |
| `moment.events` | Aconteceu algo marcante na sua vida nos últimos 12 meses? | múltipla | `none` Nada disso · `grief` Perda de alguém próximo · `separation` Separação ou divórcio · `job_loss` Perda de emprego · `family_illness` Doença na família · `own_health` Um problema de saúde meu · `new_baby` Nascimento ou chegada de um filho · `financial` Aperto financeiro · `other` Outra mudança importante · `skip` Prefiro não responder |
| `moment.decision` | Como está a sua decisão de morar nos EUA? | única | `exploring` Ainda estou conhecendo a ideia · `leaning` Estou inclinado(a) a ir · `decided` Já decidi que quero ir |
| `moment.partnerSupport` | Como o seu cônjuge vê a mudança? | única | `aligned` Quer tanto quanto eu · `mostly` Apoia, com algumas dúvidas · `unsure` Ainda está em dúvida · `against` Não quer ir · `not_talked` Ainda não conversamos. Condição: tem cônjuge (vá ou não) |
| `moment.familySupport` | As pessoas próximas apoiam a sua ideia? | única | `yes` Sim, apoiam · `partial` Algumas pessoas apoiam · `no` Não apoiam · `skip` Prefiro não responder |

---

## Bloco 11 · Perfil profissional *(para completar · por pessoa: você e cônjuge)*

> **Quem é do lar** (`homemaker`) não tem carreira em andamento: para essa pessoa, só aparecem nacionalidade, escolaridade e área de formação (no caso do cônjuge). As perguntas de carreira (área, cargo, nível, empresa, conquistas, busca de trabalho) ficam de fora.

> Incluído em 16/11/2026. Aprofunda a carreira de quem pode trabalhar ou liderar o pedido de visto. É a base do **norte dos caminhos de visto** e do **perfil da família** ([caminhos-visto.md](caminhos-visto.md)). Na tela, vem logo depois do Bloco 0, como o primeiro "para completar". Para você, o básico (escolaridade, área, anos de experiência, licença) já está no Bloco 1; para o cônjuge, é perguntado aqui.

| ID | Pergunta | Tipo | Opções / observações |
|---|---|---|---|
| `career.nationalities` | Qual é a nacionalidade do seu cônjuge? | países | Só cônjuge. Alguns caminhos dependem da nacionalidade de quem é o titular |
| `career.education` | Escolaridade mais alta (concluída) do cônjuge | única | Mesmas opções de `you.education`. Só cônjuge |
| `career.field` | Área de formação do cônjuge | texto | Só cônjuge, com escolaridade ≥ `technical` |
| `career.experienceYears` | Há quantos anos o cônjuge trabalha na área? | número | Só cônjuge com carreira |
| `career.regulated` | A profissão do cônjuge exige registro ou licença? | única | Mesmas opções de `you.regulated`. Só cônjuge com carreira |
| `career.sector` | Em que área é o trabalho? | por pessoa · única | `tech` Tecnologia · `health` Saúde · `engineering` Engenharia · `science` Ciência e pesquisa · `education` Educação · `business` Gestão e negócios · `finance` Finanças e contabilidade · `law` Direito · `arts` Artes, cultura e comunicação · `sports` Esportes · `trades` Ofícios técnicos · `hospitality` Hotelaria, alimentação e serviços · `agriculture` Agricultura · `public` Serviço público · `other` Outra |
| `career.role` | Qual é o cargo ou a função atual? | por pessoa · texto | — |
| `career.level` | Em que nível da carreira está hoje? | por pessoa · única | `entry` Começo de carreira · `mid` Experiente (pleno) · `senior` Sênior ou especialista · `manager` Gerente, coordenador(a) ou supervisor(a) · `executive` Diretor(a) ou executivo(a) · `owner` Dono(a) de empresa |
| `career.multinational` | A empresa tem filial, sede ou empresa ligada nos EUA? | por pessoa · única | `yes` · `no` · `unsure`. Condição: situação de trabalho ∈ {`employed`, `business_owner`, `remote_foreign`} |
| `career.companyTime` | Há quanto tempo trabalha nessa empresa? | por pessoa · única | `lt1y` Menos de 1 ano · `1to3y` De 1 a 3 anos · `gt3y` Mais de 3 anos. Condição: `career.multinational` = `yes` |
| `career.achievements` | Quais destas conquistas fazem parte da carreira? Marque só o que dá para comprovar. | por pessoa · múltipla | `awards` Prêmios ou reconhecimentos · `associations` Associações que só aceitam profissionais de destaque · `media` Matérias sobre o trabalho · `judge` Avaliar o trabalho de outros · `contributions` Contribuições originais reconhecidas · `publications` Artigos, livros ou pesquisas · `exhibitions` Obras expostas ou apresentações · `leading_role` Liderança em organização reconhecida · `high_salary` Salário alto para a área · `license_cert` Licença ou certificação · `none` Nenhuma. **Espelha os tipos de evidência listados pelo USCIS (EB-1, EB-2), sem afirmar qualificação** |
| `career.usJobSearch` | Já procurou trabalho nos EUA? | por pessoa · única | `not_yet` Ainda não · `searching` Procurando · `interviews` Já fiz entrevistas · `offer` Já tenho oferta |
| `career.sameField` | Quer continuar na mesma área nos EUA? | por pessoa · única | `yes` · `maybe` · `change` Quero mudar de área · `no_work` Não pretendo trabalhar |
| `career.principal` | Quem da família tem o perfil profissional mais forte para liderar o pedido de visto? | única | `me` Eu · `partner` Meu cônjuge · `both` Os dois · `unsure` Não sei. Condição: `household.partner` ∈ {`going`, `undecided`} e **nenhum dos dois é do lar** |

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
| Respostas do Bloco 11 (com escolaridade, objetivo e nacionalidades) | Monta os **caminhos de visto para conhecer**, com "por que apareceu", requisitos oficiais e recomendação de advogado (mapeamento em [caminhos-visto.md](caminhos-visto.md#mapeamento-respostas--caminhos-para-conhecer-rascunho)) |
| `career.achievements` com itens marcados | Cria tarefas de preparação: **juntar provas** de cada conquista (cartas, certificados, publicações), sem prometer resultado |
| `career.principal` ∈ {`partner`, `both`} | Mostra os caminhos pelos dois adultos |
| `career.usJobSearch` = `not_yet` e propósito de trabalho | Inclui na Fase 1 as tarefas de currículo no padrão americano e de busca de emprego |
| `moment.life` = `hard` ou `moment.events` com itens marcados | Sugere um ritmo mais leve e começa com tarefas bem pequenas (pequenas vitórias), sem culpa |
| `moment.decision` = `exploring` | Começa por uma fase de **conhecer antes de decidir**; desistir com consciência é tratado como bom resultado |
| `moment.partnerSupport` ∈ {`unsure`, `against`, `not_talked`} | Inclui logo no começo tarefas de **conversa do casal** sobre a mudança |
| `moment.familySupport` = `no` | Reforça os lembretes do "porquê" e as celebrações de progresso |
| `dest.cityList` com cidades | Usa as cidades nas comparações de custo de vida, clima e impostos (estado e cidade) |

## Cidades dos EUA: fonte e capitais

- **Fonte oficial:** U.S. Census Bureau, [City and Town Population Totals: 2020-2025](https://www.census.gov/data/datasets/time-series/demo/popest/2020s-total-cities-and-towns.html), arquivo SUB-EST2025 (**Vintage 2025**, população estimada em 1º de julho de 2025, publicada em 14/05/2026). Baixado em 17/11/2026.
- **Script:** `scripts/build-us-cities.mjs` (rodar com `pnpm data:cities`) baixa o arquivo oficial e gera `apps/web/public/data/us-cities/<UF>.json` (19.483 cidades, 51 arquivos, cerca de 600 KB no total). O app baixa **só o arquivo do estado escolhido**, quando a pergunta aparece.
- **O que entra:** os "incorporated places" do Census (cidades, towns, villages, boroughs), incluindo a parte principal das cidades consolidadas com o condado (ex.: Nashville, Indianapolis, Louisville). No Havaí, que não tem cidades incorporadas, entra o lugar oficial do Census (Urban Honolulu). **Áreas não incorporadas (CDPs) de outros estados não estão neste arquivo**: alguns subúrbios conhecidos podem não aparecer. Se fizer falta, avaliar outro arquivo oficial do Census.
- **Atualização:** quando o Census publicar a próxima edição (Vintage 2026), trocar a URL e a coluna no script e rodar de novo.
- **Capital do estado (pendente):** a ideia aprovada é mostrar a capital primeiro, com o selo "Capital". Ainda **não está implementado** porque não encontramos uma fonte oficial que liste **estado e capital juntos** em formato que dê para usar com segurança. O mapa do Census (Statistics in Schools) traz os nomes das capitais, mas não diz de qual estado é cada uma (há nomes repetidos, como Columbia, Jackson, Springfield), e a tentativa de associar pela posição no mapa errou. **Conhecimento de memória não é fonte.** Próximo passo: levantar a capital de cada estado no site oficial do governo do estado (.gov) e guardar com o link e a data.

## Pendências
- [x] Aprovar a lista de perguntas e opções (aprovada em 16/11/2026, com os ajustes: autonomia na parte essencial, filhos de qualquer idade num só lugar, data de nascimento em vez de idade, perguntas de poupança, cônjuge, orçamento)
- [x] Aprovar a divisão entre "essencial" e "para completar"
- [x] Traduzir os textos para en-US e es (em `apps/web/messages/questionnaire/`; um teste automático confere se nenhum texto falta em nenhum idioma)
- [ ] Completar a tabela de regras junto com o conteúdo da jornada
- [ ] Capital de cada estado com fonte oficial (ver [Cidades dos EUA](#cidades-dos-eua-fonte-e-capitais))
- [ ] Profissão, cargo e área de formação como lista padronizada (avaliar a classificação oficial O\*NET do Departamento do Trabalho dos EUA; precisa ser verificada antes)
