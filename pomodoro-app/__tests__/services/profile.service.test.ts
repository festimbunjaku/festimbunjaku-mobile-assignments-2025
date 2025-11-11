import { profileService } from "../../src/services/profile.service";
import { supabase } from "../../src/services/supabase";

jest.mock("../../src/services/supabase");

describe("profileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    test("fetches profile successfully", async () => {
      const mockProfile = {
        id: "user-1",
        email: "test@example.com",
        profile_picture_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
      });

      const result = await profileService.getProfile("user-1");

      expect(result).toEqual(mockProfile);
      expect(supabase.from).toHaveBeenCalledWith("profiles");
    });

    test("returns null on error", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Not found" },
        }),
      });

      const result = await profileService.getProfile("user-1");

      expect(result).toBeNull();
    });
  });

  describe("validateImage", () => {
    test("validates image size correctly", () => {
      const largeFile = {
        uri: "file://test.jpg",
        type: "image/jpeg",
        fileSize: 4 * 1024 * 1024, // 4MB
      };

      const result = profileService.validateImage(largeFile);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Image size must be less than 3MB");
    });

    test("validates image format correctly", () => {
      const invalidFormat = {
        uri: "file://test.gif",
        type: "image/gif",
        fileSize: 1024,
      };

      const result = profileService.validateImage(invalidFormat);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Only JPEG images are allowed");
    });

    test("accepts valid JPG image", () => {
      const validJpg = {
        uri: "file://test.jpg",
        type: "image/jpeg",
        fileSize: 1024 * 1024, // 1MB
      };

      const result = profileService.validateImage(validJpg);

      expect(result.valid).toBe(true);
    });

    test("rejects PNG image (only JPEG allowed)", () => {
      const invalidPng = {
        uri: "file://test.png",
        type: "image/png",
        fileSize: 1024 * 1024, // 1MB
      };

      const result = profileService.validateImage(invalidPng);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Only JPEG images are allowed");
    });

    test("accepts valid image at max size", () => {
      const maxSize = {
        uri: "file://test.jpg",
        type: "image/jpeg",
        fileSize: 3 * 1024 * 1024, // 3MB
      };

      const result = profileService.validateImage(maxSize);

      expect(result.valid).toBe(true);
    });
  });

  describe("uploadProfilePicture", () => {
    test("uploads image successfully", async () => {
      const mockUrl = "https://supabase.co/storage/profile-pictures/user-1/123.jpg";
      const userId = "user-1";
      const imageUri = "file://test.jpg";
      const mimeType = "image/jpeg";

      // Mock getFileSize
      jest.spyOn(profileService, "getFileSize").mockResolvedValue(1024);

      // Mock getProfile
      jest.spyOn(profileService, "getProfile").mockResolvedValue({
        id: userId,
        email: "test@example.com",
        profile_picture_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Mock storage upload
      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: "user-1/123.jpg" },
        error: null,
      });
      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: mockUrl },
      });

      (supabase.storage as any) = {
        from: jest.fn().mockReturnValue({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        }),
      };

      // Mock updateProfile
      jest.spyOn(profileService, "updateProfile").mockResolvedValue({
        id: userId,
        email: "test@example.com",
        profile_picture_url: mockUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Mock fetch for blob
      global.fetch = jest.fn().mockResolvedValue({
        blob: jest.fn().mockResolvedValue({ size: 1024 }),
      } as any);

      const result = await profileService.uploadProfilePicture(
        userId,
        imageUri,
        mimeType
      );

      expect(result.url).toBe(mockUrl);
      expect(result.error).toBeNull();
    });

    test("rejects image that is too large", async () => {
      const userId = "user-1";
      const imageUri = "file://test.jpg";
      const mimeType = "image/jpeg";

      // Mock getFileSize to return large file
      jest.spyOn(profileService, "getFileSize").mockResolvedValue(4 * 1024 * 1024); // 4MB

      const result = await profileService.uploadProfilePicture(
        userId,
        imageUri,
        mimeType
      );

      expect(result.url).toBeNull();
      expect(result.error).toBe("Image size must be less than 3MB");
    });

    test("rejects invalid image format", async () => {
      const userId = "user-1";
      const imageUri = "file://test.gif";
      const mimeType = "image/gif";

      // Mock getFileSize
      jest.spyOn(profileService, "getFileSize").mockResolvedValue(1024);

      const result = await profileService.uploadProfilePicture(
        userId,
        imageUri,
        mimeType
      );

      expect(result.url).toBeNull();
      expect(result.error).toBe("Only JPEG images are allowed");
    });

    test("rejects PNG image format", async () => {
      const userId = "user-1";
      const imageUri = "file://test.png";
      const mimeType = "image/png";

      // Mock getFileSize
      jest.spyOn(profileService, "getFileSize").mockResolvedValue(1024);

      const result = await profileService.uploadProfilePicture(
        userId,
        imageUri,
        mimeType
      );

      expect(result.url).toBeNull();
      expect(result.error).toBe("Only JPEG images are allowed");
    });
  });

  describe("removeProfilePicture", () => {
    test("removes profile picture successfully", async () => {
      const userId = "user-1";
      const mockUrl = "https://supabase.co/storage/profile-pictures/user-1/123.jpg";
      const mockProfile = {
        id: userId,
        email: "test@example.com",
        profile_picture_url: mockUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mock getProfile
      jest.spyOn(profileService, "getProfile").mockResolvedValue(mockProfile);

      // Mock deleteProfilePicture
      jest.spyOn(profileService, "deleteProfilePicture").mockResolvedValue(true);

      // Mock updateProfile
      jest.spyOn(profileService, "updateProfile").mockResolvedValue({
        ...mockProfile,
        profile_picture_url: null,
      });

      const result = await profileService.removeProfilePicture(userId);

      expect(result).toBe(true);
      expect(profileService.getProfile).toHaveBeenCalledWith(userId);
      expect(profileService.deleteProfilePicture).toHaveBeenCalledWith(mockUrl);
      expect(profileService.updateProfile).toHaveBeenCalledWith(userId, {
        profile_picture_url: null,
      });
    });

    test("handles case when no profile picture exists", async () => {
      const userId = "user-1";
      const mockProfile = {
        id: userId,
        email: "test@example.com",
        profile_picture_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mock getProfile with no picture
      jest.spyOn(profileService, "getProfile").mockResolvedValue(mockProfile);

      // Mock updateProfile
      jest.spyOn(profileService, "updateProfile").mockResolvedValue(mockProfile);

      const result = await profileService.removeProfilePicture(userId);

      expect(result).toBe(true);
      expect(profileService.getProfile).toHaveBeenCalledWith(userId);
      expect(profileService.updateProfile).toHaveBeenCalledWith(userId, {
        profile_picture_url: null,
      });
    });
  });
});

