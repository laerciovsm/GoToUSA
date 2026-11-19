import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { ResetView } from "@/components/account/account-app";
import { accountsEnabled } from "@/lib/accounts";

/** Criar nova senha (link do e-mail). Só existe com o backend (ACCOUNTS_ENABLED). */
export default function Page() {
  if (!accountsEnabled()) notFound();
  return (
    <>
      <ResetView />
      <AppNav />
    </>
  );
}
