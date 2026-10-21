import type { PatrolEscapeLevel, PatrolEscapeVehicle } from "@/lib/patrol-escape";

const police: PatrolEscapeVehicle = {
  id: "police",
  label: "Police escape car",
  row: 2,
  col: 0,
  length: 2,
  orientation: "horizontal",
  color: "police",
};

function level(
  id: number,
  title: string,
  difficulty: PatrolEscapeLevel["difficulty"],
  par: number,
  vehicles: PatrolEscapeVehicle[],
): PatrolEscapeLevel {
  return { id, title, difficulty, par, vehicles: [{ ...police }, ...vehicles] };
}

function masterLevel(title: string, vehicles: PatrolEscapeVehicle[]): PatrolEscapeLevel {
  return {
    id: 0,
    title,
    difficulty: "Master",
    par: 0,
    vehicles: [{ ...police, col: 4 }, ...vehicles],
  };
}

const patrolEscapeLevelTemplates: PatrolEscapeLevel[] = [
  level(1, "First Call", "Easy", 5, [
    { id: "gate-van", label: "Blue gate van", row: 1, col: 2, length: 2, orientation: "vertical", color: "blue" },
    { id: "taxi-a", label: "Amber taxi", row: 0, col: 3, length: 2, orientation: "horizontal", color: "amber" },
    { id: "sedan-a", label: "Green sedan", row: 4, col: 0, length: 2, orientation: "horizontal", color: "green" },
  ]),
  level(2, "Lower Deck", "Easy", 5, [
    { id: "gate-van", label: "Blue gate van", row: 2, col: 3, length: 2, orientation: "vertical", color: "blue" },
    { id: "taxi-a", label: "Amber taxi", row: 0, col: 0, length: 2, orientation: "horizontal", color: "amber" },
    { id: "truck-a", label: "Slate truck", row: 5, col: 1, length: 3, orientation: "horizontal", color: "slate" },
  ]),
  level(3, "Twin Barriers", "Easy", 7, [
    { id: "gate-van", label: "Blue gate van", row: 1, col: 2, length: 2, orientation: "vertical", color: "blue" },
    { id: "gate-taxi", label: "Amber gate taxi", row: 2, col: 4, length: 2, orientation: "vertical", color: "amber" },
    { id: "sedan-a", label: "Green sedan", row: 5, col: 0, length: 2, orientation: "horizontal", color: "green" },
  ]),
  level(4, "Long Shift", "Medium", 8, [
    { id: "gate-truck", label: "Blue gate truck", row: 0, col: 2, length: 3, orientation: "vertical", color: "blue" },
    { id: "gate-van", label: "Rose gate van", row: 1, col: 5, length: 2, orientation: "vertical", color: "rose" },
    { id: "sedan-a", label: "Green sedan", row: 4, col: 3, length: 2, orientation: "horizontal", color: "green" },
  ]),
  level(5, "Roof Block", "Medium", 7, [
    { id: "gate-van", label: "Blue gate van", row: 1, col: 2, length: 2, orientation: "vertical", color: "blue" },
    { id: "roof-car", label: "Amber roof car", row: 0, col: 1, length: 2, orientation: "horizontal", color: "amber" },
    { id: "sedan-a", label: "Green sedan", row: 4, col: 1, length: 2, orientation: "horizontal", color: "green" },
  ]),
  level(6, "Basement Block", "Medium", 8, [
    { id: "gate-van", label: "Blue gate van", row: 2, col: 3, length: 2, orientation: "vertical", color: "blue" },
    { id: "floor-car", label: "Violet floor car", row: 4, col: 2, length: 2, orientation: "horizontal", color: "violet" },
    { id: "taxi-a", label: "Amber taxi", row: 0, col: 3, length: 2, orientation: "horizontal", color: "amber" },
  ]),
  level(7, "Split Detail", "Hard", 10, [
    { id: "gate-left", label: "Blue left van", row: 1, col: 2, length: 2, orientation: "vertical", color: "blue" },
    { id: "gate-right", label: "Rose right van", row: 2, col: 4, length: 2, orientation: "vertical", color: "rose" },
    { id: "roof-car", label: "Amber roof car", row: 0, col: 1, length: 2, orientation: "horizontal", color: "amber" },
    { id: "floor-car", label: "Green floor car", row: 4, col: 3, length: 2, orientation: "horizontal", color: "green" },
  ]),
  level(8, "Three Lanes", "Hard", 10, [
    { id: "gate-a", label: "Blue gate van", row: 1, col: 2, length: 2, orientation: "vertical", color: "blue" },
    { id: "gate-b", label: "Amber gate van", row: 2, col: 3, length: 2, orientation: "vertical", color: "amber" },
    { id: "gate-c", label: "Green gate van", row: 1, col: 5, length: 2, orientation: "vertical", color: "green" },
    { id: "floor-car", label: "Violet floor car", row: 4, col: 2, length: 2, orientation: "horizontal", color: "violet" },
  ]),
  level(9, "Boxed In", "Hard", 12, [
    { id: "gate-a", label: "Blue gate van", row: 1, col: 2, length: 2, orientation: "vertical", color: "blue" },
    { id: "gate-b", label: "Rose gate truck", row: 0, col: 4, length: 3, orientation: "vertical", color: "rose" },
    { id: "roof-car", label: "Amber roof car", row: 0, col: 1, length: 2, orientation: "horizontal", color: "amber" },
    { id: "floor-car", label: "Green floor truck", row: 4, col: 1, length: 3, orientation: "horizontal", color: "green" },
  ]),
  level(10, "Cross Traffic", "Expert", 14, [
    { id: "gate-a", label: "Blue gate truck", row: 0, col: 2, length: 3, orientation: "vertical", color: "blue" },
    { id: "gate-b", label: "Amber gate van", row: 2, col: 4, length: 2, orientation: "vertical", color: "amber" },
    { id: "floor-car", label: "Green floor car", row: 4, col: 3, length: 2, orientation: "horizontal", color: "green" },
    { id: "lower-car", label: "Violet lower car", row: 5, col: 0, length: 3, orientation: "horizontal", color: "violet" },
  ]),
  level(11, "Night Convoy", "Expert", 15, [
    { id: "gate-a", label: "Blue gate van", row: 1, col: 2, length: 2, orientation: "vertical", color: "blue" },
    { id: "gate-b", label: "Rose gate van", row: 2, col: 3, length: 2, orientation: "vertical", color: "rose" },
    { id: "gate-c", label: "Amber gate van", row: 1, col: 5, length: 2, orientation: "vertical", color: "amber" },
    { id: "roof-car", label: "Slate roof car", row: 0, col: 1, length: 2, orientation: "horizontal", color: "slate" },
    { id: "floor-car", label: "Green floor car", row: 4, col: 2, length: 2, orientation: "horizontal", color: "green" },
  ]),
  level(12, "Final Dispatch", "Expert", 18, [
    { id: "gate-a", label: "Blue gate truck", row: 0, col: 2, length: 3, orientation: "vertical", color: "blue" },
    { id: "gate-b", label: "Rose gate van", row: 2, col: 3, length: 2, orientation: "vertical", color: "rose" },
    { id: "gate-c", label: "Amber gate truck", row: 0, col: 5, length: 3, orientation: "vertical", color: "amber" },
    { id: "floor-car", label: "Green floor truck", row: 4, col: 2, length: 3, orientation: "horizontal", color: "green" },
    { id: "lower-car", label: "Violet lower car", row: 5, col: 0, length: 2, orientation: "horizontal", color: "violet" },
  ]),
  masterLevel("Dense Alpha", [
    { id: "a-v1", label: "Blue tower truck", row: 0, col: 0, length: 3, orientation: "vertical", color: "blue" },
    { id: "a-v2", label: "Amber north van", row: 0, col: 1, length: 2, orientation: "vertical", color: "amber" },
    { id: "a-h1", label: "Green roof car", row: 0, col: 2, length: 2, orientation: "horizontal", color: "green" },
    { id: "a-v3", label: "Rose center truck", row: 1, col: 2, length: 3, orientation: "vertical", color: "rose" },
    { id: "a-v4", label: "Violet gate van", row: 1, col: 3, length: 2, orientation: "vertical", color: "violet" },
    { id: "a-h2", label: "Slate west car", row: 3, col: 0, length: 2, orientation: "horizontal", color: "slate" },
    { id: "a-h3", label: "Amber middle truck", row: 4, col: 1, length: 3, orientation: "horizontal", color: "amber" },
    { id: "a-v5", label: "Green east truck", row: 3, col: 5, length: 3, orientation: "vertical", color: "green" },
    { id: "a-h4", label: "Blue floor truck", row: 5, col: 0, length: 3, orientation: "horizontal", color: "blue" },
  ]),
];

