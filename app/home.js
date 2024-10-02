import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Nearbyjobs, Popularjobs, Welcome } from "../components";
import { SIZES } from "../constants";
// import EmployerCard from "../components/common/EmployerCard";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import EmployerJobs from "../components/home/employerJobs/EmployerJobs";
import { globalStyles } from "../styles/styles";
import { showToast } from "../utils";
const Home = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        showToast("You are logged in");
      } else {
        console.log("User is signed out");
        setIsSignedIn(false);
        router.replace("auth");
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isSignedIn) {
    return null;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.scrollViewContent}
      >
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={() => {
              if (searchTerm) {
                router.push(`/search/${searchTerm}`);
              }
            }}
          />
          <Popularjobs />
          <EmployerJobs />
          <Nearbyjobs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
