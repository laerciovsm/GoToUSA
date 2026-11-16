/**
 * Definição do questionário, conforme docs/questionario-perguntas.md (aprovado em 16/11/2026).
 * Os textos ficam nos arquivos de tradução; aqui ficam só IDs, tipos, opções e condições.
 */
import {
  autonomyAskedInHousehold,
  ctxAnswer as a,
  ctxPersonAnswer as p,
  includes,
  partnerIsGoing,
  personAge,
} from "./engine";
import type { Block, BlockItem, Question, QuestionContext } from "./types";

const ENGLISH_LEVELS = ["none", "basic", "intermediate", "advanced", "fluent"] as const;
const HIGHER_EDUCATION = new Set(["technical", "bachelor", "postgrad", "master", "doctorate"]);

const hasSelection = (value: unknown, none: string) =>
  Array.isArray(value) && value.length > 0 && !value.includes(none);

const hasJobOffer = (ctx: QuestionContext) =>
  includes(a(ctx, "goal.has"), "job_offer") || a(ctx, "goal.purpose") === "transfer";

/** Autonomia e cuidador: as mesmas perguntas (mesmo ID) no Bloco 3 e no Bloco 4. */
const autonomy = (when: (ctx: QuestionContext) => boolean): Question => ({
  id: "health.autonomy",
  type: "single",
  options: ["independent", "supervision", "help", "full"],
  when,
});

const caregiver = (when: (ctx: QuestionContext) => boolean): Question => ({
  id: "health.caregiver",
  type: "people",
  excludeSelf: true,
  extraOptions: ["external", "other"],
  when: (ctx) => when(ctx) && p(ctx, "health.autonomy") !== undefined && p(ctx, "health.autonomy") !== "independent",
});

/** Nos blocos "para completar", todas as perguntas podem ser puladas. */
function allOptional(items: readonly BlockItem[]): BlockItem[] {
  return items.map((item) =>
    "group" in item
      ? { ...item, questions: item.questions.map((q) => ({ ...q, optional: true })) }
      : { ...item, optional: true },
  );
}

const whyBlock: Block = {
  id: "why",
  number: 0,
  stage: "complete",
  minutes: 3,
  items: allOptional([
    {
      id: "why.reason",
      type: "multi",
      options: ["career", "safety", "education", "family", "quality", "income", "experience", "other"],
    },
    { id: "why.reasonOther", type: "text", when: (ctx) => includes(a(ctx, "why.reason"), "other") },
    { id: "why.reasonText", type: "text", long: true },
    { id: "why.expect", type: "text", long: true },
    {
      id: "why.fears",
      type: "multi",
      options: ["language", "money", "job", "family_left", "kids_adapt", "health", "legal", "loneliness", "other"],
    },
    { id: "why.fearsOther", type: "text", when: (ctx) => includes(a(ctx, "why.fears"), "other") },
    {
      id: "why.giveUp",
      type: "multi",
      options: ["near_family", "career_now", "comfort", "language_daily", "savings", "none_sure"],
      exclusive: ["none_sure"],
    },
  ]),
};

const youBlock: Block = {
  id: "you",
  number: 1,
  stage: "essential",
  minutes: 3,
  items: [
    { id: "you.nationalities", type: "countries" },
    { id: "you.residence", type: "country", prefillFrom: "you.nationalities" },
    { id: "you.birthYear", type: "number", min: 1900, maxValue: new Date().getFullYear() },
    { id: "you.languages", type: "languages", optional: true },
    { id: "you.english", type: "single", options: ENGLISH_LEVELS },
    {
      id: "you.education",
      type: "single",
      options: ["primary", "secondary", "technical", "bachelor", "postgrad", "master", "doctorate"],
    },
    {
      id: "you.field",
      type: "text",
      optional: true,
      when: (ctx) => HIGHER_EDUCATION.has(String(a(ctx, "you.education"))),
    },
    { id: "you.occupation", type: "text", optional: true },
    { id: "you.experienceYears", type: "number", min: 0, maxValue: 70, optional: true },
    { id: "you.regulated", type: "single", options: ["yes", "no", "unsure"] },
    {
      id: "you.workStatus",
      type: "single",
      options: ["employed", "business_owner", "self_employed", "remote_foreign", "student", "retired", "unemployed"],
    },
  ],
};

