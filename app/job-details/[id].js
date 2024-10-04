import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";
import { globalStyles } from "../../styles/styles";

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { data, isLoading, error } = useFetch("job-details", {
    job_id: params.id,
  });
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const displayTabContent = useMemo(() => {
    if (!data || data.length === 0) return null;

    const {
      job_description = "No data provided",
      job_highlights: { Qualifications = [], Responsibilities = [] } = {},
    } = data[0];

    const aboutContent = job_description;

    switch (activeTab) {
      case "About":
        return <JobAbout info={aboutContent} />;
      case "Qualifications":
        return (
          <Specifics
            title="Qualifications"
            points={
              data[0].job_highlights?.Qualifications ?? [
                "No Qualifications were found for this job.",
              ]
            }
          />
        );
      case "Responsibilities":
        return (
          <Specifics
            title="Responsibilities"
            points={
              data[0].job_highlights?.Responsibilities ?? [
                "No Responsibilities were found for this job.",
              ]
            }
          />
        );
      default:
        return null;
    }
  }, [data, activeTab]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
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
                const jobLink = data?.[0]?.job_apply_link;
                Share.share({
                  message: `Check out this job:\n ${jobLink}`,
                  url: jobLink,
                });
              }}
              showModal={false}
            />
          ),
          headerTitle: "",
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyles.scrollViewContent}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong: {error.message}</Text>
        ) : data.length === 0 ? (
          <Text>No data available</Text>
        ) : (
          <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
            <Company
              companyLogo={data[0]?.employer_logo}
              jobTitle={data[0]?.job_title}
              companyName={data[0]?.employer_name}
              location={data[0]?.job_country}
            />

            <JobTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {displayTabContent}
          </View>
        )}
      </ScrollView>

      <JobFooter url={data?.[0]?.job_apply_link} hideBookmark={true} />
    </SafeAreaView>
  );
};

export default JobDetails;
