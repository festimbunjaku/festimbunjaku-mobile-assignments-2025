import React from "react";
import { View, Text, Image, StyleSheet, ImageStyle, ViewStyle, TextStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface AvatarProps {
  profilePictureUrl: string | null | undefined;
  email: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  profilePictureUrl,
  email,
  size = 40,
  style,
}) => {
  const { theme } = useTheme();

  // Get user's first letter
  const getInitials = (email: string): string => {
    if (!email) return "?";
    const firstLetter = email.charAt(0).toUpperCase();
    return firstLetter;
  };

  const initials = getInitials(email);
  const avatarSize = size;
  const fontSize = avatarSize * 0.4;

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: theme.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.border,
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize,
    fontWeight: "700",
    color: theme.primary,
    fontFamily: "Inter_700Bold",
  };

  if (profilePictureUrl) {
    return (
      <View testID="avatar-container" style={containerStyle}>
        <Image
          testID="avatar-image"
          source={{ uri: profilePictureUrl }}
          style={styles.image as ImageStyle}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View testID="avatar-container" style={containerStyle}>
      <Text testID="avatar-initials" style={textStyle}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

