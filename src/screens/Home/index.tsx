import { useState } from "react";
import { ScrollView } from "react-native";
import { styles } from "./style";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import { SortedCard } from "../../components/sortedCard";
import { CategoryContainer } from "../../components/categoryContainer";
import { AddButton } from "../../components/addButton";
import type { Category } from "../../types/category.types";

const initialCategories: Category[] = [
  {
    id: "1",
    title: "Jantares",
    quantity: 42,
    imageUrl:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=880&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Almoço",
    quantity: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=880&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Sobremesa",
    quantity: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=880&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Salgados",
    quantity: 34,
    imageUrl:
      "https://images.unsplash.com/photo-1626776876729-bab4369a5a5d?q=80&w=880&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Café da manhã",
    quantity: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1626776876729-bab4369a5a5d?q=80&w=880&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Lanches",
    quantity: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1626776876729-bab4369a5a5d?q=80&w=880&auto=format&fit=crop",
  },
];

export default function Home() {
  const { theme } = useTheme();
  const [categories, setCategories] = useState(initialCategories);

  function handleCreateCategory(categoryName: string) {
    const formattedName = categoryName.trim();
    if (!formattedName) {
      return;
    }

    setCategories((previous) => [
      {
        id: String(Date.now()),
        title: formattedName,
        quantity: 0,
        imageUrl:
          "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=880&auto=format&fit=crop",
      },
      ...previous,
    ]);
  }

  return (
    <>
      <Header screen="home" title="Home" />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <SortedCard />
        <CategoryContainer categories={categories} />
      </ScrollView>
      <AddButton type="category" onCreateCategory={handleCreateCategory} />
    </>
  );
}
