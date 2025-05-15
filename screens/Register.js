import React, { useState } from "react";
import { Alert, View, Text } from "react-native";
import { Button, HelperText, TextInput as PaperInput } from "react-native-paper";

// Import modular Firebase
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "@react-native-firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "@react-native-firebase/auth";

const firestore = getFirestore();
const auth = getAuth();

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = useState(true);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const hasErrorFullName = fullName === "";
  const hasErrorEmail = !email.includes("@") || email.length < 6;
  const hasErrorPassword = password.length < 6;
  const hasErrorPasswordConfirm = passwordConfirm !== password;

  const handleCreateAccount = async () => {
    if (hasErrorFullName || hasErrorEmail || hasErrorPassword || hasErrorPasswordConfirm) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin nhập");
      return;
    }

    try {
      // Kiểm tra email đã tồn tại trong Firestore chưa
      const usersCollection = collection(firestore, "USERS");
      const q = query(usersCollection, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        Alert.alert("Lỗi", "Email đã được sử dụng để đăng ký.");
        return;
      }

      // Tạo tài khoản Auth Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential && userCredential.user) {
        // Lưu thông tin người dùng trong Firestore với doc id là uid
        const userDocRef = doc(firestore, "USERS", userCredential.user.uid);
        await setDoc(userDocRef, {
          fullName,
          email,
          phone,
          address,
          role: "customer",
        });

        Alert.alert("Thành công", "Tạo tài khoản thành công");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center", marginTop: 50, marginBottom: 50, color: "pink" }}>
        Register New Account
      </Text>
      <PaperInput label="Full Name" value={fullName} onChangeText={setFullName} error={hasErrorFullName} />
      {hasErrorFullName && <HelperText type="error" visible={hasErrorFullName}>Full name không được phép để trống</HelperText>}

      <PaperInput label="Email" value={email} onChangeText={setEmail} error={hasErrorEmail} />
      {hasErrorEmail && <HelperText type="error" visible={hasErrorEmail}>Địa chỉ email không hợp lệ</HelperText>}

      <PaperInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={hiddenPassword}
        right={<PaperInput.Icon icon={hiddenPassword ? "eye" : "eye-off"} onPress={() => setHiddenPassword(!hiddenPassword)} />}
        error={hasErrorPassword}
      />
      {hasErrorPassword && <HelperText type="error" visible={hasErrorPassword}>Password ít nhất 6 kí tự</HelperText>}

      <PaperInput
        label="Confirm Password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry={hiddenPasswordConfirm}
        right={<PaperInput.Icon icon={hiddenPasswordConfirm ? "eye" : "eye-off"} onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)} />}
        error={hasErrorPasswordConfirm}
      />
      {hasErrorPasswordConfirm && <HelperText type="error" visible={hasErrorPasswordConfirm}>Confirm Password phải trùng khớp với password</HelperText>}

      <PaperInput label="Address" value={address} onChangeText={setAddress} style={{ marginBottom: 20 }} />
      <PaperInput label="Phone" value={phone} onChangeText={setPhone} style={{ marginBottom: 20 }} />

      <Button mode="contained" onPress={handleCreateAccount} style={{ marginTop: 20 }} buttonColor="green">
        Create New Account
      </Button>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
        <Text>Do you have an account? </Text>
        <Button onPress={() => navigation.navigate("Login")} textColor="blue" compact>
          Login Account
        </Button>
      </View>
    </View>
  );
};

export default Register;
