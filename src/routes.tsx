import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "./screens/Home";
import NewDish from "./screens/NewDish";
import { useTheme } from "./util/ThemeProvider";
import DishList from "./screens/DishList";

export type RootTabParamList = {
  Home: undefined;
  "Novo Prato": { categoryId: string };
  "Lista de Pratos": { categoryId: string; categoryTitle: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabsNavigation() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.secondary,
        tabBarInactiveTintColor: theme.placeHolder,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Novo Prato") {
            iconName = "add-circle-outline";
          } else {
            iconName = "list-outline";
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
        name="Novo Prato"
        component={NewDish}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Lista de Pratos"
        component={DishList}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
}
