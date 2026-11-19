// Servidor próprio do app (recurso oficial "custom server" do Next.js).
// Existe só para gravar o IP real do celular num cabeçalho que a API usa no
// limite de tentativas de login. Ver docs/backend-local.md (passo 3).
//
// Uso: node server.mjs [-H <endereço>] [-p <porta>]   (padrão: 127.0.0.1 e 3000)
// Para a rede de casa: pnpm --filter @gotousa/web start -H 0.0.0.0 -p 3000
import { createServer } from "node:http";
import { applyClientIp } from "./client-ip.mjs";

process.env.NODE_ENV ??= "production";

function option(short, long) {
  const args = process.argv.slice(2);
  const i = args.findIndex((a) => a === short || a === long);
  return i >= 0 ? args[i + 1] : undefined;
}

const hostname = option("-H", "--hostname") ?? "127.0.0.1";
const port = Number(option("-p", "--port") ?? 3000);

const { default: next } = await import("next");
const app = next({ dev: false, hostname, port, dir: import.meta.dirname });
await app.prepare();
const handle = app.getRequestHandler();

createServer((req, res) => {
  applyClientIp(req);
  handle(req, res);
}).listen(port, hostname, () => {
  console.log(`> GoToUSA em http://${hostname}:${port}`);
});
