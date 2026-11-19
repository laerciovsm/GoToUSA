import { describe, expect, it } from "vitest";
import { parseEnv } from "./env.ts";

const SECRET = "senha-super-secreta";
const valid = { DATABASE_URL: `postgresql://gotousa:${SECRET}@127.0.0.1:5432/gotousa` };

describe("parseEnv", () => {
  it("aceita o mínimo e aplica os padrões (só no PC, porta 4000)", () => {
    expect(parseEnv(valid)).toEqual({ ...valid, API_HOST: "127.0.0.1", API_PORT: 4000 });
  });

  it("converte a porta de texto para número", () => {
    expect(parseEnv({ ...valid, API_PORT: "4100" }).API_PORT).toBe(4100);
  });

  it("diz qual variável falta, sem mostrar valores", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it("recusa endereço que não seja de PostgreSQL, sem vazar a senha", () => {
    const run = () => parseEnv({ DATABASE_URL: `mysql://u:${SECRET}@127.0.0.1/db` });
    expect(run).toThrow(/DATABASE_URL/);
    expect(run).not.toThrow(new RegExp(SECRET));
  });

  it("recusa escutar na rede (só o próprio PC)", () => {
    expect(() => parseEnv({ ...valid, API_HOST: "0.0.0.0" })).toThrow(/API_HOST/);
  });
});
