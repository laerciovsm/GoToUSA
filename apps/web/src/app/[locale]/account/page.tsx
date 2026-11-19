import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { AccountHome } from "@/components/account/account-app";
import { accountsEnabled } from "@/lib/accounts";

/** Conta: entrar e criar conta, ou sair e apagar. Só existe com o backend (ACCOUNTS_ENABLED). */
export default function Page() {
  if (!accountsEnabled()) notFound();
  return (
    <>
      <AccountHome />
      <AppNav />
    </>
  );
}
