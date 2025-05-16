import Dexie from "dexie";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

// Create a simple Dexie database to store the persisted client
class QueryPersistenceDB extends Dexie {
  queryCache!: Dexie.Table<{ key: string; value: PersistedClient }, string>;

  constructor() {
    super("ReactQueryPersistence");
    this.version(1).stores({
      queryCache: "key",
    });
  }
}

const db = new QueryPersistenceDB();

/**
 * Creates a Dexie-based persister for React Query
 * @param persistKey The key under which to store the persisted client
 */
export function createDexiePersister(
  persistKey: string = "reactQuery",
): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await db.queryCache.put({ key: persistKey, value: client });
      } catch (error) {
        console.error("Error persisting react-query cache:", error);
      }
    },

    restoreClient: async () => {
      try {
        const record = await db.queryCache.get(persistKey);
        return record?.value;
      } catch (error) {
        console.error("Error restoring react-query cache:", error);
        return undefined;
      }
    },

    removeClient: async () => {
      try {
        await db.queryCache.delete(persistKey);
      } catch (error) {
        console.error("Error removing react-query cache:", error);
      }
    },
  };
}
