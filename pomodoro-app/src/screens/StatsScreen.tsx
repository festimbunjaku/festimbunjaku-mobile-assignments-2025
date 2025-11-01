import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useStats } from "../hooks/useStats";
import { useTheme } from "../context/ThemeContext";
import { formatDuration } from "../utils";

const screenWidth = Dimensions.get("window").width;

// Helper function to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "124, 139, 158"; // Default to primary color
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

export const StatsScreen: React.FC = () => {
  const { stats, loading, refetch } = useStats();
  const { theme } = useTheme();

  const handleRefresh = () => {
    refetch();
  };

  // Prepare chart data for last 7 days
  const chartData = useMemo(() => {
    const last7Days = stats.last7DaysStats.slice(-7);
    const labels = last7Days.map((day) => {
      const date = new Date(day.date);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });

    const focusTimeData = last7Days.map((day) =>
      Math.round(day.totalTime / 60) // Convert seconds to minutes
    );
    const sessionData = last7Days.map((day) => day.sessionCount);

    const maxFocusTime = Math.max(...focusTimeData, 30); // At least 30 min max for visibility

    return {
      labels: labels.length > 0 ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      focusTimeData: focusTimeData.length > 0 ? focusTimeData : [0, 0, 0, 0, 0, 0, 0],
      sessionData: sessionData.length > 0 ? sessionData : [0, 0, 0, 0, 0, 0, 0],
      maxFocusTime,
    };
  }, [stats.last7DaysStats]);

  const chartConfig = useMemo(
    () => ({
      backgroundColor: theme.surface,
      backgroundGradientFrom: theme.surface,
      backgroundGradientTo: theme.surface,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(${hexToRgb(theme.accent.work)}, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(${hexToRgb(theme.text.secondary)}, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.6,
      useShadowColorFromDataset: false,
      propsForBackgroundLines: {
        strokeDasharray: "",
        stroke: theme.border,
        strokeWidth: 1,
      },
    }),
    [theme]
  );

  const dynamicStyles = {
    container: [styles.container, { backgroundColor: theme.background }],
    sectionTitle: [styles.sectionTitle, { color: theme.text.primary }],
    statCard: [
      styles.statCard,
      {
        backgroundColor: theme.surface,
        borderColor: theme.border,
      },
    ],
    statValue: [styles.statValue, { color: theme.primary }],
    statLabel: [styles.statLabel, { color: theme.text.secondary }],
    emptyState: [
      styles.emptyState,
      {
        backgroundColor: theme.surface,
        borderColor: theme.border,
      },
    ],
    emptyText: [styles.emptyText, { color: theme.text.secondary }],
    emptySubtext: [styles.emptySubtext, { color: theme.text.tertiary }],
    dayRow: [
      styles.dayRow,
      {
        backgroundColor: theme.surface,
      },
    ],
    dayDate: [styles.dayDate, { color: theme.text.secondary }],
    dayBar: [styles.dayBar, { backgroundColor: theme.border }],
    barFill: [styles.barFill, { backgroundColor: theme.accent.work }],
    dayValue: [styles.dayValue, { color: theme.text.primary }],
    tipCard: [
      styles.tipCard,
      {
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderLeftColor: theme.accent.work,
      },
    ],
    tipText: [styles.tipText, { color: theme.text.secondary }],
  };

  return (
    <ScrollView
      style={dynamicStyles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
      }
    >
      {/* Today's Stats */}
      <View style={styles.section}>
        <Text style={dynamicStyles.sectionTitle}>Today</Text>

        <View style={styles.statsGrid}>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statValue}>
              {formatDuration(stats.todayFocusTime)}
            </Text>
            <Text style={dynamicStyles.statLabel}>Focus Time</Text>
          </View>

          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statValue}>
              {stats.todaySessionCount}
            </Text>
            <Text style={dynamicStyles.statLabel}>Sessions</Text>
          </View>
        </View>
      </View>

      {/* Last 7 Days - Focus Time Chart */}
      {stats.last7DaysStats.length > 0 && (
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Focus Time (Last 7 Days)</Text>
          <View
            style={[
              styles.chartContainer,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <LineChart
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: chartData.focusTimeData,
                    color: (opacity = 1) =>
                      `rgba(${hexToRgb(theme.accent.work)}, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              yAxisSuffix="m"
              yAxisInterval={1}
              segments={4}
            />
          </View>
        </View>
      )}

      {/* Last 7 Days - Sessions Chart */}
      {stats.last7DaysStats.length > 0 && (
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Sessions Per Day (Last 7 Days)</Text>
          <View
            style={[
              styles.chartContainer,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <BarChart
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: chartData.sessionData,
                  },
                ],
              }}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisSuffix=""
              yAxisInterval={1}
              showValuesOnTopOfBars
              fromZero
            />
          </View>
        </View>
      )}

      {/* Last 7 Days Overview - List View */}
      {stats.last7DaysStats.length === 0 && (
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Last 7 Days</Text>
          <View style={dynamicStyles.emptyState}>
            <Text style={dynamicStyles.emptyText}>No data yet</Text>
            <Text style={dynamicStyles.emptySubtext}>
              Start a session to see your stats
            </Text>
          </View>
        </View>
      )}

      {/* Tips */}
      <View style={styles.section}>
        <Text style={dynamicStyles.sectionTitle}>💡 Tips</Text>
        <View style={dynamicStyles.tipCard}>
          <Text style={dynamicStyles.tipText}>
            Consistency is key! Try to maintain a regular pomodoro schedule to
            build focus habits.
          </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  emptyState: {
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
  },
  dayDate: {
    fontSize: 12,
    fontWeight: "600",
    width: 40,
  },
  dayBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  dayValue: {
    fontSize: 12,
    fontWeight: "600",
    width: 50,
    textAlign: "right",
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
