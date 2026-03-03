import { Text, View } from "react-native";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";

export default function DishList(categoryId?: string, categoryName?: string) {
  const { theme } = useTheme();

  return (
    <>
      <Header screen="dishList" title={categoryName || "Lista de Pratos"} />
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}> Screen</Text>
      </View>
    </>
  );
}
