# Questionário inicial

> Documento vivo. Define as perguntas do questionário inicial do GoToUSA e o que cada bloco influencia na jornada (ver [jornada.md](jornada.md)).
> **Especificação detalhada** (IDs, textos, opções, condições e regras): [questionario-perguntas.md](questionario-perguntas.md).

## Objetivo

Entender com clareza **o que a pessoa quer** e a **situação real dela e da família**, para gerar uma jornada completa e personalizada. O questionário precisa prever qualquer situação (por exemplo: filho adulto com deficiência que depende da pessoa, pai idoso que mora junto e vai na mudança) sem perguntar nada desnecessário.

## Regras de funcionamento

- **Adaptativo:** as perguntas seguintes dependem das respostas anteriores. Quem responde "não tenho filhos" não vê nenhuma pergunta sobre filhos.
- **Por blocos, com progresso salvo a cada passo:** a pessoa pode parar e continuar depois.
- **Toda pergunta tem um motivo:** se a resposta não muda nada na jornada, a pergunta sai.
- **Opções "Não sei ainda" e "Prefiro não responder"** nas perguntas delicadas.
- **Dados sensíveis (saúde, deficiência, antecedentes):** perguntar o mínimo necessário (ex.: "precisa de cuidados contínuos?" em vez do diagnóstico). No servidor, só com consentimento explícito e criptografia.
- **Editável:** a pessoa pode mudar respostas depois, e a jornada é recalculada.
- **Multilíngue:** todas as perguntas e opções vêm de arquivos de tradução (idiomas iniciais: en-US, pt-BR, es).

## Antes do questionário

1. **Aviso legal com aceite obrigatório:** o app não dá orientação jurídica. Ele apresenta os requisitos oficiais dos EUA e é um auxílio à jornada.
2. **Expectativa clara:** mudar de país é uma jornada longa, com esforço e renúncias. O app vai ajudar a pessoa a ver o todo, e decidir no meio do caminho que não é para ela também é um resultado válido.

## Blocos

### 0. O seu porquê
> Base psicológica da jornada. A resposta é mostrada de volta à pessoa nos momentos difíceis.

- Por que você quer morar nos EUA? (texto livre, com sugestões de exemplos)
- O que você espera que mude na sua vida?
- O que mais te preocupa ou dá medo nessa mudança?
- O que você está disposto(a) a abrir mão? (perto da família, carreira atual, idioma, conforto)

### 1. Sobre você
| Pergunta | Por que importa |
|---|---|
| Nacionalidade(s), podendo ser mais de uma | Isenção de visto, tratados (ex.: E-2), elegibilidade para a loteria do Green Card |
| País onde mora hoje | Consulado, documentos locais, saída fiscal |
| Idade | Tipos de visto, escola, planos de saúde |
| Idiomas que fala | Adaptação, comunidades |
| Nível de inglês (autoavaliação com descrições simples) | Plano de estudo, testes exigidos (TOEFL, IELTS, Duolingo) |
| Escolaridade e área de formação | Tipos de visto, validação de diploma |
| Profissão e anos de experiência | Tipos de visto, mercado de trabalho |
| A profissão é regulamentada? (medicina, enfermagem, direito, engenharia etc.) | Licenças necessárias nos EUA |
| Situação atual (empregado, empresário, autônomo, estudante, aposentado, trabalho remoto para empresa de fora) | Renda, caminho de visto, impostos |

### 2. O seu objetivo
| Pergunta | Opções / observações |
|---|---|
| Propósito principal | Estudar · Trabalhar com oferta de emprego · Transferência pela empresa atual · Empreender ou investir · Família (cônjuge ou parente cidadão/residente nos EUA) · Casamento com cidadão americano · Aposentadoria · Pesquisa/carreira acadêmica · Talento extraordinário (artes, esportes, ciência) · Intercâmbio · Loteria do Green Card · Proteção humanitária (encaminhar para ajuda jurídica especializada) · Ainda não sei (o app ajuda a explorar) |
| Quanto tempo quer ficar | Até 6 meses · 6 meses a 1 ano · 1 a 3 anos · 3 a 5 anos · Definitivo · Não sei |
| Quando quer ir (data aproximada) | Base do cronograma, montado de trás para frente |
| O que já tem | Oferta de emprego · Aceite de escola · Parente nos EUA · Empresa com filial nos EUA · Capital para investir · Nada ainda |
| Se trabalho: tipo de patrocínio do empregador | **Visto de trabalho temporário** (ex.: H-1B, L-1) · **Green Card por emprego** (EB-1, EB-2, EB-3) · **Não sei** (a jornada explica a diferença: "temporário" e "permanente" se referem ao tipo de visto, não ao emprego) |

### 3. Quem vai com você
> O bloco mais importante para os casos especiais.

- **Cônjuge ou parceiro(a):** vai junto? O casamento é formal? (união estável nem sempre é reconhecida para visto)
- **Para cada filho:** idade · série escolar · necessidades especiais ou cuidados contínuos · fala inglês?
- **Filhos de relacionamento anterior:** o outro pai ou mãe precisa autorizar a viagem? Como está a guarda?
- **Outros dependentes** (filho adulto, pais, avós, irmãos etc.). Para cada um: relação · idade · nível de dependência (total, parcial, financeira) · precisa de cuidador? · mobilidade reduzida? · medicação contínua?
- **Animais de estimação:** espécie e quantidade.
- **Quem fica:** alguém depende de você e vai ficar no país de origem?

