import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { styles } from "./style";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import { SortedCard } from "../../components/sortedCard";
import { CategoryContainer } from "../../components/categoryContainer";
import { AddButton } from "../../components/addButton";
import type { Category } from "../../types/category.types";
import { initDatabase } from "../../service/initDatabase";
import { createCategory, fetchCategories } from "../../service/CategoryService";

export default function Home() {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadCategories() {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }

  useEffect(() => {
    async function setupDatabase() {
      try {
        await initDatabase();
        await loadCategories();
      } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
      }
    }

    setupDatabase();
  }, []);

  async function handleCreateCategory(categoryName: string) {
    const formattedName = categoryName.trim();
    if (!formattedName) {
      return;
    }

    try {
      const newCategory = await createCategory({
        id: String(Date.now()),
        title: formattedName,
        quantity: 0,
      });

      setCategories((previous) => [newCategory, ...previous]);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
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
