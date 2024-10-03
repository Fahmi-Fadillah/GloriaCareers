import { EvilIcons, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import { globalStyles } from "../../styles/styles";
import { fetchApplicants } from "../../utils/firebaseAuth";

const JobApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        const jobsList = await fetchApplicants();
        setJobs(jobsList);
      } catch (error) {
        console.error("Error fetching applicants: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, []);

  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  const openEmailApp = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={[
          globalStyles.scrollViewContent,
          {
            marginTop: 20,
          },
        ]}
      >
        {jobs.length === 0 ? (
          <Text>No jobs found</Text>
        ) : (
          jobs.map((job) => (
            <View key={job.id} style={globalStyles.cardContainer}>
              <TouchableOpacity
                onPress={() => toggleExpand(job.id)}
                style={[globalStyles.cardHeader, styles2.jobListing]}
              >
                <Text style={globalStyles.title}>{job.jobRole}</Text>
                <Ionicons
                  name={
                    expandedJobId === job.id
                      ? "chevron-down"
                      : "chevron-forward-sharp"
                  }
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              {expandedJobId === job.id && (
                <View style={globalStyles.cardContent}>
                  {job.applicants.length === 0 ? (
                    <Text>No applicants found</Text>
                  ) : (
                    job.applicants.map((applicant) => (
                      <View key={applicant.id} style={globalStyles.card}>
                        <Text>{`Applicant Name: ${applicant.name}`}</Text>
                        <View style={styles2.emailContainer}>
                          <Text>{`Applicant Email: ${applicant.email}`}</Text>
                          <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={() => openEmailApp(applicant.email)}
                          >
                            <EvilIcons
                              name="external-link"
                              size={28}
                              color="green"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobApplicants;

const styles2 = StyleSheet.create({
  jobListing: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
