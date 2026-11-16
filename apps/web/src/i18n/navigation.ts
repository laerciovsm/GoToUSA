import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Versões de Link e do roteador que já entendem o idioma da URL. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
