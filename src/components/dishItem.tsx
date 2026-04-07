import { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Star } from "lucide-react-native";
import type { DishItemProps } from "../types/dish.types";
import { useTheme } from "../util/ThemeProvider";

type Props = {
  data: DishItemProps;
  onEditPress?: (dish: DishItemProps) => void;
};

export function DishItem({ data, onEditPress }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme } = useTheme();
  const recipeUrl = data.recipeUrl?.trim();

  function isValidHttpUrl(value: string) {
    try {
      const normalized = value.startsWith("www.") ? `https://${value}` : value;
      const url = new URL(normalized);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  const hasRecipeUrl = Boolean(recipeUrl);
  const isClickableRecipeUrl = recipeUrl ? isValidHttpUrl(recipeUrl) : false;

  function closeModal() {
    setIsModalVisible(false);
  }

  function handleEditPress() {
    closeModal();
    onEditPress?.(data);
  }

  async function handleRecipeLinkPress() {
    if (!recipeUrl || !isClickableRecipeUrl) return;

    const normalized = recipeUrl.startsWith("www.")
      ? `https://${recipeUrl}`
      : recipeUrl;

    const supported = await Linking.canOpenURL(normalized);
    if (supported) {
      await Linking.openURL(normalized);
    }
  }

  return (
    <>
      <TouchableOpacity
        style={styles.containerDishItem}
        activeOpacity={0.85}
        onPress={() => setIsModalVisible(true)}
      >
        <Image source={{ uri: data.imageURL }} style={styles.dishImage} />
        <Text style={styles.dishTitle}>{data.title}</Text>
        <View style={styles.dishRankContainer}>
          <Text style={styles.dishRankText}>
            {data.rank}.0{" "}
            <Star
              size={15}
              fill={styles.dishRankText.color}
              color={styles.dishRankText.color}
            />{" "}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={closeModal} />
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <ScrollView
              style={styles.modalScrollArea}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {data.title}
              </Text>

              <Image
                source={{ uri: data.imageURL }}
                style={styles.modalImage}
              />

              <Text style={[styles.modalLabel, { color: theme.placeHolder }]}>
                Nota
              </Text>
              <Text style={[styles.modalValue, { color: theme.text }]}>
                {data.rank}.0
              </Text>

              {hasRecipeUrl ? (
                <>
                  <Text
                    style={[styles.modalLabel, { color: theme.placeHolder }]}
                  >
                    Link da receita
                  </Text>
                  {isClickableRecipeUrl ? (
                    <Text
                      style={[
                        styles.modalValue,
                        styles.modalLinkValue,
                        { color: theme.secondary },
                      ]}
                      onPress={handleRecipeLinkPress}
                    >
                      {recipeUrl}
                    </Text>
                  ) : (
                    <Text style={[styles.modalValue, { color: theme.text }]}>
                      {recipeUrl}
                    </Text>
                  )}
                </>
              ) : null}

              <Text style={[styles.modalLabel, { color: theme.placeHolder }]}>
                Anotações
              </Text>
              <Text style={[styles.modalValue, { color: theme.text }]}>
                {data.recipe || "Sem anotações"}
              </Text>
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelText}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={handleEditPress}
              >
                <Text style={styles.confirmText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  containerDishItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 35,
    marginBottom: 18,
    marginHorizontal: 18,
    backgroundColor: "#fff",
  },
  dishImage: {
    height: 100,
    borderRadius: 999,
    marginRight: 10,
    width: "33%",
  },
  dishTitle: {
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 6,
    alignSelf: "flex-start",
    width: "44%",
  },
  dishRankContainer: {
    backgroundColor: "#FDF2E9",
    padding: 7,
    borderRadius: 999,
    alignSelf: "center",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "22%",
  },
  dishRankText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F2994A",
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
    gap: 8,
    elevation: 6,
    maxHeight: "85%",
  },
  modalScrollArea: {
    flexGrow: 0,
  },
  modalScrollContent: {
    paddingBottom: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  modalValue: {
    fontSize: 14,
    marginBottom: 4,
  },
  modalLinkValue: {
    textDecorationLine: "underline",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
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
