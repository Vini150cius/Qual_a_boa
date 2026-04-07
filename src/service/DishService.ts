import Toast from "react-native-toast-message";
import type { Dish, DishRow } from "../types/dish.types";
import { getDatabase, initDatabase } from "./initDatabase";
import axios from "axios";
import { fuzzyNameMatch } from "./searchUtils";

const unsplashAccessKey = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

async function resolveDishImageUrl(
  dishTitle: string,
  recipeUrl?: string | null,
): Promise<string> {
  let imageURL = "https://via.placeholder.com/150";

  if (recipeUrl) {
    const videoId = getYoutubeVideoId(recipeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  if (!unsplashAccessKey) {
    throw new Error(
      "Está faltando a chave de acesso do Unsplash. Verifique as variáveis de ambiente.",
    );
  }

  const response = await axios.get("https://api.unsplash.com/search/photos", {
    params: {
      client_id: unsplashAccessKey,
      query: dishTitle,
      per_page: 1,
    },
  });

  imageURL = response.data.results[0]?.urls?.small ?? imageURL;
  return imageURL;
}

function getYoutubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (hostname.endsWith("youtube.com")) {
      const watchId = parsedUrl.searchParams.get("v");
      if (watchId) {
        return watchId;
      }

      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      const embedIndex = pathParts.findIndex(
        (part) => part === "embed" || part === "shorts",
      );

      if (embedIndex >= 0 && pathParts[embedIndex + 1]) {
        return pathParts[embedIndex + 1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function createDish(dish: Dish): Promise<Dish> {
  const imageURL = await resolveDishImageUrl(dish.title, dish.recipeUrl);

  await initDatabase();
  const db = await getDatabase();

  try {
    const result = await db.runAsync(
      "INSERT INTO dishes (category_id, title, rank, recipe, recipeUrl, imageURL) VALUES (?, ?, ?, ?, ?, ?)",
      [
        dish.category_id,
        dish.title,
        dish.rank,
        dish.recipe || null,
        dish.recipeUrl || null,
        imageURL,
      ],
    );

    await db.runAsync(
      `
      UPDATE categories
      SET quantity = (
        SELECT COUNT(*)
        FROM dishes
        WHERE category_id = ?
      )
      WHERE id = ?
      `,
      [dish.category_id, dish.category_id],
    );

    return {
      ...dish,
      id: String(result.lastInsertRowId ?? dish.id),
      imageURL,
    };
  } catch (error) {
    console.error("Erro ao adicionar prato:", error);
    throw error;
  }
}

export async function updateDish(dish: Dish): Promise<Dish> {
  await initDatabase();
  const db = await getDatabase();

  const imageURL = await resolveDishImageUrl(dish.title, dish.recipeUrl);

  try {
    await db.runAsync(
      "UPDATE dishes SET title = ?, rank = ?, recipe = ?, recipeUrl = ?, imageURL = ? WHERE id = ?",
      [
        dish.title,
        dish.rank,
        dish.recipe || null,
        dish.recipeUrl || null,
        imageURL,
        dish.id,
      ],
    );

    return {
      ...dish,
      imageURL,
    };
  } catch (error) {
    console.error("Erro ao atualizar prato:", error);
    throw error;
  }
}

export async function deleteDish(dishId: string): Promise<void> {
  await initDatabase();
  const db = await getDatabase();

  try {
    const dish = await db.getFirstAsync<{ category_id: number }>(
      "SELECT category_id FROM dishes WHERE id = ?",
      [dishId],
    );

    if (!dish) {
      return;
    }

    await db.runAsync("DELETE FROM dishes WHERE id = ?", [dishId]);

    await db.runAsync(
      `
      UPDATE categories
      SET quantity = (
        SELECT COUNT(*)
        FROM dishes
        WHERE category_id = ?
      )
      WHERE id = ?
      `,
      [dish.category_id, dish.category_id],
    );
  } catch (error) {
    console.error("Erro ao excluir prato:", error);
    throw error;
  }
}

export async function fetchDishes(
  category_id: string,
  searchText: string = "",
): Promise<Dish[]> {
  await initDatabase();
  const db = await getDatabase();
  try {
    const result = await db.getAllAsync<DishRow>(
      "SELECT id, category_id, title, rank, recipe, recipeUrl, imageURL FROM dishes WHERE category_id = ? ORDER BY created_at DESC",
      [category_id],
    );

    const mappedDishes = result.map((dish) => ({
      id: String(dish.id),
      category_id: dish.category_id,
      title: dish.title,
      rank: dish.rank ?? 0,
      recipe: dish.recipe,
      recipeUrl: dish.recipeUrl,
      imageURL: dish.imageURL,
    }));

    return mappedDishes.filter((dish) =>
      fuzzyNameMatch(searchText, dish.title),
    );
  } catch (error) {
    console.error("Erro ao buscar pratos:", error);
    Toast.show({
      type: "error",
      text1: "Erro ao buscar pratos",
    });
    throw error;
  }
}
