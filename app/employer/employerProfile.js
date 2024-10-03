import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
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
import { auth } from "../../app/firebase";
import Logo from "../../assets/icon.png";
import { ScreenHeaderBtn } from "../../components";
import AppButton from "../../components/AppButton";
import AppTextInput from "../../components/AppTextInput";
import BottomBar from "../../components/BottomBar";
import { COLORS, icons } from "../../constants";
import { globalStyles } from "../../styles/styles";
import { showToast } from "../../utils";
import {
  fetchCreatedJobs,
  fetchEmployerData,
  handlelogOut,
  updateEmployerData,
} from "../../utils/firebaseAuth";
function EmployerProfile(props) {
  const navigation = useNavigation();
  const [employerData, setEmployerData] = useState(null);
  const [createdJobs, setCreatedJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setloading] = useState(true);
  const [btnLoading, setbtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyLocation: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmployerData(auth.currentUser.uid);
        setEmployerData(data);
        setFormData({
          companyName: data.companyName,
          companyLocation: data.companyLocation,
          email: data.email,
          description: data.description || "",
        });
        const jobs = await fetchCreatedJobs(data.createdJobs);
        setCreatedJobs(jobs);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setbtnLoading(true);
    try {
      await updateEmployerData(auth.currentUser.uid, formData);
      console.log("Document updated successfully!");
      showToast("Profile updated successfully!");
      setEmployerData(formData);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setbtnLoading(false);
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
              onPress={handlelogOut}
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
        {employerData && (
          <>
            {/* <View style={styles.profileHeader}> */}
            <Image source={Logo} style={styles.profileImage} />
            {/* </View> */}

            <View style={styles.infoContainer}>
              <AppTextInput
                iconName="business-outline"
                value={formData.companyName}
                onChangeText={(value) => handleChange("companyName", value)}
                editable={isEditing}
              />
              <AppTextInput
                iconName="location-outline"
                value={formData.companyLocation}
                onChangeText={(value) => handleChange("companyLocation", value)}
                editable={isEditing}
              />
              <AppTextInput
                iconName="mail-outline"
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                editable={isEditing}
              />
              <AppTextInput
                iconName="information-circle-outline"
                value={formData.description}
                onChangeText={(value) => handleChange("description", value)}
                editable={isEditing}
                multiline={true}
                placeholder="Description"
              />
              <AppButton
                title={isEditing ? "Save" : "Edit Profile"}
                onPress={isEditing ? handleSave : handleEditToggle}
                style={styles.customBtn}
                loading={btnLoading}
              />
            </View>
            <Text style={styles.sectionTitle}>Created Jobs</Text>
            {createdJobs.length > 0 ? (
              createdJobs.map((job, index) => (
                <View key={index} style={globalStyles.cardContainer}>
                  <Text style={styles.jobTitle}>{job.jobRole}</Text>
                  <Text style={styles.jobDescription}>{job.about}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noJobsText}>No jobs created yet.</Text>
            )}
          </>
        )}
      </ScrollView>
      <BottomBar navigation={navigation} />
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
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  companyLocation: {
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

export default EmployerProfile;
