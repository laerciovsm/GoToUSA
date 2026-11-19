/** A seção Conta só existe quando o backend existe (ACCOUNTS_ENABLED=true no .env, lido no build). */
export function accountsEnabled(): boolean {
  return process.env.ACCOUNTS_ENABLED === "true";
}
