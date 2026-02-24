import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { HeaderProps } from "../types/screens.types";
import { ChevronLeft, Search, X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../util/ThemeProvider";

export function Header({
  screen,
  title,
  onBackPress,
  onSearchChangeText,
  onSearchSubmit,
  searchPlaceholder = "Buscar...",
}: HeaderProps) {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function handleBackPress() {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  function handleSearchChange(text: string) {
    setSearchValue(text);
    onSearchChangeText?.(text);
  }

  function closeSearch() {
    setIsSearching(false);
    setSearchValue("");
    onSearchChangeText?.("");
  }

  const iconCircleStyle = {
    backgroundColor: theme.background,
    borderColor: theme.border,
  };

  if (isSearching) {
    return (
      <View
        style={[
          style.container,
          {
            paddingTop: insets.top,
            height: 76 + insets.top,
            backgroundColor: theme.card,
          },
        ]}
      >
        <View style={style.searchExpandedContainer}>
          <TextInput
            style={[
              style.searchInput,
              {
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            value={searchValue}
            onChangeText={handleSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.placeHolder}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => onSearchSubmit?.(searchValue)}
          />
          <TouchableOpacity
            onPress={closeSearch}
            style={[style.iconCircle, iconCircleStyle]}
            activeOpacity={0.7}
          >
            <X size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        style.container,
        {
          paddingTop: insets.top,
          height: 76 + insets.top,
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={style.row}>
        <View style={style.leftSlot}>
          {screen !== "home" && (
            <TouchableOpacity
              onPress={handleBackPress}
              style={[style.iconCircle, iconCircleStyle]}
              activeOpacity={0.7}
            >
              <ChevronLeft size={22} color={theme.text} />
            </TouchableOpacity>
          )}
        </View>

        <Text
          style={[
            style.title,
            { color: theme.text },
            screen !== "home" && style.titleCentered,
          ]}
        >
          {screen === "home" ? "Qual a boa?" : title}
        </Text>

        <View style={style.rightSlot}>
          <TouchableOpacity
            onPress={() => setIsSearching(true)}
            style={[style.iconCircle, iconCircleStyle]}
            activeOpacity={0.7}
          >
            <Search size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    height: 76,
    justifyContent: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  leftSlot: {
    width: 42,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
  },
  titleCentered: {
    textAlign: "center",
  },
  rightSlot: {
    width: 42,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    elevation: 1,
  },
  searchExpandedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 42,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
});
