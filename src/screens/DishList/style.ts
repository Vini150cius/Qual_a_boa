import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerDishItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 35,
    marginBottom: 18,
    marginHorizontal: 18,
    backgroundColor: "#fff",
  },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: 999,
    marginRight: 10,
    maxWidth: "33%",
  },
  dishTitle: {
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 6,
    alignSelf: "flex-start",
    maxWidth: "44%",
  },
  dishRankContainer: {
    backgroundColor: "#FDF2E9",
    padding: 7,
    borderRadius: 999,
    alignSelf: "center",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "22%",

  },
  dishRankText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F2994A",
  },
  dishRankTextIcon: {
    color: "#F2994A",
  },
});
