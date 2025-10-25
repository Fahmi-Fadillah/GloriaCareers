import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // sesuaikan path

const checkFirebaseConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "test"));
    console.log("Firebase Firestore Connected ✅");
    console.log("Jumlah dokumen di koleksi 'test':", querySnapshot.size);
  } catch (error) {
    console.error("Firebase Firestore Error ❌", error);
  }
};
checkFirebaseConnection();
