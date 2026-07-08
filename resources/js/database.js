let db = null;
let isInitialized = false;

export async function initDB() {
    if (isInitialized) return; // Evitar reinicializaciones

    const SQL = await initSqlJs({ locateFile: file => `js/${file}` });
    
    // Obtenemos la ruta home del usuario
    const homePath = await Neutralino.os.getEnv("HOME");
    const dbPath = `${homePath}/todolist.db`;

    console.log(dbPath)
    let data = null;

    try {
        data = await Neutralino.filesystem.readBinaryFile(dbPath);
    } catch (error) {
        console.log("No se encontró BD, se creará una nueva.");
    }

    if (data && data.byteLength > 0) {
        db = new SQL.Database(new Uint8Array(data));
    } else {
        db = new SQL.Database();
    }

    // CREAR LA TABLA SIEMPRE AL INICIO (IF NOT EXISTS es seguro)
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Guardar inmediatamente para asegurar que el archivo y la tabla existan
    await saveDB();
    
    isInitialized = true;
    console.log("✅ Base de datos inicializada correctamente.");
}

export async function saveDB() {
    if (!db) return;
    
    const homePath = await Neutralino.os.getEnv("HOME");
    const dbPath = `${homePath}/todolist.db`;
    
    const data = db.export();
    await Neutralino.filesystem.writeBinaryFile(dbPath, data);
}

export function getTasks() {
    if (!db) return [];
    // Asegurarnos de que la tabla existe antes de consultar (por seguridad)
    try {
        const stmt = db.prepare("SELECT * FROM tasks ORDER BY completed ASC, created_at DESC");
        const tasks = [];
        while (stmt.step()) {
            tasks.push(stmt.getAsObject());
        }
        stmt.free();
        return tasks;
    } catch (e) {
        console.error("Error al obtener tareas:", e);
        return [];
    }
}

export function addTask(text) {
    if (!db) return;
    db.run("INSERT INTO tasks (text) VALUES (?)", [text]);
    saveDB();
}

export function toggleTask(id) {
    if (!db) return;
    db.run("UPDATE tasks SET completed = NOT completed WHERE id = ?", [id]);
    saveDB();
}

export function deleteTask(id) {
    if (!db) return;
    db.run("DELETE FROM tasks WHERE id = ?", [id]);
    saveDB();
}