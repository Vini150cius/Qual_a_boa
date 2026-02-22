import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "./screens/Home";
import NewDish from "./screens/NewDish";

export type RootTabParamList = {
  Home: undefined;
  Mídias: undefined;
  NewDish: undefined;
  Configurações: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabsNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Mídias") {
            iconName = "image-outline";
          } else {
            iconName = "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="NewDish"
        component={NewDish}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
