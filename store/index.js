import { createContext, useContext, useMemo, useReducer } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc, collection } from "@react-native-firebase/firestore";
import { Alert } from "react-native";

const MyContext = createContext();
MyContext.displayName = "vbdbvabv";

// Dinh nghia Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userLogin: action.value };
    case "LOGOUT":
      return { ...state, userLogin: null };
    default:
      throw new Error("Action not found");
  }
};

// Dinh nghia MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
  // Khoi store
  const initialState = {
    userLogin: null,
    services: [],
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  // phan biet useMemo useEffect
  const value = useMemo(() => ({ controller, dispatch }), [controller, dispatch]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

// Dinh nghia useMyContextController
const useMyContextController = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContextController must be inside MyContextControllerProvider");
  }
  return context;
};

// Firebase instances
const auth = getAuth();
const firestore = getFirestore();
const USERS_COLLECTION = collection(firestore, "USERS");

// Hàm login đúng cách
const login = async (dispatch, email, password) => {
  try {
    // 1. Đăng nhập auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Lấy data user từ Firestore theo uid
    const userDocRef = doc(firestore, "USERS", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      dispatch({ type: "USER_LOGIN", value: userDocSnap.data() });
    } else {
      Alert.alert("Không tìm thấy thông tin người dùng trong Firestore");
    }
  } catch (error) {
    Alert.alert("Sai email hoặc mật khẩu hoặc lỗi khác");
  }
};

const logout = (dispatch) => {
  signOut(auth)
    .then(() => dispatch({ type: "LOGOUT" }))
    .catch((error) => {
      Alert.alert("Lỗi khi đăng xuất");
      console.error(error);
    });
};

export { MyContextControllerProvider, useMyContextController, login, logout };
