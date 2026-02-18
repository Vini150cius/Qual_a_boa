import React, {
  createContext,
  useState,
  useContext,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "./theme";

interface ThemeContextType {
  theme: any; 
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContextType);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [isDark, setIsDark] = useState(useColorScheme() === "dark");

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
