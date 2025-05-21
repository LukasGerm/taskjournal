import { load } from "@tauri-apps/plugin-store";

export async function getValue<T extends object>(
  key: string
): Promise<T | undefined> {
  const store = await load("store.json");

  return (await store.get(key)) as T | undefined;
}

export async function setValue<T extends object>(key: string, value: T) {
  const store = await load("store.json");
  await store.set(key, value);
}
