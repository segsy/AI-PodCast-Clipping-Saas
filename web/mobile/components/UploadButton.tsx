import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { uploadPodcastInBackground } from "../lib/backgroundUpload";
import type { UploadResponse } from "../types/api";

type Props = {
  onSuccess: (upload: UploadResponse) => Promise<void> | void;
  disabled?: boolean;
};

export function UploadButton({ onSuccess, disabled }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const pickAndUpload = async () => {
    try {
      setUploading(true);
      setProgress(0);

      const picked = await DocumentPicker.getDocumentAsync({ type: "video/*" });
      if (picked.canceled) {
        setProgress(null);
        return;
      }

      const file = picked.assets[0];
      const uploaded = await uploadPodcastInBackground(file.uri, file.name, (next) => setProgress(next));
      await onSuccess(uploaded);
      setProgress(null);
    } catch (error) {
      Alert.alert("Upload failed", error instanceof Error ? error.message : "Please try again.");
      setProgress(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <Pressable
        disabled={disabled || uploading}
        onPress={pickAndUpload}
        style={{
          borderRadius: 10,
          backgroundColor: disabled || uploading ? "#a1a1aa" : "#111",
          paddingVertical: 12,
          paddingHorizontal: 16
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>
          {uploading ? "Uploading in background..." : "Upload Podcast"}
        </Text>
      </Pressable>
      {progress !== null ? (
        <Text style={{ color: "#52525b" }}>Upload progress: {(progress * 100).toFixed(0)}%</Text>
      ) : null}
    </View>
  );
}
