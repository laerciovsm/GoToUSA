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

## Premissa: só informação oficial e verificada

> **Nada é inventado.** Todo fato do conteúdo (regras, prazos, taxas, requisitos, benefícios, dados de estados) precisa ter uma **fonte oficial** e uma **data de verificação**. Sem fonte oficial, o fato não entra.

- **Cada fato registra:** a fonte (link), o órgão responsável e a data em que foi conferido.
- **Conhecimento de memória (inclusive da IA) não é fonte.** Tudo é conferido na fonte oficial antes de entrar no conteúdo.
- **Fontes oficiais prioritárias:**
  - Imigração: USCIS (uscis.gov), Departamento de Estado (travel.state.gov, incluindo o *Visa Bulletin*), CBP (cbp.gov, para entrada no país e medicamentos)
  - Leis e regras: Federal Register (federalregister.gov), eCFR (ecfr.gov), Congresso (congress.gov)
  - Trabalho: Departamento do Trabalho (dol.gov)
  - Impostos: IRS (irs.gov)
  - Saúde e benefícios: Medicaid.gov, HHS (hhs.gov), Social Security (ssa.gov)
  - Medicamentos: FDA (fda.gov)
  - Estados: sites oficiais de cada governo estadual (domínios `.gov`), incluindo o órgão de receita (impostos estaduais) e o DMV (carteira de motorista, registro e taxas de veículos)
  - Passaporte e documentos: órgão oficial emissor do **país de origem** de cada pessoa (para os custos do [orçamento](orcamento.md))
  - Dados: Census (census.gov), BLS (bls.gov), NOAA (noaa.gov, para clima)
- **Quando não existe fonte oficial** (ex.: custo de vida detalhado, preço de aluguel): a informação aparece marcada como **"estimativa, fonte não oficial"**, com a fonte citada.
- **Conteúdo inicial:** criado durante o desenvolvimento, a partir das fontes oficiais, com as fontes citadas.
- **Atualizações:** feitas por um processo **100% automático**, sem revisão humana (ver [Atualização automática do conteúdo](#atualização-automática-do-conteúdo)).
- **Conteúdo com verificação vencida** aparece sinalizado para a pessoa até ser reconferido.

## Aviso ao final de cada conteúdo oficial

Todo conteúdo baseado em fonte oficial é apresentado como **informação compilada**, seguida de um aviso padrão com o link da fonte na íntegra. Modelo (traduzido para cada idioma):

> ℹ️ **Sobre esta informação**
> Este conteúdo foi compilado a partir de fontes oficiais, mas erros ao resumir podem acontecer. A fonte oficial na íntegra está em: **[nome do órgão – título da página](link)** (verificado em DD/MM/AAAA).
> O GoToUSA é um **apoio à sua jornada**, não uma consultoria jurídica. Para informações detalhadas, consulte a fonte oficial acima ou procure um advogado de imigração ou um especialista.

- Quando o conteúdo usa mais de uma fonte, todas são listadas.
- O aviso é um componente fixo da interface, não texto repetido à mão em cada arquivo, para garantir que nunca falte.

## Atualização automática do conteúdo

> **Decisão:** a atualização do conteúdo é **100% automática e sem revisão humana**. O projeto não depende de pessoas revisando textos ou fontes, nem da assinatura do Claude Code. O risco de um resumo errado ir ao ar é reduzido por **verificações automáticas**, **transparência**, o **aviso padrão** com o link da fonte na íntegra e o botão **"Reportar erro"**.

### O fluxo
1. **Detecção (sem IA, gratuita):** um script agendado no GitHub Actions confere periodicamente as páginas oficiais de cada conteúdo, comparando uma "impressão digital" (hash) do texto. Sem mudança, nada acontece.
2. **Busca:** se a página mudou, o script baixa o texto oficial atualizado.
3. **Resumo por IA (via API, pago por uso):** a IA gera o novo resumo seguindo as [regras de linguagem](#regras-de-linguagem).
4. **Verificações automáticas:**
   - **Conferência dos números:** todo número, data, idade ou valor do resumo precisa existir no texto oficial.
   - **Segunda leitura por IA:** outra chamada compara o resumo com o original e aponta contradições ou omissões importantes.
5. **Publicação automática:** se passar nas verificações, o resumo é salvo como commit no Git (histórico completo) e publicado com o aviso padrão.
6. **Se falhar:** mantém a versão anterior e mostra "Esta informação está sendo atualizada. Consulte a fonte oficial: [link]". **Nunca publica algo que não passou nas verificações.**

### Transparência
- Cada conteúdo mostra **"Resumo gerado automaticamente em DD/MM/AAAA"**, além do [aviso padrão](#aviso-ao-final-de-cada-conteúdo-oficial).
- Botão **"Reportar erro"** em cada conteúdo. É um alerta para quando algo escapar, não uma etapa de revisão.
- Toda atualização fica no histórico do Git e pode ser revertida.

### Dados estruturados
- O *Visa Bulletin* (fila mensal do Green Card), taxas oficiais, salário mínimo e impostos estaduais são dados estruturados e podem ser atualizados automaticamente **sem IA**.

### Depois do MVP
- Avisar quem foi afetado: "Uma regra que afeta a sua jornada mudou. Veja o que mudou."

### Custo
- A detecção é gratuita (GitHub Actions). Só o resumo e a segunda leitura por IA têm custo, **pago por uso** e proporcional ao número de mudanças nas fontes.
- É um **custo de operação** (como a hospedagem). A premissa "tudo gratuito" vale para as ferramentas de desenvolvimento.
- **Simulação de custo obrigatória antes da comercialização:** ver [comercializacao.md](comercializacao.md#simulação-de-custo-da-ia).

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

## Outras fontes de renda e trabalho temporário

Ideia do fundador: ajudar a pessoa a encontrar **outras fontes de renda**, inclusive **trabalhos temporários** que permitam trabalhar nos EUA por um período.

- **Regra principal:** trabalhar nos EUA exige **autorização de trabalho** válida. O app **só** apresenta caminhos legais e deixa claro que trabalhar sem autorização pode comprometer o status imigratório e futuros vistos (com fonte oficial).
- **O que o conteúdo pode cobrir** (cada item com fonte oficial e aviso padrão):
  - **Categorias legais de trabalho temporário** nos EUA, quem pode se candidatar e como funciona (a levantar nas fontes oficiais; ex.: vistos de trabalho sazonal e programas de intercâmbio com trabalho).
  - **Autorização de trabalho de dependentes** (cônjuge, filhos) conforme o tipo de visto.
  - **Renda vinda do país de origem:** trabalho remoto, freelance e aluguel de imóvel, com o alerta de confirmar se o tipo de visto permite e quais as obrigações fiscais nos dois países.
  - **Renda antes da mudança:** como aumentar a reserva enquanto ainda está no país de origem.
- **Ligação com o risco:** quando a família tem renda única, esse tema ganha destaque na jornada.

## Pendências
- [ ] Definir o formato exato dos arquivos de conteúdo (campos de uma tarefa, de um perfil de estado)
- [ ] Listar as fontes oficiais a monitorar
- [ ] Escolher a lista curta de estados para o primeiro perfil detalhado
- [ ] Escolher o provedor de IA para os resumos automáticos e confirmar o preço por uso
- [ ] Definir a frequência de verificação de cada tipo de fonte
- [ ] Fazer a simulação de custo da IA (ver [comercializacao.md](comercializacao.md#simulação-de-custo-da-ia))
