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
};