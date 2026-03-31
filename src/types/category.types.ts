export type CategoryItemProps = {
  title: string;
  quantity: number;
  imageUrl: string;
  id: string;
  onEditTitle?: (categoryId: string, title: string) => Promise<void> | void;
};

export type Category = {
  id: string;
  title: string;
  quantity: number;
  imageUrl?: string;
  created_at?: string;
};

export type CategoryContainerProps = {
  categories: Category[];
  onRefresh: () => void;
  onEditCategoryTitle?: (
    categoryId: string,
    title: string,
  ) => Promise<void> | void;
};
