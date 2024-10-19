// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { Ciudadano } from "@/interfaces/ciudadano.interface";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

export async function crearDoc(data: Ciudadano) {
  const path = "ciudadanos";
  try {
    const q = query(
      collection(db, path),
      where("rut", "==", data.rut),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size == 1) {
      querySnapshot.forEach(async (documentos) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(documentos.id, " => ", documentos.data());
        const usuarioRef = doc(db, path, documentos.id);
        await updateDoc(usuarioRef, { ...data, update_at: serverTimestamp() });
      });
    } else if (querySnapshot.size == 0) {
      const docRef = doc(collection(db, path));
      await setDoc(docRef, {
        uid: docRef.id,
        ...data,
        created_at: serverTimestamp(),
      });
    }
    return { ...data };
  } catch (error) {
    return false;
  }
}
