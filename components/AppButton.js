import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants";

const AppButton = ({ onPress, title, loading }) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{title}</Text>
      {loading && <ActivityIndicator size="small" color="white" />}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  btn: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    color: "white",
    padding: 10,
    height: 50,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    marginRight: 15,
  },
});
