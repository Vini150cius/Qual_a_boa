import { FlatList, Text, View } from "react-native";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import type { Dish, DishItemProps } from "../../types/dish.types";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../../routes";
import { AddButton } from "../../components/addButton";
import { useEffect, useState } from "react";
import { fetchDishes } from "../../service/DishService";
import { DishItem } from "../../components/dishItem";

const DISH_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500";

type Props = BottomTabScreenProps<RootTabParamList, "Lista de Pratos">;

export default function DishList({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { categoryTitle, categoryId, refreshKey } = route.params;
  const [dishes, setDishes] = useState<DishItemProps[]>([]);
  const [searchText, setSearchText] = useState("");

  async function loadDishes(search: string = "") {
    try {
      setDishes([]);
      const fetchedDishes = await fetchDishes(categoryId, search);

      const dishItems = fetchedDishes.map((dish: Dish) => ({
        id: dish.id,
        title: dish.title,
        rank: dish.rank,
        imageURL: dish.imageURL || DISH_PLACEHOLDER_IMAGE,
        recipe: dish.recipe,
        recipeUrl: dish.recipeUrl,
      }));

      setDishes(dishItems);
    } catch (error) {
      console.error("Erro ao buscar pratos:", error);
    }
  }

  useEffect(() => {
    void loadDishes(searchText);
  }, [categoryId, refreshKey, searchText]);

  function handleSearchChangeText(text: string) {
    setSearchText(text);
  }

  function handleSearchSubmit(text: string) {
    void loadDishes(text);
  }

  function handleEditDish(dish: DishItemProps) {
    navigation.navigate("Novo Prato", {
      categoryId,
      categoryTitle: categoryTitle || "Lista de Pratos",
      dishToEdit: dish,
    });
  }

  const renderItem = ({ item }: { item: DishItemProps }) => (
    <DishItem data={item} onEditPress={handleEditDish} />
  );

  return (
    <>
      <Header
        screen="dishList"
        title={categoryTitle || "Lista de Pratos"}
        onSearchChangeText={handleSearchChangeText}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Buscar prato..."
      />
      <View
        style={{ flex: 1, backgroundColor: theme.background, marginTop: 20 }}
      >
        <FlatList
          data={dishes}
          keyExtractor={(item: DishItemProps) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                color: theme.placeHolder,
              }}
            >
              Nenhum prato encontrado...
            </Text>
          }
        />
        <AddButton
          type="dish"
          categoryId={categoryId}
          categoryTitle={categoryTitle}
        />
      </View>
    </>
  );
}
