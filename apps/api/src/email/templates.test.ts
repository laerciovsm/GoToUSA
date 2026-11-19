import { LOCALES } from "@gotousa/shared";
import { describe, expect, it } from "vitest";
import { EMAIL_MESSAGES, renderEmail } from "./templates.ts";

/** Lista as chaves aninhadas ("verify.subject", …). */
function keys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe("textos dos e-mails", () => {
  it("existem para todos os idiomas do app, com as mesmas chaves do pt-BR", () => {
    const reference = keys(EMAIL_MESSAGES["pt-BR"]).sort();
    for (const locale of LOCALES) {
      expect(keys(EMAIL_MESSAGES[locale]).sort(), locale).toEqual(reference);
    }
  });

  it("nenhum texto vazio", () => {
    for (const locale of LOCALES) {
      const flat = JSON.stringify(EMAIL_MESSAGES[locale]);
      expect(flat, locale).not.toMatch(/""/);
    }
  });
});

describe("renderEmail", () => {
  const data = { name: "Ana", url: "http://192.168.0.6:3000/api/auth/verify-email?token=abc" };

  it("usa o idioma da conta", () => {
    expect(renderEmail("verify", "en-US", data).subject).toBe(EMAIL_MESSAGES["en-US"].verify.subject);
    expect(renderEmail("reset", "es", data).subject).toBe(EMAIL_MESSAGES.es.reset.subject);
  });

  it("idioma desconhecido cai no idioma reserva (inglês)", () => {
    expect(renderEmail("verify", "xx", data).subject).toBe(EMAIL_MESSAGES["en-US"].verify.subject);
    expect(renderEmail("verify", undefined, data).subject).toBe(EMAIL_MESSAGES["en-US"].verify.subject);
  });

  it("traz o nome e o link por extenso, sem variáveis sobrando", () => {
    const email = renderEmail("verify", "pt-BR", data);
    expect(email.text).toContain("Ana");
    expect(email.text).toContain(data.url);
    expect(email.text).not.toMatch(/\{\w+\}/);
    expect(email.html).toContain(data.url);
  });

  it("protege o HTML contra nome malicioso", () => {
    const email = renderEmail("verify", "pt-BR", { ...data, name: "<script>x</script>" });
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;script&gt;");
  });
});
