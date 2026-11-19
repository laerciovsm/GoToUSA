import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { ForgotView } from "@/components/account/account-app";
import { accountsEnabled } from "@/lib/accounts";

/** Esqueci a senha. Só existe com o backend (ACCOUNTS_ENABLED). */
export default function Page() {
  if (!accountsEnabled()) notFound();
  return (
    <>
      <ForgotView />
      <AppNav />
    </>
  );
}
