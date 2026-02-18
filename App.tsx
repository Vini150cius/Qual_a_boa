import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { ThemeProvider, useTheme } from "./src/util/ThemeProvider";
import Toast from "react-native-toast-message";
import TabsNavigation from "./src/routes";

function AppContent() {
  const { theme, isDark } = useTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border || "transparent",
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <TabsNavigation />
      <Toast />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
