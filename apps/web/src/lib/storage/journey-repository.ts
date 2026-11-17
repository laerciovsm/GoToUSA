import { parseProgress, type JourneyProgress } from "@gotousa/shared";
import { idbGet, idbSet } from "./indexed-db";

/**
 * Camada de armazenamento do progresso da jornada (docs/telas.md, "Como os dados chegam à tela").
 * Hoje: só no navegador (IndexedDB). Depois do MVP: uma implementação que fala com a API.
 */
export interface JourneyRepository {
  /**
   * Carrega o progresso salvo. Retorna undefined se ainda não existe.
   * Lança InvalidProgressError se existe algo salvo que não é válido,
   * para a tela não sobrescrever (e perder) esses dados.
   */
  load(): Promise<JourneyProgress | undefined>;
  save(progress: JourneyProgress): Promise<void>;
}

export class InvalidProgressError extends Error {
  constructor() {
    super("Progresso da jornada salvo em formato inválido");
    this.name = "InvalidProgressError";
  }
}

const KEY = "journey";

export const browserJourneyRepository: JourneyRepository = {
  async load() {
    const raw = await idbGet(KEY);
    if (raw === undefined) return undefined;
    const progress = parseProgress(raw);
    if (!progress) throw new InvalidProgressError();
    return progress;
  },
  async save(progress) {
    await idbSet(KEY, progress);
  },
};
