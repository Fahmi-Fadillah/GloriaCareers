import { Stack, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { db } from "./firebase";
import { useFonts } from "expo-font";

const Layout = () => {
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(
          doc(collection(db, "employers"), user.uid)
        );
        const userData = userDoc.data();
        if (userData && userData.role === "employer") {
          Alert.alert("You are an employer");
          router.push("employer/employerHome");
        } else {
          Alert.alert("You are a job seeker");
          router.push("home");
        }
      } else {
        Alert.alert("You are not signed in");
        router.push("auth");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          marginVertical: "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={"green"} />
      </View>
    );
  }
  return (
    <Stack>
      <Stack.Screen options={{ header: () => null }} name="auth" />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: true }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen
        name="employer/createJobs"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="employer/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="employer/EmployerAuth"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="employer/employerProfile"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default Layout;
