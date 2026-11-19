import type { Env } from "./config/env.js";

/** Configuração falsa para os testes automáticos (nenhum segredo real). */
export const TEST_ENV: Env = {
  DATABASE_URL: "postgresql://x:y@127.0.0.1:5432/z",
  API_HOST: "127.0.0.1",
  API_PORT: 0,
  BETTER_AUTH_SECRET: "segredo-de-teste-com-mais-de-32-caracteres",
  BETTER_AUTH_URL: "http://127.0.0.1:3000",
  AUTH_SIGNUP_ALLOWLIST: ["fundador@example.com"],
  SMTP_HOST: "127.0.0.1",
  SMTP_PORT: 1025,
  SMTP_USER: undefined,
  SMTP_PASS: undefined,
  MAIL_FROM: "GoToUSA <teste@example.com>",
};
