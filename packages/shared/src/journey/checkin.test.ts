import { describe, expect, it } from "vitest";
import { recordCheckin, resumeJourney, setTaskStatus } from "./progress.ts";
import { createProgress, parseProgress } from "./schema.ts";
import { completedPhases, pendingCheckin } from "./today.ts";
import type { Journey, JourneyTask } from "./types.ts";

const NOW = new Date(2026, 10, 17, 10, 0, 0);

const task = (key: string, phase: JourneyTask["phase"], status: JourneyTask["status"]): JourneyTask => ({
  key,
  taskId: key,
  personId: null,
  phase,
  stage: `${phase}.x`,
  themes: ["family"],
  type: "action",
  weight: "medium",
  essential: true,
  highlighted: false,
  due: null,
  dueRelative: null,
  state: "open",
  waitingFor: [],
  status,
  priority: false,
  hours: 1,
  executor: "family",
  executorDefault: "family",
});

const journeyWith = (tasks: JourneyTask[]): Journey => ({
  phases: [
    { id: "discovery", stages: ["discovery.x"] },
    { id: "planning", stages: ["planning.x"] },
    { id: "move", stages: [] },
  ],
  tasks,
  paths: [],
  missingBlocks: [],
  departure: null,
  arrival: null,
  start: "2026-11-17",
  reality: { kind: "no_departure" },
  nextStep: null,
});

describe("progresso versão 2: check-in, pausa e encerramento", () => {
  it("progresso da versão 1 é migrado sem perder nada", () => {
    const v2 = setTaskStatus(createProgress(NOW), "family-talk", "done", NOW);
    const { checkins: _c, pausedAt: _p, endedAt: _e, executors: _x, ...rest } = v2;
    const v1 = { ...rest, schemaVersion: 1 };
    const migrated = parseProgress(JSON.parse(JSON.stringify(v1)))!;
    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.tasks["family-talk"]!.status).toBe("done");
    expect(migrated).toMatchObject({ checkins: {}, pausedAt: null, endedAt: null, executors: {} });
  });

  it("progresso da versão 2 é migrado para a 3 sem perder nada", () => {
    const p = recordCheckin(setTaskStatus(createProgress(NOW), "family-talk", "done", NOW), "discovery", "pause", NOW);
    const { executors: _x, ...rest } = p;
    const migrated = parseProgress(JSON.parse(JSON.stringify({ ...rest, schemaVersion: 2 })))!;
    expect(migrated).toEqual(p);
  });

  it("pausar e encerrar ficam registrados; continuar e retomar limpam", () => {
    let p = recordCheckin(createProgress(NOW), "discovery", "pause", NOW);
    expect(p.pausedAt).toBe(NOW.toISOString());
    expect(p.checkins.discovery!.answer).toBe("pause");
    p = recordCheckin(p, "discovery", "end", NOW);
    expect(p).toMatchObject({ pausedAt: null, endedAt: NOW.toISOString() });
    p = resumeJourney(p);
    expect(p).toMatchObject({ pausedAt: null, endedAt: null });
    expect(parseProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
  });
});

describe("carimbos e convite de check-in", () => {
  it("fase só ganha carimbo com tarefas e todas concluídas ou 'não se aplica'", () => {
    const j = journeyWith([task("a", "discovery", "done"), task("b", "discovery", "na"), task("c", "planning", "doing")]);
    expect(completedPhases(j)).toEqual(["discovery"]); // "move" não tem tarefas: sem carimbo
  });

  it("o convite aparece para a fase concluída sem check-in", () => {
    const j = journeyWith([task("a", "discovery", "done")]);
    expect(pendingCheckin(j, createProgress(NOW))).toBe("discovery");
    expect(pendingCheckin(j, recordCheckin(createProgress(NOW), "discovery", "continue", NOW))).toBeNull();
  });
});
