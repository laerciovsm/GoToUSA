/**
 * Listas de códigos usadas no questionário. Só códigos, nunca textos:
 * os nomes de países e idiomas são exibidos no idioma da pessoa com Intl.DisplayNames.
 */

/** Países e territórios (ISO 3166-1 alfa-2). */
export const COUNTRY_CODES: readonly string[] = (
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ " +
  "CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR " +
  "GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
  "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT " +
  "MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW " +
  "SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG " +
  "UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW"
).split(" ");

/** Idiomas mais falados no mundo (códigos BCP 47). A lista pode crescer sem mudar o código. */
export const LANGUAGE_CODES: readonly string[] = (
  "en es pt fr de it nl ru uk pl ro el tr ar he fa ur hi bn pa gu mr ta te kn ml ne si zh ja ko vi th id ms tl " +
  "sw am ha yo ig zu so km lo my mn kk uz az ka hy sq sr hr bs sl sk cs hu bg lt lv et fi sv no da is ga cy ca eu gl ht qu gn"
).split(" ");

/**
 * Estados dos EUA e Washington, D.C. (códigos postais oficiais).
 * Os nomes oficiais são mantidos em inglês, como os demais termos oficiais americanos.
 */
export const US_STATES: readonly { code: string; name: string }[] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"],
  ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"],
  ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
  ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"],
  ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"],
  ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"],
  ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
].map(([code, name]) => ({ code: code!, name: name! }));

/** Moedas mais comuns, mostradas primeiro na escolha de moeda (ISO 4217). */
export const COMMON_CURRENCIES: readonly string[] = [
  "USD", "BRL", "EUR", "MXN", "ARS", "COP", "CLP", "PEN", "UYU", "PYG", "BOB", "VES", "GBP", "CAD",
  "INR", "CNY", "JPY", "KRW", "PHP", "NGN", "ZAR",
];
