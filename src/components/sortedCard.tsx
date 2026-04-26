import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../util/ThemeProvider";
import { Dice5, Sparkles, X } from "lucide-react-native";
import type { Category } from "../types/category.types";
import { fetchDishes } from "../service/DishService";
import type { Dish } from "../types/dish.types";
import StarRating from "react-native-star-rating-widget";

type Props = {
  categories: Category[];
};

function formatRating(value: number) {
  return `${value.toFixed(1)}`;
}

function pickRandomDish(dishes: Dish[]) {
  const randomIndex = Math.floor(Math.random() * dishes.length);
  return dishes[randomIndex];
}

export function SortedCard({ categories }: Props) {
  const { theme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [minRating, setMinRating] = useState(1);
  const [maxRating, setMaxRating] = useState(5);
  const [isSorting, setIsSorting] = useState(false);
  const [sortedDish, setSortedDish] = useState<Dish | null>(null);
  const [sortError, setSortError] = useState<string | null>(null);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (
      selectedCategoryId &&
      !categories.some((category) => category.id === selectedCategoryId)
    ) {
      setSelectedCategoryId(categories[0]?.id ?? "");
    }
  }, [categories, selectedCategoryId]);

  function closeModal() {
    setIsModalVisible(false);
    setSortError(null);
  }

  function openModal() {
    setSortedDish(null);
    setSortError(null);
    setIsModalVisible(true);
  }

  function handleMinRatingChange(value: number) {
    setMinRating(value);
    setSortedDish(null);
    setSortError(null);

    if (value > maxRating) {
      setMaxRating(value);
    }
  }

  function handleMaxRatingChange(value: number) {
    setMaxRating(value);
    setSortedDish(null);
    setSortError(null);

    if (value < minRating) {
      setMinRating(value);
    }
  }

  async function handleSortMeal() {
    if (!selectedCategoryId) {
      setSortError("Selecione uma categoria para sortear.");
      return;
    }

    setIsSorting(true);
    setSortedDish(null);
    setSortError(null);

    try {
      const dishes = await fetchDishes(selectedCategoryId);
      const filteredDishes = dishes.filter(
        (dish) => dish.rank >= minRating && dish.rank <= maxRating,
      );

      if (filteredDishes.length === 0) {
        setSortError("Nenhum prato encontrado com essa categoria e nota.");
        return;
      }

      setSortedDish(pickRandomDish(filteredDishes));
    } catch (error) {
      console.error("Erro ao sortear refeição:", error);
      setSortError("Não foi possível sortear a refeição agora.");
    } finally {
      setIsSorting(false);
    }
  }

  const canSort = categories.length > 0 && Boolean(selectedCategoryId);

  return (
    <>
      <View style={[styles.cardContainer, { backgroundColor: theme.primary }]}>
        <View style={styles.leftContent}>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              O que comer hoje ?
            </Text>
            <Text style={[styles.cardText, { color: theme.placeHolder }]}>
              Escolha a categoria e a faixa de nota, depois deixe a sorte
              decidir
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.secondary },
              !canSort && styles.buttonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={openModal}
            disabled={!canSort}
          >
            <Dice5 size={16} color={theme.onSecondary} />
            <Text style={[styles.buttonText, { color: theme.onSecondary }]}>
              Sortear Refeição
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardImageBorder}>
          <View style={styles.cardImageClip}>
            <Image
              source={require("./../../assets/images/cardsorted.png")}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={closeModal} />

          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Sortear refeição
                </Text>
                <Text
                  style={[styles.modalSubtitle, { color: theme.placeHolder }]}
                >
                  Defina a categoria e a faixa de nota.
                </Text>
              </View>

              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.sectionLabel, { color: theme.placeHolder }]}>
                Categoria
              </Text>

              <View style={styles.optionsWrap}>
                {categories.length === 0 ? (
                  <Text
                    style={[styles.emptyText, { color: theme.placeHolder }]}
                  >
                    Nenhuma categoria cadastrada.
                  </Text>
                ) : (
                  categories.map((category) => {
                    const isSelected = category.id === selectedCategoryId;

                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.optionChip,
                          {
                            backgroundColor: isSelected
                              ? theme.secondary
                              : theme.background,
                            borderColor: isSelected
                              ? theme.secondary
                              : theme.placeHolder,
                          },
                        ]}
                        onPress={() => {
                          setSelectedCategoryId(category.id);
                          setSortedDish(null);
                          setSortError(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            {
                              color: isSelected ? theme.background : theme.text,
                            },
                          ]}
                        >
                          {category.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>

              <View style={styles.rangeBlock}>
                <View style={styles.rangeColumn}>
                  <Text
                    style={[styles.sectionLabel, { color: theme.placeHolder }]}
                  >
                    Nota mínima
                  </Text>
                  <View style={styles.starRow}>
                    <StarRating
                      rating={minRating}
                      onChange={(value) => handleMinRatingChange(value)}
                      starSize={28}
                      color={theme.secondary}
                      step="full"
                    />
                  </View>
                  <Text style={[styles.ratingText, { color: theme.text }]}>
                    {formatRating(minRating)}
                  </Text>
                </View>

                <View style={styles.rangeColumn}>
                  <Text
                    style={[styles.sectionLabel, { color: theme.placeHolder }]}
                  >
                    Nota máxima
                  </Text>
                  <View style={styles.starRow}>
                    <StarRating
                      rating={maxRating}
                      onChange={(value) => handleMaxRatingChange(value)}
                      starSize={28}
                      color={theme.secondary}
                      step="full"
                    />
                  </View>
                  <Text style={[styles.ratingText, { color: theme.text }]}>
                    {formatRating(maxRating)}
                  </Text>
                </View>
              </View>

              <View
                style={[styles.summaryBox, { backgroundColor: theme.primary }]}
              >
                <Sparkles size={16} color={theme.text} />
                <Text style={[styles.summaryText, { color: theme.text }]}>
                  Sorteio atual: {selectedCategory?.title ?? "sem categoria"}{" "}
                  entre {formatRating(minRating)} e {formatRating(maxRating)}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.sortButton,
                  { backgroundColor: theme.secondary },
                  (!canSort || isSorting) && styles.buttonDisabled,
                ]}
                onPress={handleSortMeal}
                disabled={!canSort || isSorting}
              >
                <Text
                  style={[styles.sortButtonText, { color: theme.onSecondary }]}
                >
                  {isSorting ? "Sorteando..." : "Sortear agora"}
                </Text>
              </TouchableOpacity>

              {sortError ? (
                <Text style={[styles.errorText, { color: theme.secondary }]}>
                  {sortError}
                </Text>
              ) : null}

              {sortedDish ? (
                <View style={styles.resultCard}>
                  <Text
                    style={[styles.resultLabel, { color: theme.placeHolder }]}
                  >
                    Refeição sorteada
                  </Text>
                  <Text style={[styles.resultTitle, { color: theme.text }]}>
                    {sortedDish.title}
                  </Text>
                  <Text
                    style={[styles.resultMeta, { color: theme.placeHolder }]}
                  >
                    Nota {formatRating(sortedDish.rank)}
                  </Text>
                  <Image
                    source={{
                      uri:
                        sortedDish.imageURL ??
                        "https://via.placeholder.com/300",
                    }}
                    style={styles.resultImage}
                  />
                  {sortedDish.recipe ? (
                    <Text style={[styles.resultRecipe, { color: theme.text }]}>
                      {sortedDish.recipe}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 14,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    elevation: 1,
  },
  leftContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 12,
    marginTop: 6,
  },
  cardContent: {
    flexDirection: "column",
  },
  button: {
    marginTop: 12,
    height: 36,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    gap: 8,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  cardImageBorder: {
    width: 120,
    height: 120,
    borderRadius: 999,
    padding: 3,
  },
  cardImageClip: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  modalCard: {
    borderRadius: 22,
    padding: 18,
    maxHeight: "82%",
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  modalSubtitle: {
    marginTop: 4,
    fontSize: 12,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  rangeBlock: {
    gap: 14,
    marginTop: 18,
  },
  rangeColumn: {
    gap: 10,
  },
  starRow: {
    alignItems: "flex-start",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
  },
  summaryBox: {
    marginTop: 18,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  sortButton: {
    marginTop: 18,
    height: 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },
  errorText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  resultCard: {
    marginTop: 18,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  resultMeta: {
    fontSize: 12,
    fontWeight: "600",
  },
  resultImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    marginTop: 4,
  },
  resultRecipe: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 12,
  },
});
