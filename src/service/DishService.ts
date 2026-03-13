import type { Dish } from "../types/dish.types";
import { getDatabase } from "./initDatabase";

export async function createDish(dish: Dish): Promise<Dish> {
  const db = await getDatabase();

  try {
    const result = await db.runAsync(
      "INSERT INTO dishes (category_id, title, rank, recipe, recipeUrl) VALUES (?, ?, ?, ?, ?)",
      [dish.category_id, dish.title, dish.rank, dish.recipe || null, dish.recipeUrl || null],
    );

    return {
      ...dish,
      id: String(result.lastInsertRowId ?? dish.id),
    };
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    throw error;
  }
}