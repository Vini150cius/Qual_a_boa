import { Text, View } from "react-native";
import { styles } from "./style";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import { SortedCard } from "../../components/sortedCard";

export default function Home() {
  const { theme } = useTheme();
  return (
    <>
      <Header screen="home" title="Home" />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SortedCard />
        <Text style={{ color: theme.text }}>Home Screen</Text>
      </View>
    </>
  );
}
