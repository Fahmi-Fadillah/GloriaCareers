import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Nearbyjobs, Popularjobs, Welcome } from "../../components";
import AppHeader from "../../components/AppHeader";
import BottomBar from "../../components/BottomBar";
import EmployerJobs from "../../components/home/employerJobs/EmployerJobs";
import { SIZES } from "../../constants";
import { globalStyles } from "../../styles/styles";
import { showToast } from "../../utils";
import { handlelogOut } from "../../utils/firebaseAuth";

const employerHome = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isSignedIn) {
    return null;
  }

  const routingOptions = [
    {
      label: "Employer Profile",
      icon: "account",
      route: "employer/employerProfile",
    },
    {
      label: "Saved Jobs",
      icon: "content-save",
      route: "employer/jobApplicants",
    },
    {
      label: "About Us",
      icon: "information",
      route: "about",
    },
    {
      label: "Settings",
      icon: "wrench",
      action: () => showToast("Settings Coming Soon"),
    },
    {
      label: "Logout",
      icon: "exit-to-app",
      action: handlelogOut,
    },
  ];

  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader routingOptions={routingOptions} />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            globalStyles.scrollViewContent,
            { paddingBottom: 60 },
          ]}
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
        <BottomBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default employerHome;