> ⚠️ **Alerta para a jornada:** em geral, só o **cônjuge** e os **filhos solteiros menores de 21 anos** podem ir como dependentes do visto do titular. Filhos maiores de idade (mesmo dependentes) e pais ou avós normalmente precisam de um caminho próprio. A jornada deve mostrar esse alerta na Fase 0 e recomendar a confirmação com um advogado de imigração.

### 4. Saúde (detalhada, por pessoa)
> O detalhe é necessário para cruzar a situação de cada pessoa com o que existe nos EUA e quanto custa (ver [conteudo.md](conteudo.md#saúde-cruzamento-com-serviços-e-custos)).
> **Privacidade:** no modo gratuito, tudo fica só no navegador. Com conta, os dados de saúde exigem **consentimento explícito** separado, ficam **criptografados** e a pessoa pode escolher mantê-los apenas no aparelho. Todas as perguntas aceitam "Prefiro não responder".

Para **cada pessoa** que vai (titular, cônjuge, filhos, outros dependentes):
- **Condições**, por categoria:
  - Neurodesenvolvimento: autismo (nível de suporte 1, 2 ou 3), deficiência intelectual (grau), TDAH, outras
  - Doenças crônicas (ex.: diabetes, cardiopatia, doença renal)
  - Saúde mental
  - Mobilidade (cadeira de rodas, mobilidade reduzida)
  - Sentidos (visão, audição)
  - Outras
- **Grau de autonomia:** independente · precisa de supervisão · precisa de ajuda em atividades do dia a dia · dependência total. Quem é o cuidador principal?
- **Medicação contínua:** nome, dose, frequência e se é **controlada**.
- **Tratamentos e terapias** em andamento (ex.: fonoaudiologia, terapia ocupacional, diálise).
- **Equipamentos** necessários.
- **Especialistas** que acompanham.
- **Gravidez** atual ou planejada.
- **Vacinas** em dia? (o visto de imigrante exige vacinas e exame médico)

### 5. Dinheiro
- Quanto pretende levar, em USD.
- Renda que continua depois da mudança (trabalho remoto, aluguel, aposentadoria).
- Patrimônio no país de origem: vender, alugar ou manter?
- Dívidas e financiamentos ativos.
- Por quantos meses o dinheiro precisa durar até haver renda nos EUA?

### 6. Preferências e estilo de vida
> As preferências pessoais pesam tanto quanto os requisitos. Exemplo: quem odeia calor não deve receber a Flórida como sugestão principal.

- **Clima:** gosta de frio, calor, quatro estações bem definidas? Tolera neve? Tolera calor e umidade?
- **Tamanho de lugar:** cidade grande, cidade média, subúrbio, cidade pequena ou interior?
- **Natureza e lazer:** praia, montanha, vida ao ar livre, vida cultural e noturna?
- **Locomoção:** quer (ou precisa) viver sem carro?
- **Ritmo de vida:** agitado ou tranquilo?
- **Comunidade:** quer viver perto de pessoas do seu país ou idioma, ou prefere imersão total?
- **Prioridades da família:** escolas, segurança, acesso a hospitais especializados (para dependentes com necessidades de saúde).

### 7. Destino
- Já sabe a cidade ou o estado? Por quê?
- Se não sabe, o que mais importa: custo de vida · clima · segurança · escolas · comunidade do seu país ou idioma · emprego na sua área · impostos do estado · transporte público (sem carro) · proximidade de família ou amigos.
- Se já escolheu, o app compara o destino com as preferências do bloco 6 e aponta conflitos (ex.: "você disse que odeia calor, e Miami tem verão de 6 meses").

### 8. Histórico com os EUA
- Já visitou? Tem ou teve visto?
- Tem família ou amigos nos EUA? (rede de apoio, possível patrocinador)
- Existe algo que possa complicar, como visto negado, permanência além do prazo ou antecedentes criminais? **Só sim / não / prefiro não dizer, sem detalhes.** Se for "sim", a jornada recomenda um advogado logo no início.

### 9. Documentos que você já tem (só sim/não, sem envio de arquivos)
- Passaporte válido (e até quando) de cada pessoa que vai.
- Certidões (nascimento, casamento), diplomas e históricos escolares.
- Carteira de motorista.

### 10. Seu ritmo e suas recompensas
- Idioma do app.
- Quanto tempo por semana consegue dedicar à jornada.
- **Que pequenas recompensas te motivam?** (a pessoa escolhe as próprias; ver [jornada.md](jornada.md#recompensas))

## Pendências
- [ ] Redigir o texto final de cada pergunta e opção (en-US, pt-BR, es)
- [ ] Definir as regras de ramificação (qual resposta abre qual pergunta)
- [ ] Mapear cada resposta para as tarefas da jornada
- [ ] Validar com pessoas reais que estão planejando a mudança
