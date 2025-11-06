/**
 * @jest-environment node
 */
// Import directly from timeFormatter to avoid importing utils index (which includes soundManager and expo-av)
import {
  formatTime,
  minutesToSeconds,
  secondsToMinutes,
  formatDuration,
  calculateElapsedTime,
} from "../../src/utils/timeFormatter";

describe("timeFormatter", () => {
  describe("formatTime", () => {
    test("formats seconds to MM:SS", () => {
      expect(formatTime(125)).toBe("02:05");
      expect(formatTime(0)).toBe("00:00");
      expect(formatTime(3661)).toBe("61:01");
      expect(formatTime(30)).toBe("00:30");
      expect(formatTime(90)).toBe("01:30");
    });

    test("handles negative values", () => {
      expect(formatTime(-10)).toBe("00:00");
      expect(formatTime(-100)).toBe("00:00");
    });

    test("handles large values", () => {
      expect(formatTime(999999)).toBe("16666:39");
      expect(formatTime(3600)).toBe("60:00");
    });
  });

  describe("minutesToSeconds", () => {
    test("converts minutes to seconds correctly", () => {
      expect(minutesToSeconds(1)).toBe(60);
      expect(minutesToSeconds(30)).toBe(1800);
      expect(minutesToSeconds(0)).toBe(0);
      expect(minutesToSeconds(60)).toBe(3600);
    });
  });

  describe("secondsToMinutes", () => {
    test("converts seconds to minutes correctly", () => {
      expect(secondsToMinutes(60)).toBe(1);
      expect(secondsToMinutes(1800)).toBe(30);
      expect(secondsToMinutes(0)).toBe(0);
      expect(secondsToMinutes(90)).toBe(1);
      expect(secondsToMinutes(3600)).toBe(60);
    });
  });

  describe("formatDuration", () => {
    test("formats duration correctly", () => {
      expect(formatDuration(0)).toBe("0min");
      expect(formatDuration(60)).toBe("1min");
      expect(formatDuration(1800)).toBe("30min");
      expect(formatDuration(3600)).toBe("1h");
      expect(formatDuration(5400)).toBe("1h 30min");
      expect(formatDuration(7200)).toBe("2h");
    });
  });

  describe("calculateElapsedTime", () => {
    test("calculates elapsed time correctly", () => {
      const start = new Date("2024-01-01T10:00:00Z");
      const end = new Date("2024-01-01T10:01:30Z");
      expect(calculateElapsedTime(start, end)).toBe(90);
    });

    test("uses current time when end date not provided", () => {
      const start = new Date();
      start.setSeconds(start.getSeconds() - 30);
      const elapsed = calculateElapsedTime(start);
      expect(elapsed).toBeGreaterThanOrEqual(29);
      expect(elapsed).toBeLessThanOrEqual(31);
    });

    test("handles negative elapsed time", () => {
      const start = new Date("2024-01-01T10:00:00Z");
      const end = new Date("2024-01-01T09:59:00Z");
      expect(calculateElapsedTime(start, end)).toBe(-60);
    });
  });
});

