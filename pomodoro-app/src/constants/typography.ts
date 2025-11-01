import { TextStyle, Platform } from "react-native";

// Typography System using Inter font
export const typography = {
  // Font Family
  fontFamily: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    extraBold: "Inter_800ExtraBold",
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 40,
    "6xl": 48,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
  },

  // Pre-defined Typography Styles
  styles: {
    // Display Styles (Large Headlines)
    display: {
      fontFamily: "Inter_700Bold",
      fontSize: 48,
      lineHeight: 58,
      letterSpacing: -0.5,
      fontWeight: "700",
    } as TextStyle,

    // Heading Styles
    h1: {
      fontFamily: "Inter_700Bold",
      fontSize: 36,
      lineHeight: 44,
      letterSpacing: -0.5,
      fontWeight: "700",
    } as TextStyle,

    h2: {
      fontFamily: "Inter_700Bold",
      fontSize: 30,
      lineHeight: 38,
      letterSpacing: -0.5,
      fontWeight: "700",
    } as TextStyle,

    h3: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.25,
      fontWeight: "600",
    } as TextStyle,

    h4: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: -0.25,
      fontWeight: "600",
    } as TextStyle,

    h5: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 18,
      lineHeight: 26,
      letterSpacing: 0,
      fontWeight: "600",
    } as TextStyle,

    h6: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: "600",
    } as TextStyle,

    // Body Text Styles
    bodyLarge: {
      fontFamily: "Inter_400Regular",
      fontSize: 18,
      lineHeight: 28,
      letterSpacing: 0,
      fontWeight: "400",
    } as TextStyle,

    body: {
      fontFamily: "Inter_400Regular",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: "400",
    } as TextStyle,

    bodySmall: {
      fontFamily: "Inter_400Regular",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "400",
    } as TextStyle,

    // UI Text Styles
    button: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.25,
      fontWeight: "600",
    } as TextStyle,

    buttonSmall: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
      fontWeight: "600",
    } as TextStyle,

    label: {
      fontFamily: "Inter_500Medium",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "500",
    } as TextStyle,

    caption: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0,
      fontWeight: "400",
    } as TextStyle,

    // Special Styles for Timer
    timer: {
      fontFamily: "Inter_800ExtraBold",
      fontSize: 72,
      lineHeight: 86,
      letterSpacing: -1,
      fontWeight: "800",
    } as TextStyle,

    timerMedium: {
      fontFamily: "Inter_700Bold",
      fontSize: 48,
      lineHeight: 58,
      letterSpacing: -0.5,
      fontWeight: "700",
    } as TextStyle,

    timerSmall: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 36,
      lineHeight: 44,
      letterSpacing: -0.5,
      fontWeight: "600",
    } as TextStyle,
  },
} as const;

// Helper function to get font family with fallback
export const getFontFamily = (weight: keyof typeof typography.fontFamily): string => {
  const font = typography.fontFamily[weight];
  return Platform.select({
    ios: font,
    android: font,
    default: font,
  }) || "System";
};

// Export type for TypeScript
export type TypographyStyle = keyof typeof typography.styles;

