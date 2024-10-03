import { useRoute } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import { globalStyles } from "../../styles/styles";
import {
  fetchJobDetails,
  fetchUserType,
  handleLike,
} from "../../utils/firebaseAuth";

const tabs = ["About", "Qualifications", "Responsibilities"];

function EmployerCreatedJobs({}) {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params;
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isLiked, setIsLiked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserTypeAndDetails = async () => {
      try {
        const userType = await fetchUserType();
        setUserType(userType);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };

    fetchUserTypeAndDetails();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userType) return;
      try {
        const { job, isLiked, isApplied } = await fetchJobDetails(id, userType);
        setJob(job);
        setIsLiked(isLiked);
        setIsApplied(isApplied);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, userType]);

  const handleLikeJob = async () => {
    try {
      await handleLike(job.id);
      setIsLiked(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return (
          <>
            {/* <Specifics
              title="Qualifications"
              points={job.qualifications ?? ["N/A"]}
            /> */}
            <JobAbout
              title="Qualifications for Job"
              info={job.qualifications ?? "No data provided"}
            />
          </>
        );

      case "About":
        return <JobAbout info={job.about ?? "No data provided"} />;

      case "Responsibilities":
        return (
          <>
            {/* <Specifics
              title="Responsibilities"
              points={job.responsibilities ?? ["N/A"]}
            /> */}
            <JobAbout
              title={"Responsibilities"}
              info={job.responsibilities ?? "No data provided"}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaView style={globalStyles.container}>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: COLORS.lightWhite },
            headerShadowVisible: false,
            headerBackVisible: false,
            headerLeft: () => (
              <ScreenHeaderBtn
                iconUrl={icons.left}
                dimension="60%"
                handlePress={() => router.back()}
                showModal={false}
              />
            ),
            headerRight: () => (
              <ScreenHeaderBtn
                iconUrl={icons.share}
                dimension="60%"
                handlePress={() => {
                  const jobLink = job.job_google_link;
                  Share.share({
                    message: `Check out this job:\n Link here`,
                    url: jobLink,
                    // You can also add a URL to share
                    // url: '<job link here>'
                  });
                }}
                showModal={false}
              />
            ),
            headerTitle: "",
          }}
        />
        <ScrollView
          contentContainerStyle={globalStyles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <ActivityIndicator
              style={{
                alignSelf: "center",
              }}
              size="large"
              color={COLORS.primary}
            />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : job === null ? (
            <Text>No data available</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={job.employer_logo}
                jobTitle={job.jobRole}
                companyName={job.companyName}
                location={"India"}
              />

              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        {userType == "seeker" && (
          <JobFooter
            url={"kapilbadokar.vercel.app"}
            isEmployerPage={true}
            onLike={handleLikeJob}
            isLiked={isLiked}
            jobId={id}
            isApplied={isApplied}
          />
        )}
      </SafeAreaView>
    </>
  );
}

export default EmployerCreatedJobs;
