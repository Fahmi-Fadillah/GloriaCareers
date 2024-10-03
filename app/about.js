import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/icon.png";
import { ScreenHeaderBtn } from "../components";
import { COLORS, icons } from "../constants";
import { globalStyles } from "../styles/styles";

function About(props) {
  const router = useRouter();
  const developers = [
    {
      name: "Kapil Badokar",
      social: "https://www.linkedin.com/in/kapil-badokar/",
      role: "Lead Developer",
      bio: "Kapil is a seasoned developer with a passion for building scalable applications.",
    },
    {
      name: "Mohanish Desale",
      social: "https://www.linkedin.com/in/mohanish-desale/",
      role: "Backend Developer",
      bio: "Mohanish specializes in backend development and database management.",
    },
    {
      name: "Chinmay Rathod",
      social: "https://www.linkedin.com/in/chinmayy19/",
      role: "Frontend Developer",
      bio: "Chinmay is an expert in creating intuitive and responsive user interfaces.",
    },
  ];

  const appFeatures = [
    "Centralized job listings from various sources",
    "Personalized job recommendations",
    "Real-time job alerts and notifications",
    "Easy application tracking",
    "Seamless navigation and user experience",
  ];

  return (
    <SafeAreaView style={globalStyles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerTitle: "About Us",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
        }}
      />

      <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
        <Image source={Logo} resizeMode="contain" style={styles.headerImage} />
        <Text style={styles.title}>Welcome to JobCentral</Text>
        <Text style={styles.paragraph}>
          Your ultimate destination for simplified job searching! At JobCentral,
          we believe in making the job search process effortless for users
          worldwide. Our centralized platform aggregates job listings from
          various sources, providing you with a comprehensive database of
          opportunities. Whether you're a seasoned professional or a fresh
          graduate, JobCentral offers intuitive features, personalized
          recommendations, and seamless navigation to help you find your dream
          job.
        </Text>

        <Text style={styles.subtitle}>Key Features</Text>
        {appFeatures.map((feature, index) => (
          <Text key={index} style={styles.featureItem}>
            - {feature}
          </Text>
        ))}

        <Text
          style={[
            styles.subtitle,
            {
              paddingTop: 20,
            },
          ]}
        >
          Meet the Developers
        </Text>
        {developers.map((dev, index) => (
          <View key={index} style={styles.devContainer}>
            <Text style={styles.devName}>{dev.name}</Text>
            <Text style={styles.devRole}>{dev.role}</Text>
            <Text style={styles.devBio}>{dev.bio}</Text>
            <Icon
              name="linkedin-square"
              type="font-awesome"
              size={28}
              color={"blue"}
              onPress={() => Linking.openURL(dev.social)}
              style={{ marginRight: 10 }}
            />
          </View>
        ))}
        <Text
          style={[
            styles.subtitle,
            {
              fontSize: 14,
              color: "gray",
            },
          ]}
        >
          Copyright © JobCentral{" "}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    padding: 20,
  },
  headerImage: {
    width: "100%",
    height: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  paragraph: {
    lineHeight: 25,
    fontSize: 17,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "justify",
    backgroundColor: "#f0f0f0",
    padding: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 5,
  },
  featureItem: {
    fontSize: 17,
    marginBottom: 10,
  },
  devContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  devName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  devRole: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 5,
  },
  devBio: {
    fontSize: 14,
    marginBottom: 10,
  },
  contactItem: {
    fontSize: 17,
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
});

export default About;
