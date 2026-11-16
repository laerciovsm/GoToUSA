# Comercialização

> Documento vivo. Checklist do que precisa ser feito ou mudado quando o GoToUSA passar da validação para a venda. Durante a validação, as decisões do [MVP](mvp.md) continuam valendo.

## O que continua igual

- **A stack:** todas as ferramentas escolhidas têm licenças que permitem uso comercial.
- **Conteúdo em arquivos no Git**, com [atualização automática](conteudo.md#atualização-automática-do-conteúdo).
- **O app em si não usa IA** para funcionar. A IA só entra no processo automático de atualização do conteúdo.

## Simulação de custo da IA

> **Obrigatório antes de definir o preço do plano anual.** O preço de venda precisa **pagar o custo da IA e ainda dar margem**.

A simulação deve estimar:
- **Quantas páginas oficiais** são monitoradas (por cenário, por estado, por tema).
- **Com que frequência elas mudam**, na prática. Medir durante a validação: o script de detecção registra cada mudança.
- **Custo por atualização:** tamanho médio do texto oficial + resumo + segunda leitura de verificação, multiplicado pelo preço por uso do provedor de IA escolhido.
- **Custo mensal e anual** em três cenários: poucas mudanças, normal e muitas mudanças (ex.: uma grande reforma imigratória).
- **Custo por cliente:** custo anual da IA ÷ número de clientes, comparado ao preço do plano.

Somar ao custo da IA os demais custos de operação (ver abaixo) e a taxa do Merchant of Record. O preço do plano anual precisa cobrir **tudo isso com margem**.

## Custos de operação

| Item | Observação |
|---|---|
| Hospedagem | Servidor, banco de dados, backups. Começa com camadas gratuitas ou baratas e cresce com o número de clientes. |
| Domínio | Custo anual. |
| Envio de e-mails | Lembretes e avisos de mudança de regras. |
| IA (atualização do conteúdo) | Pago por uso (ver simulação acima). |
| Merchant of Record | Percentual por venda. |
| Monitoramento e segurança | Muitos serviços têm plano gratuito (ex.: Cloudflare). |

## Estrutura do app

- [ ] **Backend obrigatório:** contas, transferência da jornada do navegador para a conta, confirmação de pagamento, acesso em vários aparelhos, avisos de mudança de regras.
- [ ] **Segurança de produção:** proteção contra ataques, backups testados, plano de resposta a incidentes e, idealmente, teste de invasão antes do lançamento.
- [ ] **Monitoramento:** saber quando o app sai do ar ou dá erro.

## Conteúdo

- [ ] **Traduções** en-US e es completas.
- [ ] **Mais cenários e estados**, adicionados como conteúdo e regras.
- [ ] **Avaliar uma revisão jurídica periódica** do aviso legal e dos termos por um advogado de imigração americano, para dar credibilidade e reduzir risco.
- [ ] **Confirmar os termos de uso** do provedor de IA para uso comercial do conteúdo gerado.

## Empresa e jurídico

- [ ] **Abrir uma empresa** para receber os pagamentos (o tipo certo um contador define).
- [ ] **Impostos sobre a renda:** o Merchant of Record cuida dos impostos sobre as vendas em cada país, mas o valor repassado é **renda da empresa**, tributada normalmente. Precisa de contador.
- [ ] **Termos de uso e política de privacidade** revisados por advogado.
- [ ] **Leis de privacidade (LGPD, GDPR, CCPA):** responsável pelos dados (encarregado), registro do tratamento de dados, contratos com fornecedores, consentimento separado para dados de saúde, obrigação de avisar em caso de vazamento.
- [ ] **Direito de arrependimento:** 7 dias no Brasil, 14 dias na Europa (o Merchant of Record ajuda).
- [ ] **Registro da marca** no INPI (Brasil) e, se for vender nos EUA, no USPTO.

## Pagamento

- [ ] Criar a conta no Merchant of Record (ex.: Paddle) e passar pela verificação.
- [ ] Definir o valor do plano anual (depois da simulação de custos).
- [ ] Definir o preço por país (ajustado ao poder de compra ou único).
- [ ] Definir a divisão entre grátis e pago.

## Atendimento

- [ ] Canal de suporte.
- [ ] Página de perguntas frequentes.
- [ ] Política de reembolso.

## ⚠️ Atenção: o visto do fundador

Em muitos vistos de trabalho temporários (ex.: H-1B, L-1), em geral só é permitido trabalhar para o empregador patrocinador. Tocar ativamente o próprio negócio pode ser considerado trabalho não autorizado e colocar o status em risco. Com Green Card, essa restrição não existe.

- [ ] **Antes da mudança**, confirmar com um advogado de imigração como o fundador pode se envolver com o GoToUSA (sócio, renda passiva, empresa no Brasil ou nos EUA).

> Informação citada de memória durante o planejamento. **Precisa ser conferida em fonte oficial** (premissa do projeto).
