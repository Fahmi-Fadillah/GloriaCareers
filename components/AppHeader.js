import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import profileIcon from "../assets/logo.png";
import icons from "../constants/icons";
import { showToast } from "../utils/index";
import ScreenHeaderBtn from "./common/header/ScreenHeaderBtn";

const AppHeader = ({ title, onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      <ScreenHeaderBtn
        iconUrl={icons.menu}
        dimension="60%"
        options={[
          {
            label: "My Profile",
            icon: "account",
            action: () => showToast("Profile Coming Soon"),
          },
          {
            label: "Saved Jobs",
            icon: "content-save",
            action: () => router.push("likedJobs"),
          },
          {
            label: "About Us",
            icon: "information",
            action: () => router.push("about"),
          },
          {
            label: "Settings",
            icon: "wrench",
            action: () => showToast("Settings Coming Soon"),
          },
          {
            label: "Logout",
            icon: "exit-to-app",
            action: () => {
              const auth = getAuth();
              signOut(auth)
                .then(() => {
                  console.log("User signed out");
                  // router.push("auth");
                })
                .catch((error) => {
                  // An error happened.
                  console.log("Error signing out: ", error);
                });
            },
          },
        ]}
        showModal={true}
      />
      <Text style={styles.headerText}>{title}</Text>
      <ScreenHeaderBtn
        iconUrl={profileIcon}
        dimension="100%"
        options={[]}
        showModal={false}
        handlePress={() => showToast("Profile Coming Soon")}
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
