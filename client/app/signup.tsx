import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import SmallRobot from "../components/smallRobot";

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    accountType: "child" as "parent" | "child",
    age: "",
    parentEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const { signup, user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/(tabs)");
    }
  }, [user, authLoading]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    // Validation
    if (
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.name.trim()
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (formData.accountType === "child") {
      if (!formData.age.trim() || !formData.parentEmail.trim()) {
        Alert.alert(
          "Error",
          "Age and parent email are required for child accounts"
        );
        return;
      }
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
        Alert.alert("Error", "Please enter a valid age (1-18)");
        return;
      }
    }

    try {
      setLoading(true);
      const signupPayload: any = {
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        accountType: formData.accountType,
      };

      if (formData.accountType === "child") {
        signupPayload.age = parseInt(formData.age, 10);
        signupPayload.parentEmail = formData.parentEmail.trim();
      }

      await signup(signupPayload);
    } catch (error) {
      Alert.alert(
        "Signup Failed",
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/backgroundImages/Splash.png")}
      style={styles.container}
      resizeMode="stretch"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.nameTitle}>CompanIOn</Text>
          </View>
          <View style={styles.robotContainer}>
            <SmallRobot size={1} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Join CompanIOn!</Text>
            <Text style={styles.subtitle}>
              Create your account to get started
            </Text>

            <View style={styles.accountTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  formData.accountType === "parent" &&
                    styles.accountTypeButtonActive,
                ]}
                onPress={() => updateField("accountType", "parent")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.accountTypeText,
                    formData.accountType === "parent" &&
                      styles.accountTypeTextActive,
                  ]}
                >
                  Parent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  formData.accountType === "child" &&
                    styles.accountTypeButtonActive,
                ]}
                onPress={() => updateField("accountType", "child")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.accountTypeText,
                    formData.accountType === "child" &&
                      styles.accountTypeTextActive,
                  ]}
                >
                  Child
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.name}
                onChangeText={(value) => updateField("name", value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.email}
                onChangeText={(value) => updateField("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.password}
                onChangeText={(value) => updateField("password", value)}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            {formData.accountType === "child" && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Age *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your age"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={formData.age}
                    onChangeText={(value) => updateField("age", value)}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Parent Email *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter parent's email"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={formData.parentEmail}
                    onChangeText={(value) => updateField("parentEmail", value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.linkText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    marginTop: 80,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  robotContainer: {
    alignItems: "center",
    marginBottom: -50,
    minHeight: 100,
  },
  formContainer: {
    backgroundColor: "rgba(1, 90, 106, 0.5)",
    borderRadius: 20,
    marginTop: 60,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  nameTitle: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  accountTypeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  accountTypeButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  accountTypeButtonActive: {
    backgroundColor: "rgba(233, 148, 12, 0.3)",
    borderColor: "#E9940C",
  },
  accountTypeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "600",
  },
  accountTypeTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  button: {
    backgroundColor: "#E9940C",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  linkText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
});