const goalBlock: Block = {
  id: "goal",
  number: 2,
  stage: "essential",
  minutes: 2,
  items: [
    {
      id: "goal.purpose",
      type: "single",
      options: [
        "work",
        "transfer",
        "study",
        "business",
        "family",
        "marriage",
        "retire",
        "academic",
        "talent",
        "exchange",
        "lottery",
        "protection",
        "unsure",
      ],
    },
    { id: "goal.duration", type: "single", options: ["lt6m", "6to12m", "1to3y", "3to5y", "permanent", "unsure"] },
    { id: "goal.departure", type: "monthYear", allowUnsure: true, range: "future" },
    {
      id: "goal.has",
      type: "multi",
      options: ["job_offer", "school_admission", "us_relative", "company_branch", "capital", "nothing"],
      exclusive: ["nothing"],
    },
    {
      id: "goal.sponsorship",
      type: "single",
      options: ["temporary", "greencard", "unsure"],
      when: (ctx) => ["work", "transfer"].includes(String(a(ctx, "goal.purpose"))) || includes(a(ctx, "goal.has"), "job_offer"),
    },
    {
      id: "goal.familyLink",
      type: "single",
      options: [
        "spouse_citizen",
        "spouse_resident",
        "parent_citizen",
        "parent_resident",
        "child_citizen",
        "sibling_citizen",
        "other",
      ],
      when: (ctx) => a(ctx, "goal.purpose") === "family" || includes(a(ctx, "goal.has"), "us_relative"),
    },
    {
      id: "goal.studyLevel",
      type: "single",
      options: ["language", "undergrad", "grad", "vocational", "exchange_hs"],
      when: (ctx) => a(ctx, "goal.purpose") === "study",
    },
    {
      id: "goal.investRange",
      type: "single",
      options: ["lt100k", "100to500k", "500kto1m", "gt1m", "unsure"],
      when: (ctx) => a(ctx, "goal.purpose") === "business",
    },
  ],
};

const isPartner = (ctx: QuestionContext) => ctx.person?.kind === "partner";

/**
 * Bloco 11 · Perfil profissional: aprofunda a carreira de você e do cônjuge.
 * Base para o "norte" dos caminhos de visto (docs/caminhos-visto.md). As opções de conquistas
 * espelham, em linguagem simples, os tipos de evidência listados pelo USCIS, sem afirmar qualificação.
 */
const careerBlock: Block = {
  id: "career",
  number: 11,
  stage: "complete",
  minutes: 4,
  items: allOptional([
    {
      group: "workers",
      questions: [
        { id: "career.nationalities", type: "countries", when: isPartner },
        {
          id: "career.education",
          type: "single",
          options: ["primary", "secondary", "technical", "bachelor", "postgrad", "master", "doctorate"],
          optionsFrom: "you.education",
          when: isPartner,
        },
        {
          id: "career.field",
          type: "text",
          when: (ctx) => isPartner(ctx) && HIGHER_EDUCATION.has(String(p(ctx, "career.education"))),
        },
        { id: "career.experienceYears", type: "number", min: 0, maxValue: 70, when: isPartner },
        {
          id: "career.regulated",
          type: "single",
          options: ["yes", "no", "unsure"],
          optionsFrom: "you.regulated",
          when: isPartner,
        },
        {
          id: "career.sector",
          type: "single",
          options: [
            "tech",
            "health",
            "engineering",
            "science",
            "education",
            "business",
            "finance",
            "law",
            "arts",
            "sports",
            "trades",
            "hospitality",
            "agriculture",
            "public",
            "other",
          ],
        },
        { id: "career.role", type: "text" },
        { id: "career.level", type: "single", options: ["entry", "mid", "senior", "manager", "executive", "owner"] },
        { id: "career.multinational", type: "single", options: ["yes", "no", "unsure"] },
        {
          id: "career.companyTime",
          type: "single",
          options: ["lt1y", "1to3y", "gt3y"],
          when: (ctx) => p(ctx, "career.multinational") === "yes",
        },
        {
          id: "career.achievements",
          type: "multi",
          options: [
            "awards",
            "associations",
            "media",
            "judge",
            "contributions",
            "publications",
            "exhibitions",
            "leading_role",
            "high_salary",
            "license_cert",
            "none",
          ],
          exclusive: ["none"],
        },
        { id: "career.usJobSearch", type: "single", options: ["not_yet", "searching", "interviews", "offer"] },
        { id: "career.sameField", type: "single", options: ["yes", "maybe", "change", "no_work"] },
      ],
    },
    {
      id: "career.principal",
      type: "single",
      options: ["me", "partner", "both", "unsure"],
      when: (ctx) => partnerIsGoing(ctx.record),
    },
  ]),
};

