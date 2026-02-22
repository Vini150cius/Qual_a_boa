export type Screen =
  | "home"
  | "categories"
  | "addDish"
  | "favorites"
  | "settings";

export interface HeaderProps {
  screen: Screen;
  title: string;
  onBackPress?: () => void;
  onSearchChangeText?: (text: string) => void;
  onSearchSubmit?: (text: string) => void;
  searchPlaceholder?: string;
}
