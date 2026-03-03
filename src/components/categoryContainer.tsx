import { FlatList, StyleSheet, Text, View } from "react-native";
import { CategoryItem } from "./categoryItem";

type Category = {
  id: string;
  title: string;
  quantity: number;
  imageUrl: string;
};

const categories: Category[] = [
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

export function CategoryContainer() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar por categorias</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <CategoryItem
              title={item.title}
              quantity={item.quantity}
              imageUrl={item.imageUrl}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  listContent: {
    rowGap: 12,
  },
  row: {
    justifyContent: "space-between",
  },
  itemWrapper: {
    width: "48%",
  },
});
