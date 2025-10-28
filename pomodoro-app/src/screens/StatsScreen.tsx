import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useStats } from "../hooks/useStats";
import { useTheme } from "../context/ThemeContext";
import { formatDuration } from "../utils";

export const StatsScreen: React.FC = () => {
  const { stats, loading, refetch } = useStats();
  const { theme } = useTheme();

  const handleRefresh = () => {
    refetch();
  };

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

      {/* Last 7 Days Overview */}
      <View style={styles.section}>
        <Text style={dynamicStyles.sectionTitle}>Last 7 Days</Text>

        {stats.last7DaysStats.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <Text style={dynamicStyles.emptyText}>No data yet</Text>
            <Text style={dynamicStyles.emptySubtext}>
              Start a session to see your stats
            </Text>
          </View>
        ) : (
          stats.last7DaysStats.map((day, index) => (
            <View key={index} style={dynamicStyles.dayRow}>
              <Text style={dynamicStyles.dayDate}>
                {new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
              <View style={dynamicStyles.dayBar}>
                <View
                  style={[
                    dynamicStyles.barFill,
                    {
                      width: `${Math.min((day.totalTime / 1800) * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={dynamicStyles.dayValue}>
                {formatDuration(day.totalTime)}
              </Text>
            </View>
          ))
        )}
      </View>

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
});