const householdBlock: Block = {
  id: "household",
  number: 3,
  stage: "essential",
  minutes: 4,
  items: [
    { id: "household.partner", type: "single", options: ["none", "going", "not_going", "undecided"] },
    {
      id: "household.partnerUnion",
      type: "single",
      options: ["civil_marriage", "stable_union", "informal", "other"],
      when: (ctx) => partnerIsGoing(ctx.record),
    },
    {
      id: "partner.english",
      type: "single",
      options: ENGLISH_LEVELS,
      optionsFrom: "you.english",
      optional: true,
      when: (ctx) => partnerIsGoing(ctx.record),
    },
    { id: "partner.occupation", type: "text", optional: true, when: (ctx) => partnerIsGoing(ctx.record) },
    { id: "household.children", type: "number", min: 0, maxValue: 20 },
    {
      group: "children",
      questions: [
        { id: "child.nickname", type: "text", optional: true },
        { id: "child.birth", type: "monthYear", range: "past" },
        {
          id: "child.school",
          type: "single",
          options: ["not_school", "preschool", "elementary", "high", "college", "finished", "special"],
        },
        { id: "child.specialNeeds", type: "single", options: ["yes", "no", "skip"] },
        autonomy((ctx) => p(ctx, "child.specialNeeds") === "yes"),
        caregiver((ctx) => p(ctx, "child.specialNeeds") === "yes"),
        { id: "child.english", type: "single", options: ENGLISH_LEVELS, optionsFrom: "you.english" },
      ],
    },
    {
      id: "household.otherChildren",
      type: "single",
      options: ["yes", "no"],
      when: (ctx) => Number(a(ctx, "household.children") ?? 0) > 0,
    },
    {
      id: "household.custody",
      type: "single",
      options: ["agrees", "disagrees", "unknown", "sole"],
      when: (ctx) => Number(a(ctx, "household.children") ?? 0) > 0 && a(ctx, "household.otherChildren") === "yes",
    },
    { id: "household.dependents", type: "number", min: 0, maxValue: 20 },
    {
      group: "dependents",
      questions: [
        { id: "dependent.nickname", type: "text", optional: true },
        { id: "dependent.relation", type: "single", options: ["parent", "grandparent", "sibling", "in_law", "other"] },
        { id: "dependent.birth", type: "monthYear", range: "past" },
        { id: "dependent.dependency", type: "single", options: ["full", "care", "financial", "partial"] },
        autonomy((ctx) => !!ctx.person && autonomyAskedInHousehold(ctx.record, ctx.person)),
        caregiver((ctx) => !!ctx.person && autonomyAskedInHousehold(ctx.record, ctx.person)),
      ],
    },
    {
      id: "household.pets",
      type: "multi",
      options: ["none", "dog", "cat", "bird", "other"],
      exclusive: ["none"],
    },
    {
      id: "household.petsCount",
      type: "number",
      min: 1,
      maxValue: 20,
      optional: true,
      when: (ctx) => hasSelection(a(ctx, "household.pets"), "none"),
    },
    { id: "household.leftBehind", type: "single", options: ["yes", "no"] },
    {
      id: "household.leftBehindWho",
      type: "text",
      optional: true,
      when: (ctx) => a(ctx, "household.leftBehind") === "yes",
    },
  ],
};

const healthBlock: Block = {
  id: "health",
  number: 4,
  stage: "complete",
  minutes: 5,
  items: allOptional([
    {
      group: "members",
      questions: [
        {
          id: "health.conditions",
          type: "multi",
          options: ["none", "autism", "intellectual", "adhd", "chronic", "mental", "mobility", "vision", "hearing", "other"],
          exclusive: ["none"],
        },
        {
          id: "health.autismLevel",
          type: "single",
          options: ["1", "2", "3", "unknown"],
          when: (ctx) => includes(p(ctx, "health.conditions"), "autism"),
        },
        {
          id: "health.intellectualDegree",
          type: "single",
          options: ["mild", "moderate", "severe", "profound", "unknown"],
          when: (ctx) => includes(p(ctx, "health.conditions"), "intellectual"),
        },
        autonomy((ctx) => !!ctx.person && !autonomyAskedInHousehold(ctx.record, ctx.person)),
        caregiver((ctx) => !!ctx.person && !autonomyAskedInHousehold(ctx.record, ctx.person)),
        { id: "health.medications", type: "medications" },
        {
          id: "health.therapies",
          type: "multi",
          options: ["none", "speech", "occupational", "physio", "psych", "aba", "dialysis", "other"],
          exclusive: ["none"],
        },
        { id: "health.equipment", type: "text" },
        { id: "health.specialists", type: "text", long: true },
        {
          id: "health.pregnancy",
          type: "single",
          options: ["current", "planned", "no"],
          when: (ctx) => {
            if (!ctx.person) return false;
            const age = personAge(ctx.record, ctx.person, ctx.now);
            return age === undefined ? ctx.person.kind !== "child" : age >= 18;
          },
        },
        { id: "health.vaccines", type: "single", options: ["yes", "no", "unsure"] },
      ],
    },
  ]),
};

