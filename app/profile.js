import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeaderBtn } from "../components";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import { COLORS, icons } from "../constants";
import { globalStyles } from "../styles/styles";
import {
  fetchAppliedJobs,
  fetchSeekerData,
  handlelogOut,
  updateSeekerData,
} from "../utils/firebaseAuth";
import { showToast } from "../utils/index";
import Logo from "./../assets/icon.png";
import { auth } from "./firebase";

function SeekerProfile(props) {
  const [seekerData, setSeekerData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSeekerData(auth.currentUser.uid);
        setSeekerData(data);
        setFormData({
          name: data.name,
          email: data.email,
          bio: data.bio || "",
        });
        const jobs = await fetchAppliedJobs(data.appliedJobs);
        setAppliedJobs(jobs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setBtnLoading(true);
    try {
      await updateSeekerData(auth.currentUser.uid, formData);
      console.log("Document updated successfully!");
      showToast("Profile updated successfully!");
      setSeekerData(formData);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
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
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                handlelogOut();
                router.replace("auth");
              }}
              style={{ marginRight: 10 }}
            >
              <Ionicons
                name="log-out-outline"
                size={30}
                color={COLORS.tertiary}
              />
            </TouchableOpacity>
          ),
          headerTitle: "Profile",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
        }}
      />
      <ScrollView
        contentContainerStyle={[
          globalStyles.scrollViewContent,
          {
            paddingHorizontal: 16,
          },
        ]}
      >
        {seekerData && (
          <>
            <Image source={Logo} style={styles.profileImage} />

            <View style={styles.infoContainer}>
              <AppTextInput
                iconName="person-outline"
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
                editable={isEditing}
                placeholder="Enter Your Name"
              />
              <AppTextInput
                iconName="mail-outline"
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                editable={isEditing}
              />
              <AppTextInput
                iconName="information-circle-outline"
                value={formData.bio}
                onChangeText={(value) => handleChange("bio", value)}
                editable={isEditing}
                multiline={true}
                placeholder="Bio"
              />
              <AppButton
                title={isEditing ? "Save" : "Edit Profile"}
                onPress={isEditing ? handleSave : handleEditToggle}
                style={styles.customBtn}
                loading={btnLoading}
              />
            </View>
            <Text style={styles.sectionTitle}>Applied Jobs</Text>
            {appliedJobs.length > 0 ? (
              appliedJobs.map((job, index) => (
                <View key={index} style={globalStyles.cardContainer}>
                  <Text style={styles.jobTitle}>{job.jobRole}</Text>
                  <Text style={styles.jobDescription}>{job.about}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noJobsText}>No jobs applied yet.</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  customBtn: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.lightWhite,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  location: {
    fontSize: 18,
    color: COLORS.gray,
  },
  infoContainer: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 30,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 18,
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
    marginTop: 20,
  },
  jobContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  jobDescription: {
    fontSize: 16,
    color: COLORS.gray,
  },
  noJobsText: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default SeekerProfile;
