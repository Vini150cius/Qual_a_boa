import { FlatList, StyleSheet, Text, View } from "react-native";
import { CategoryItem } from "./categoryItem";
import type { Category } from "../types/category.types";

type CategoryContainerProps = {
  categories: Category[];
};

export function CategoryContainer({ categories }: CategoryContainerProps) {
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
              imageUrl={item.imageUrl || "https://via.placeholder.com/150"}
              id={item.id}
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