const districtNames = [
  "Harbor",
  "Midtown",
  "Riverside",
  "Market",
  "Station",
  "Parkside",
  "Old Town",
  "Airport",
  "Hillcrest",
  "West End",
];

const missionNames = [
  "Dispatch",
  "Detour",
  "Gridlock",
  "Crossing",
  "Night Shift",
  "Roadblock",
  "Rush Hour",
  "Convoy",
  "Clearance",
  "Breakout",
];

const masterTitles = [
  "Terminal Lock",
  "Midnight Grid",
  "Command Block",
  "Harbor Siege",
  "Downtown Knot",
  "Convoy Trap",
  "Station Maze",
  "Eastside Lock",
  "Airport Standstill",
  "Market Deadlock",
  "Bridge Closure",
  "Tunnel Tangle",
  "Central Jam",
  "Nightwatch Grid",
  "Cross-Town Lock",
  "Dispatch Maze",
  "Patrol Deadlock",
  "Metro Standstill",
  "Final Roadblock",
  "Master Clearance",
];

function difficultyForLevel(id: number): PatrolEscapeLevel["difficulty"] {
  if (id <= 20) return "Easy";
  if (id <= 45) return "Medium";
  if (id <= 75) return "Hard";
  if (id <= 100) return "Expert";
  return "Master";
}

