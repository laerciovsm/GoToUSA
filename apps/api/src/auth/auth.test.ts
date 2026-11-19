import { describe, expect, it } from "vitest";
import { isSignupAllowed } from "./allowlist.ts";
import { hashPassword, verifyPassword } from "./password.ts";

describe("senha com Argon2id", () => {
  it("gera hash Argon2id com os parâmetros escolhidos e confere a senha certa", async () => {
    const hash = await hashPassword("uma senha longa o bastante");
    expect(hash).toMatch(/^\$argon2id\$v=19\$m=65536,t=3,p=1\$/);
    expect(hash).not.toContain("uma senha");
    expect(await verifyPassword({ hash, password: "uma senha longa o bastante" })).toBe(true);
  });

  it("recusa a senha errada e hash em formato estranho", async () => {
    const hash = await hashPassword("senha-certa-123");
    expect(await verifyPassword({ hash, password: "senha-errada-123" })).toBe(false);
    expect(await verifyPassword({ hash: "isto-nao-e-um-hash", password: "x" })).toBe(false);
  });
});

describe("lista de e-mails que podem criar conta", () => {
  const list = ["fundador@example.com"];

  it("aceita quem está na lista, sem diferenciar maiúsculas nem espaços", () => {
    expect(isSignupAllowed("fundador@example.com", list)).toBe(true);
    expect(isSignupAllowed("  Fundador@Example.COM ", list)).toBe(true);
  });

  it("recusa quem está fora da lista ou dado inválido", () => {
    expect(isSignupAllowed("outra@example.com", list)).toBe(false);
    expect(isSignupAllowed(undefined, list)).toBe(false);
    expect(isSignupAllowed(["fundador@example.com"], list)).toBe(false);
    expect(isSignupAllowed("fundador@example.com", [])).toBe(false);
  });
});
