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

export function Header({
  screen,
  title,
  onBackPress,
  onSearchChangeText,
  onSearchSubmit,
  searchPlaceholder = "Buscar...",
}: HeaderProps) {
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

  if (isSearching) {
    return (
      <View
        style={[
          style.container,
          { paddingTop: insets.top, height: 76 + insets.top },
        ]}
      >
        <View style={style.searchExpandedContainer}>
          <TextInput
            style={style.searchInput}
            value={searchValue}
            onChangeText={handleSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor="#8a8a8a"
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => onSearchSubmit?.(searchValue)}
          />
          <TouchableOpacity
            onPress={closeSearch}
            style={style.iconCircle}
            activeOpacity={0.7}
          >
            <X size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        style.container,
        { paddingTop: insets.top, height: 76 + insets.top },
      ]}
    >
      <View style={style.row}>
        <View style={style.leftSlot}>
          {screen !== "home" && (
            <TouchableOpacity
              onPress={handleBackPress}
              style={style.iconCircle}
              activeOpacity={0.7}
            >
              <ChevronLeft size={22} color="#333" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[style.title, screen !== "home" && style.titleCentered]}>
          {screen === "home" ? "Qual a boa?" : title}
        </Text>

        <View style={style.rightSlot}>
          <TouchableOpacity
            onPress={() => setIsSearching(true)}
            style={style.iconCircle}
            activeOpacity={0.7}
          >
            <Search size={20} color="#333" />
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
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
    color: "#1d1d1d",
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
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eceff1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  searchExpandedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#d8dee4",
  },
});
