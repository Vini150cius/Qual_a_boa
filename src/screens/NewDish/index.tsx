import { useEffect, useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import { styles } from "./style";
import { Link2 } from "lucide-react-native";
import StarRating from "react-native-star-rating-widget";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../../routes";
import { createDish, updateDish } from "../../service/DishService";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type Props = BottomTabScreenProps<RootTabParamList, "Novo Prato">;

export default function NewDish({ route }: Props) {
  const navigate = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldPositions = useRef({
    dishName: 0,
    youtubeLink: 0,
    recipeNotes: 0,
  });
  const { categoryId, categoryTitle, dishToEdit } = route.params;
  const isEditMode = Boolean(dishToEdit);

  const [dishName, setDishName] = useState(dishToEdit?.title ?? "");
  const [youtubeLink, setYoutubeLink] = useState(dishToEdit?.recipeUrl ?? "");
  const [recipeNotes, setRecipeNotes] = useState(dishToEdit?.recipe ?? "");
  const [rating, setRating] = useState(dishToEdit?.rank ?? 0);
  const [textRanking, setTextRanking] = useState("");

  useEffect(() => {
    setDishName(dishToEdit?.title ?? "");
    setYoutubeLink(dishToEdit?.recipeUrl ?? "");
    setRecipeNotes(dishToEdit?.recipe ?? "");
    setRating(dishToEdit?.rank ?? 0);
  }, [dishToEdit]);

  function setFieldPosition(
    field: "dishName" | "youtubeLink" | "recipeNotes",
    event: LayoutChangeEvent,
  ) {
    fieldPositions.current[field] = event.nativeEvent.layout.y;
  }

  function scrollToField(field: "dishName" | "youtubeLink" | "recipeNotes") {
    const target = Math.max(0, fieldPositions.current[field] - 24);
    scrollViewRef.current?.scrollTo({ y: target, animated: true });
  }

  function updateTextRanking() {
    switch (rating) {
      case 0:
        setTextRanking("Sem avaliação");
        break;
      case 1:
        setTextRanking("Melhor do que passar fome");
        break;
      case 2:
        setTextRanking("Dá pra engolir");
        break;
      case 3:
        setTextRanking("É...");
        break;
      case 4:
        setTextRanking("Bom");
        break;
      case 5:
        setTextRanking("8 Maravilha do Mundo");
        break;
    }
  }

  async function setDish() {
    if (isEditMode && dishToEdit) {
      await updateDish({
        id: dishToEdit.id,
        category_id: Number(categoryId),
        title: dishName,
        rank: rating,
        recipe: recipeNotes,
        recipeUrl: youtubeLink,
      });
    } else {
      await createDish({
        id: String(Date.now()),
        category_id: Number(categoryId),
        title: dishName,
        rank: rating,
        recipe: recipeNotes,
        recipeUrl: youtubeLink,
      });
    }

    setDishName("");
    setYoutubeLink("");
    setRecipeNotes("");
    setRating(0);

    navigate.navigate("Lista de Pratos", {
      categoryId,
      categoryTitle,
      refreshKey: Date.now(),
    });
  }

  useEffect(() => {
    updateTextRanking();
  }, [rating]);

  return (
    <>
      <Header
        screen="addDish"
        title={isEditMode ? "Editar Prato" : "Adicionar Prato"}
      />
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: theme.background }]}
        behavior="height"
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          contentInsetAdjustmentBehavior="automatic"
        >
          <View
            style={styles.fieldGroup}
            onLayout={(event) => setFieldPosition("dishName", event)}
          >
            <Text style={[styles.label, { color: theme.text }]}>
              Nome do Prato
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={dishName}
                onChangeText={setDishName}
                placeholder="Ex: Lasanha Bolonhesa"
                placeholderTextColor={theme.placeHolder}
                onFocus={() => scrollToField("dishName")}
              />
            </View>
          </View>

          <View
            style={styles.fieldGroup}
            onLayout={(event) => setFieldPosition("youtubeLink", event)}
          >
            <Text style={[styles.label, { color: theme.text }]}>
              Link do YouTube
            </Text>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={youtubeLink}
                onChangeText={setYoutubeLink}
                placeholder="https://youtube.com/..."
                placeholderTextColor={theme.placeHolder}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => scrollToField("youtubeLink")}
              />
              <View style={styles.iconContainer}>
                <Link2 size={18} color={theme.placeHolder} />
              </View>
            </View>
          </View>

          <View
            style={styles.fieldGroup}
            onLayout={(event) => setFieldPosition("recipeNotes", event)}
          >
            <Text style={[styles.label, { color: theme.text }]}>
              Anotações da receita
            </Text>
            <TextInput
              style={[
                styles.textarea,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={recipeNotes}
              onChangeText={setRecipeNotes}
              placeholder="Ingredientes secretos, dicas de preparo..."
              placeholderTextColor={theme.placeHolder}
              multiline
              textAlignVertical="top"
              onFocus={() => scrollToField("recipeNotes")}
            />
          </View>

          <View style={[styles.fieldGroup, styles.ratingGroup]}>
            <Text
              style={[
                styles.label,
                { color: theme.text, textAlign: "center", fontSize: 20 },
              ]}
            >
              Minha nota
            </Text>
            <StarRating rating={rating} onChange={setRating} step="full" />
            <Text style={styles.textRanking}> {textRanking} </Text>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={setDish}>
            <Text style={styles.textButton}>
              {isEditMode ? "Salvar Alterações" : "Salvar Prato"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
