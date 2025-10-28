export const lightTheme = {
  background: "#F7F7F5", // Soft off-white
  surface: "#FFFFFF", // Pure white for cards
  primary: "#7C8B9E", // Muted blue-gray
  secondary: "#A8B5C4", // Lighter blue-gray
  text: {
    primary: "#2D3436", // Dark gray
    secondary: "#636E72", // Medium gray
    tertiary: "#A8B5C4", // Light gray
  },
  accent: {
    work: "#8FA89E", // Muted sage green
    break: "#D4A373", // Muted terracotta
    success: "#7FB685", // Muted green
    warning: "#C9A67A", // Muted amber
  },
  border: "#E8E8E6", // Very light gray
};

export const darkTheme = {
  background: "#1C1C1E", // Very dark gray
  surface: "#2C2C2E", // Dark gray for cards
  primary: "#8FA8BC", // Lighter muted blue
  secondary: "#6A7A8A", // Muted slate
  text: {
    primary: "#E8E8E8", // Off-white
    secondary: "#A8B5C4", // Light gray
    tertiary: "#6A7A8A", // Medium gray
  },
  accent: {
    work: "#9BB8A7", // Lighter sage
    break: "#D9B896", // Lighter terracotta
    success: "#8FC497", // Lighter green
    warning: "#D4B48F", // Lighter amber
  },
  border: "#3C3C3E", // Medium-dark gray
};

export type Theme = typeof lightTheme;
