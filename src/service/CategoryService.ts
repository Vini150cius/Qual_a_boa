import Toast from "react-native-toast-message";
import type { Category } from "../types/category.types";
import { getDatabase, initDatabase } from "./initDatabase";
import axios from "axios";
import { fuzzyNameMatch } from "./searchUtils";

const unsplashAccessKey = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

type CategoryRow = {
  id: number;
  title: string;
  quantity: number | null;
  imageUrl: string;
  created_at: string | null;
};

export async function fetchCategories(searchText: string = "") {
  await initDatabase();
  const db = await getDatabase();

  try {
    const result = await db.getAllAsync<CategoryRow>(
      "SELECT id, title, quantity, imageUrl, created_at FROM categories ORDER BY created_at DESC",
    );

    const mappedCategories = result.map((category) => ({
      id: String(category.id),
      title: category.title,
      quantity: category.quantity ?? 0,
      imageUrl: category.imageUrl,
      created_at: category.created_at ?? undefined,
    }));

    return mappedCategories.filter((category) =>
      fuzzyNameMatch(searchText, category.title),
    );
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar categorias",
    });
    throw error;
  }
}

export async function createCategory(category: Category): Promise<Category> {
  if (!unsplashAccessKey) {
    throw new Error(
      "Está faltando a chave de acesso do Unsplash. Verifique as variáveis de ambiente.",
    );
  }

  const response = await axios.get("https://api.unsplash.com/search/photos", {
    params: {
      client_id: unsplashAccessKey,
      query: category.title,
      per_page: 1,
    },
  });

  const imageUrl =
    response.data.results[0]?.urls?.small ??
    category.imageUrl ??
    "https://via.placeholder.com/150";

  await initDatabase();
  const db = await getDatabase();
  try {
    const result = await db.runAsync(
      "INSERT INTO categories (title, imageUrl, quantity) VALUES (?, ?, ?)",
      [category.title, imageUrl, category.quantity || 0],
    );

    return {
      ...category,
      id: String(result.lastInsertRowId ?? category.id),
      imageUrl,
      created_at: category.created_at ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    throw error;
  }
}
