import { Audio } from "expo-av";
import { soundManager } from "../../src/utils/soundManager";

jest.mock("expo-av");

// Create a shared mock sound object that will be reused
let mockSound: any;

describe("soundManager", () => {
  beforeEach(() => {
    // Reset the soundManager internal state using the reset method
    soundManager.reset();
    
    // Create a fresh mock sound for each test
    mockSound = {
      replayAsync: jest.fn().mockResolvedValue(undefined),
      stopAsync: jest.fn().mockResolvedValue(undefined),
      unloadAsync: jest.fn().mockResolvedValue(undefined),
    };
    
    // Reset and set up mocks fresh for each test
    (Audio.setAudioModeAsync as jest.Mock).mockReset();
    (Audio.Sound.createAsync as jest.Mock).mockReset();
    
    // Set up the mock to return our mock sound
    (Audio.setAudioModeAsync as jest.Mock).mockResolvedValue(undefined);
    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
      sound: mockSound,
    });
  });

  describe("loadSound", () => {
    test("loads sound successfully", async () => {
      await soundManager.loadSound();

      expect(Audio.setAudioModeAsync).toHaveBeenCalled();
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
    });

    test("handles missing sound file gracefully", async () => {
      (Audio.setAudioModeAsync as jest.Mock).mockResolvedValue(undefined);
      (Audio.Sound.createAsync as jest.Mock).mockRejectedValue(
        new Error("File not found")
      );

      await soundManager.loadSound();

      expect(Audio.setAudioModeAsync).toHaveBeenCalled();
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
    });

    test("does not reload if already loaded", async () => {
      await soundManager.loadSound();
      jest.clearAllMocks();
      await soundManager.loadSound();

      expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(0);
    });
  });

  describe("playAlarm", () => {
    test("plays alarm sound", async () => {
      await soundManager.loadSound();
      // Verify the sound was loaded
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
      
      await soundManager.playAlarm();

      expect(mockSound.replayAsync).toHaveBeenCalled();
    });

    test("loads sound if not loaded before playing", async () => {
      await soundManager.playAlarm();

      expect(Audio.Sound.createAsync).toHaveBeenCalled();
      expect(mockSound.replayAsync).toHaveBeenCalled();
    });

    test("handles playback errors gracefully", async () => {
      mockSound.replayAsync.mockRejectedValueOnce(new Error("Playback failed"));
      await soundManager.loadSound();
      await expect(soundManager.playAlarm()).resolves.not.toThrow();
    });
  });

  describe("stopAlarm", () => {
    test("stops alarm sound", async () => {
      await soundManager.loadSound();
      await soundManager.stopAlarm();

      expect(mockSound.stopAsync).toHaveBeenCalled();
    });

    test("handles stop errors gracefully", async () => {
      mockSound.stopAsync.mockRejectedValueOnce(new Error("Stop failed"));
      await soundManager.loadSound();
      await expect(soundManager.stopAlarm()).resolves.not.toThrow();
    });
  });

  describe("unloadSound", () => {
    test("unloads sound successfully", async () => {
      await soundManager.loadSound();
      await soundManager.unloadSound();

      expect(mockSound.unloadAsync).toHaveBeenCalled();
    });

    test("handles unload errors gracefully", async () => {
      mockSound.unloadAsync.mockRejectedValueOnce(new Error("Unload failed"));
      await soundManager.loadSound();
      await expect(soundManager.unloadSound()).resolves.not.toThrow();
    });
  });
});

