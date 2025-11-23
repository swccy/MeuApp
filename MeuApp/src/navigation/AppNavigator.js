import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import IMCScreen from "../screens/IMCScreen";
import TodoScreen from "../screens/TodoScreen";
import EditAccountScreen from "../screens/EditAccountScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: "#1E88E5" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Criar Conta" }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Tela Inicial", headerLeft: null }} />
      <Stack.Screen name="IMC" component={IMCScreen} options={{ title: "Calculadora de IMC" }} />
      <Stack.Screen name="Todo" component={TodoScreen} options={{ title: "Lista de Tarefas" }} />
      <Stack.Screen name="EditAccount" component={EditAccountScreen} options={{ title: "Editar Conta" }} />
    </Stack.Navigator>
  );
}
