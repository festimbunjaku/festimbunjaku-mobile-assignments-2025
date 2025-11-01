import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Linking,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { typography } from "../constants/typography";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const highlights = [
    {
      icon: "timer" as const,
      iconType: "MaterialIcons" as const,
      value: "25min",
      label: "Focus",
      gradient: theme.accent.work,
    },
    {
      icon: "free-breakfast" as const,
      iconType: "MaterialIcons" as const,
      value: "5min",
      label: "Break",
      gradient: theme.accent.break,
    },
    {
      icon: "trending-up" as const,
      iconType: "MaterialIcons" as const,
      value: "4x",
      label: "Sessions",
      gradient: theme.primary,
    },
  ];

  const features = [
    {
      icon: "timer" as const,
      iconType: "MaterialIcons" as const,
      title: "Smart Timer",
      description: "Customizable sessions",
      color: theme.accent.work,
    },
    {
      icon: "bar-chart" as const,
      iconType: "MaterialIcons" as const,
      title: "Analytics",
      description: "Track progress",
      color: theme.primary,
    },
    {
      icon: "center-focus-strong" as const,
      iconType: "MaterialIcons" as const,
      title: "Focus Mode",
      description: "Zero distractions",
      color: theme.accent.break,
    },
    {
      icon: "notifications-active" as const,
      iconType: "MaterialIcons" as const,
      title: "Alerts",
      description: "Smart reminders",
      color: theme.secondary,
    },
  ];

  const benefits = [
    "Increase productivity by 40%",
    "Better work-life balance",
    "Track your growth over time",
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Navigation */}
      <View style={styles.header}>
        <Text style={[styles.brand, { color: theme.text.primary }]}>
          FocusEdge
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={[styles.headerButton, { borderColor: theme.border }]}
          >
            <Text
              style={[styles.headerButtonText, { color: theme.text.primary }]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={[
              styles.headerButton,
              styles.headerButtonPrimary,
              {
                backgroundColor: theme.primary,
              },
            ]}
          >
            <Text
              style={[styles.headerButtonTextPrimary, { color: "#FFFFFF" }]}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View
            style={[
              styles.heroBadge,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <MaterialIcons name="star" size={16} color={theme.primary} />
            <Text style={[styles.heroBadgeText, { color: theme.primary }]}>
              #1 Productivity App
            </Text>
          </View>

          <Text style={[styles.heroTitle, { color: theme.text.primary }]}>
            Master Your Time,{"\n"}Amplify Your Focus
          </Text>

          <Text
            style={[styles.heroDescription, { color: theme.text.secondary }]}
          >
            Transform your productivity with the proven Pomodoro technique. Work
            smarter, rest better, achieve more.
          </Text>

          {/* Highlight Cards */}
          <View style={styles.highlightsContainer}>
            {highlights.map((highlight, index) => (
              <View
                key={index}
                style={[
                  styles.highlightCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.highlightIconWrapper,
                    { backgroundColor: highlight.gradient + "15" },
                  ]}
                >
                  {highlight.iconType === "MaterialIcons" ? (
                    <MaterialIcons
                      name={highlight.icon}
                      size={24}
                      color={highlight.gradient}
                    />
                  ) : (
                    <Ionicons
                      name={highlight.icon}
                      size={24}
                      color={highlight.gradient}
                    />
                  )}
                </View>
                <Text
                  style={[styles.highlightValue, { color: theme.text.primary }]}
                >
                  {highlight.value}
                </Text>
                <Text
                  style={[
                    styles.highlightLabel,
                    { color: theme.text.secondary },
                  ]}
                >
                  {highlight.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Everything You Need
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: theme.text.secondary }]}
          >
            Powerful tools for focused work
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.featureIconWrapper,
                  { backgroundColor: feature.color + "15" },
                ]}
              >
                {feature.iconType === "MaterialIcons" ? (
                  <MaterialIcons
                    name={feature.icon}
                    size={32}
                    color={feature.color}
                  />
                ) : (
                  <Ionicons
                    name={feature.icon}
                    size={32}
                    color={feature.color}
                  />
                )}
              </View>
              <Text
                style={[styles.featureTitle, { color: theme.text.primary }]}
              >
                {feature.title}
              </Text>
              <Text
                style={[
                  styles.featureDescription,
                  { color: theme.text.secondary },
                ]}
                numberOfLines={2}
              >
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Benefits Section */}
      <View
        style={[styles.benefitsSection, { backgroundColor: theme.surface }]}
      >
        <Text style={[styles.benefitsTitle, { color: theme.text.primary }]}>
          Why Choose FocusEdge?
        </Text>

        {benefits.map((benefit, index) => (
          <View
            key={index}
            style={[
              styles.benefitItem,
              index === benefits.length - 1 && styles.benefitItemLast,
            ]}
          >
            <View
              style={[
                styles.benefitIconWrapper,
                {
                  backgroundColor:
                    index === 0
                      ? theme.accent.work + "15"
                      : index === 1
                      ? theme.accent.break + "15"
                      : theme.primary + "15",
                },
              ]}
            >
              <MaterialIcons
                name="check-circle"
                size={24}
                color={
                  index === 0
                    ? theme.accent.work
                    : index === 1
                    ? theme.accent.break
                    : theme.primary
                }
              />
            </View>
            <Text style={[styles.benefitText, { color: theme.text.primary }]}>
              {benefit}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={[styles.footerText, { color: theme.text.secondary }]}>
            Copyright{" "}
          </Text>
          <MaterialIcons
            name="copyright"
            size={13}
            color={theme.text.secondary}
            style={styles.copyrightIcon}
          />
          <Text style={[styles.footerText, { color: theme.text.secondary }]}>
            {" "}
          </Text>
          <Text
            style={[styles.footerLink, { color: theme.primary }]}
            onPress={() => Linking.openURL("https://festimbunjaku.dev")}
          >
            Festim Bunjaku
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  brand: {
    ...typography.styles.h3,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  headerButtonPrimary: {
    borderWidth: 0,
  },
  headerButtonText: {
    ...typography.styles.buttonSmall,
  },
  headerButtonTextPrimary: {
    ...typography.styles.buttonSmall,
    color: "#FFFFFF",
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  heroBadgeText: {
    ...typography.styles.caption,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroTitle: {
    ...typography.styles.h1,
    fontSize: 40,
    letterSpacing: -1.2,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 48,
  },
  heroDescription: {
    ...typography.styles.bodyLarge,
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 340,
  },
  highlightsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  highlightCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
  highlightIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  highlightValue: {
    ...typography.styles.h4,
    fontSize: 18,
    marginBottom: 4,
  },
  highlightLabel: {
    ...typography.styles.caption,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.styles.h2,
    fontSize: 28,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  sectionSubtitle: {
    ...typography.styles.body,
    fontWeight: "500",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: (width - 60) / 2,
    minHeight: 180,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    ...Platform.select({
      web: {
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
      },
    }),
  },
  featureIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureTitle: {
    ...typography.styles.h6,
    marginBottom: 6,
    textAlign: "center",
  },
  featureDescription: {
    ...typography.styles.bodySmall,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  benefitsSection: {
    marginHorizontal: 24,
    borderRadius: 28,
    padding: 32,
    marginBottom: 32,
    ...Platform.select({
      web: {
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
      },
    }),
  },
  benefitsTitle: {
    ...typography.styles.h3,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  benefitItemLast: {
    marginBottom: 0,
  },
  benefitIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  benefitText: {
    ...typography.styles.body,
    fontWeight: "600",
    flex: 1,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    ...typography.styles.bodySmall,
    fontSize: 13,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  copyrightIcon: {
    marginHorizontal: 2,
  },
  footerLink: {
    fontSize: 18,
    fontFamily: typography.fontFamily.extraBold,
    fontWeight: "800",
    letterSpacing: 0.3,
    lineHeight: 22,
  },
});
