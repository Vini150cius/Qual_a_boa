import { Text, View } from "react-native";
import { styles } from "./style";
import { Header } from "../../components/header";

export default function Home() {
  return (
    <>
      <Header screen="home" title="Home" />
      <View style={styles.container}>
        <Text>Home Screen</Text>
      </View>
    </>
  );
}
