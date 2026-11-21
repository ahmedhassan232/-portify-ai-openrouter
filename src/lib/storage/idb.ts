const DB = "portify", STORE = "kv";
function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((res, rej) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => { db.close(); res(req.result); };
    req.onerror = () => { db.close(); rej(req.error); };
  });
}
export const idbGet = <T,>(k: string) => tx<T | undefined>("readonly", (s) => s.get(k));
export const idbSet = (k: string, v: unknown) => tx("readwrite", (s) => s.put(v, k));
export const idbDel = (k: string) => tx("readwrite", (s) => s.delete(k));
