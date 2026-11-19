// Opções do Better Auth que mudam as TABELAS do banco. Usadas pela API (auth.ts)
// e pela CLI do Better Auth para gerar o schema.prisma (prisma/auth-cli.config.ts).
// Sem imports relativos, para a CLI conseguir ler este arquivo sozinho.

/** Cabeçalho com o IP real do celular, gravado só pelo servidor do app (apps/web/server.mjs). */
export const CLIENT_IP_HEADER = "x-gotousa-client-ip";

export const authSchemaOptions = {
  user: {
    additionalFields: {
      /** Idioma da pessoa, para os e-mails irem no idioma certo. */
      locale: { type: "string", required: false, input: true },
    },
  },
  rateLimit: {
    enabled: true,
    // No banco, para os contadores não zerarem quando a API reinicia.
    storage: "database",
  },
} as const;

/** Campos nossos nas tabelas do plugin de organização (jornada = organização; passo 4). */
export const organizationSchemaOptions = {
  invitation: {
    additionalFields: {
      /** Pessoa da família no questionário (UUID) que vai usar esta conta. */
      personId: { type: "string", required: true, input: true },
      /** Idioma do e-mail do convite e do link. */
      locale: { type: "string", required: true, input: true },
      /** Nome de quem é convidado, para a saudação do e-mail. */
      inviteeName: { type: "string", required: false, input: true },
    },
  },
  member: {
    additionalFields: {
      /** Pessoa da família no questionário. Vazio no dono (é o "você" do questionário). */
      personId: { type: "string", required: false, input: false },
    },
  },
} as const;
