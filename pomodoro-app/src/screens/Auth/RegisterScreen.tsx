import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { Button, Input } from "../../components/Common";
import { useTheme } from "../../context/ThemeContext";

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
}) => {
  const { signUp } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      let errorMessage = "Could not create account";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 422) {
        errorMessage = "Invalid email or password format. Please check your input.";
      }
      
      Alert.alert("Registration Failed", errorMessage);
    } else {
      Alert.alert(
        "Success!",
        "Account created successfully. You can now sign in.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>Start your focus journey today</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text.secondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.footerLink, { color: theme.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.homeFooter}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.homeButton}
        >
          <MaterialIcons name="home" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 24,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  homeFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    paddingTop: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  homeButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: "transparent",
  },
});
