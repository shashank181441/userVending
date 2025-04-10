import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, useWindowDimensions } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVendingMachinesByOwner, deleteVendingMachine } from "../../../components/api";
import { Dialog, Portal, Button, Provider as PaperProvider } from "react-native-paper";

export default function AdminVendingMachinesUI() {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["vendingMachines"],
    queryFn: getVendingMachinesByOwner,
  });

  const deleteMachineMutation = useMutation({
    mutationFn: (id) => deleteVendingMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["vendingMachines"]);
      hideDialog();
    },
  });

  const showDialog = (id) => {
    setSelectedMachineId(id);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedMachineId(null);
  };

  const handleDelete = () => {
    if (selectedMachineId) {
      deleteMachineMutation.mutate(selectedMachineId);
    }
  };

  if (isLoading) return <Text className="text-center text-lg">Loading...</Text>;
  if (error) router.push("/error");

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Vending Machines Management</Text>
      <Link href="/machines/create" className="text-white text-center text-lg font-bold bg-indigo-600 p-3 rounded-lg mb-4">
        Add Machine
      </Link>

      {!isMobile && (
        <View className="flex-row bg-gray-300 p-3 rounded-t-lg">
          <Text className="flex-1 font-bold text-sm text-gray-700">#</Text>
          <Text className="flex-1 font-bold text-sm text-gray-700">Location</Text>
          <Text className="flex-1 font-bold text-sm text-gray-700">Status</Text>
          <Text className="flex-1 font-bold text-sm text-gray-700 text-right">Actions</Text>
        </View>
      )}

      <FlatList
        data={data?.data?.data || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View className={`flex-row p-3 border-b border-gray-300 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>            
            <Text className="flex-1 text-gray-800">{index + 1}</Text>
            <Text className="flex-1 text-blue-500 underline" onPress={() => router.push(`/products/${item._id}`)}>{item.location}</Text>
            <Text className="flex-1 text-gray-800">{item.status ? "Active" : "Inactive"}</Text>
            <View className="flex-1 flex-row justify-end space-x-3">
              <TouchableOpacity onPress={() => router.push(`/machines/edit/${item._id}`)}>
                <Text className="text-indigo-600">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showDialog(item._id)}>
                <Text className="text-red-500">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-4">No vending machines found.</Text>}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Delete Machine</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this machine?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleDelete} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
