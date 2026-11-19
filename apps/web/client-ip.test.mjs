import { describe, expect, it } from "vitest";
import { applyClientIp, CLIENT_IP_HEADER, normalizeIp } from "./client-ip.mjs";

describe("IP real do celular", () => {
  it("grava o IP da conexão", () => {
    const req = { headers: {}, socket: { remoteAddress: "192.168.0.10" } };
    applyClientIp(req);
    expect(req.headers[CLIENT_IP_HEADER]).toBe("192.168.0.10");
  });

  it("troca sempre o valor que veio de fora (não dá para falsificar)", () => {
    const req = { headers: { [CLIENT_IP_HEADER]: "1.2.3.4" }, socket: { remoteAddress: "192.168.0.11" } };
    applyClientIp(req);
    expect(req.headers[CLIENT_IP_HEADER]).toBe("192.168.0.11");
  });

  it("sem IP da conexão, apaga o valor de fora e não inventa nada", () => {
    const req = { headers: { [CLIENT_IP_HEADER]: "1.2.3.4" }, socket: {} };
    applyClientIp(req);
    expect(req.headers[CLIENT_IP_HEADER]).toBeUndefined();
  });

  it("tira o prefixo IPv6 de um IPv4", () => {
    expect(normalizeIp("::ffff:192.168.0.12")).toBe("192.168.0.12");
    expect(normalizeIp("::1")).toBe("::1");
    expect(normalizeIp("")).toBeUndefined();
  });
});
