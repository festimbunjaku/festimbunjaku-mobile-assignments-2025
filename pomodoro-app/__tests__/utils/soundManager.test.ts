import { AudioPlayer } from "expo-audio";
import { soundManager } from "../../src/utils/soundManager";

jest.mock("expo-audio");

// Create a shared mock player object that will be reused
let mockPlayer: any;

describe("soundManager", () => {
  beforeEach(() => {
    // Reset the soundManager internal state using the reset method
    soundManager.reset();
    
    // Create a fresh mock player for each test
    mockPlayer = {
      loadAsync: jest.fn().mockResolvedValue(undefined),
      playAsync: jest.fn().mockResolvedValue(undefined),
      replayAsync: jest.fn().mockResolvedValue(undefined),
      pauseAsync: jest.fn().mockResolvedValue(undefined),
      setPositionAsync: jest.fn().mockResolvedValue(undefined),
      getStatusAsync: jest.fn().mockResolvedValue({
        isLoaded: true,
        isPlaying: false,
      }),
      unloadAsync: jest.fn().mockResolvedValue(undefined),
    };
    
    // Reset and set up mocks fresh for each test
    (AudioPlayer as jest.Mock).mockReset();
    
    // Set up the mock constructor to return our mock player
    (AudioPlayer as jest.Mock).mockImplementation(() => mockPlayer);
  });

  describe("loadSound", () => {
    test("loads sound successfully", async () => {
      await soundManager.loadSound();

      expect(AudioPlayer).toHaveBeenCalled();
      expect(mockPlayer.loadAsync).toHaveBeenCalled();
    });

    test("handles missing sound file gracefully", async () => {
      mockPlayer.loadAsync.mockRejectedValueOnce(
        new Error("File not found")
      );

      await soundManager.loadSound();

      expect(AudioPlayer).toHaveBeenCalled();
      expect(mockPlayer.loadAsync).toHaveBeenCalled();
    });

    test("does not reload if already loaded", async () => {
      await soundManager.loadSound();
      jest.clearAllMocks();
      await soundManager.loadSound();

      expect(AudioPlayer).toHaveBeenCalledTimes(0);
    });
  });

  describe("playAlarm", () => {
    test("plays alarm sound", async () => {
      await soundManager.loadSound();
      // Verify the sound was loaded
      expect(AudioPlayer).toHaveBeenCalled();
      
      await soundManager.playAlarm();

      expect(mockPlayer.getStatusAsync).toHaveBeenCalled();
      expect(mockPlayer.playAsync).toHaveBeenCalled();
    });

    test("loads sound if not loaded before playing", async () => {
      await soundManager.playAlarm();

      expect(AudioPlayer).toHaveBeenCalled();
      expect(mockPlayer.playAsync).toHaveBeenCalled();
    });

    test("replays if already playing", async () => {
      mockPlayer.getStatusAsync.mockResolvedValueOnce({
        isLoaded: true,
        isPlaying: true,
      });
      await soundManager.loadSound();
      await soundManager.playAlarm();

      expect(mockPlayer.replayAsync).toHaveBeenCalled();
    });

    test("handles playback errors gracefully", async () => {
      mockPlayer.playAsync.mockRejectedValueOnce(new Error("Playback failed"));
      await soundManager.loadSound();
      await expect(soundManager.playAlarm()).resolves.not.toThrow();
    });
  });

  describe("stopAlarm", () => {
    test("stops alarm sound", async () => {
      await soundManager.loadSound();
      await soundManager.stopAlarm();

      expect(mockPlayer.pauseAsync).toHaveBeenCalled();
      expect(mockPlayer.setPositionAsync).toHaveBeenCalledWith(0);
    });

    test("handles stop errors gracefully", async () => {
      mockPlayer.pauseAsync.mockRejectedValueOnce(new Error("Stop failed"));
      await soundManager.loadSound();
      await expect(soundManager.stopAlarm()).resolves.not.toThrow();
    });
  });

  describe("unloadSound", () => {
    test("unloads sound successfully", async () => {
      await soundManager.loadSound();
      await soundManager.unloadSound();

      expect(mockPlayer.unloadAsync).toHaveBeenCalled();
    });

    test("handles unload errors gracefully", async () => {
      mockPlayer.unloadAsync.mockRejectedValueOnce(new Error("Unload failed"));
      await soundManager.loadSound();
      await expect(soundManager.unloadSound()).resolves.not.toThrow();
    });
  });
});

