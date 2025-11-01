// Color Palette Variables - Light Mode (Brown)
export const palette = {
  brown1: "#724e2c", // RGB: (114,78,44) - Medium brown
  brown2: "#271300", // RGB: (39,19,0) - Very dark brown (almost black)
  brown3: "#9c6f44", // RGB: (156,111,68) - Lighter medium brown
  brown4: "#563517", // RGB: (86,53,23) - Dark brown
  brown5: "#6f4827", // RGB: (111,72,39) - Medium-dark brown
} as const;

// Color Palette Variables - Dark Mode (Warm Brown)
export const darkPalette = {
  background: "#120A04", // Deep espresso-brown - Base/Page background
  surface: "#1E1208", // Slightly lighter brown - Containers/UI surfaces
  primary: "#A87448", // Rich bronze-gold - Main brand/highlight
  secondary: "#8B5A2B", // Medium copper-brown - Buttons/icons/focus
  text: "#DCC3A2", // Warm beige - Text & icons
} as const;

// Light Theme using palette variables
export const lightTheme = {
  background: "#F5F1EB", // Very light beige tint for background
  surface: "#FFFFFF", // Pure white for cards
  primary: palette.brown1, // #724e2c - Medium brown for primary actions
  secondary: palette.brown3, // #9c6f44 - Lighter medium brown for secondary elements
  text: {
    primary: palette.brown2, // #271300 - Very dark brown for primary text
    secondary: palette.brown4, // #563517 - Dark brown for secondary text
    tertiary: palette.brown5, // #6f4827 - Medium-dark brown for tertiary text
  },
  accent: {
    work: palette.brown1, // #724e2c - Work sessions
    break: palette.brown3, // #9c6f44 - Break sessions
    success: palette.brown1, // #724e2c - Success state
    warning: palette.brown5, // #6f4827 - Warning state
  },
  border: "#E0D5C8", // Light brown tint for borders
};

// Dark Theme using dark palette variables (Warm Brown)
export const darkTheme = {
  background: darkPalette.background, // #120A04 - Deep espresso-brown background
  surface: darkPalette.surface, // #1E1208 - Slightly lighter brown for cards
  primary: darkPalette.primary, // #A87448 - Rich bronze-gold for primary actions
  secondary: darkPalette.secondary, // #8B5A2B - Medium copper-brown for secondary elements
  text: {
    primary: darkPalette.text, // #DCC3A2 - Warm beige for primary text
    secondary: "#C4B093", // Slightly darker beige for secondary text
    tertiary: "#A8937A", // Medium beige for tertiary text
  },
  accent: {
    work: darkPalette.primary, // #A87448 - Rich bronze-gold for work sessions
    break: darkPalette.secondary, // #8B5A2B - Medium copper-brown for break sessions
    success: darkPalette.primary, // #A87448 - Rich bronze-gold for success state
    warning: darkPalette.secondary, // #8B5A2B - Medium copper-brown for warning state
  },
  border: "#2A1A0E", // Subtle brown border (darker than surface for definition)
};

export type Theme = typeof lightTheme;
