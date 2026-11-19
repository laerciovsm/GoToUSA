import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { InviteView } from "@/components/account/invite-view";
import { accountsEnabled } from "@/lib/accounts";

/** Link do convite para uma jornada. Só existe com o backend (ACCOUNTS_ENABLED). */
export default function Page() {
  if (!accountsEnabled()) notFound();
  return (
    <>
      <InviteView />
      <AppNav />
    </>
  );
}
