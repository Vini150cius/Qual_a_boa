import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useContext,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { lightTheme, darkTheme } from "./theme";

type ThemeMode = "light" | "dark";

const THEME_MODE_STORAGE_KEY = "@qual_a_boa:theme_mode";
const THEME_MODE_FILE =
  FileSystem.documentDirectory != null
    ? `${FileSystem.documentDirectory}${THEME_MODE_STORAGE_KEY}.txt`
    : null;

async function loadStoredThemeMode(): Promise<ThemeMode | null> {
  if (!THEME_MODE_FILE) {
    return null;
  }

  const fileInfo = await FileSystem.getInfoAsync(THEME_MODE_FILE);
  if (!fileInfo.exists) {
    return null;
  }

  const storedThemeMode = (
    await FileSystem.readAsStringAsync(THEME_MODE_FILE)
  ).trim();
  if (storedThemeMode === "light" || storedThemeMode === "dark") {
    return storedThemeMode;
  }

  return null;
}

async function persistThemeMode(mode: ThemeMode) {
  if (!THEME_MODE_FILE) {
    return;
  }

  await FileSystem.writeAsStringAsync(THEME_MODE_FILE, mode);
}

interface ThemeContextType {
  theme: any;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContextType);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    useColorScheme() === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    async function loadThemePreference() {
      try {
        const storedThemeMode = await loadStoredThemeMode();

        if (storedThemeMode === "light" || storedThemeMode === "dark") {
          setThemeModeState(storedThemeMode);
        }
      } catch (error) {
        console.error("Erro ao carregar tema salvo:", error);
      }
    }

    void loadThemePreference();
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);

    try {
      await persistThemeMode(mode);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  }, []);

  const isDark = themeMode === "dark";

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    void setThemeMode(isDark ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, themeMode, setThemeMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
