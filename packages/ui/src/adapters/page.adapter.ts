import { Page } from "shared/src/generated";
import {
  createRecord,
  getRecordById,
  getAllRecords,
  updateRecordById,
  deleteRecordById,
  executeQuery,
} from "../lib/db";

const TABLE_NAME = "pages";

// Create a new page
export const createPage = async (
  pageData: Omit<Page, "id"> & { id?: string }
): Promise<Page> => {
  const id = pageData.id || crypto.randomUUID();
  const dataToInsert = { ...pageData, id };
  await createRecord(TABLE_NAME, dataToInsert);

  const newPage = await getPageById(id);
  if (!newPage) {
    throw new Error("Failed to create or retrieve page after creation.");
  }
  return newPage;
};

// Get a page by its ID
export const getPageById = async (id: string): Promise<Page | null> => {
  return getRecordById<Page>(TABLE_NAME, id);
};

// Get all pages
export const getAllPages = async (): Promise<Page[]> => {
  return getAllRecords<Page>(TABLE_NAME);
};

// Get all pages for a specific user
export const getAllPagesByUserId = async (userId: string): Promise<Page[]> => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE userId = ?`;
  return executeQuery<Page>(query, [userId]);
};

// Update a page by its ID
export const updatePage = async (
  id: string,
  pageData: Partial<Omit<Page, "id">>
): Promise<Page | null> => {
  await updateRecordById(TABLE_NAME, id, pageData);
  // Similar to create, updateRecordById doesn't return the updated record.
  // Fetch it to return the updated state.
  return getPageById(id);
};

// Delete a page by its ID
export const deletePage = async (id: string): Promise<void> => {
  await deleteRecordById(TABLE_NAME, id);
};

// Update a page title by its ID
export const updatePageTitle = async (
  id: string,
  title: string
): Promise<Page | null> => {
  return updatePage(id, { title });
};
