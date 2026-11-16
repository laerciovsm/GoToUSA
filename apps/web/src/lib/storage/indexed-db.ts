/**
 * Armazenamento chave-valor mínimo sobre o IndexedDB do navegador.
 * Usado só pelos repositórios desta pasta; as telas nunca acessam o IndexedDB diretamente.
 */
const DB_NAME = "gotousa";
const DB_VERSION = 1;
const STORE = "kv";

let dbPromise: Promise<IDBDatabase> | undefined;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") {
        reject(new Error("IndexedDB indisponível"));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    // Se falhar (ex.: navegação privada), permite tentar de novo depois.
    dbPromise.catch(() => {
      dbPromise = undefined;
    });
  }
  return dbPromise;
}

function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = action(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(request.result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      }),
  );
}

export function idbGet(key: string): Promise<unknown> {
  return run("readonly", (store) => store.get(key));
}

export async function idbSet(key: string, value: unknown): Promise<void> {
  await run("readwrite", (store) => store.put(value, key));
}
