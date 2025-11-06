import { supabase } from "./supabase";
import { Profile, ProfileUpdate } from "../types";
import * as FileSystem from "expo-file-system/legacy";

const PROFILE_PICTURES_BUCKET = "profile-pictures";
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
const ALLOWED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

export const profileService = {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: ProfileUpdate
  ): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  },

  /**
   * Validate image file
   */
  validateImage(file: { uri: string; type?: string; fileSize?: number }): {
    valid: boolean;
    error?: string;
  } {
    // Check file size
    if (file.fileSize && file.fileSize > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "Image size must be less than 3MB",
      };
    }

    // Check file format
    if (file.type && !ALLOWED_FORMATS.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: "Only JPG and PNG images are allowed",
      };
    }

    return { valid: true };
  },

  /**
   * Upload profile picture to Supabase Storage
   */
  async uploadProfilePicture(
    userId: string,
    imageUri: string,
    mimeType: string
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      // Validate file
      const fileSize = await this.getFileSize(imageUri);
      const validation = this.validateImage({
        uri: imageUri,
        type: mimeType,
        fileSize,
      });

      if (!validation.valid) {
        return { url: null, error: validation.error || "Invalid image" };
      }

      // Read file as base64 (React Native compatible)
      let base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to Uint8Array for Supabase Storage (React Native compatible)
      // Use a simple base64 decoder that works in all React Native environments
      const base64Chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      const bytes: number[] = [];
      let i = 0;

      // Remove whitespace but keep padding
      base64 = base64.replace(/\s/g, "");

      while (i < base64.length) {
        const encoded1 = base64Chars.indexOf(base64.charAt(i++));
        const encoded2 = base64Chars.indexOf(base64.charAt(i++));
        const encoded3 = base64Chars.indexOf(base64.charAt(i++));
        const encoded4 = base64Chars.indexOf(base64.charAt(i++));

        // Handle padding (= is index 64)
        if (encoded1 === -1 || encoded2 === -1) break;

        const bitmap =
          (encoded1 << 18) |
          (encoded2 << 12) |
          ((encoded3 === 64 ? 0 : encoded3) << 6) |
          (encoded4 === 64 ? 0 : encoded4);

        bytes.push((bitmap >> 16) & 255);
        if (encoded3 !== 64 && encoded3 !== -1) bytes.push((bitmap >> 8) & 255);
        if (encoded4 !== 64 && encoded4 !== -1) bytes.push(bitmap & 255);
      }

      const uint8Array = new Uint8Array(bytes);

      // Normalize mime type (some systems use image/jpeg, others use image/jpg)
      // Supabase Storage typically accepts image/jpeg, but normalize to be safe
      let normalizedMimeType = mimeType;
      if (mimeType === "image/jpg" || mimeType === "image/jpeg") {
        normalizedMimeType = "image/jpeg"; // Use standard JPEG mime type
      }

      // Generate unique filename
      const fileExt = normalizedMimeType.split("/")[1] || "jpg";
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage (accepts Uint8Array)
      const { data, error } = await supabase.storage
        .from(PROFILE_PICTURES_BUCKET)
        .upload(fileName, uint8Array, {
          contentType: normalizedMimeType,
          upsert: false,
        });

      if (error) {
        console.error("Error uploading image:", error);

        // Provide specific error messages based on error type
        let errorMessage = "Failed to upload image";

        if (error.message) {
          // Check for mime type errors
          if (
            error.message.includes("mime type") &&
            error.message.includes("not supported")
          ) {
            errorMessage = `Image format not supported. The mime type "${mimeType}" is not allowed. Please use JPG or PNG format.`;
          } else if (error.message.includes("not supported")) {
            errorMessage = `Image format not supported: ${error.message}`;
          } else if (
            error.message.includes("size") ||
            error.message.includes("too large")
          ) {
            errorMessage = "Image file is too large. Maximum size is 3MB.";
          } else if (
            error.message.includes("permission") ||
            error.message.includes("unauthorized")
          ) {
            errorMessage =
              "Permission denied. Please check your storage permissions.";
          } else {
            // Use the actual error message if it's informative
            errorMessage = error.message;
          }
        }

        return { url: null, error: errorMessage };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(PROFILE_PICTURES_BUCKET).getPublicUrl(fileName);

      // Delete old profile picture if exists
      const profile = await this.getProfile(userId);
      if (profile?.profile_picture_url) {
        await this.deleteProfilePicture(profile.profile_picture_url);
      }

      // Update profile with new picture URL
      await this.updateProfile(userId, {
        profile_picture_url: publicUrl,
      });

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return { url: null, error: "An error occurred while uploading image" };
    }
  },

  /**
   * Delete profile picture from Supabase Storage
   */
  async deleteProfilePicture(imageUrl: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const userId = urlParts[urlParts.length - 2];
      const filePath = `${userId}/${fileName}`;

      const { error } = await supabase.storage
        .from(PROFILE_PICTURES_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error("Error deleting image:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      return false;
    }
  },

  /**
   * Remove profile picture (set to null)
   */
  async removeProfilePicture(userId: string): Promise<boolean> {
    try {
      // Get current profile
      const profile = await this.getProfile(userId);
      if (profile?.profile_picture_url) {
        // Delete from storage
        await this.deleteProfilePicture(profile.profile_picture_url);
      }

      // Update profile to remove picture URL
      const updated = await this.updateProfile(userId, {
        profile_picture_url: null,
      });

      return updated !== null;
    } catch (error) {
      console.error("Error removing profile picture:", error);
      return false;
    }
  },

  /**
   * Get file size from URI (React Native compatible)
   */
  async getFileSize(uri: string): Promise<number> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && "size" in fileInfo) {
        return fileInfo.size;
      }
      return 0;
    } catch (error) {
      console.error("Error getting file size:", error);
      return 0;
    }
  },
};
