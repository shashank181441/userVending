import { Wallet, WashingMachine } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../store/authSlice";
// import { loginUser } from "../../../components/api";
import { useRouter } from "expo-router";
import { loginUser } from "../../components/api";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("h@g.come");
  const [password, setPassword] = useState("password1");
  const [disable, setDisable] = useState(false)
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      // const userData = await loginUser({ email: "h@g.come", password: "password1" });
      const userData = await loginUser({ email: email, password: password });
      setDisable(true)
      if (userData) {
        dispatch(login({ userData: userData.data }));
        router.push("/machines");
      } else {
        dispatch(logout());
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Wallet size={144} style={styles.logo} />
        <Text style={styles.title}>Sign in to your account</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={disable}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Do not have an account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    backgroundColor: "#fff",
    // justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
    color: "red",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    color: "#555",
  },
  registerLink: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
