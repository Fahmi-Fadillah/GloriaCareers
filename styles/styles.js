import { StyleSheet } from "react-native";
import { COLORS } from "../constants";

export const globalStyles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
