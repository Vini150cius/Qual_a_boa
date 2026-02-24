import { Text, View } from "react-native";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";

export default function NewDish() {
  const { theme } = useTheme();

  return (
    <>
      <Header screen="addDish" title="Adicionar Prato" />
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}> Screen</Text>
      </View>
    </>
  );
}
