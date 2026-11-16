import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/** Detecta o idioma do navegador e redireciona para /<idioma>/... */
export default createMiddleware(routing);

export const config = {
  // Ignora rotas internas e arquivos estáticos (qualquer caminho com ponto).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
