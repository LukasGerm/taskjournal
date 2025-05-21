import OriginalDatabase, { QueryResult } from "@tauri-apps/plugin-sql";

let dbInstance: OriginalDatabase | null = null;
const DB_PATH = "sqlite:taskjournal.sqlite";

async function getDbInstance(): Promise<OriginalDatabase> {
  if (dbInstance === null) {
    dbInstance = await OriginalDatabase.load(DB_PATH);
  }

  return dbInstance;
}

export const executeCommand = async (
  sql: string,
  values?: unknown[]
): Promise<QueryResult> => {
  const db = await getDbInstance();
  return db.execute(sql, values);
};

export const createRecord = async (
  tableName: string,
  data: Record<string, any>
): Promise<void> => {
  const keys = Object.keys(data);
  const columns = keys.map((key) => `"${key}"`).join(", "); // Quote column names
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
  const values = Object.values(data);
  const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders})`; // Quote table name
  await executeCommand(query, values);
};

// For fetching a single record by ID
export const getRecordById = async <T>(
  tableName: string,
  id: string
): Promise<T | null> => {
  const db = await getDbInstance();
  const query = `SELECT * FROM ${tableName} WHERE id = $1`;
  const result = await db.select<T[]>(query, [id]); // db.select returns T[], so we expect an array
  return result.length > 0 ? result[0] : null;
};

// For fetching all records from a table
export const getAllRecords = async <T>(tableName: string): Promise<T[]> => {
  const db = await getDbInstance();
  const query = `SELECT * FROM "${tableName}"`;
  return db.select<T[]>(query);
};

// For updating records (typically uses UPDATE)
export const updateRecordById = async (
  tableName: string,
  id: string,
  data: Partial<Record<string, any>>
): Promise<void> => {
  const keys = Object.keys(data);
  const setClauses = keys.map((key, i) => `"${key}" = $${i + 1}`).join(", "); // Quote column names
  const values = Object.values(data);
  const query = `UPDATE "${tableName}" SET ${setClauses} WHERE "id" = $${keys.length + 1}`; // Also quote "id" in WHERE for consistency
  await executeCommand(query, [...values, id]);
};

// For deleting records (typically uses DELETE)
export const deleteRecordById = async (
  tableName: string,
  id: string
): Promise<void> => {
  const query = `DELETE FROM "${tableName}" WHERE "id" = $1`; // Also quote "id" in WHERE for consistency
  await executeCommand(query, [id]);
};

export const executeQuery = async <T>(
  sql: string,
  values?: unknown[]
): Promise<T[]> => {
  const db = await getDbInstance();
  return db.select<T[]>(sql, values);
};
