import {
  del as idbDelete,
  entries as idbEntries,
  get as idbGet,
  set as idbSet,
} from "idb-keyval";

export async function get<T>(key: string): Promise<T | undefined> {
  return idbGet<T>(key);
}

export async function set<T>(key: string, value: T): Promise<void> {
  await idbSet(key, value);
}

export async function remove(key: string): Promise<void> {
  await idbDelete(key);
}

export async function list<T>(prefix = ""): Promise<Array<[string, T]>> {
  const rows = await idbEntries<string, T>();

  if (!prefix) {
    return rows;
  }

  return rows.filter(([key]) => key.startsWith(prefix));
}
