// Textos dos e-mails em português do Brasil (referência para os outros idiomas).
// Variáveis: {name} (como a pessoa quer ser chamada), {url} (link), {hours} (validade).
// No convite: {inviter} (quem convidou), {journey} (nome da jornada), {days} (validade).
export default {
  verify: {
    subject: "Confirme seu e-mail no GoToUSA",
    greeting: "Olá, {name}!",
    intro: "Falta só um passo para ativar sua conta no GoToUSA. Toque no link abaixo para confirmar seu e-mail:",
    action: "Confirmar meu e-mail",
    expiry: "O link vale por {hours} hora(s).",
    ignore: "Se você não criou uma conta no GoToUSA, pode ignorar este e-mail.",
  },
  reset: {
    subject: "Criar uma nova senha no GoToUSA",
    greeting: "Olá, {name}!",
    intro: "Recebemos um pedido para criar uma nova senha para a sua conta. Toque no link abaixo para escolher a nova senha:",
    action: "Criar nova senha",
    expiry: "O link vale por {hours} hora(s). Ao trocar a senha, as outras sessões abertas são encerradas.",
    ignore: "Se não foi você que pediu, pode ignorar este e-mail: sua senha continua a mesma.",
  },
  invite: {
    subject: "{inviter} convidou você para uma jornada no GoToUSA",
    greeting: "Olá, {name}!",
    greetingNoName: "Olá!",
    intro: "{inviter} convidou você para a jornada “{journey}” no GoToUSA, para acompanharem juntos a preparação da mudança para os Estados Unidos. Toque no link abaixo para ver o convite:",
    action: "Ver o convite",
    expiry: "O convite vale por {days} dias.",
    ignore: "Se você não esperava este convite, pode ignorar este e-mail.",
  },
  footer: "GoToUSA: seu companheiro na jornada para morar nos Estados Unidos.",
};
