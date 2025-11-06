import { soundManager } from "../../src/utils/soundManager";
import { Audio } from "expo-av";

jest.mock("expo-av");

describe("Sound Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles missing sound file", async () => {
    (Audio.setAudioModeAsync as jest.Mock).mockResolvedValue(undefined);
    (Audio.Sound.createAsync as jest.Mock).mockRejectedValue(
      new Error("File not found")
    );

    await soundManager.loadSound();

    expect(Audio.Sound.createAsync).toHaveBeenCalled();
    await expect(soundManager.playAlarm()).resolves.not.toThrow();
  });

  test("handles audio permission denied", async () => {
    const permissionError = new Error("Permission denied");
    (permissionError as any).code = "PERMISSION_DENIED";

    (Audio.setAudioModeAsync as jest.Mock).mockRejectedValue(permissionError);

    await expect(soundManager.loadSound()).resolves.not.toThrow();
  });

  test("handles audio playback failures", async () => {
    const mockSound = {
      replayAsync: jest.fn().mockRejectedValue(new Error("Playback failed")),
      stopAsync: jest.fn(),
      unloadAsync: jest.fn(),
    };

    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
      sound: mockSound,
    });

    await soundManager.loadSound();
    await expect(soundManager.playAlarm()).resolves.not.toThrow();
  });

  test("handles audio unload failures", async () => {
    const mockSound = {
      replayAsync: jest.fn(),
      stopAsync: jest.fn(),
      unloadAsync: jest.fn().mockRejectedValue(new Error("Unload failed")),
    };

    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
      sound: mockSound,
    });

    await soundManager.loadSound();
    await expect(soundManager.unloadSound()).resolves.not.toThrow();
  });
});

