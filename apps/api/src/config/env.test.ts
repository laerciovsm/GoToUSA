import { describe, expect, it } from "vitest";
import { parseEnv } from "./env.ts";

const SECRET = "senha-super-secreta";
const valid = {
  DATABASE_URL: `postgresql://gotousa:${SECRET}@127.0.0.1:5432/gotousa`,
  BETTER_AUTH_SECRET: "x".repeat(40),
  BETTER_AUTH_URL: "http://192.168.0.6:3000/",
};

describe("parseEnv", () => {
  it("aceita o mínimo e aplica os padrões (só no PC, porta 4000, Mailpit)", () => {
    const env = parseEnv(valid);
    expect(env.API_HOST).toBe("127.0.0.1");
    expect(env.API_PORT).toBe(4000);
    expect(env.SMTP_HOST).toBe("127.0.0.1");
    expect(env.SMTP_PORT).toBe(1025);
    expect(env.SMTP_USER).toBeUndefined();
    expect(env.AUTH_SIGNUP_ALLOWLIST).toEqual([]);
    expect(env.BETTER_AUTH_URL).toBe("http://192.168.0.6:3000"); // sem a barra final
  });

  it("converte a porta de texto para número e trata texto vazio como não definido", () => {
    const env = parseEnv({ ...valid, API_PORT: "4100", SMTP_USER: "", SMTP_PASS: "  " });
    expect(env.API_PORT).toBe(4100);
    expect(env.SMTP_USER).toBeUndefined();
    expect(env.SMTP_PASS).toBeUndefined();
  });

  it("lê a lista de e-mails separada por vírgula, em minúsculas", () => {
    const env = parseEnv({ ...valid, AUTH_SIGNUP_ALLOWLIST: " Ana@Example.com, bia@example.com ," });
    expect(env.AUTH_SIGNUP_ALLOWLIST).toEqual(["ana@example.com", "bia@example.com"]);
  });

  it("recusa lista com e-mail inválido", () => {
    expect(() => parseEnv({ ...valid, AUTH_SIGNUP_ALLOWLIST: "nao-e-email" })).toThrow(/AUTH_SIGNUP_ALLOWLIST/);
  });

  it("diz qual variável falta, sem mostrar valores", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL.*BETTER_AUTH_SECRET.*BETTER_AUTH_URL/);
  });

  it("recusa segredo curto", () => {
    expect(() => parseEnv({ ...valid, BETTER_AUTH_SECRET: "curto" })).toThrow(/BETTER_AUTH_SECRET/);
  });

  it("recusa endereço que não seja de PostgreSQL, sem vazar a senha", () => {
    const run = () => parseEnv({ ...valid, DATABASE_URL: `mysql://u:${SECRET}@127.0.0.1/db` });
    expect(run).toThrow(/DATABASE_URL/);
    expect(run).not.toThrow(new RegExp(SECRET));
  });

  it("recusa escutar na rede (só o próprio PC)", () => {
    expect(() => parseEnv({ ...valid, API_HOST: "0.0.0.0" })).toThrow(/API_HOST/);
  });
});

describe("parseEnv com o Gmail", () => {
  const appPassword = "abcdabcdabcdabcd";
  const gmail = {
    ...valid,
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "465",
    SMTP_USER: "gotousa.teste@gmail.com",
    SMTP_PASS: appPassword,
    MAIL_FROM: "GoToUSA <gotousa.teste@gmail.com>",
  };

  it("aceita a configuração completa", () => {
    const env = parseEnv(gmail);
    expect(env.SMTP_PORT).toBe(465);
  });

  it("exige usuário e senha de app, sem mostrar valores", () => {
    expect(() => parseEnv({ ...gmail, SMTP_PASS: "" })).toThrow(/SMTP_PASS/);
    expect(() => parseEnv({ ...gmail, SMTP_USER: "" })).toThrow(/SMTP_USER/);
    try {
      parseEnv({ ...gmail, SMTP_USER: "" });
    } catch (error) {
      expect(String(error)).not.toContain(appPassword);
    }
  });

  it("exige o remetente igual ao endereço do Gmail", () => {
    expect(() => parseEnv({ ...gmail, MAIL_FROM: "GoToUSA <nao-responda@gotousa.local>" })).toThrow(/MAIL_FROM/);
    expect(parseEnv({ ...gmail, MAIL_FROM: "GoToUSA <GoToUSA.Teste@gmail.com>" }).MAIL_FROM).toContain("GoToUSA");
  });
});
