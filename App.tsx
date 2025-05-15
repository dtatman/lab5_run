import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./routers/Router";
import { MyContextControllerProvider } from "./store";

// Import modular Firebase
import { getAuth, fetchSignInMethodsForEmail, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import { getFirestore, doc, collection, getDocs, setDoc, query, where, limit } from "@react-native-firebase/firestore";

const auth = getAuth();
const firestore = getFirestore();

const App = () => {
  const admin = {
    fullName: "Admin",
    email: "abc@gmail.com",
    password: "123456",
    phone: "0913131732",
    address: "Binh Duong",
    role: "admin",
  };

  useEffect(() => {
    const checkAndCreateAdmin = async () => {
      try {
        const methods = await fetchSignInMethodsForEmail(auth, admin.email);

        if (methods.length === 0) {
          // Chưa có user admin -> tạo mới
          const newUserCredential = await createUserWithEmailAndPassword(auth, admin.email, admin.password);

          if (newUserCredential && newUserCredential.user) {
            const adminDocRef = doc(firestore, "USERS", newUserCredential.user.uid);
            await setDoc(adminDocRef, admin);
            console.log("Đã tạo tài khoản admin và lưu thông tin vào Firestore");
          }
        } else {
          // User đã có -> check Firestore
          const usersCollection = collection(firestore, "USERS");
          const q = query(usersCollection, where("email", "==", admin.email), limit(1));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // Chưa có trong Firestore -> tạo mới
            const adminDocRef = doc(firestore, "USERS", admin.email);
            await setDoc(adminDocRef, admin);
            console.log("Đã lưu thông tin admin vào Firestore (tài khoản đã có trong Auth)");
          } else {
            console.log("Tài khoản admin đã tồn tại trong Authentication và Firestore");
          }
        }
      } catch (error) {
        console.error("Lỗi trong quá trình tạo hoặc kiểm tra admin:", error);
      }
    };

    checkAndCreateAdmin();
  }, []);

  return (
    <MyContextControllerProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </MyContextControllerProvider>
  );
};

export default App;
