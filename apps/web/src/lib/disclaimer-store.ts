import {
  DISCLAIMER_VERSION,
  isValidDisclaimerAcceptance,
  type DisclaimerAcceptance,
} from "@gotousa/shared";

/**
 * Guarda o aceite do aviso legal no navegador.
 * Se o armazenamento estiver bloqueado (ex.: aba anônima restrita), o aceite vale só até fechar a página.
 */
const KEY = "gotousa.disclaimer";

const listeners = new Set<() => void>();
let memoryValue: string | null = null;

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeDisclaimer(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

/** Retorna o texto bruto salvo (estável entre chamadas, como o React exige). */
export function getDisclaimerSnapshot(): string | null {
  try {
    return window.localStorage.getItem(KEY) ?? memoryValue;
  } catch {
    return memoryValue;
  }
}

export function getDisclaimerServerSnapshot(): string | null {
  return null;
}

export function parseDisclaimer(raw: string | null): DisclaimerAcceptance | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return isValidDisclaimerAcceptance(value) ? value : null;
  } catch {
    return null;
  }
}

export function acceptDisclaimer() {
  const value: DisclaimerAcceptance = {
    version: DISCLAIMER_VERSION,
    acceptedAt: new Date().toISOString(),
  };
  const raw = JSON.stringify(value);
  memoryValue = raw;
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    // Armazenamento indisponível: mantém só em memória.
  }
  notify();
}
