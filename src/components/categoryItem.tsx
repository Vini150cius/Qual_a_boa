import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { CategoryItemProps } from "../types/category.types";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../routes";
import { useTheme } from "../util/ThemeProvider";

export function CategoryItem({
  title,
  quantity,
  imageUrl,
  id,
  onEditTitle,
}: CategoryItemProps) {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { theme } = useTheme();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  function openEditModal() {
    setNewTitle(title);
    setIsEditModalVisible(true);
  }

  function closeEditModal() {
    setIsEditModalVisible(false);
  }

  async function handleSaveTitle() {
    const formattedTitle = newTitle.trim();

    if (!formattedTitle) {
      return;
    }

    await onEditTitle?.(id, formattedTitle);
    closeEditModal();
  }

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        key={id}
        onPress={() => {
          navigation.navigate("Lista de Pratos", {
            categoryId: id,
            categoryTitle: title,
          });
        }}
        onLongPress={openEditModal}
        delayLongPress={300}
      >
        <Image
          source={{
            uri: imageUrl,
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.quantity}>{quantity} receitas</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={isEditModalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={closeEditModal} />
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Editar categoria
            </Text>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
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
                style={[styles.actionButton, styles.cancelButton]}
                onPress={closeEditModal}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={handleSaveTitle}
              >
                <Text style={styles.confirmText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    width: "100%",
    height: 150,
    borderRadius: 22,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    position: "absolute",
    bottom: 25,
    left: 8,
    color: "#fff",
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 5, height: 2 },
    shadowColor: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    position: "absolute",
    bottom: 10,
    left: 8,
    color: "#fff",
    fontSize: 12,
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
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  cancelText: {
    color: "#111827",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
