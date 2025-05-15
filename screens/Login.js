import { View, Text, TextInput } from "react-native";
import { Button, HelperText, TextInput as PaperInput } from "react-native-paper";
import { login as loginAction } from "../store";
import { useEffect, useState } from "react";
import { useMyContextController } from "../store";

const Login = ({ navigation }) => {
  const { controller, dispatch } = useMyContextController();
  const { userLogin } = controller;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const hasErrorEmail = !email.includes("@") || email.length < 6;
  const hasErrorPassword = password.length < 6;

  const handleLogin = () => {
    loginAction(dispatch, email, password);
  };

  useEffect(() => {
    console.log(userLogin);
    if (userLogin != null) {
      if (userLogin.role === "admin") {
        navigation.navigate("Admin");
      } else if (userLogin.role === "customer") {
        navigation.navigate("Customer");
      }
    }
  }, [userLogin,navigation]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ fontSize: 40, fontWeight: "bold", textAlign: "center", marginBottom: 50 }}>Login(Tran Tien DAt)</Text>
        <PaperInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          error={hasErrorEmail}
        />
        {hasErrorEmail ? (
          <HelperText type="error" visible={hasErrorEmail}>
            Email is invalid!
          </HelperText>
        ) : null}
        <PaperInput
          label="Password"
          value={password}
          secureTextEntry={hiddenPassword}
          onChangeText={(text) => setPassword(text)}
          right={<PaperInput.Icon icon={hiddenPassword ? "eye" : "eye-off"} onPress={() => setHiddenPassword(!hiddenPassword)} />}
          error={hasErrorPassword}
        />
        {hasErrorPassword ? (
          <HelperText type="error" visible={hasErrorPassword}>
            Password must be at least 6 characters
          </HelperText>
        ) : null}
        <Button mode="contained" onPress={handleLogin} style={{ marginTop: 20 }} buttonColor="blue">
          Login
        </Button>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
        <Text>Don't have an account? </Text>
        <Button onPress={() => navigation.navigate("Register")} textColor="blue" compact>
          Register
        </Button>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Button onPress={() => navigation.navigate("ForgotPassword")} textColor="blue" compact>
          Forgot Password
        </Button>
      </View>
    </View>
  );
};

export default Login;