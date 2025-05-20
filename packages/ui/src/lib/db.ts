import OriginalDatabase, { QueryResult } from "@tauri-apps/plugin-sql";

// This is a simplified DB instance manager. Adapt to your project's setup.
let dbInstance: OriginalDatabase | null = null;
const DB_PATH = "sqlite:taskjournal.db"; // Replace with your actual database path

async function getDbInstance(): Promise<OriginalDatabase> {
  if (dbInstance === null) {
    dbInstance = await OriginalDatabase.load(DB_PATH);
  }
  return dbInstance;
}

// For INSERT, UPDATE, DELETE commands that don't need to return the affected rows in a specific format
// other than what QueryResult provides.
export const executeCommand = async (
  sql: string,
  values?: unknown[]
): Promise<QueryResult> => {
  const db = await getDbInstance();
  return db.execute(sql, values);
};

// For creating records (typically uses INSERT)
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
  // Quote table name for consistency, though less critical for SELECT * if tableName is simple
  const query = `SELECT * FROM "${tableName}"`;
  return db.select<T[]>(query);
};

// For updating records (typically uses UPDATE)
export const updateRecordById = async (
  tableName: string,
  id: string,
  data: Partial<Record<string, any>>
): Promise<void> => {
  // Assuming no specific return needed
  const keys = Object.keys(data);
  const setClauses = keys.map((key, i) => `"${key}" = $${i + 1}`).join(", "); // Quote column names
  const values = Object.values(data);
  // Quote table name
  const query = `UPDATE "${tableName}" SET ${setClauses} WHERE "id" = $${keys.length + 1}`; // Also quote "id" in WHERE for consistency
  await executeCommand(query, [...values, id]);
};

// For deleting records (typically uses DELETE)
export const deleteRecordById = async (
  tableName: string,
  id: string
): Promise<void> => {
  // Quote table name
  const query = `DELETE FROM "${tableName}" WHERE "id" = $1`; // Also quote "id" in WHERE for consistency
  await executeCommand(query, [id]);
};

// This function is used for SELECT queries that return multiple rows.
// It should be generic and use db.select<T[]>().
export const executeQuery = async <T>(
  sql: string,
  values?: unknown[]
): Promise<T[]> => {
  const db = await getDbInstance();
  return db.select<T[]>(sql, values);
};
