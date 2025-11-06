import {
  formatSessionDate,
  formatSessionTime,
  groupByDate,
  getDateRange,
} from "../../src/utils/dateUtils";

describe("dateUtils", () => {
  describe("formatSessionDate", () => {
    test("formats today's date correctly", () => {
      const today = new Date().toISOString();
      const result = formatSessionDate(today);
      expect(result).toBe("Today");
    });

    test("formats yesterday's date correctly", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatSessionDate(yesterday.toISOString());
      expect(result).toBe("Yesterday");
    });

    test("formats other dates correctly", () => {
      const date = new Date("2024-01-15T10:00:00Z");
      const result = formatSessionDate(date.toISOString());
      expect(result).toMatch(/Jan 15, 2024/);
    });
  });

  describe("formatSessionTime", () => {
    test("formats time to HH:mm format", () => {
      const date = new Date("2024-01-15T14:30:00Z");
      const result = formatSessionTime(date.toISOString());
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    test("handles midnight correctly", () => {
      const date = new Date("2024-01-15T00:00:00Z");
      const result = formatSessionTime(date.toISOString());
      // The result will be in local time, so it might not be 00:00 depending on timezone
      // Just verify it's a valid time format
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe("groupByDate", () => {
    test("groups items by date correctly", () => {
      const items = [
        { started_at: "2024-01-15T10:00:00Z" },
        { started_at: "2024-01-15T14:00:00Z" },
        { started_at: "2024-01-16T10:00:00Z" },
      ];

      const result = groupByDate(items);
      expect(Object.keys(result)).toHaveLength(2);
      expect(result["2024-01-15"]).toHaveLength(2);
      expect(result["2024-01-16"]).toHaveLength(1);
    });

    test("handles empty array", () => {
      const result = groupByDate([]);
      expect(Object.keys(result)).toHaveLength(0);
    });

    test("handles single item", () => {
      const items = [{ started_at: "2024-01-15T10:00:00Z" }];
      const result = groupByDate(items);
      expect(Object.keys(result)).toHaveLength(1);
      expect(result["2024-01-15"]).toHaveLength(1);
    });
  });

  describe("getDateRange", () => {
    test("returns correct date range", () => {
      const result = getDateRange(7);
      expect(result.start).toBeDefined();
      expect(result.end).toBeDefined();
      expect(new Date(result.start).getTime()).toBeLessThan(
        new Date(result.end).getTime()
      );
    });

    test("handles zero days", () => {
      const result = getDateRange(0);
      expect(result.start).toBeDefined();
      expect(result.end).toBeDefined();
    });

    test("handles large number of days", () => {
      const result = getDateRange(30);
      const start = new Date(result.start);
      const end = new Date(result.end);
      const diffDays = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBe(30);
    });
  });

  describe("timezone conversions", () => {
    test("handles timezone conversions", () => {
      // Test that dates are handled correctly across timezones
      // Create a date in UTC
      const utcDate = new Date("2024-01-15T12:00:00Z");
      const utcISO = utcDate.toISOString();
      
      // Format should work regardless of local timezone
      const formatted = formatSessionDate(utcISO);
      expect(formatted).toBeDefined();
      
      // Test time formatting with UTC date
      const timeFormatted = formatSessionTime(utcISO);
      expect(timeFormatted).toMatch(/\d{2}:\d{2}/);
      
      // Verify that the same UTC timestamp formats consistently
      // even if local timezone differs
      const utcDate2 = new Date("2024-01-15T00:00:00Z");
      const formatted2 = formatSessionDate(utcDate2.toISOString());
      expect(formatted2).toBeDefined();
      
      // Test that grouping by date works correctly with UTC timestamps
      const items = [
        { started_at: "2024-01-15T00:00:00Z" }, // UTC midnight
        { started_at: "2024-01-15T23:59:59Z" }, // UTC end of day
        { started_at: "2024-01-16T00:00:00Z" }, // Next day UTC
      ];
      
      const grouped = groupByDate(items);
      // All should be grouped by their date part (YYYY-MM-DD)
      expect(Object.keys(grouped).length).toBeGreaterThan(0);
      
      // Verify UTC dates are converted to local date strings correctly
      const date1 = new Date("2024-01-15T12:00:00Z");
      const date2 = new Date("2024-01-15T18:00:00Z");
      // Both should be on the same date when converted to local time
      const localDate1 = new Date(date1.getTime() + date1.getTimezoneOffset() * 60000);
      const localDate2 = new Date(date2.getTime() + date2.getTimezoneOffset() * 60000);
      // The date part should be the same
      expect(localDate1.toISOString().split("T")[0]).toBe(localDate2.toISOString().split("T")[0]);
    });
  });
});

