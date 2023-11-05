const cache: Record<string, Record<number, any>> = {};

export type PlaceName = {
  Name: string;
};

export type Territory = {
  PlaceName: PlaceName;
};

export type ToDo = {
  Text: string;
  Order: number;
};

export type TextData = {
  ToDo: ToDo[];
};

export type Expansion = {
  Name: string;
};

export type Quest = {
  Name: string;
  IconHD: string;
  TextData: TextData;
  ClassJobLevel0: number;
  IssuerLocation: {
    Territory: Territory;
  };
  Expansion: Expansion;
};

async function getSheet<T>(name: string, row: number) {
  if (cache[name] != null && cache[name][row] != null) {
    return cache[name][row] as T;
  }

  const req = await fetch(
    `https://xivapi.com/${name}/${row}?private_key=${process.env.XIVAPI_KEY}`
  );
  if (req.status !== 200) return null;

  const json = await req.json();

  if (cache[name] == null) cache[name] = {};
  cache[name][row] = json;
  return json as T;
}

export async function getQuest(row: number) {
  return await getSheet<Quest>("Quest", row);
}
