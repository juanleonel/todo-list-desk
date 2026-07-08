import { getDB, scheduleSaveWithDebounce } from './sqljs-connection.js';

/**
 * @description Create the initial task scheme for app.
 */
export function createTable() {
  const db = getDB();
  db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
  `);
}

export function getAllTasks() {
  const db = getDB();
  const stmt = db.prepare('SELECT * FROM tasks ORDER BY completed ASC, created_at DESC');
  const tasks = [];

  while (stmt.step()) {
    tasks.push(stmt.getAsObject());
  }
  stmt.free();

  return tasks;
}

export function insertTask(text) {
  const db = getDB();
  db.run('INSERT INTO tasks (text) VALUES (?)', [text]);
  scheduleSaveWithDebounce();
}

export function updateTaskStatus(id) {
  const db = getDB();
  db.run('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id]);
  scheduleSaveWithDebounce();
}

export function removeTask(id) {
  const db = getDB();
  db.run('DELETE FROM tasks WHERE id = ?', [id]);
  scheduleSaveWithDebounce();
}
