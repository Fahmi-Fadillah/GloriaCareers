import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function Loading() {
  const router = useRouter();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("auth");
  //   }, 2000);

  //   // Cleanup the timer on component unmount
  //   return () => clearTimeout(timer);
  // }, [router]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const employerDoc = await getDoc(doc(db, "employers", user.uid));
        if (employerDoc.exists()) {
          console.log("You are an employer");
          router.push("employer/employerHome");
        } else {
          const jobSeekerDoc = await getDoc(doc(db, "seekers", user.uid));
          if (jobSeekerDoc.exists()) {
            console.log("You are a job seeker");
            router.push("home");
          } else {
            console.log("User type not identified");
            router.push("auth");
          }
        }
      } else {
        console.log("You are not signed in");
        router.navigate("auth");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        marginVertical: "50%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={"red"} />
    </View>
  );
}

const styles = StyleSheet.create({});
