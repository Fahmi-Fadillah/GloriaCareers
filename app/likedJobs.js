import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeaderBtn } from "../components";
import { COLORS, icons } from "../constants";
import { globalStyles } from "../styles/styles";
import { showToast } from "../utils";
import { fetchLikedJobs, removeLikedJob } from "../utils/firebaseAuth";

const LikedJobsScreen = () => {
  const [likedJobs, setLikedJobs] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadLikedJobs();
  }, []);

  const loadLikedJobs = async () => {
    setisLoading(true);
    try {
      const likedJobsList = await fetchLikedJobs();
      setLikedJobs(likedJobsList);
    } catch (error) {
      console.error(error.message);
    } finally {
      setisLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
          headerTitle: "",
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={likedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                style={styles.jobItem}
                onPress={() => {
                  router.push(`/employer/${item.id}`);
                }}
              >
                {/* 
               
                <Image
                  source={{
                    uri:
                      item.jobLogo !== "logo here"
                        ? item.jobLogo
                        : "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar",
                  }}
                  style={{ width: 50, height: 50 }}
                /> */}
                <View>
                  <Text style={styles.jobTitle}>{item.jobRole}</Text>
                  <Text style={styles.employerName}>{item.companyName}</Text>
                  <Text style={styles.employerName}>{item.location}</Text>
                  {item.isApplied ? (
                    <Text style={styles.appliedStatus}>Applied</Text>
                  ) : (
                    <Text style={styles.notAppliedStatus}>Not Applied</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    await removeLikedJob(item.id);
                    showToast("Job removed from liked jobs");
                    loadLikedJobs();
                  }}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={28}
                    color="red"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f8f8f8",
  },
  jobItem: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  employerName: {
    fontSize: 16,
    color: "#888",
  },
  appliedStatus: {
    fontSize: 14,
    color: "green",
  },
  notAppliedStatus: {
    fontSize: 14,
    color: "red",
  },
  likedStatus: {
    fontSize: 14,
    color: "blue",
  },
});

export default LikedJobsScreen;
