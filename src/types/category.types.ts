export type CategoryItemProps = {
  title: string;
  quantity: number;
  imageUrl: string;
  id: string;
};

export type Category = {
  id: string;
  title: string;
  quantity: number;
  imageUrl?: string;
  created_at?: string;
};
