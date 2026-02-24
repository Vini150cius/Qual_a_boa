import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../util/ThemeProvider";
import { Dice5 } from "lucide-react-native";

export function SortedCard() {
  const { theme } = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.primary }]}>
      <View style={styles.leftContent}>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            O que comer hoje ?
          </Text>
          <Text style={[styles.cardText, { color: theme.placeHolder }]}>
            Deixe a sorte decidir o prato
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          activeOpacity={0.8}
        >
          <Dice5 size={16} color={theme.background} />
          <Text style={[styles.buttonText, { color: theme.background }]}>
            Sortear Refeição
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardImageBorder}>
        <View style={styles.cardImageClip}>
          <Image
            source={require("./../../assets/images/cardsorted.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 14,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    elevation: 1,
  },
  leftContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 12,
    marginTop: 6,
  },
  cardContent: {
    flexDirection: "column",
  },
  button: {
    marginTop: 12,
    height: 36,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    gap: 8,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  cardImageBorder: {
    width: 120,
    height: 120,
    borderRadius: 999,
    padding: 3,
  },
  cardImageClip: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
});
