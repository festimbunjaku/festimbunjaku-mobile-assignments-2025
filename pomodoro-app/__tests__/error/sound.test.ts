import { soundManager } from "../../src/utils/soundManager";
import { AudioPlayer } from "expo-audio";

jest.mock("expo-audio");

describe("Sound Error Handling", () => {
  let mockPlayer: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
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

    (AudioPlayer as jest.Mock).mockImplementation(() => mockPlayer);
  });

  test("handles missing sound file", async () => {
    mockPlayer.loadAsync.mockRejectedValueOnce(
      new Error("File not found")
    );

    await soundManager.loadSound();

    expect(AudioPlayer).toHaveBeenCalled();
    await expect(soundManager.playAlarm()).resolves.not.toThrow();
  });

  test("handles audio permission denied", async () => {
    const permissionError = new Error("Permission denied");
    (permissionError as any).code = "PERMISSION_DENIED";

    mockPlayer.loadAsync.mockRejectedValueOnce(permissionError);

    await expect(soundManager.loadSound()).resolves.not.toThrow();
  });

  test("handles audio playback failures", async () => {
    mockPlayer.playAsync.mockRejectedValueOnce(new Error("Playback failed"));

    await soundManager.loadSound();
    await expect(soundManager.playAlarm()).resolves.not.toThrow();
  });

  test("handles audio unload failures", async () => {
    mockPlayer.unloadAsync.mockRejectedValueOnce(new Error("Unload failed"));

    await soundManager.loadSound();
    await expect(soundManager.unloadSound()).resolves.not.toThrow();
  });
});

