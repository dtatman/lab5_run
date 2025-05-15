import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Services from "../screens/Services";
import AddNewService from "../screens/AddNewService";
import ServiceDetail from "../screens/ServiceDetail";
import { useMyContextController } from "../store";
import { IconButton } from "react-native-paper";

const Stack = createStackNavigator();

const RouterService = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      initialRouteName="Services"
      screenOptions={({ navigation, route }) => ({
        title: userLogin?.name || "Services",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "pink",
        },
        headerRight: (props) => (
          <IconButton
            icon="account"
            color={props.color || "black"}
            onPress={() => {
              // Ví dụ điều hướng sang màn hình Profile (bạn cần tạo màn hình này)
              console.log("Account button pressed");
              // navigation.navigate("Profile"); 
              // Nếu bạn chưa có màn hình Profile, bạn có thể để console.log tạm
            }}
          />
        ),
      })}
    >
      <Stack.Screen name="Services" component={Services} />
      <Stack.Screen name="AddNewService" component={AddNewService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
    </Stack.Navigator>
  );
};

export default RouterService;
