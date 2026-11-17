import { MoreApp } from "@/components/more/more-app";
import { AppNav } from "@/components/app-nav";

/** Aba "Mais": baixar e importar a jornada, ajustes, questionário, idioma e aviso legal. Tudo no navegador. */
export default function MorePage() {
  return (
    <>
      <MoreApp />
      <AppNav />
    </>
  );
}
