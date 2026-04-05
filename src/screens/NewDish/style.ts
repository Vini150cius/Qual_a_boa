import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 18,
  },
  fieldGroup: {
    gap: 8,
  },
  ratingGroup: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 240,
    marginTop: 12,
  },
  starContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  inputRow: {
    minHeight: 56,
    borderRadius: 28,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 19,
    fontWeight: "400",
    paddingVertical: 0,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  textarea: {
    minHeight: 132,
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: "400",
  },
  textRanking: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#F4C542",
  },
  button: {
    borderRadius: 999,
    backgroundColor: "#FF6347",
    padding: 14,
  },
  textButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
});
