import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { BackHandler, ScrollView, View } from "react-native";
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

    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  if (!isSignedIn) {
    return null;
  }

  const routingOptions = [
    {
      label: "Employer Profile",
      icon: "person-outline",
      route: "employer/employerProfile",
    },
    {
      label: "Saved Jobs",
      icon: "bookmark-outline",
      route: "employer/jobApplicants",
    },
    {
      label: "About Us",
      icon: "information-circle-outline",
      route: "about",
    },
    {
      label: "Settings",
      icon: "settings-outline",
      action: () => showToast("Settings Coming Soon"),
    },
    {
      label: "Logout",
      icon: "log-out-outline",
      action: () => {
        handlelogOut();
        router.replace("auth");
      },
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
        <BottomBar router={router} />
      </View>
    </SafeAreaView>
  );
};

export default employerHome;
