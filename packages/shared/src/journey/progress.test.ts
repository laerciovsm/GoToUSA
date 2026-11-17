import { describe, expect, it } from "vitest";
import { emptyRecord, setTaskStatus, splitTaskKey, taskProgress, toggleSubtask, updateTask } from "./progress";
import { createProgress, parseProgress } from "./schema";

const NOW = new Date(2026, 10, 17, 10, 0, 0);

describe("progresso da jornada", () => {
  it("tarefa sem progresso começa vazia e o progresso anterior não muda", () => {
    const p = createProgress(NOW);
    expect(taskProgress(p, "family-talk").status).toBe("todo");
    const next = setTaskStatus(p, "family-talk", "done", NOW);
    expect(p.tasks["family-talk"]).toBeUndefined();
    expect(next.tasks["family-talk"]!.status).toBe("done");
    expect(next.tasks["family-talk"]!.doneAt).toBe(NOW.toISOString());
  });

  it("desfazer a conclusão limpa a data", () => {
    let p = setTaskStatus(createProgress(NOW), "family-talk", "done", NOW);
    p = setTaskStatus(p, "family-talk", "todo", NOW);
    expect(p.tasks["family-talk"]!.doneAt).toBeNull();
  });

  it("marcar a primeira subtarefa coloca a tarefa em andamento; desmarcar não volta", () => {
    let p = toggleSubtask(createProgress(NOW), "family-talk", "pick-moment");
    expect(p.tasks["family-talk"]).toMatchObject({ status: "doing", subtasks: ["pick-moment"] });
    p = toggleSubtask(p, "family-talk", "pick-moment");
    expect(p.tasks["family-talk"]).toMatchObject({ status: "doing", subtasks: [] });
  });

  it("subtarefa numa tarefa concluída não muda a situação", () => {
    let p = setTaskStatus(createProgress(NOW), "x", "done", NOW);
    p = toggleSubtask(p, "x", "a");
    expect(p.tasks["x"]!.status).toBe("done");
  });

  it("registro, plano e anotação ficam salvos e passam na validação", () => {
    const personId = "0b9e4d2c-1a3f-4c5d-8e6f-7a8b9c0d1e2f";
    let p = updateTask(createProgress(NOW), "family-talk", {
      plan: "terças, 20h",
      note: "levar o caderno",
      record: { ...(emptyRecord({ type: "agreement" }) as Extract<ReturnType<typeof emptyRecord>, { type: "agreement" }>), people: [personId], agreed: "yes" },
    });
    p = updateTask(p, `passport-check@${personId}`, {
      record: { type: "documents", items: { [`passport@${personId}`]: { state: "have", validUntil: "2030-05", note: "" } } },
    });
    expect(parseProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
  });

  it("chave da tarefa separa o ID da pessoa", () => {
    expect(splitTaskKey("family-talk")).toEqual({ taskId: "family-talk", personId: null });
    expect(splitTaskKey("care-plan@abc")).toEqual({ taskId: "care-plan", personId: "abc" });
  });
});
