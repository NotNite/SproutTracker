const rowCache: Record<string, Record<number, any>> = {};
const sheetCache: Record<string, any> = {};

export type Sheet<T> = {
  rows: SheetRow<T>[];
};

export type SheetRow<T> = {
  row_id: number;
  fields: T;
};

export type Icon = {
  id: number;
  path: string;
  path_hr1: string;
};

export type TodoParam = {
  ToDoCompleteSeq: number;
};

export type QuestText = {
  unknown0: string;
  unknown4: string;
};

export type LevelSheet = {
  Territory: SheetRow<TerritoryTypeSheet>;
};

export type TerritoryTypeSheet = {
  PlaceName: SheetRow<PlaceNameSheet>;
};

export type PlaceNameSheet = {
  Name: string;
};

export type ExVersionSheet = {
  Name: string;
};

export type QuestSheet = {
  Id: string;
  Name: string;
  Icon?: Icon;
  ClassJobLevel: [number];
  IssuerLocation: SheetRow<LevelSheet>;
  Expansion: SheetRow<ExVersionSheet>;
  TodoParams: TodoParam[];
};

async function getSheet<T>(
  name: string,
  fields?: string[]
): Promise<SheetRow<T>[] | null> {
  if (sheetCache[name] != null) {
    return sheetCache[name] as SheetRow<T>[];
  }

  let url = `https://beta.xivapi.com/api/1/sheet/${name}`;
  if (fields != null) url += `?fields=${encodeURIComponent(fields.join(","))}`;

  const req = await fetch(url);
  if (req.status !== 200) return null;

  const json: Sheet<T> = await req.json();

  sheetCache[name] = json.rows;
  return json.rows;
}

async function getSheetRow<T>(
  name: string,
  row: number,
  fields?: string[]
): Promise<T | null> {
  if (rowCache[name] != null && rowCache[name][row] != null) {
    return rowCache[name][row] as T;
  }

  let url = `https://beta.xivapi.com/api/1/sheet/${name}/${row}`;
  if (fields != null) url += `?fields=${encodeURIComponent(fields.join(","))}`;

  const req = await fetch(url);
  if (req.status !== 200) return null;

  const json: SheetRow<T> = await req.json();

  if (rowCache[name] == null) rowCache[name] = {};
  rowCache[name][row] = json.fields;
  return json.fields;
}

export async function getQuest(row: number) {
  return await getSheetRow<QuestSheet>("Quest", row, [
    "Id",
    "Name",
    "Icon",
    "ClassJobLevel",
    "IssuerLocation.Territory.PlaceName.Name",
    "Expansion.Name"
  ]);
}

export async function getTodo(
  quest: QuestSheet
): Promise<Record<number, string> | null> {
  const parts = quest.Id.split("_");
  const number = parseInt(parts[1]);
  // KinGma102_04861 -> quest/048/KinGma102_04861
  const section = Math.floor(number / 100)
    .toString()
    .padStart(3, "0");
  const path = `quest/${section}/${quest.Id}`.replaceAll("/", "%2F");

  const sheet = await getSheet<QuestText>(path, ["unknown0", "unknown4"]);
  if (sheet == null) return null;

  const todo: Record<number, string> = {};

  for (const row of sheet) {
    const key = row.fields.unknown0; // TEXT_KINGMA102_04861_TODO_00
    const value = row.fields.unknown4;

    if (!key.includes("TODO")) continue;
    const parts = key.split("_");
    const idx = parseInt(parts[parts.length - 1]);
    if (idx == null || isNaN(idx)) continue;

    todo[idx] = value;
  }

  return todo;
}
