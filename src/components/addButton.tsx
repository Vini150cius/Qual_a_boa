import { Plus } from "lucide-react-native";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../util/ThemeProvider";
import type { AddButtonProps } from "../types/screens.types";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../routes";
import { useState } from "react";

export function AddButton({
  type,
  onCreateCategory,
  categoryId,
  categoryTitle,
}: AddButtonProps) {
  const { theme } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  function closeModal() {
    setIsModalVisible(false);
    setCategoryName("");
  }

  function handleMainPress() {
    if (type === "category") {
      setIsModalVisible(true);
      return;
    }
    if (type === "dish" && categoryId) {
      navigation.navigate("Novo Prato", {
        categoryId,
        categoryTitle: categoryTitle ?? "Lista de Pratos",
        dishToEdit: undefined,
      });
    }
  }

  async function handleSaveCategory() {
    const formattedName = categoryName;

    await onCreateCategory?.(formattedName);
    closeModal();
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.secondary }]}
        onPress={handleMainPress}
      >
        <Plus size={35} color={theme.onSecondary} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={closeModal} />
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Nova categoria
            </Text>
            <TextInput
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Nome da categoria"
              placeholderTextColor={theme.placeHolder}
              style={[
                styles.modalInput,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
              autoFocus
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={closeModal}
              >
                <Text style={[styles.cancelText, { color: theme.text }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={handleSaveCategory}
              >
                <Text
                  style={[styles.confirmText, { color: theme.onSecondary }]}
                >
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 24,
    right: 24,
    borderRadius: 999,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCard: {
    borderRadius: 18,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  cancelText: {
    fontWeight: "600",
  },
  confirmText: {
    fontWeight: "600",
  },
});
