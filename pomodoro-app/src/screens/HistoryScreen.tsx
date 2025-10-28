import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { timerService } from "../services/timer.service";
import { formatTime, formatDuration } from "../utils";
import {
  getDateRange,
  groupByDate,
  formatSessionDate,
  formatSessionTime,
} from "../utils/dateUtils";
import { Session } from "../types";

export const HistoryScreen: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { start, end } = getDateRange(30);
      const data = await timerService.getSessionsInRange(
        user.id,
        new Date(start),
        new Date(end)
      );
      setSessions(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const groupedSessions = groupByDate(sessions);
  const dates = Object.keys(groupedSessions).sort().reverse();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchHistory} />
      }
    >
      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Sessions Yet</Text>
          <Text style={styles.emptyText}>
            Start a pomodoro session to see your history here
          </Text>
        </View>
      ) : (
        dates.map((date) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>
              {formatSessionDate(date + "T00:00:00")}
            </Text>

            {groupedSessions[date].map((session) => (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionLeft}>
                  <View
                    style={[
                      styles.sessionTypeBadge,
                      {
                        backgroundColor:
                          session.type === "work" ? "#8FA89E" : "#D4A373",
                      },
                    ]}
                  >
                    <Text style={styles.sessionTypeText}>
                      {session.type === "work" ? "🎯" : "☕"}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.sessionTypeLabel}>
                      {session.type === "work" ? "Focus" : "Break"}
                    </Text>
                    <Text style={styles.sessionTime}>
                      {formatSessionTime(session.started_at)}
                    </Text>
                  </View>
                </View>

                <View style={styles.sessionRight}>
                  <Text style={styles.sessionDuration}>
                    {formatDuration(session.duration)}
                  </Text>
                  <Text
                    style={[
                      styles.sessionStatus,
                      {
                        color: session.is_completed ? "#7FB685" : "#C9A67A",
                      },
                    ]}
                  >
                    {session.is_completed ? "✓ Done" : "⏸ Paused"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F5",
    padding: 16,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#636E72",
    marginBottom: 8,
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E8E8E6",
  },
  sessionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sessionTypeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sessionTypeText: {
    fontSize: 20,
  },
  sessionTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
  },
  sessionTime: {
    fontSize: 12,
    color: "#636E72",
    marginTop: 2,
  },
  sessionRight: {
    alignItems: "flex-end",
  },
  sessionDuration: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3436",
  },
  sessionStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