type EncodedLevel = readonly [templateIndex: number, positions: string, par: number];

const encodedLevels: readonly EncodedLevel[] = [
  [0,"20120340",5],[2,"20420453",4],[9,"2012044052",7],[2,"20320450",4],[7,"2022234541",7],[6,"2012140340",7],[1,"20130153",5],[1,"21130253",5],[8,"2012340240",6],[10,"203233450340",4],
  [10,"201213050042",6],[0,"20120142",6],[7,"2002330541",4],[0,"20320240",4],[7,"2102132541",5],[7,"2002030542",4],[9,"2022044353",5],[6,"2242240344",5],[6,"2022340441",6],[6,"2002240344",7],
  [9,"2002044151",10],[10,"202223050144",6],[10,"200223250342",7],[10,"213223150440",6],[7,"2042132543",6],[10,"201213050040",6],[8,"2202040043",7],[7,"2002131543",6],[10,"204213150140",6],[9,"2002044351",9],
  [9,"2022044051",7],[1,"20130351",6],[8,"2012240440",6],[10,"201213150042",7],[9,"2002344053",7],[8,"2012240340",6],[10,"203223150143",7],[7,"2012031540",6],[10,"202203150444",8],[8,"2012240041",6],
  [9,"2012044350",9],[6,"2032240044",6],[3,"20123542",7],[9,"2002044051",9],[9,"2002444051",10],[10,"203223250444",8],[3,"20022544",9],[10,"201223350143",8],[10,"201223150443",9],[3,"20121541",8],
  [8,"2132140243",13],[9,"2012044050",9],[9,"2002244453",9],[8,"2002040043",9],[9,"2002244351",11],[9,"2012144150",11],[9,"2022144051",8],[9,"2012244051",9],[9,"2002444250",13],[8,"2132040043",13],
  [11,"203213154353",10],[8,"2022140241",9],[9,"2012244451",10],[9,"2002244050",11],[9,"2012144452",8],[9,"2012044051",8],[9,"2002244352",10],[8,"2022140141",9],[9,"2012444151",10],[11,"202223154351",13],
  [9,"2022244352",8],[11,"202213154350",11],[10,"202223250243",9],[9,"2002044252",9],[9,"2012044150",10],[11,"200213154154",16],[11,"203223054353",12],[9,"2002144251",11],[11,"201213354251",16],[8,"2032040243",13],
  [11,"200203254150",15],[11,"200213254150",16],[8,"2232140243",14],[11,"201203054254",14],[8,"2032140243",12],[8,"2022140143",11],[9,"2002344050",10],[8,"2042140043",12],[11,"201203154351",12],[11,"201203254254",14],
  [11,"201203154253",12],[11,"201223154250",14],[11,"201203154151",14],[11,"200203054052",17],[11,"200213054252",16],[8,"2022040143",12],[11,"200203154350",12],[8,"2142040143",15],[11,"201223054354",15],[11,"200223054354",16],
  [12,"21102444233200500511",27],[12,"22150130004243531402",32],[12,"20134053240102300541",22],[12,"21254243041011533100",23],[12,"21052444003203502311",28],
  [12,"20153044142251103303",20],[12,"23010012223344520502",23],[12,"22211452350210322003",24],[12,"20121341051402533033",20],[12,"20154202300011530443",20],
  [12,"21041033253240000351",20],[12,"20302334054401411251",29],[12,"22304202254133100453",20],[12,"21044243202310010553",23],[12,"20053253134044101400",25],
  [12,"20353201300443101352",21],[12,"20152240134253001410",21],[12,"21043000053251430333",25],[12,"20134010044253012530",32],[12,"21154244031411001053",29],
];

function decodeLevel([templateIndex, positions, par]: EncodedLevel, index: number): PatrolEscapeLevel {
  const id = index + 1;
  const template = patrolEscapeLevelTemplates[templateIndex];
  const vehicles = template.vehicles.map((vehicle, vehicleIndex) => ({
    ...vehicle,
    row: Number(positions[vehicleIndex * 2]),
    col: Number(positions[vehicleIndex * 2 + 1]),
  }));

  return {
    id,
    title: id === 1
      ? "First Call"
      : id > 100
        ? masterTitles[id - 101]
        : `${districtNames[(id - 1) % districtNames.length]} ${missionNames[Math.floor((id - 1) / districtNames.length)]}`,
    difficulty: difficultyForLevel(id),
    par,
    vehicles,
  };
}

export const patrolEscapeLevels: PatrolEscapeLevel[] = encodedLevels.map(decodeLevel);
