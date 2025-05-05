import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, gerçekzamanlıdatabase kullanacaksam bu olacak unutma.
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };

  

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyAi4b_ruPdPPDVqv-oI-527UJz3YNRe86M",
//   authDomain: "mehmetblog-3cc5b.firebaseapp.com",
//   databaseURL: "https://mehmetblog-3cc5b-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "mehmetblog-3cc5b",
//   storageBucket: "mehmetblog-3cc5b.firebasestorage.app",
//   messagingSenderId: "156270534478",
//   appId: "1:156270534478:web:b0aa68694ffdd44c3b881f",
//   measurementId: "G-314CB270WW"
// };


// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
