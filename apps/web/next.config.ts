import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseEnv } from "node:util";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** Cabeçalhos de segurança aplicados a todas as respostas. A CSP completa entra antes da publicação. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

/**
 * Lê do .env da raiz SÓ as chaves que o app usa (os segredos da API não entram no app).
 * Variáveis já definidas no sistema têm prioridade. Ver docs/backend-local.md.
 */
function rootEnv(key: string): string | undefined {
  if (process.env[key] !== undefined) return process.env[key];
  const file = join(process.cwd(), "..", "..", ".env");
  if (!existsSync(file)) return undefined;
  return parseEnv(readFileSync(file, "utf8"))[key];
}

/** Para onde o app repassa o /api/* (a API escuta só neste PC). Lido no build. */
const apiInternalUrl = (rootEnv("API_INTERNAL_URL") ?? "http://127.0.0.1:4000").replace(/\/+$/, "");

/** Mostra a seção Conta (só quando o backend existe). Lido no build. */
const accountsEnabled = rootEnv("ACCOUNTS_ENABLED") === "true" ? "true" : "false";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  env: { ACCOUNTS_ENABLED: accountsEnabled },
  transpilePackages: ["@gotousa/shared"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    // O celular só fala com a porta 3000: sem CORS e com a API fechada para a rede.
    return [{ source: "/api/:path*", destination: `${apiInternalUrl}/api/:path*` }];
  },
};

export default withNextIntl(nextConfig);
