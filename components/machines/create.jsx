import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { createVendingMachine } from "../../components/api";
import { ArrowLeft } from "lucide-react-native";

export default function AdminVendingCreate() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    location: "",
    status: false, // Default to false (inactive)
  });

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createVendingMachine(formData);
      // Alert.alert("Success", "Vending machine created successfully.", [
      //   { text: "OK", onPress: () => router.back() }, // Navigate back after success
      // ]);
      router.back()
      router.push("/machines")

    } catch (error) {
      console.error("Error creating vending machine:", error);
      Alert.alert("Error", "An error occurred while creating the vending machine.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ArrowLeft onPress={() => router.back()} />
        <Text style={styles.title}>Update Vending Machine</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={formData.location}
          onChangeText={(text) => handleChange("location", text)}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Active</Text>
          <Switch
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", flex: 1 },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

