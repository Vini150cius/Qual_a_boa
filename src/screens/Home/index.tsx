import { ScrollView, Text, View } from "react-native";
import { styles } from "./style";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import { SortedCard } from "../../components/sortedCard";
import { CategoryContainer } from "../../components/categoryContainer";

export default function Home() {
  const { theme } = useTheme();
  return (
    <>
      <Header screen="home" title="Home" />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <SortedCard />
        <CategoryContainer />
      </ScrollView>
    </>
  );
}
