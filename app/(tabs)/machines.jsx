import { Link, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getVendingMachinesByOwner } from "../../components/api";
import { Button, useTheme, Text } from "react-native-paper";
import { MapPin, ChevronDown } from "lucide-react-native";
import { useSelector } from "react-redux";
import AdminVendingEdit from "../machines/edit/[id]";



export function MachineCard({ id, location, status, onEdit }) {
  const theme = useTheme();
  const lightModeLogo = "https://files.catbox.moe/a7kpfd.png";
  const darkModeLogo = "https://files.catbox.moe/6616hk.png";
  const router = useRouter()

  return (
    <TouchableOpacity onPress={()=>{
      router.push(`/products/${id}`)
    }}
      style={{
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 16,
        margin: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: theme.colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: theme.dark ? darkModeLogo : lightModeLogo }}
        style={{ width: 64, height: 64 }}
        resizeMode="contain"
      />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          <MapPin size={16} color={theme.colors.onSurfaceVariant} />
          <Text style={{ marginLeft: 8, color: theme.colors.onSurfaceVariant, fontWeight: "bold" }}>
            {location}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: status ? theme.colors.primary : theme.colors.error,
                borderRadius: 6,
                marginRight: 8,
              }}
            />
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              {status ? "Active" : "Inactive"}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primaryContainer,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
            }}
            onPress={onEdit}
          >
            <Text style={{ color: theme.colors.onPrimaryContainer }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AdminVendingMachinesUI() {
  const theme = useTheme();
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  const { data: vendingMachines, isLoading, error, refetch } = useQuery({
    queryKey: ["vendingMachines", userData],
    queryFn: async () => {
      const res = await getVendingMachinesByOwner();
      return res.data.data;
    },
  });

  if (isLoading) return <Text style={{ textAlign: "center", fontSize: 18 }}>Loading...</Text>;
  if (error) return <Text>Error... {error.toString()}</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View className={`pt-14 bg-orange-600 px-6 pb-4 rounded-2xl`}>
      <Text className="pt-4 rounded-b-xl text-white" style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "white" }}>
        Your Vending Machines
      </Text>
      </View>

      <Link className="m-4" href="/machines/create" style={{ backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <Text style={{ color: theme.colors.onPrimary, textAlign: "center", fontSize: 18, fontWeight: "bold" }}>Add Machine</Text>
      </Link>
      <FlatList
        data={vendingMachines}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MachineCard
          id={item._id}
            location={item.location}
            status={item.status}
            onEdit={() => {
              setSelectedMachineId(item._id);
              setModalVisible(true);
            }}
          />
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>No vending machines found.</Text>}
      />
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%", height: "30%" }}>
            {selectedMachineId && <AdminVendingEdit id={selectedMachineId} makeInvisible={setModalVisible} refetch={refetch} />}
            <Button onPress={() => setModalVisible(false)}>Close</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
