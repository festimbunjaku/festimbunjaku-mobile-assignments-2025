import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import { Avatar } from "../components/Common/Avatar";
import { Button } from "../components/Common";
import { profileService } from "../services/profile.service";
import { typography } from "../constants/typography";

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, refreshProfile } = useProfile();
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photo library to upload a profile picture."
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      // Only allow JPEG images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await uploadImage(asset.uri, asset.mimeType || "image/jpeg");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const uploadImage = async (uri: string, mimeType: string) => {
    if (!user) return;

    setUploading(true);
    try {
      // Validate image before upload
      const fileSize = await profileService.getFileSize(uri);
      const validation = profileService.validateImage({
        uri,
        type: mimeType,
        fileSize,
      });

      if (!validation.valid) {
        Alert.alert("Invalid Image", validation.error || "Invalid image file");
        setUploading(false);
        return;
      }

      const { url, error } = await profileService.uploadProfilePicture(
        user.id,
        uri,
        mimeType
      );

      if (error) {
        Alert.alert("Upload Failed", error);
      } else {
        await refreshProfile();
        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePicture = async () => {
    if (!user) return;

    Alert.alert(
      "Remove Profile Picture",
      "Are you sure you want to remove your profile picture?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setUploading(true);
            try {
              const success = await profileService.removeProfilePicture(user.id);
              if (success) {
                await refreshProfile();
                Alert.alert("Success", "Profile picture removed successfully!");
              } else {
                Alert.alert("Error", "Failed to remove profile picture.");
              }
            } catch (error) {
              console.error("Error removing profile picture:", error);
              Alert.alert("Error", "Failed to remove profile picture.");
            } finally {
              setUploading(false);
            }
          },
        },
      ]
    );
  };

  const dynamicStyles = {
    container: [styles.container, { backgroundColor: theme.background }],
    card: [
      styles.card,
      {
        backgroundColor: theme.surface,
        borderColor: theme.border,
      },
    ],
    label: [styles.label, { color: theme.text.primary }],
    value: [styles.value, { color: theme.text.secondary }],
    sectionTitle: [styles.sectionTitle, { color: theme.text.primary }],
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Profile Picture Section */}
      <View style={styles.section}>
        <View style={styles.avatarSection}>
          <Avatar
            profilePictureUrl={profile?.profile_picture_url}
            email={user?.email || ""}
            size={120}
            style={styles.avatar}
          />
          {uploading && (
            <View style={[styles.uploadOverlay, { backgroundColor: theme.background + "CC" }]}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Change Picture"
            onPress={pickImage}
            variant="primary"
            disabled={uploading}
            style={styles.button}
          />
          {profile?.profile_picture_url && (
            <Button
              title="Remove Picture"
              onPress={removeProfilePicture}
              variant="outline"
              disabled={uploading}
              style={styles.button}
            />
          )}
        </View>
      </View>

      {/* Profile Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons
            name="person"
            size={20}
            color={theme.text.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={dynamicStyles.sectionTitle}>Profile Information</Text>
        </View>
        <View style={dynamicStyles.card}>
          <View style={styles.infoRow}>
            <Text style={dynamicStyles.label}>Email</Text>
            <Text style={dynamicStyles.value}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={dynamicStyles.label}>Member Since</Text>
            <Text style={dynamicStyles.value}>
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  avatar: {
    marginBottom: 16,
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
  buttonContainer: {
    gap: 12,
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
  },
});

