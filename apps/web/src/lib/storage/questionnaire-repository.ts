import { parseQuestionnaire, type QuestionnaireData } from "@gotousa/shared";
import { idbGet, idbSet } from "./indexed-db";

/**
 * Camada de armazenamento do questionário (ver docs/mvp.md, "Cuidados para adicionar o backend").
 * Hoje: só no navegador (IndexedDB). Depois do MVP: uma implementação que fala com a API.
 */
export interface QuestionnaireRepository {
  /**
   * Carrega o questionário salvo. Retorna undefined se ainda não existe.
   * Lança InvalidQuestionnaireError se existe algo salvo que não é válido,
   * para a tela não sobrescrever (e perder) esses dados.
   */
  load(): Promise<QuestionnaireData | undefined>;
  save(data: QuestionnaireData): Promise<void>;
}

export class InvalidQuestionnaireError extends Error {
  constructor() {
    super("Dados do questionário salvos em formato inválido");
    this.name = "InvalidQuestionnaireError";
  }
}

const KEY = "questionnaire";

export const browserQuestionnaireRepository: QuestionnaireRepository = {
  async load() {
    const raw = await idbGet(KEY);
    if (raw === undefined) return undefined;
    const data = parseQuestionnaire(raw);
    if (!data) throw new InvalidQuestionnaireError();
    return data;
  },
  async save(data) {
    await idbSet(KEY, data);
  },
};
