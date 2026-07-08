import { isNullOrUndefined, isStringEmpty } from './utils.functions.js'

let dbInstance = null;
let dbPath = null;
let saveTimeout = null;

function checkConfig(config) {
  if (isNullOrUndefined(config)) {
    throw Error('The config cannot be null')
  }

  if (isNullOrUndefined(config.homePath) || isStringEmpty(config.homePath)) {
    throw Error('The homePath cannot be null or empty')
  }

  if (isNullOrUndefined(config.dbName) || isStringEmpty(config.homePath)) {
    throw Error('The dbName cannot be null or empty')
  }
}

export async function initConnection(config = { homePath, dbName }) {
    checkConfig(config);

    const SQL = await initSqlJs({ locateFile: file => `js/${file}` });
    dbPath = `${config.homePath}/${config.dbName}`;

    try {
      const data = await Neutralino.filesystem.readBinaryFile(dbPath);
      dbInstance = new SQL.Database(new Uint8Array(data));
    } catch (error) {
      console.log('Initializing a new database connection');
      dbInstance = new SQL.Database();
    }
    await persistToDisk();

    return dbInstance;
}

export function getDB() {
    if (!dbInstance) {
      throw new Error('The database has not been initialized');
    }

    return dbInstance;
}

export function scheduleSaveWithDebounce() {
  const timeOut = 500;

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    persistToDisk();
  }, timeOut);
}

async function persistToDisk() {
  if (!dbInstance || !dbPath) {
    return;
  }

  try {
    const data = dbInstance.export();
    await Neutralino.filesystem.writeBinaryFile(dbPath, data);
  } catch (error) {
    console.error('Error to save in disk:', JSON.stringify(error));
  }
}
