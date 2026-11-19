import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { SignInView } from "@/components/account/account-app";
import { accountsEnabled } from "@/lib/accounts";

/** Entrar. Só existe com o backend (ACCOUNTS_ENABLED). */
export default function Page() {
  if (!accountsEnabled()) notFound();
  return (
    <>
      <SignInView />
      <AppNav />
    </>
  );
}
