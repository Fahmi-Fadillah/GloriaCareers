import { useNavigation } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../app/firebase";
import { ScreenHeaderBtn } from "../../components";
import BottomBar from "../../components/BottomBar";
import { COLORS, icons } from "../../constants";
import { globalStyles } from "../../styles/styles";

function employerProfile(props) {
  const navigation = useNavigation();
  const [employerData, setEmployerData] = useState(null);

  useEffect(() => {
    const fetchEmployerData = async () => {
      const docRef = doc(db, "employers", auth.currentUser.uid); // replace "users" with the name of your collection
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEmployerData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchEmployerData();
  }, []);

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
          headerTitle: "Profile",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
        }}
      />
      <ScrollView contentContainerStyle={globalStyles.scrollViewContent}>
        <View style={styles.container}>
          {employerData && (
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Email: {employerData.email}</Text>
              <Text style={styles.text}>
                Company Name: {employerData.companyName}
              </Text>
              <Text style={styles.text}>
                Location: {employerData.companyLocation}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.lightWhite,
  },
  infoContainer: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 10,
  },
});

export default employerProfile;
