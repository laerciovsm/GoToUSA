import { describe, expect, it } from "vitest";
import { backupFileName, createBackup, parseBackup } from "./backup.ts";
import { setTaskStatus } from "./journey/progress.ts";
import { createProgress } from "./journey/schema.ts";
import { createQuestionnaire, setAnswer } from "./questionnaire/engine.ts";

const NOW = new Date(2026, 10, 17, 10, 0, 0);

describe("baixar e importar a jornada", () => {
  const questionnaire = setAnswer(createQuestionnaire(NOW), "goal.purpose", "work", undefined, NOW);
  const progress = setTaskStatus(createProgress(NOW), "family-talk", "done", NOW);

  it("o arquivo baixado volta igual ao importar", () => {
    const text = JSON.stringify(createBackup(questionnaire, progress, NOW));
    const result = parseBackup(text);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.backup.questionnaire).toEqual(questionnaire);
      expect(result.backup.progress).toEqual(progress);
    }
  });

  it("aceita arquivo sem progresso (só o questionário)", () => {
    const result = parseBackup(JSON.stringify(createBackup(questionnaire, null, NOW)));
    expect(result.ok && result.backup.progress).toBeNull();
  });

  it("recusa o que não é um arquivo válido do GoToUSA", () => {
    expect(parseBackup("isto não é json")).toEqual({ ok: false, error: "not_json" });
    expect(parseBackup(JSON.stringify({ hello: "world" }))).toEqual({ ok: false, error: "not_gotousa" });
    const broken = { ...createBackup(questionnaire, progress, NOW), questionnaire: { schemaVersion: 99 } };
    expect(parseBackup(JSON.stringify(broken))).toEqual({ ok: false, error: "invalid" });
    expect(parseBackup("x".repeat(3 * 1024 * 1024))).toEqual({ ok: false, error: "too_big" });
  });

  it("nome do arquivo com a data", () => {
    expect(backupFileName(NOW)).toBe("gotousa-jornada-2026-11-17.json");
  });
});
