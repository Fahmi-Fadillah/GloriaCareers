import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
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
      applicants: [],
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

export const fetchJobs = async () => {
  try {
    const q = collection(db, "jobs");
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchJobDetails = async (jobId, userType) => {
  try {
    const docRef = doc(db, "jobs", jobId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const job = docSnap.data();
      const userId = auth.currentUser.uid;
      if (userType === "seeker") {
        const userDocRef = doc(db, "seekers", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const savedJobs = userDocSnap.data().savedJobs || [];
          const appliedJobs = userDocSnap.data().appliedJobs || [];
          const isLiked = savedJobs.includes(jobId);
          const isApplied = appliedJobs.includes(jobId);
          return { job, isLiked, isApplied };
        } else {
          throw new Error("User document does not exist");
        }
      } else if (userType === "employer") {
        return { job, isLiked: false, isApplied: false };
      } else {
        throw new Error("User type not specified");
      }
    } else {
      throw new Error("No such document!");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const handleLike = async (jobId) => {
  const userId = auth.currentUser.uid;
  const userDocRef = doc(db, `seekers`, userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const savedJobs = userDocSnap.data().savedJobs || [];
    if (savedJobs.includes(jobId)) {
      // The job is already liked, so we don't do anything
      console.log("Job already liked");
      showToast("Job is already liked");
      return true;
    } else {
      await updateDoc(userDocRef, {
        savedJobs: arrayUnion(jobId),
      });
      showToast("Job liked successfully");
      return true;
    }
  } else {
    throw new Error("User document does not exist");
  }
};

export const applyForJob = async (jobId) => {
  const jobDocRef = doc(db, "jobs", jobId);
  const jobDocSnap = await getDoc(jobDocRef);

  if (!jobDocSnap.exists()) {
    throw new Error("Job does not exist in the app's jobs collection");
  }

  const userId = auth.currentUser.uid;
  const userDocRef = doc(db, `seekers`, userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const appliedJobs = userDocSnap.data().appliedJobs || [];
    if (appliedJobs.includes(jobId)) {
      console.log("Job already applied");
      showToast("Job is already applied");
      return true;
    } else {
      await updateDoc(userDocRef, {
        appliedJobs: arrayUnion(jobId),
      });
      await updateDoc(jobDocRef, {
        applicants: arrayUnion(userId),
      });
      showToast("Job applied successfully");
      return true;
    }
  } else {
    throw new Error("User document does not exist");
  }
};

export const fetchLikedJobs = async () => {
  const userId = auth.currentUser.uid;
  const userDocRef = doc(db, `seekers`, userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const likedJobsIds = userDocSnap.data().savedJobs || [];
    const likedJobsList = [];
    const userType = await fetchUserType();
    for (const jobId of likedJobsIds) {
      const jobDetails = await fetchJobDetails(jobId, userType);
      likedJobsList.push({
        id: jobId,
        ...jobDetails.job,
        isLiked: jobDetails.isLiked,
        isApplied: jobDetails.isApplied,
      });
    }

    return likedJobsList;
  } else {
    throw new Error("User document does not exist");
  }
};

export const removeLikedJob = async (jobId) => {
  const userId = auth.currentUser.uid;
  const userDocRef = doc(db, `seekers`, userId);
  await updateDoc(userDocRef, {
    savedJobs: arrayRemove(jobId),
  });
};

export const fetchApplicants = async () => {
  try {
    const auth = getAuth();
    const employerId = auth.currentUser.uid;
    const jobsQuery = query(
      collection(db, "jobs"),
      where("employerId", "==", employerId)
    );
    const jobsSnapshot = await getDocs(jobsQuery);
    const jobsList = [];

    for (const jobDoc of jobsSnapshot.docs) {
      const jobData = jobDoc.data();
      const jobId = jobDoc.id;
      const applicantsList = [];

      const applicantsIds = jobData.applicants || [];
      for (const applicantId of applicantsIds) {
        const applicantDocRef = doc(db, "seekers", applicantId);
        const applicantDocSnap = await getDoc(applicantDocRef);
        if (applicantDocSnap.exists()) {
          applicantsList.push({
            id: applicantId,
            ...applicantDocSnap.data(),
          });
        }
      }

      jobsList.push({
        id: jobId,
        ...jobData,
        applicants: applicantsList,
      });
    }

    return jobsList;
  } catch (error) {
    console.error("Error fetching applicants: ", error);
    throw error;
  }
};

export const fetchUserType = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const employerDocRef = doc(db, "employers", user.uid);
    const jobSeekerDocRef = doc(db, "seekers", user.uid);

    const employerDocSnapshot = await getDoc(employerDocRef);
    const jobSeekerDocSnapshot = await getDoc(jobSeekerDocRef);

    if (employerDocSnapshot.exists()) {
      return "employer";
    } else if (jobSeekerDocSnapshot.exists()) {
      return "seeker";
    } else {
      throw new Error("No such user!");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchEmployerData = async (userId) => {
  const docRef = doc(db, "employers", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No such document!");
  }
};

export const fetchCreatedJobs = async (jobIds) => {
  const jobs = [];
  for (const jobId of jobIds) {
    const jobDocRef = doc(db, "jobs", jobId);
    const jobDocSnap = await getDoc(jobDocRef);
    if (jobDocSnap.exists()) {
      jobs.push(jobDocSnap.data());
    }
  }
  return jobs;
};

export const updateEmployerData = async (userId, formData) => {
  const docRef = doc(db, "employers", userId);
  await updateDoc(docRef, formData);
};

export const fetchSeekerData = async (userId) => {
  const docRef = doc(db, "seekers", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No such document!");
  }
};

export const fetchAppliedJobs = async (jobIds) => {
  const jobs = [];
  for (const jobId of jobIds) {
    const jobDocRef = doc(db, "jobs", jobId);
    const jobDocSnap = await getDoc(jobDocRef);
    if (jobDocSnap.exists()) {
      jobs.push(jobDocSnap.data());
    }
  }
  return jobs;
};

export const updateSeekerData = async (userId, formData) => {
  const docRef = doc(db, "seekers", userId);
  await updateDoc(docRef, formData);
};

export const fetchUserName = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userType = await fetchUserType();
      let userData;
      if (userType === "seeker") {
        userData = await fetchSeekerData(user.uid);
      } else if (userType === "employer") {
        userData = await fetchEmployerData(user.uid);
      }
      return { userName: userData?.name || userData?.companyName, userType };
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
};
