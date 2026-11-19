import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { SignUpView } from "@/components/account/account-app";
import { accountsEnabled } from "@/lib/accounts";

/** Criar conta. Só existe com o backend (ACCOUNTS_ENABLED). */
export default function Page() {
  if (!accountsEnabled()) notFound();
  return (
    <>
      <SignUpView />
      <AppNav />
    </>
  );
}
