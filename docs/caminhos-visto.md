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

## Perguntas novas (Bloco 11 · Perfil profissional)

Incluídas em 16/11/2026 para aprofundar a carreira **de você e do cônjuge**. Detalhes em [questionario-perguntas.md](questionario-perguntas.md#bloco-11--perfil-profissional-para-completar--por-pessoa-você-e-cônjuge). As opções de conquistas espelham, em linguagem simples, os tipos de evidência listados pelo USCIS, sem afirmar que a pessoa se qualifica.

## Pendências
- [ ] Completar o mapeamento no Marco 3, com o conteúdo de cada caminho resumido da fonte oficial
- [ ] Conferir em fonte oficial a lista de países de tratado (E-1/E-2) e as nacionalidades de TN e E-3 antes de usar no mapeamento
- [ ] Desenhar a tela do perfil da família
