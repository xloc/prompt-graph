import Dexie, { Table } from 'dexie';

export interface GraphFile {
  id?: number;

  fileName: string;
  createAt: Date;
  updateAt: Date;

  content: string;
}

export class GraphFileStorageDexie extends Dexie {
  files!: Table<GraphFile>;

  constructor() {
    super('file-storage');
    this.version(1).stores({
      files: '++id, &fileName, creatdAt, updatedAt'
    });
  }
}

export const db = new GraphFileStorageDexie();



export const getNewFileName = async (name?: string): Promise<string> => {
  name = name ?? 'Untitled';

  // if name is unique, return it
  const exist = await db.files.where('fileName').equals(name).first();
  if (!exist) return name;

  // otherwise, add next ID to it
  const lastAdded = await db.files.orderBy('id').last();
  const lastID = lastAdded?.id ?? -1;
  return `${name} ${(lastID + 1)}`
}

export const createNewFile = async (): Promise<GraphFile> => {
  const newIntID = await db.files.add({
    fileName: await getNewFileName(),
    createAt: new Date(),
    updateAt: new Date(),
    content: '[]',
  }) as string;
  const file = await db.files.get(newIntID);
  return file!;
}

export const EDITING_FILE_PRIMARY_KEY = 'editing-file-id';
export const getEditingFile = async (): Promise<GraphFile> => {
  // if editing file is in local storage and valid, return it
  const getExistingFile = async () => {
    const key = localStorage.getItem(EDITING_FILE_PRIMARY_KEY);
    if (key === null) return;
    const intKey = parseInt(key);
    if (isNaN(intKey)) return;
    const file = await db.files.get(intKey);
    if (file !== undefined) return file;
  }
  const existingFile = await getExistingFile();
  if (existingFile) return existingFile;

  // otherwise, create a new file in IndexedDB
  const newFile = await createNewFile();
  // update local storage
  localStorage.setItem(EDITING_FILE_PRIMARY_KEY, newFile.id!.toString());

  return newFile
}

(window as unknown as any).clearStorage = () => {
  db.files.clear();
  localStorage.clear();
}