const moneyBlock: Block = {
  id: "money",
  number: 5,
  stage: "complete",
  minutes: 5,
  items: allOptional([
    {
      id: "money.earnersNow",
      type: "multi",
      options: ["me", "partner", "adult_child", "other_member", "passive"],
    },
    {
      id: "money.earnersUS",
      type: "multi",
      options: ["me", "partner", "adult_child", "unsure"],
      exclusive: ["unsure"],
    },
    {
      id: "money.partnerAvailability",
      type: "single",
      options: ["yes", "partial", "no", "no_other"],
      when: (ctx) => partnerIsGoing(ctx.record),
    },
    {
      id: "money.otherSources",
      type: "multi",
      options: ["remote_home", "freelance", "online_business", "rent_home", "investments", "none", "unsure"],
      exclusive: ["none", "unsure"],
    },
    { id: "money.saved", type: "money" },
    { id: "money.monthlySaving", type: "money" },
    { id: "money.bring", type: "money", currency: "USD" },
    { id: "money.expectedIncomeUS", type: "money", currency: "USD", when: hasJobOffer },
    {
      id: "money.employerBenefits",
      type: "multi",
      options: ["health", "relocation", "housing", "visa_fees", "lawyer", "unsure"],
      exclusive: ["unsure"],
      when: hasJobOffer,
    },
    {
      id: "money.income",
      type: "multi",
      options: ["none", "remote_job", "rent", "pension", "business", "other"],
      exclusive: ["none"],
    },
    {
      id: "money.incomeMonthly",
      type: "money",
      currency: "USD",
      when: (ctx) => hasSelection(a(ctx, "money.income"), "none"),
    },
    {
      id: "money.housingPlan",
      type: "single",
      options: ["rent", "buy_cash", "buy_financed", "family", "employer", "unsure"],
    },
    { id: "money.carPlan", type: "single", options: ["none", "buy_cash", "buy_financed", "lease", "unsure"] },
    {
      id: "money.carCount",
      type: "number",
      min: 1,
      maxValue: 10,
      when: (ctx) => ["buy_cash", "buy_financed", "lease"].includes(String(a(ctx, "money.carPlan"))),
    },
    { id: "money.scoutingTrips", type: "single", options: ["none", "one", "two_plus", "unsure"] },
    {
      id: "money.scoutingPeople",
      type: "people",
      multiple: true,
      when: (ctx) => ["one", "two_plus"].includes(String(a(ctx, "money.scoutingTrips"))),
    },
    { id: "money.moveBelongings", type: "single", options: ["suitcases", "some_boxes", "shipment", "unsure"] },
    { id: "money.assets", type: "single", options: ["sell", "rent", "keep", "mixed", "none"] },
    { id: "money.debts", type: "single", options: ["yes", "no", "skip"] },
    {
      id: "money.debtsContinue",
      type: "single",
      options: ["yes", "no", "unsure"],
      when: (ctx) => a(ctx, "money.debts") === "yes",
    },
    {
      id: "money.debtsMonthly",
      type: "money",
      when: (ctx) => a(ctx, "money.debts") === "yes" && a(ctx, "money.debtsContinue") === "yes",
    },
    { id: "money.runway", type: "single", options: ["lt3", "3to6", "6to12", "gt12", "unsure"] },
  ]),
};

