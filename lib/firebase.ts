import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { addDoc } from "firebase/firestore";

// Firebase config bilgileri
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, gerçekzamanlıdatabase kullanacaksam bu olacak unutma.
};

// Firebase'i başlatmak için fonks.
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Yorumları çekmek için fonks.
export const getYorumlar = async () => {
  const yorumlarRef = collection(firestore, "yorumlar");
  const q = query(yorumlarRef, orderBy("olusturulmaTarihi", "desc"));
  const yorumlarSnapshot = await getDocs(q);
  const yorumlarListesi = yorumlarSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return yorumlarListesi;
};
// Yorum eklemeye Fonksi.
export const yorumEkle = async (adSoyad: string, yorumMetni: string) => {
  try {
    await addDoc(collection(firestore, "yorumlar"), {
      adSoyad,
      yorumMetni,
      olusturulmaTarihi: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Yorum eklenirken hata oluştu:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    await deleteDoc(doc(firestore, "yorumlar", commentId));
    return true;
  } catch (error) {
    console.error("Yorum silinirken hata oluştu:", error);
    throw error;
  }
};

export const updateComment = async (commentId: string, newText: string) => {
  try {
    await updateDoc(doc(firestore, "yorumlar", commentId), {
      yorumMetni: newText,
      guncellemeTarihi: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Yorum güncellenirken hata oluştu:", error);
    throw error;
  }
};

export { firestore };

// biryerde hata var bak buna

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
