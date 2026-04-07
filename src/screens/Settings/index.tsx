import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";

import { Header } from "../../components/header";
import { useTheme } from "../../util/ThemeProvider";
import {
  exportDatabaseBackup,
  importAndMergeBackup,
} from "../../service/BackupService";
import { styles } from "./style";

export default function Settings() {
  const { theme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  async function handleExportBackup() {
    try {
      setIsExporting(true);

      const backupJson = await exportDatabaseBackup();
      const fileUri = `${FileSystem.cacheDirectory}qual_a_boa-backup-${Date.now()}.json`;

      await FileSystem.writeAsStringAsync(fileUri, backupJson, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Toast.show({
          type: "success",
          text1: "Backup criado",
          text2: "Arquivo salvo temporariamente no dispositivo.",
        });
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Salvar backup do Qual a boa",
      });

      Toast.show({
        type: "success",
        text1: "Backup pronto",
        text2: "Escolha onde salvar o arquivo.",
      });
    } catch (error) {
      console.error("Erro ao exportar backup:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao exportar",
        text2: "Nao foi possivel gerar o backup.",
      });
    } finally {
      setIsExporting(false);
    }
  }

  async function handleImportBackup() {
    try {
      setIsImporting(true);

      const file = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/json", "text/plain"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (file.canceled || !file.assets?.[0]?.uri) {
        return;
      }

      const selectedFileUri = file.assets[0].uri;
      const rawJson = await FileSystem.readAsStringAsync(selectedFileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const result = await importAndMergeBackup(rawJson);

      Alert.alert(
        "Importacao concluida",
        `Categorias adicionadas: ${result.insertedCategories}\nPratos adicionados: ${result.insertedDishes}`,
      );
    } catch (error) {
      console.error("Erro ao importar backup:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao importar",
        text2: "Nao foi possivel importar este arquivo.",
      });
    } finally {
      setIsImporting(false);
    }
  }

  const isLoading = isExporting || isImporting;

  return (
    <>
      <Header screen="settings" title="Configurações" />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            Backup de dados
          </Text>
          <Text style={[styles.description, { color: theme.placeHolder }]}>
            Baixe um arquivo com todas as categorias e pratos. Voce pode guardar
            esse arquivo para restaurar depois.
          </Text>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.secondary },
              isLoading && styles.disabledButton,
            ]}
            onPress={handleExportBackup}
            disabled={isLoading}
          >
            {isExporting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>Download do backup</Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            Importar e mesclar
          </Text>
          <Text style={[styles.description, { color: theme.placeHolder }]}>
            Envie um backup em JSON. Os dados novos serao adicionados ao banco
            atual sem apagar os existentes.
          </Text>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: "#2F855A" },
              isLoading && styles.disabledButton,
            ]}
            onPress={handleImportBackup}
            disabled={isLoading}
          >
            {isImporting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>Upload de backup</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
