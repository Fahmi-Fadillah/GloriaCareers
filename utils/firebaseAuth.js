import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../app/firebase";
import { showToast } from "../utils/index";

export const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const employerDocRef = doc(db, "employers", user.uid);
    const jobSeekerDocRef = doc(db, "seekers", user.uid);

    const employerDocSnapshot = await getDoc(employerDocRef);
    const jobSeekerDocSnapshot = await getDoc(jobSeekerDocRef);

    if (employerDocSnapshot.exists()) {
      return { userType: "employer", userData: employerDocSnapshot.data() };
    } else if (jobSeekerDocSnapshot.exists()) {
      return { userType: "jobSeeker", userData: jobSeekerDocSnapshot.data() };
    } else {
      throw new Error("No such user!");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleEmployerSignUp = async (
  email,
  password,
  companyName,
  companyLocation
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "employers", user.uid), {
      email,
      companyName,
      companyLocation,
      createdJobs: [],
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleUserSignUp = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "seekers", user.uid), {
      email,
      name,
      savedJobs: [],
      appliedJobs: [],
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handlelogOut = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log("User signed out");
    showToast("User signed out");
    router.replace("auth");
  } catch (error) {
    console.log("Error signing out: ", error);
    showToast("Error signing out");
  }
};

export const saveJob = async (
  jobRole,
  qualifications,
  responsibilities,
  about
) => {
  try {
    const employerDocRef = doc(db, "employers", auth.currentUser.uid);
    const employerDoc = await getDoc(employerDocRef);
    const companyName = employerDoc.data().companyName;

    const jobDocRef = await addDoc(collection(db, "jobs"), {
      jobRole: jobRole,
      qualifications: qualifications,
      responsibilities: responsibilities,
      about: about,
      employerId: auth.currentUser.uid,
      companyName: companyName,
    });
    const jobId = jobDocRef.id;
    await updateDoc(jobDocRef, { id: jobId });
    await updateDoc(employerDocRef, {
      createdJobs: arrayUnion(jobId),
    });
    console.log("Job posted successfully");
  } catch (e) {
    console.error("Error posting job: ", e);
    throw e;
  }
};
