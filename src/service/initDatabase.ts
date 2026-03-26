import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let schemaPromise: Promise<void> | null = null;

export async function getDatabase() {
  if (db) {
    try {
      await db.getFirstAsync("SELECT 1");
      return db;
    } catch {
      db = null;
    }
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = SQLite.openDatabaseAsync("qual_a_boa.db")
    .then((database) => {
      db = database;
      return database;
    })
    .finally(() => {
      dbPromise = null;
    });

  return dbPromise;
}

const createDatabaseSchema = async (db: SQLite.SQLiteDatabase) => {
  // DROP TABLE IF EXISTS categories;
  // DROP TABLE IF EXISTS dishes;
  await db.execAsync(`

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      rank INTEGER DEFAULT 0,
      recipe TEXT,
      recipeUrl TEXT,
      imageURL TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);
};

export async function initDatabase() {
  if (schemaPromise) {
    return schemaPromise;
  }

  schemaPromise = (async () => {
    try {
      const database = await getDatabase();
      await createDatabaseSchema(database);
    } catch (error) {
      db = null;
      console.error("Error initializing database:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao inicializar banco de dados",
      });
      throw error;
    }
  })().finally(() => {
    schemaPromise = null;
  });

  return schemaPromise;
}
