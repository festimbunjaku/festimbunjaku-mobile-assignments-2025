import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Button } from "../components/Common";

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.navContent}>
          <Text style={styles.navBrand}>FocusFlow</Text>
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.navButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.navButtonTextPrimary}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Value Proposition */}
        <View style={styles.valueSection}>
          <Text style={styles.valueTitle}>Take Control of Your Time</Text>
          <Text style={styles.valueDescription}>
            Work smarter, not harder. Break your day into focused sessions with
            strategic breaks.
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose FocusFlow?</Text>

          <View style={styles.featureGrid}>
            <View style={styles.featureColumn}>
              <View style={[styles.featureCard, styles.featureCard1]}>
                <Text style={styles.featureIcon}>⏱️</Text>
                <Text style={styles.featureTitle}>Smart Timers</Text>
                <Text style={styles.featureDesc}>Customizable sessions</Text>
              </View>

              <View style={[styles.featureCard, styles.featureCard2]}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text style={styles.featureTitle}>Analytics</Text>
                <Text style={styles.featureDesc}>Track your progress</Text>
              </View>
            </View>

            <View style={styles.featureColumn}>
              <View style={[styles.featureCard, styles.featureCard3]}>
                <Text style={styles.featureIcon}>🔔</Text>
                <Text style={styles.featureTitle}>Alerts</Text>
                <Text style={styles.featureDesc}>Smart notifications</Text>
              </View>

              <View style={[styles.featureCard, styles.featureCard4]}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureTitle}>Focus Mode</Text>
                <Text style={styles.featureDesc}>Zero distractions</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>25min</Text>
            <Text style={styles.statLabel}>Focus Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5min</Text>
            <Text style={styles.statLabel}>Short Break</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15min</Text>
            <Text style={styles.statLabel}>Long Break</Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Transform Your Habits</Text>

          <View style={styles.benefitItem}>
            <View style={styles.benefitCheckbox}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Increase Productivity</Text>
              <Text style={styles.benefitDesc}>
                50% more focus time with strategic breaks
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitCheckbox}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Better Work-Life Balance</Text>
              <Text style={styles.benefitDesc}>
                Know when to work and when to rest
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitCheckbox}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Track Your Growth</Text>
              <Text style={styles.benefitDesc}>
                Visual insights into your productivity patterns
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Button
          title="Get Started Now"
          onPress={() => navigation.navigate("Register")}
          style={styles.primaryButton}
        />

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.secondaryButtonText}>
            Already have an account?
          </Text>
          <Text style={styles.secondaryButtonLink}>Sign In Here</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  navBar: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 24,
    backgroundColor: "#8FA89E",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      },
    }),
  },
  navContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBrand: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  navButtons: {
    flexDirection: "row",
    gap: 10,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  navButtonPrimary: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  navButtonTextPrimary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8FA89E",
  },
  headerSection: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: "#8FA89E", // Changed from LinearGradient to solid color
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      },
    }),
  },
  heroSection: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 44,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E8F5E9",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  valueSection: {
    marginBottom: 36,
  },
  valueTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 10,
  },
  valueDescription: {
    fontSize: 15,
    color: "#636E72",
    lineHeight: 22,
  },
  featuresSection: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 16,
  },
  featureGrid: {
    flexDirection: "row",
    gap: 12,
  },
  featureColumn: {
    flex: 1,
    gap: 12,
  },
  featureCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  featureCard1: {
    backgroundColor: "#E8F5E9",
    borderLeftWidth: 4,
    borderLeftColor: "#8FA89E",
  },
  featureCard2: {
    backgroundColor: "#FFF3E0",
    borderLeftWidth: 4,
    borderLeftColor: "#D4A373",
  },
  featureCard3: {
    backgroundColor: "#F3E5F5",
    borderLeftWidth: 4,
    borderLeftColor: "#B19CD9",
  },
  featureCard4: {
    backgroundColor: "#E3F2FD",
    borderLeftWidth: 4,
    borderLeftColor: "#7C8B9E",
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: "#636E72",
  },
  statsSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 36,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E6",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8FA89E",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#A8B5C4",
  },
  benefitsSection: {
    marginBottom: 36,
  },
  benefitItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  benefitCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8FA89E",
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 13,
    color: "#636E72",
    lineHeight: 18,
  },
  ctaSection: {
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 12,
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#8FA89E",
    backgroundColor: "rgba(143, 168, 158, 0.05)",
  },
  secondaryButtonText: {
    fontSize: 13,
    color: "#A8B5C4",
    marginBottom: 2,
  },
  secondaryButtonLink: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8FA89E",
  },
});
