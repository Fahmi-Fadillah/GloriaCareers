import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
function AppTextInput({ iconName, ...otherProps }) {
  return (
    <View style={[styles.container]}>
      {iconName && (
        <View style={styles.icon}>
          <Ionicons name={iconName} size={24} color="black" />
        </View>
      )}
      <TextInput style={styles.text} {...otherProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    gap: 10,
  },

  text: {
    fontSize: 20,
    color: "black",
  },
});

export default AppTextInput;
