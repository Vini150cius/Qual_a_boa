import { Image, StyleSheet, Text, View } from "react-native";
import type { CategoryItemProps } from "../types/category.types";

export function CategoryItem({ title, quantity, imageUrl }: CategoryItemProps) {
  return (
    <View style={styles.item}>
      <Image
        source={{
          uri: imageUrl,
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.quantity}>{quantity} receitas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: "100%",
    height: 150,
    borderRadius: 22,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    position: "absolute",
    bottom: 25,
    left: 8,
    color: "#fff",
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 5, height: 2 },
    shadowColor: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    position: "absolute",
    bottom: 10,
    left: 8,
    color: "#fff",
    fontSize: 12,
  },
});
