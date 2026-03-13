import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { CategoryItemProps } from "../types/category.types";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../routes";

export function CategoryItem({
  title,
  quantity,
  imageUrl,
  id,
}: CategoryItemProps) {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <TouchableOpacity
      style={styles.item}
      key={id}
      onPress={() => {
        navigation.navigate("Lista de Pratos", {
          categoryId: id,
          categoryTitle: title,
        });
      }}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.quantity}>{quantity} receitas</Text>
    </TouchableOpacity>
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
