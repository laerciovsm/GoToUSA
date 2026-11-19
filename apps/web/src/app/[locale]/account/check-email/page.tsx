import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { CheckEmailView } from "@/components/account/account-app";
import { accountsEnabled } from "@/lib/accounts";

/** Confira seu e-mail. Só existe com o backend (ACCOUNTS_ENABLED). */
export default function Page() {
  if (!accountsEnabled()) notFound();
  return (
    <>
      <CheckEmailView />
      <AppNav />
    </>
  );
}
