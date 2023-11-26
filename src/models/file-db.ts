import Dexie, { Table } from 'dexie';

export interface GraphFile {
  fileName: string;
  creatdAt: Date;
  updatedAt: Date;

  content: string;
}

export class GraphFileStorageDexie extends Dexie {
  files!: Table<GraphFile>;

  constructor() {
    super('file-storage');
    this.version(1).stores({
      files: '&fileName, creatdAt, updatedAt'
    });
  }
}

export const db = new GraphFileStorageDexie();

// first time launch this app, IndexedDB is empty.
// so, create a empty file

// after that IndexedDB is not empty
// so, should load last edited file

// to sum up, check local storage is empty or not
// if empty, create a new empty file
// otherwise, load last edited file

// whenever file is edited, save it to IndexedDB
// and update last edit file to local storage

const getUniqueFileName = (): Promise<string> => {
  return Promise.resolve(new Date(Date.now()).toLocaleString());
}

export const EDITING_FILE_PRIMARY_KEY = 'editing-file-name';
export const getEditingFile = async (): Promise<GraphFile> => {
  // if editing file is in local storage and valid, return it
  const key = localStorage.getItem(EDITING_FILE_PRIMARY_KEY);
  if (key !== null) {
    const file = await db.files.get(key);
    if (file !== undefined) return file;
  }

  // otherwise, create a new file in IndexedDB
  const newKey = await db.files.add({
    fileName: await getUniqueFileName(),
    creatdAt: new Date(),
    updatedAt: new Date(),
    content: '[]',
  }) as string;
  // update local storage
  localStorage.setItem(EDITING_FILE_PRIMARY_KEY, newKey);

  return await db.files.get(newKey) as GraphFile;
}

(window as unknown as any).clearStorage = () => {
  db.files.clear();
  localStorage.clear();
}