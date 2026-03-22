export type DishItemProps = {
  id: string;
  title: string;
  rank: number;
  imageURL: string;
};

export type Dish = {
  id: string;
  category_id: number;
  title: string;
  rank: number;
  recipe?: string | null;
  recipeUrl?: string | null;
  imageURL?: string | null;
};

export type DishRow = {
  id: number;
  category_id: number;
  title: string;
  rank: number | null;
  recipe: string | null;
  recipeUrl: string | null;
  imageURL: string | null;
};
