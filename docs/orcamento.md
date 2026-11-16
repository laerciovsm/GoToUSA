# Orçamento da mudança

> Documento vivo. Define como o GoToUSA calcula **quanto a mudança custa**, **quanto a família vai gastar por mês nos EUA** e se a **renda prevista cobre as despesas**. Ideia do fundador: a composição da renda familiar precisa ser comparada com os gastos previstos, incluindo taxas e tributos obrigatórios do estado de destino e todos os custos até a mudança.

## Objetivo

Responder com clareza três perguntas, a partir das respostas do questionário:

1. **Quanto custa chegar lá?** (custos únicos, antes e durante a mudança)
2. **Quanto vamos gastar por mês nos EUA?** (custos recorrentes, no estado escolhido)
3. **A conta fecha?** (renda prevista × despesas, reserva de emergência e quanto falta juntar)

O orçamento não decide pela pessoa. Ele mostra os números para ela decidir com consciência, inclusive que a mudança não cabe agora (ver a [ideia central](../CLAUDE.md#ideia-central-a-alma-do-produto)).

## As três partes do orçamento

### 1. Custos até a mudança (únicos)

| Grupo | Itens | De onde vem o valor |
|---|---|---|
| **Documentos** | Passaporte de cada pessoa que não tem ou que vence logo · certidões · traduções juramentadas · apostilamento · antecedentes criminais | Taxa oficial do órgão emissor do **país de origem** · tradução e apostila: estimativa |
| **Visto e imigração** | Taxas de visto de cada pessoa · taxas de petição do USCIS (quando houver) · exame médico do visto de imigrante · vacinas exigidas | Taxas oficiais (travel.state.gov, uscis.gov) · exame e vacinas: estimativa |
| **Viagens antes da mudança** | Viagem à entrevista no consulado (passagem, hospedagem) · **visitas exploratórias aos EUA** para conhecer o destino | Estimativa, a partir de `money.scoutingTrips` e do tamanho da família |
| **A mudança em si** | Passagens só de ida para todos · bagagem extra · envio de pertences · transporte de animais · hospedagem temporária na chegada | Estimativa |
| **Instalação** | Depósito-caução e primeiro aluguel (ou entrada do imóvel) · móveis básicos · carro (à vista ou entrada) · ligação de serviços (luz, internet, celular) | Estimativa, a partir de `money.housingPlan` e `money.carPlan` |
| **Assessoria** | Advogado de imigração, quando a jornada recomendar | Estimativa (faixa de valores, fonte não oficial) |

### 2. Custo mensal nos EUA (recorrente)

| Grupo | Itens | De onde vem o valor |
|---|---|---|
| **Moradia** | Aluguel **ou** prestação do financiamento · seguro do imóvel ou do inquilino · condomínio (HOA) · **imposto sobre a propriedade** (se comprar) | Imposto: fonte oficial do estado ou do condado · aluguel e seguro: estimativa |
| **Transporte** | Prestação ou *leasing* do carro · seguro do carro · registro anual e taxas do veículo (DMV) · combustível · transporte público | Registro e taxas: DMV do estado · resto: estimativa |
| **Saúde** | Plano de saúde (parte paga pela família) · remédios contínuos · terapias e especialistas · cuidados que saem do bolso enquanto não há acesso a benefícios | Ver [conteudo.md](conteudo.md#saúde-cruzamento-com-serviços-e-custos) · estimativa |
| **Impostos e tributos obrigatórios** | Imposto de renda federal · contribuições sobre o salário (Social Security e Medicare) · imposto de renda estadual (alguns estados não cobram) · imposto local, onde existir · imposto sobre vendas (*sales tax*) embutido nas compras | Fontes oficiais: IRS (irs.gov) e o órgão de receita de cada estado |
| **Dia a dia** | Mercado · contas da casa (luz, água, gás, internet, celular) · escola, creche ou cuidador · lazer | Estimativa, a partir do tamanho da família e do estado |
| **Compromissos no país de origem** | Dívidas e financiamentos que continuam · ajuda a quem ficou (`household.leftBehind`) · impostos e contas de bens mantidos | Valores informados pela pessoa |

### 3. A conta fecha?

- **Renda mensal prevista nos EUA:** salário da oferta (líquido, depois dos impostos estimados) + renda do cônjuge, se puder trabalhar + rendas que continuam (`money.income`).
- **Despesa mensal prevista:** a soma da parte 2.
- **Resultado do mês:** sobra ou falta, mostrado de forma clara, sem alarmismo.
- **Reserva de emergência sugerida:** meses de despesa guardados. É maior quando há **renda única** ou dependentes que exigem cuidados (ver as regras em [questionario-perguntas.md](questionario-perguntas.md#regras-o-que-cada-resposta-muda-na-jornada)).
- **Meta total para juntar** = custos até a mudança + reserva de emergência.
- **Quanto falta e em quanto tempo:** (meta − `money.saved`) ÷ `money.monthlySaving`. O resultado é comparado com a data de partida (`goal.departure`): "No ritmo atual, você chega à meta em março de 2028. A sua data de ida é dezembro de 2027."

## De onde vêm os valores (premissa de fonte oficial)

Todo número do orçamento tem **uma origem visível**, seguindo a [premissa de fonte oficial](conteudo.md#premissa-só-informação-oficial-e-verificada):

| Selo | Quando | Exemplos |
|---|---|---|
| **Oficial** | Valor publicado por órgão oficial, com link e data de verificação | Taxas de visto, taxas do USCIS, taxa do passaporte no país de origem, alíquotas de impostos, taxas do DMV |
| **Estimativa, fonte não oficial** | Não existe fonte oficial; a fonte da estimativa é citada | Aluguel, passagens, mercado, plano de saúde, mudança |
| **Informado por você** | A pessoa digitou o valor | Salário da oferta, dívidas, aluguel de um imóvel que ela já pesquisou |

- **A pessoa pode trocar qualquer estimativa** pelo valor real que encontrou. O valor dela passa a valer e ganha o selo "informado por você".
- **Impostos são estimativas de cálculo**, mesmo usando alíquotas oficiais, porque dependem da situação de cada família. O app mostra o aviso: "Cálculo aproximado. Para o valor exato, consulte um contador ou especialista em impostos nos EUA."
- **Câmbio:** a pessoa pode digitar valores na moeda do país dela. O app converte para USD com uma cotação marcada como estimativa e com a data.
- **Dados estruturados** (taxas oficiais, alíquotas, salário mínimo) entram na [atualização automática sem IA](conteudo.md#dados-estruturados).
- **Passaporte e documentos dependem do país de origem.** No MVP, só o país do cenário inicial (Brasil), com fonte oficial. Os outros países entram depois, com a mesma regra.

## Regras de linguagem do orçamento

- O orçamento é **informativo, não é consultoria financeira, tributária ou jurídica**. O aviso padrão vale aqui também.
- Nunca dizer "você não pode ir". O certo é mostrar o número: "Com os valores de hoje, falta US$ X por mês. Veja o que pode mudar: outro estado, outro tipo de moradia, uma renda a mais."
- Ligar o resultado à jornada: se falta dinheiro, aparecem tarefas como "rever o orçamento", "comparar estados mais baratos" e "ver outras fontes de renda legais" (ver [conteudo.md](conteudo.md#outras-fontes-de-renda-e-trabalho-temporário)).
- **O orçamento muda quando as respostas mudam:** trocar o estado, a moradia ou o carro recalcula tudo na hora. Isso ajuda a pessoa a testar cenários ("e se eu alugar em vez de comprar?").

## Perguntas do questionário que alimentam o orçamento

Detalhes em [questionario-perguntas.md](questionario-perguntas.md#bloco-5--dinheiro-para-completar):

- **Família e documentos:** quantas pessoas vão e as idades (bloco 3); quem precisa de passaporte (`docs.passport`).
- **Objetivo:** tipo de visto, que define as taxas (bloco 2).
- **Saúde:** remédios, terapias e cuidados (bloco 4).
- **Dinheiro (bloco 5):**
  - Renda: `money.expectedIncomeUS` (salário da oferta) e `money.employerBenefits` (o que o empregador oferece).
  - Reserva: `money.saved` e `money.monthlySaving`.
  - Moradia e carro: `money.housingPlan` (alugar ou comprar), `money.carPlan` (comprar à vista, financiar, *leasing* ou ficar sem carro).
  - Mudança: `money.scoutingTrips` (visitas antes da mudança) e `money.moveBelongings` (o que vai levar).
  - Compromissos: `money.debts` e o que continua sendo pago.
- **Destino:** o estado escolhido, que define impostos, taxas e custo de vida (bloco 7). Sem estado escolhido, o app mostra uma faixa ou compara os estados da lista da pessoa.

## No MVP

- Entra uma **versão simples**, para o cenário inicial: custos até a mudança, custo mensal no(s) estado(s) da lista curta e "a conta fecha?".
- Todas as taxas oficiais usadas no MVP precisam ser **levantadas e conferidas nas fontes oficiais** antes de entrar no app. Nenhum valor de memória.

## Pendências
- [ ] Levantar as fontes oficiais de cada taxa (passaporte no Brasil, vistos, USCIS, DMV e impostos dos estados da lista curta)
- [ ] Escolher as fontes das estimativas (aluguel, passagens, plano de saúde) e registrar cada uma
- [ ] Definir como calcular a reserva de emergência sugerida (quantos meses, conforme o risco)
- [ ] Definir o formato dos dados de custo no `content/` (valor, moeda, fonte, data de verificação, selo)
- [ ] Desenhar a tela do orçamento (celular primeiro)
