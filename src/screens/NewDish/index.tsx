import { useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import { styles } from "./style";
import { Link2 } from "lucide-react-native";

export default function NewDish() {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldPositions = useRef({
    dishName: 0,
    youtubeLink: 0,
    recipeNotes: 0,
  });

  const [dishName, setDishName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [recipeNotes, setRecipeNotes] = useState("");

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

  return (
    <>
      <Header screen="addDish" title="Adicionar Prato" />
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor: theme.background }]}
        behavior="height"
      >
        <ScrollView
          ref={scrollViewRef}
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
              Anotacoes da receita
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
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
