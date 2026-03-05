import { FlatList, Image, Text, View } from "react-native";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import type { DishItemProps } from "../../types/dish.types";

export default function DishList(categoryId?: string, categoryName?: string) {
  const { theme } = useTheme();

  const feed = [
    {
      id: 1,
      title: "Risoto de Cogumelos",
      rank: 5,
      imageURL:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=500",
    },
    {
      id: 2,
      title: "Lasanha à Bolonhesa",
      rank: 4,
      imageURL:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500",
    },
    {
      id: 3,
      title: "Espaguete ao Pesto",
      rank: 5,
      imageURL:
        "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=500",
    },
    {
      id: 4,
      title: "Salmão Grelhado",
      rank: 4,
      imageURL:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500",
    },
  ];

  const DishItem = ({ data }: { data: DishItemProps }) => (
    <View>
      <Image
        source={{ uri: data.imageURL }}
        style={{ width: 100, height: 100 }}
      />
      <Text>{data.title}</Text>
      <Text>Rank: {data.rank}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: DishItemProps }) => (
    <DishItem data={item} />
  );

  return (
    <>
      <Header screen="dishList" title={categoryName || "Lista de Pratos"} />
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}> Screen</Text>
        <FlatList
          data={feed}
          keyExtractor={(item: DishItemProps) => String(item.id)}
          renderItem={renderItem}
        />
      </View>
    </>
  );
}
