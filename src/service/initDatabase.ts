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
  // DROP TABLE IF EXISTS categories;
  await db.execAsync(`
    DROP TABLE IF EXISTS dishes;

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
