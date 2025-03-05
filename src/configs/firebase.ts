// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuTeD4_f7YiaasqBfYQWkh7wsyBKZjPJo",
  authDomain: "hlakabar-a9e21.firebaseapp.com",
  projectId: "hlakabar-a9e21",
  storageBucket: "hlakabar-a9e21.appspot.com",
  messagingSenderId: "957367250500",
  appId: "1:957367250500:web:6d215ebec1e0c69d72d611",
  measurementId: "G-4NPXF2ML34",
  // apiKey: "AIzaSyAhKstMYdkk1rzZTz20Pk3C4WyOX9L5ELQ",
  // authDomain: "hlakabar-company.firebaseapp.com",
  // projectId: "hlakabar-company",
  // storageBucket: "hlakabar-company.appspot.com",
  // messagingSenderId: "268160797429",
  // appId: "1:268160797429:web:b39348919a8775bb5153bc",
  // measurementId: "G-71QC0259LR",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// const analytics = getAnalytics(app);

async function addUser(user) {
  try {
    const docRef = await addDoc(collection(db, "Users"), {
      branch: user.branch,
      role: user.role,
      email: user.email,
      // Add other fields as needed
    });
    console.log("User added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding user: ", e);
  }
}

// Example usage
// addUser({
//   branch: "Branch_A",
//   role: "admin",
//   email: "mr.kaungthantzin@gmail.com",
// });
