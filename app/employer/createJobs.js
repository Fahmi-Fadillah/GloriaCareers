import { useNavigation } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeaderBtn } from "../../components";
import AppButton from "../../components/AppButton";
import AppTextInput from "../../components/AppTextInput";
import BottomBar from "../../components/BottomBar";
import { COLORS, icons } from "../../constants";
import { globalStyles } from "../../styles/styles";
import { saveJob } from "../../utils/firebaseAuth";
import { showToast } from "../../utils/index";

function createJobs() {
  const navigation = useNavigation();
  const router = useRouter();
  const [jobRole, setJobRole] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!jobRole || !qualifications || !responsibilities || !about) {
        showToast("Please fill all fields");
        return;
      }
      await saveJob(jobRole, qualifications, responsibilities, about);
      showToast("Job posted successfully");
      router.replace("employer/employerHome");
    } catch (e) {
      console.error("Error posting job: ", e);
    } finally {
      setLoading(false);
    }
  };

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
          headerTitle: "Create Job",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 22, fontWeight: "bold" },
        }}
      />
      <ScrollView
        style={{ padding: 16 }}
        contentContainerStyle={[globalStyles.scrollViewContent, {}]}
      >
        <Text style={{ fontSize: 24, marginBottom: 20, alignSelf: "center" }}>
          Create a Job Posting
        </Text>
        <AppTextInput
          iconName={"person-outline"}
          placeholder={"Enter your Job Role here"}
          onChangeText={setJobRole}
        />
        <AppTextInput
          iconName={"school-outline"}
          multiline={true}
          placeholder={"Enter your Qualifications here"}
          onChangeText={setQualifications}
        />
        <AppTextInput
          iconName={"build-outline"}
          multiline={true}
          placeholder={"Enter your Responsibilities here"}
          onChangeText={setResponsibilities}
        />
        <AppTextInput
          iconName={"information-circle-outline"}
          multiline={true}
          placeholder={"Enter your About here"}
          onChangeText={setAbout}
        />
        <AppButton loading={loading} onPress={handleSubmit} title={"Submit"} />
      </ScrollView>
      <BottomBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    color: "white",
    padding: 10,
    height: 50,
    borderRadius: 5,
    marginBottom: 50,
  },
  btnText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
});

export default createJobs;
