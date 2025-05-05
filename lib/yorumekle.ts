import { collection, addDoc, Timestamp } from "firebase/firestore";
import { firestore } from "./firebase";

export const yorumEkle = async (adSoyad: string, yorumMetni: string) => {
  try {
    const belge = await addDoc(collection(firestore, "yorumlar"), {
      adSoyad,
      yorumMetni,
      olusturulmaTarihi: Timestamp.now(),
    });
    console.log("Yorum eklendi, ID:", belge.id);
  } catch (hata) {
    console.error("Yorum eklenirken hata oluştu:", hata);
  }
};
