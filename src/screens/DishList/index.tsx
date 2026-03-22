import { FlatList, Image, Text, View } from "react-native";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import type { Dish, DishItemProps } from "../../types/dish.types";
import { styles } from "./style";
import { Star } from "lucide-react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../../routes";
import { AddButton } from "../../components/addButton";
import { useEffect, useState } from "react";
import { fetchDishes } from "../../service/DishService";

const DISH_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500";

type Props = BottomTabScreenProps<RootTabParamList, "Lista de Pratos">;

export default function DishList({ route }: Props) {
  const { theme } = useTheme();
  const { categoryTitle, categoryId, refreshKey } = route.params;
  const [dishes, setDishes] = useState<DishItemProps[]>([]);

  async function loadDishes() {
    try {
      setDishes([]);
      const fetchedDishes = await fetchDishes(categoryId);

      const dishItems = fetchedDishes.map((dish: Dish) => ({
        id: dish.id,
        title: dish.title,
        rank: dish.rank,
        imageURL: dish.imageURL || DISH_PLACEHOLDER_IMAGE,
      }));

      setDishes(dishItems);
    } catch (error) {
      console.error("Erro ao buscar pratos:", error);
    }
  }

  useEffect(() => {
    void loadDishes();
  }, [categoryId, refreshKey]);

  const DishItem = ({ data }: { data: DishItemProps }) => (
    <View style={styles.containerDishItem}>
      <Image source={{ uri: data.imageURL }} style={styles.dishImage} />
      <Text style={styles.dishTitle}>{data.title}</Text>
      <View style={styles.dishRankContainer}>
        <Text style={styles.dishRankText}>
          {data.rank}.0{" "}
          <Star
            size={15}
            fill={styles.dishRankText.color}
            color={styles.dishRankText.color}
          />{" "}
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: DishItemProps }) => (
    <DishItem data={item} />
  );

  return (
    <>
      <Header screen="dishList" title={categoryTitle || "Lista de Pratos"} />
      <View
        style={{ flex: 1, backgroundColor: theme.background, marginTop: 20 }}
      >
        <FlatList
          data={dishes}
          keyExtractor={(item: DishItemProps) => String(item.id)}
          renderItem={renderItem}
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
