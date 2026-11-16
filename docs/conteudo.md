# Conteúdo

> Documento vivo. Define como o conteúdo do GoToUSA é organizado, escrito, atualizado e cruzado com a situação de cada pessoa.

## Onde o conteúdo fica

- **Arquivos no repositório**, numa pasta `content/` (MDX para textos, JSON/YAML para dados estruturados), versionados no Git.
- Cada item de conteúdo (tarefa, artigo, perfil de estado) tem um **ID estável** que nunca muda, para não quebrar o progresso salvo das pessoas.
- Conteúdo traduzível: um arquivo por idioma (pt-BR primeiro; en-US e es antes do lançamento público).
- **Por que arquivos no Git:**
  - **Histórico completo** do que mudou, quando e por quê, o que funciona como auditoria das mudanças legais.
  - **Revisão antes de publicar.**
  - Gratuito e simples, sem banco de dados ou painel administrativo.
- **Atualização:** corrigir o arquivo, fazer o commit e publicar de novo. Num app web, todos veem a versão nova no próximo acesso.
- **Depois do MVP:** com backend e contas, será possível avisar cada pessoa afetada por uma mudança. O conteúdo pode continuar em arquivos no Git.

## Atualização do conteúdo legal

> **Regra de ouro:** o app **nunca** reescreve conteúdo legal sozinho, nem com automação nem com IA. Uma leitura automática errada, mostrada como verdade para quem está tomando decisões de vida, é o maior risco do produto.

- **Monitoramento automático das fontes oficiais** (USCIS, Federal Register, Departamento de Estado). Quando algo muda, o sistema **avisa quem mantém o conteúdo**. Uma IA pode ajudar a resumir e sugerir a atualização, mas **uma pessoa revisa e aprova**.
- **Dados estruturados podem ser atualizados automaticamente:** o *Visa Bulletin* (fila mensal do Green Card), taxas oficiais, salário mínimo, impostos estaduais.
- **Transparência em todo conteúdo legal:** data da última revisão, link da fonte oficial e lembrete para confirmar na fonte.
- **Depois do MVP:** avisar quem foi afetado: "Uma regra que afeta a sua jornada mudou. Veja o que mudou."

## Regras de linguagem

**Informar, sim. Concluir pelo caso da pessoa, nunca.** O app informa sobre temas como CSPA, *guardianship* e benefícios, mas não dá orientação jurídica.

- **Informar a regra geral e a fonte.** Exemplo: "Pela regra geral, filhos com 21 anos ou mais não podem ir como dependentes. Existe uma lei, a CSPA, que em alguns casos protege a idade do filho em processos de Green Card." + link oficial.
- **Nunca concluir pelo caso da pessoa.** Nada de "seu filho não pode ir" ou "você tem direito à CSPA".
- **Indicar quando procurar um advogado.** Exemplo: "A sua situação envolve este tema. Recomendamos confirmar com um advogado de imigração antes de seguir."
- **A pessoa é quem executa:** "você concluiu", "seu próximo passo". Nunca "o app fez".
- **Sem culpa nem pressão:** mensagens de apoio, nunca de cobrança.
- **Termos oficiais em inglês** (Green Card, SSN, USCIS), com explicação no idioma da pessoa.

## Perfil dos estados

Leis, custos e benefícios mudam muito de estado para estado. O app mostra **o que cada estado tem e o que não tem** e compara com as preferências e a situação da família. **Ele não escolhe pela pessoa.**

| Tema | Exemplos |
|---|---|
| Dinheiro | Imposto de renda estadual (alguns estados não cobram), custo de vida, salário mínimo |
| Clima | Temperaturas médias, neve, calor e umidade (comparados às preferências da pessoa) |
| Saúde e deficiência | Programas de Medicaid para deficiência intelectual e autismo, filas de espera, serviços para adultos |
| Família | Escolas, educação especial, regras de *guardianship* |
| Vida prática | Carteira de motorista para imigrantes, transporte público |
| Imigração | Benefícios estaduais que cobrem imigrantes (variam bastante) |

- A estrutura cobre **os 50 estados e Washington D.C.** desde o início.
- **Dados objetivos vêm de fontes oficiais estruturadas:** impostos, salário mínimo, clima.
- **Dados que exigem pesquisa** (programas, filas, serviços) começam por uma **lista curta** de estados de interesse dos validadores.
- O resultado é uma comparação com **pontos a favor e contra** para cada estado, ligada às respostas do questionário (ex.: "você não gosta de calor, e este estado tem verões longos e úmidos").

## Saúde: cruzamento com serviços e custos

A partir das respostas detalhadas de saúde de cada pessoa ([questionario.md](questionario.md)), o app mostra:

- **Medicação:** se existe nos EUA (inclusive genérico), se exige receita de médico americano, se é controlada, como entrar no país com estoque inicial (receita e laudo traduzidos, regras de entrada de medicamentos) e custo estimado.
- **Tratamentos, terapias e especialistas:** disponibilidade e custo estimado, com e sem plano de saúde.
- **Serviços para pessoas com deficiência:** educação especial (em geral termina aos 21 ou 22 anos, conforme o estado), programas de dia para adultos, programas de Medicaid do estado e filas de espera.
- **Acesso a benefícios conforme o status imigratório:** em geral, quem tem visto temporário não acessa a maioria dos benefícios, e quem tem Green Card recente costuma esperar 5 anos por muitos deles (ex.: Medicaid), com exceções em alguns estados. Isso entra no **orçamento**: os cuidados podem sair do bolso nos primeiros anos.
- **Tarefas geradas na jornada.** Exemplo, para medicação controlada contínua: levar estoque para os primeiros meses com receita e laudo traduzidos; agendar médico nos EUA antes de o estoque acabar; pesquisar o custo do genérico no estado escolhido.

Tudo segue as [regras de linguagem](#regras-de-linguagem): informa a regra geral e a fonte e indica quando procurar um profissional.

## Pendências
- [ ] Definir o formato exato dos arquivos de conteúdo (campos de uma tarefa, de um perfil de estado)
- [ ] Listar as fontes oficiais a monitorar
- [ ] Escolher a lista curta de estados para o primeiro perfil detalhado
- [ ] Definir quem escreve e revisa o conteúdo
