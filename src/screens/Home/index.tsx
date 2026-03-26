import { useEffect, useState } from "react";
import { View } from "react-native";
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
  const [searchText, setSearchText] = useState("");

  async function loadCategories(search: string = "") {
    try {
      const fetchedCategories = await fetchCategories(search);
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
      await createCategory({
        id: String(Date.now()),
        title: formattedName,
        quantity: 0,
      });

      await loadCategories(searchText);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  }

  function handleSearchChangeText(text: string) {
    setSearchText(text);
    void loadCategories(text);
  }

  function handleSearchSubmit(text: string) {
    void loadCategories(text);
  }

  return (
    <>
      <Header
        screen="home"
        title="Home"
        onSearchChangeText={handleSearchChangeText}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Buscar categoria..."
      />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SortedCard />
        <CategoryContainer
          onRefresh={() => loadCategories(searchText)}
          categories={categories}
        />
      </View>
      <AddButton type="category" onCreateCategory={handleCreateCategory} />
    </>
  );
}