const prefBlock: Block = {
  id: "pref",
  number: 6,
  stage: "complete",
  minutes: 3,
  items: allOptional([
    { id: "pref.climate", type: "single", options: ["cold", "mild", "hot", "seasons", "any"] },
    { id: "pref.heat", type: "single", options: ["love", "ok", "hate"] },
    { id: "pref.snow", type: "single", options: ["love", "ok", "hate"] },
    { id: "pref.placeSize", type: "single", options: ["big_city", "mid_city", "suburb", "small_town", "rural", "any"] },
    { id: "pref.leisure", type: "multi", options: ["beach", "mountains", "outdoors", "culture", "nightlife", "quiet"] },
    { id: "pref.car", type: "single", options: ["yes", "no", "unsure"] },
    { id: "pref.pace", type: "single", options: ["fast", "balanced", "calm"] },
    { id: "pref.community", type: "single", options: ["yes", "some", "immersion"] },
    {
      id: "pref.familyPriorities",
      type: "multi",
      options: ["schools", "special_ed", "safety", "hospitals", "disability_services", "elder_care", "none"],
      exclusive: ["none"],
    },
  ]),
};

const destKnown = (ctx: QuestionContext) => ["yes", "some"].includes(String(a(ctx, "dest.known")));

const destBlock: Block = {
  id: "dest",
  number: 7,
  stage: "complete",
  minutes: 2,
  items: allOptional([
    { id: "dest.known", type: "single", options: ["yes", "some", "no"] },
    { id: "dest.places", type: "usStates", when: destKnown },
    { id: "dest.cities", type: "text", when: destKnown },
    { id: "dest.why", type: "text", long: true, when: destKnown },
    {
      id: "dest.criteria",
      type: "multi",
      max: 3,
      options: ["cost", "climate", "safety", "schools", "community", "jobs", "taxes", "transit", "near_people", "services"],
    },
  ]),
};

const historyBlock: Block = {
  id: "history",
  number: 8,
  stage: "complete",
  minutes: 1,
  items: allOptional([
    { id: "history.visited", type: "single", options: ["never", "once", "several"] },
    { id: "history.visa", type: "single", options: ["valid", "expired", "never"] },
    {
      id: "history.network",
      type: "multi",
      options: ["family", "friends", "colleagues", "nobody"],
      exclusive: ["nobody"],
    },
    { id: "history.complication", type: "single", options: ["no", "yes", "skip"] },
  ]),
};

const docsBlock: Block = {
  id: "docs",
  number: 9,
  stage: "complete",
  minutes: 2,
  items: allOptional([
    {
      group: "members",
      questions: [{ id: "docs.passport", type: "single", options: ["valid_long", "valid_short", "expired", "none"] }],
    },
    {
      id: "docs.certificates",
      type: "multi",
      options: ["birth", "marriage", "diplomas", "transcripts", "criminal", "medical_reports", "none"],
      exclusive: ["none"],
    },
    { id: "docs.driverLicense", type: "single", options: ["yes", "no"] },
  ]),
};

const rhythmBlock: Block = {
  id: "rhythm",
  number: 10,
  stage: "essential",
  minutes: 1,
  items: [
    { id: "rhythm.cadence", type: "single", options: ["daily", "3week", "weekly", "biweekly"] },
    { id: "rhythm.weeklyTime", type: "single", options: ["lt1h", "1to3h", "3to5h", "gt5h"] },
    {
      id: "rhythm.rewards",
      type: "multi",
      options: ["snack", "movie", "free_time", "walk", "game", "call", "other"],
      optional: true,
    },
    {
      id: "rhythm.rewardsOther",
      type: "text",
      optional: true,
      when: (ctx) => includes(a(ctx, "rhythm.rewards"), "other"),
    },
  ],
};

/**
 * Todos os blocos. O Bloco 11 (perfil profissional) vem logo depois do 0, para ser o primeiro
 * "para completar" depois do porquê: é a base do norte dos caminhos de visto.
 */
export const BLOCKS: readonly Block[] = [
  whyBlock,
  youBlock,
  goalBlock,
  householdBlock,
  careerBlock,
  healthBlock,
  moneyBlock,
  prefBlock,
  destBlock,
  historyBlock,
  docsBlock,
  rhythmBlock,
];

/** Ordem em que os blocos são apresentados: primeiro os essenciais, depois os "para completar". */
export const BLOCK_ORDER: readonly Block[] = [
  ...BLOCKS.filter((b) => b.stage === "essential"),
  ...BLOCKS.filter((b) => b.stage === "complete"),
];

export function getBlock(id: string): Block | undefined {
  return BLOCKS.find((b) => b.id === id);
}
