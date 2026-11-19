// IP real de quem acessa o app, repassado para a API (ver docs/backend-local.md, passo 3).
// Mantenha o nome do cabeçalho igual ao de apps/api/src/auth/schema-options.ts.

export const CLIENT_IP_HEADER = "x-gotousa-client-ip";

/** "::ffff:192.168.0.10" (IPv4 dentro de IPv6) → "192.168.0.10". */
export function normalizeIp(address) {
  if (typeof address !== "string" || address === "") return undefined;
  return address.startsWith("::ffff:") ? address.slice(7) : address;
}

/**
 * Apaga qualquer valor que tenha vindo de fora (ninguém consegue falsificar)
 * e grava o IP da conexão. Chamado antes de cada requisição chegar ao Next.js.
 */
export function applyClientIp(req) {
  delete req.headers[CLIENT_IP_HEADER];
  const ip = normalizeIp(req.socket?.remoteAddress);
  if (ip) req.headers[CLIENT_IP_HEADER] = ip;
}
