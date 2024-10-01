import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Loading() {
  return (
    <View
      style={{
        flex: 1,
        marginVertical: "50%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={"red"} />
    </View>
  );
}

const styles = StyleSheet.create({});
