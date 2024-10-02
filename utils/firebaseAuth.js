import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../app/firebase";

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
