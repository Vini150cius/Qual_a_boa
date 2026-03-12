import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("qual_a_boa.db");
  }

  return db;
}

const createDatabaseSchema = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
    DROP TABLE IF EXISTS categories;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export async function initDatabase() {
  try {
    const database = await getDatabase();
    await createDatabaseSchema(database);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao inicializar banco de dados",
    });
    throw error;
  }
}
