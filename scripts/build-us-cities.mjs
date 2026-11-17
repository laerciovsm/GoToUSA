/**
 * Gera as listas de cidades de cada estado dos EUA a partir da fonte oficial:
 * U.S. Census Bureau, "City and Town Population Totals: 2020-2025" (Vintage 2025, publicada em 14/05/2026),
 * arquivo SUB-EST2025 (estimativa da população residente em 1º de julho de 2025).
 * Página: https://www.census.gov/data/datasets/time-series/demo/popest/2020s-total-cities-and-towns.html
 *
 * Saída: apps/web/public/data/us-cities/<UF>.json, uma lista por estado, da maior para a menor cidade.
 * Só entram "incorporated places" (SUMLEV 162) e, no Havaí, que não tem cidades incorporadas, o CDP oficial.
 * Áreas não incorporadas (CDPs) de outros estados não entram neste arquivo do Census.
 *
 * Como rodar (na raiz): pnpm data:cities
 * Quando o Census publicar uma nova edição, troque SOURCE_URL, VINTAGE e POP_COLUMN e rode de novo.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_URL = "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/cities/totals/sub-est2025.csv";
const SOURCE_PAGE = "https://www.census.gov/data/datasets/time-series/demo/popest/2020s-total-cities-and-towns.html";
const VINTAGE = "Vintage 2025 (população estimada em 1º de julho de 2025)";
const POP_COLUMN = "POPESTIMATE2025";
const OUT_DIR = join(import.meta.dirname, "..", "apps", "web", "public", "data", "us-cities");

/** Mesmos nomes de US_STATES (packages/shared/src/questionnaire/data.ts). */
const STATE_CODES = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT",
  Delaware: "DE", "District of Columbia": "DC", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID",
  Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME",
  Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO",
  Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
  "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR",
  Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN",
  Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

/** Tipo legal que o Census acrescenta ao nome ("Seattle city" → "Seattle"). */
const LEGAL_SUFFIX =
  / (city and borough|consolidated government( \(balance\))?|metropolitan government( \(balance\))?|metro government( \(balance\))?|unified government( \(balance\))?|urban county|city \(balance\)|municipality|corporation|borough|village|town|city|CDP)$/;

/** Divide uma linha CSV respeitando campos entre aspas. */
function parseCsvLine(line) {
  const out = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { out.push(field); field = ""; }
    else field += ch;
  }
  out.push(field);
  return out;
}

const response = await fetch(SOURCE_URL);
if (!response.ok) throw new Error(`Falha ao baixar ${SOURCE_URL}: ${response.status}`);
const csv = new TextDecoder("latin1").decode(await response.arrayBuffer());
const [header, ...lines] = csv.split(/\r?\n/).filter(Boolean);
const columns = parseCsvLine(header);
const col = (name) => {
  const index = columns.indexOf(name);
  if (index < 0) throw new Error(`Coluna ${name} não encontrada no arquivo do Census`);
  return index;
};
const [SUMLEV, PLACE, NAME, STNAME, POP] = ["SUMLEV", "PLACE", "NAME", "STNAME", POP_COLUMN].map(col);

const byState = {};
for (const line of lines) {
  const c = parseCsvLine(line);
  // Só lugares (SUMLEV 162). As linhas "(balance)" (FUNCSTAT F) são a parte principal das cidades
  // consolidadas com o condado (ex.: Nashville, Indianapolis, Louisville) e por isso entram.
  if (c[SUMLEV] !== "162") continue;
  const code = STATE_CODES[c[STNAME]];
  if (!code) continue;
  const name = c[NAME].replace(LEGAL_SUFFIX, "").trim();
  (byState[code] ??= []).push([c[PLACE], name, Number(c[POP])]);
}

mkdirSync(OUT_DIR, { recursive: true });
const retrieved = new Date().toISOString().slice(0, 10);
let total = 0;
for (const code of Object.values(STATE_CODES)) {
  const cities = (byState[code] ?? []).sort((a, b) => b[2] - a[2]);
  total += cities.length;
  const data = {
    source: "U.S. Census Bureau, City and Town Population Totals (SUB-EST2025)",
    sourceUrl: SOURCE_PAGE,
    vintage: VINTAGE,
    retrieved,
    /** [código do lugar no Census, nome, população estimada] */
    cities,
  };
  writeFileSync(join(OUT_DIR, `${code}.json`), JSON.stringify(data));
}
console.log(`${total} cidades em ${Object.keys(STATE_CODES).length} arquivos, em ${OUT_DIR}`);
