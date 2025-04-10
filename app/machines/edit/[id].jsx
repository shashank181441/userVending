import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { updateVendingMachine, getVendingMachineDetails } from "../../../components/api";
import { ArrowLeft } from "lucide-react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminVendingEdit({id, makeInvisible, refetch}) {
  const router = useRouter();
  // const { id } = useLocalSearchParams();
  const queryClient = useQueryClient()

  // Fetch machine details
  const { data: machine, isLoading, error } = useQuery({
    queryKey: ["machine", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await getVendingMachineDetails(id);
      return res.data.data;
    },
    enabled: !!id,
  });

  const [formData, setFormData] = useState({
    location: "",
    status: false,
  });

  useEffect(() => {
    if (machine) {
      setFormData({
        location: machine.location || "",
        status: machine.status || false,
      });
    }
  }, [machine]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateVendingMachine(id, formData);
      // Alert.alert("Success", "Vending machine updated successfully.");
      // router.push("/home/machines");
      makeInvisible(false)
      refetch()
    } catch (error) {
      console.error("Error updating vending machine:", error);
      Alert.alert("Error", "An error occurred while updating the vending machine.");
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading machine details.</Text>;
  }

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* <View className="flex-row items-center mb-4">
        <ArrowLeft onPress={() => router.back()} />
        <Text className="text-xl font-bold text-center flex-1">Create Vending Machine</Text>
      </View> */}
      {/* <View className="bg-white p-4 rounded-lg shadow-md"> */}
        <Text className="text-lg font-semibold text-gray-700 mb-2">Location</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-lg bg-white mb-4"
          placeholder="Enter location"
          value={formData.location}
          onChangeText={(text) => handleChange("location", text)}
        />
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-700">Active</Text>
          <Switch value={formData.status} onValueChange={(value) => handleChange("status", value)} />
        </View>
        <TouchableOpacity className="bg-indigo-600 p-3 rounded-lg items-center" onPress={handleSubmit}>
          <Text className="text-white text-lg font-semibold">Save Changes</Text>
        </TouchableOpacity>
      {/* </View> */}
    </View>
  );
}
