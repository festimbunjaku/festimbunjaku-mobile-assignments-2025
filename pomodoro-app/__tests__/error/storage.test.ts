import { storageService } from "../../src/services/storage.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage");

describe("Storage Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles AsyncStorage write failures", async () => {
    const timerState = {
      status: "running",
      timeRemaining: 1800,
    };

    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
      new Error("Write failed")
    );

    await expect(
      storageService.saveTimerState(timerState)
    ).resolves.not.toThrow();
  });

  test("handles AsyncStorage read failures", async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
      new Error("Read failed")
    );

    const result = await storageService.getTimerState();

    expect(result).toBeNull();
  });

  test("handles corrupted timer state data", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      "{ invalid json }"
    );

    // The function catches errors and returns null
    const result = await storageService.getTimerState();
    expect(result).toBeNull();
  });

  test("handles storage quota exceeded", async () => {
    const timerState = {
      status: "running",
      timeRemaining: 1800,
    };

    const quotaError = new Error("QuotaExceededError");
    (quotaError as any).name = "QuotaExceededError";

    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(quotaError);

    await expect(
      storageService.saveTimerState(timerState)
    ).resolves.not.toThrow();
  });

  test("handles null timer state gracefully", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await storageService.getTimerState();

    expect(result).toBeNull();
  });
});

