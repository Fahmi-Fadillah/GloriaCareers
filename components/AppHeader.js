import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import profileIcon from "../assets/icon.png";
import icons from "../constants/icons";
import { showToast } from "../utils/index";
import ScreenHeaderBtn from "./common/header/ScreenHeaderBtn";

const AppHeader = ({ title, onBackPress, routingOptions }) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <ScreenHeaderBtn
        iconUrl={icons.menu}
        dimension="60%"
        options={routingOptions.map((option) => ({
          ...option,
          action: () => {
            if (option.action) {
              option.action();
            } else if (option.route) {
              router.push(option.route);
            }
          },
        }))}
        showModal={true}
      />
      <Text style={styles.headerText}>{title}</Text>
      <ScreenHeaderBtn
        iconUrl={profileIcon}
        dimension="100%"
        options={[]}
        showModal={false}
        handlePress={() => router.push("about")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: "#E8E8E8",
    borderRadius: 41,
    width: 31,
    height: 31,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
});

export default AppHeader;
