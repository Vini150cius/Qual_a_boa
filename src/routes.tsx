import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "./screens/Home";
import NewDish from "./screens/NewDish";
import { useTheme } from "./util/ThemeProvider";
import DishList from "./screens/DishList";
import type { DishItemProps } from "./types/dish.types";
import Settings from "./screens/Settings";

export type RootTabParamList = {
  Home: undefined;
  Configurações: undefined;
  "Novo Prato": {
    categoryId: string;
    categoryTitle: string;
    dishToEdit?: DishItemProps;
  };
  "Lista de Pratos": {
    categoryId: string;
    categoryTitle: string;
    refreshKey?: number;
  };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function lightenHexColor(hexColor: string, amount = 0.25) {
  const hex = hexColor.replace("#", "");

  if (hex.length !== 6) {
    return hexColor;
  }

  const numericValue = Number.parseInt(hex, 16);
  const red = (numericValue >> 16) & 255;
  const green = (numericValue >> 8) & 255;
  const blue = numericValue & 255;

  const mixWithWhite = (channel: number) =>
    Math.round(channel + (255 - channel) * amount);

  const nextRed = mixWithWhite(red);
  const nextGreen = mixWithWhite(green);
  const nextBlue = mixWithWhite(blue);

  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${toHex(nextRed)}${toHex(nextGreen)}${toHex(nextBlue)}`;
}

export default function TabsNavigation() {
  const { theme } = useTheme();
  const activeTabColor = lightenHexColor(theme.secondary, 0.3);

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
        tabBarActiveTintColor: activeTabColor,
        tabBarInactiveTintColor: theme.placeHolder,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Configurações") {
            iconName = "settings-outline";
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
        name="Configurações"
        component={Settings}
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
