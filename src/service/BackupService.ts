import { getDatabase, initDatabase } from "./initDatabase";

type CategoryBackupRow = {
  id: number;
  title: string;
  imageUrl: string;
  quantity: number | null;
  created_at: string | null;
};

type DishBackupRow = {
  id: number;
  category_id: number;
  title: string;
  rank: number | null;
  recipe: string | null;
  recipeUrl: string | null;
  imageURL: string | null;
  created_at: string | null;
};

type BackupPayload = {
  version: number;
  exportedAt: string;
  categories: CategoryBackupRow[];
  dishes: DishBackupRow[];
};

const BACKUP_VERSION = 1;
const FALLBACK_IMAGE = "https://via.placeholder.com/150";

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function buildDishKey(dish: {
  category_id: number;
  title: string;
  rank: number | null;
  recipe: string | null;
  recipeUrl: string | null;
}) {
  return [
    String(dish.category_id),
    normalize(dish.title),
    String(dish.rank ?? 0),
    normalize(dish.recipe),
    normalize(dish.recipeUrl),
  ].join("||");
}

export async function exportDatabaseBackup(): Promise<string> {
  await initDatabase();
  const db = await getDatabase();

  const categories = await db.getAllAsync<CategoryBackupRow>(
    "SELECT id, title, imageUrl, quantity, created_at FROM categories ORDER BY id ASC",
  );
  const dishes = await db.getAllAsync<DishBackupRow>(
    "SELECT id, category_id, title, rank, recipe, recipeUrl, imageURL, created_at FROM dishes ORDER BY id ASC",
  );

  const payload: BackupPayload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    categories,
    dishes,
  };

  return JSON.stringify(payload, null, 2);
}

export async function importAndMergeBackup(rawJson: string): Promise<{
  insertedCategories: number;
  insertedDishes: number;
}> {
  await initDatabase();
  const db = await getDatabase();

  let payload: BackupPayload;
  try {
    payload = JSON.parse(rawJson) as BackupPayload;
  } catch {
    throw new Error("Arquivo de backup invalido. JSON mal formatado.");
  }

  if (!Array.isArray(payload.categories) || !Array.isArray(payload.dishes)) {
    throw new Error("Arquivo de backup invalido. Estrutura inesperada.");
  }

  let insertedCategories = 0;
  let insertedDishes = 0;

  await db.withTransactionAsync(async () => {
    const existingCategories = await db.getAllAsync<{
      id: number;
      title: string;
    }>("SELECT id, title FROM categories");

    const categoryByNormalizedTitle = new Map<string, number>();
    for (const category of existingCategories) {
      categoryByNormalizedTitle.set(normalize(category.title), category.id);
    }

    const categoryIdMap = new Map<number, number>();

    for (const incomingCategory of payload.categories) {
      const normalizedTitle = normalize(incomingCategory.title);
      if (!normalizedTitle) {
        continue;
      }

      const existingId = categoryByNormalizedTitle.get(normalizedTitle);
      if (existingId) {
        categoryIdMap.set(incomingCategory.id, existingId);
        continue;
      }

      const result = await db.runAsync(
        "INSERT INTO categories (title, imageUrl, quantity) VALUES (?, ?, 0)",
        [
          incomingCategory.title.trim(),
          incomingCategory.imageUrl || FALLBACK_IMAGE,
        ],
      );

      const newCategoryId = Number(result.lastInsertRowId);
      categoryByNormalizedTitle.set(normalizedTitle, newCategoryId);
      categoryIdMap.set(incomingCategory.id, newCategoryId);
      insertedCategories += 1;
    }

    const existingDishes = await db.getAllAsync<{
      category_id: number;
      title: string;
      rank: number | null;
      recipe: string | null;
      recipeUrl: string | null;
    }>("SELECT category_id, title, rank, recipe, recipeUrl FROM dishes");

    const existingDishKeys = new Set<string>();
    for (const dish of existingDishes) {
      existingDishKeys.add(buildDishKey(dish));
    }

    for (const incomingDish of payload.dishes) {
      const mappedCategoryId = categoryIdMap.get(incomingDish.category_id);
      if (!mappedCategoryId) {
        continue;
      }

      const incomingTitle = incomingDish.title?.trim();
      if (!incomingTitle) {
        continue;
      }

      const candidate = {
        category_id: mappedCategoryId,
        title: incomingTitle,
        rank: incomingDish.rank ?? 0,
        recipe: incomingDish.recipe ?? null,
        recipeUrl: incomingDish.recipeUrl ?? null,
      };

      const dishKey = buildDishKey(candidate);
      if (existingDishKeys.has(dishKey)) {
        continue;
      }

      await db.runAsync(
        "INSERT INTO dishes (category_id, title, rank, recipe, recipeUrl, imageURL) VALUES (?, ?, ?, ?, ?, ?)",
        [
          mappedCategoryId,
          candidate.title,
          candidate.rank,
          candidate.recipe,
          candidate.recipeUrl,
          incomingDish.imageURL || FALLBACK_IMAGE,
        ],
      );

      existingDishKeys.add(dishKey);
      insertedDishes += 1;
    }

    await db.runAsync(`
      UPDATE categories
      SET quantity = (
        SELECT COUNT(*)
        FROM dishes
        WHERE dishes.category_id = categories.id
      )
    `);
  });

  return {
    insertedCategories,
    insertedDishes,
  };
}
