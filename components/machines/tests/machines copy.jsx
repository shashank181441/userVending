// import { Link, useRouter } from "expo-router";
// import React, { useMemo, useState } from "react";
// import {
//   View,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   useWindowDimensions,
//   Alert,
// } from "react-native";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getVendingMachinesByOwner,
//   deleteVendingMachine,
// } from "../../../components/api";
// import {
//   Dialog,
//   Portal,
//   Button,
//   Menu,
//   Divider,
//   useTheme,
//   Text,
// } from "react-native-paper";
// import { MapPin, ChevronDown } from "lucide-react-native";
// import { useSelector } from "react-redux";

// export function MachineCard({ location, status, onEdit, onDelete }) {
//   const theme = useTheme();

//   const lightModeLogo = "https://files.catbox.moe/a7kpfd.png";
//   const darkModeLogo = "https://files.catbox.moe/6616hk.png";

//   return (
//     <View
//       style={{
//         backgroundColor: theme.colors.surfaceVariant,
//         borderRadius: 16,
//         margin: 16,
//         padding: 16,
//         flexDirection: "row",
//         alignItems: "center",
//         shadowColor: theme.colors.shadow,
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         elevation: 3,
//       }}
//     >
//       <Image
//         source={{ uri: theme.dark ? darkModeLogo : lightModeLogo }}
//         style={{ width: 64, height: 64 }}
//         resizeMode="contain"
//       />
//       <View style={{ flex: 1, marginLeft: 16 }}>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginBottom: 4,
//           }}
//         >
//           <MapPin size={16} color={theme.colors.onSurfaceVariant} />
//           <Text
//             style={{
//               marginLeft: 8,
//               color: theme.colors.onSurfaceVariant,
//               fontWeight: "bold",
//             }}
//           >
//             {location}
//           </Text>
//         </View>
//         <View className="flex-row justify-between">
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <View
//             style={{
//               width: 12,
//               height: 12,
//               backgroundColor: status
//                 ? theme.colors.primary
//                 : theme.colors.error,
//               borderRadius: 6,
//               marginRight: 8,
//             }}
//           />
//           <Text style={{ color: theme.colors.onSurfaceVariant }}>
//             {status ? "Active" : "Inactive"}
//           </Text>
//         </View>
//         <View style={{ flexDirection: "row", gap: 8 }}>
//           <TouchableOpacity style={{ backgroundColor: theme.colors.primaryContainer, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, }} 
//           onPress={onEdit}
//           >
//             <Text style={{ color: theme.colors.onPrimaryContainer }}>Edit</Text>
//           </TouchableOpacity>
//           {/* <TouchableOpacity
//             style={{
//               backgroundColor: theme.colors.errorContainer, padding: 8, borderRadius: 8,
//             }}
//             onPress={onDelete}
//           >
//             <Text style={{ color: theme.colors.onErrorContainer }}>Inactive</Text>
//           </TouchableOpacity> */}
//         </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// export default function AdminVendingMachinesUI() {
//   const theme = useTheme();
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [visible, setVisible] = useState(false);
//   const [selectedMachineId, setSelectedMachineId] = useState(null);
//   const [sortBy, setSortBy] = useState("location");
//   const userData = useSelector((state) => state.auth.userData);

//   // Fetch vending machines
//   const {
//     data: vendingMachines,
//     isLoading,
//     error, refetch
//   } = useQuery({
//     queryKey: ["vendingMachines", userData],
//     queryFn: async () => {
//       const res = await getVendingMachinesByOwner();
//       console.log(res.data.data);
//       return res.data.data;
//     },
//   });

//   // Sort data using useMemo
//   const sortedData = useMemo(() => {
//     if (!vendingMachines) return [];
//     return [...vendingMachines].sort((a, b) => {
//       if (sortBy === "location") return a.location.localeCompare(b.location);
//       if (sortBy === "id") return a._id.localeCompare(b._id);
//       if (sortBy === "status") return b.status - a.status;
//     });
//   }, [vendingMachines, sortBy]);

//   // Delete vending machine mutation
//   const deleteMachineMutation = useMutation({
//     mutationFn: deleteVendingMachine,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["vendingMachines"]);
//       hideDialog();
//     },
//   });

//   // Dialog functions
//   const showDialog = (id) => {
//     setSelectedMachineId(id);
//     setVisible(true);
//   };

//   const hideDialog = () => {
//     setVisible(false);
//     setSelectedMachineId(null);
//   };

//   const handleDelete = () => {
//     if (selectedMachineId) {
//       // deleteMachineMutation.mutate(selectedMachineId);
//       Alert.alert("to be contd...")
//     }
//   };

//   // Menu state
//   const [menuVisible, setMenuVisible] = useState(false);
//   const openMenu = () => setMenuVisible(true);
//   const closeMenu = () => setMenuVisible(false);

//   if (isLoading)
//     return (
//       <Text style={{ textAlign: "center", fontSize: 18 }}>Loading...</Text>
//     );
//   if (error) return <Text>Error... {error.toString()}</Text>;
//   // if (error) router.push("/error");

//   return (
//     <View
//       style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}
//     >
//       <Text
//         style={{
//           fontSize: 24,
//           fontWeight: "bold",
//           marginBottom: 16,
//           color: theme.colors.onBackground,
//         }}
//       >
//         Your Vending Machines
//       </Text>

//       {/* Add Machine Button */}
//       <Link
//         href="/machines/create"
//         style={{
//           backgroundColor: theme.colors.primary,
//           padding: 12,
//           borderRadius: 8,
//           marginBottom: 16,
//         }}
//       >
//         <Text
//           style={{
//             color: theme.colors.onPrimary,
//             textAlign: "center",
//             fontSize: 18,
//             fontWeight: "bold",
//           }}
//         >
//           Add Machine
//         </Text>
//       </Link>

//       {/* Sorting Dropdown Menu */}
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "flex-end",
//           alignItems: "center",
//           marginBottom: 16,
//         }}
//       >
//         <TouchableOpacity onPress={()=>{
//           refetch()
//         }}><Text>Refresh</Text></TouchableOpacity>
//         <Text
//           style={{
//             fontSize: 18,
//             fontWeight: "600",
//             marginRight: 8,
//             color: theme.colors.onBackground,
//           }}
//         >
//           Sort by:
//         </Text>
//         <Menu
//           visible={menuVisible}
//           onDismiss={closeMenu}
//           anchor={
//             <Button
//               mode="outlined"
//               onPress={openMenu}
//               icon={() => (
//                 <ChevronDown size={16} color={theme.colors.primary} />
//               )}
//             >
//               {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
//             </Button>
//           }
//         >
//           <Menu.Item
//             onPress={() => {
//               setSortBy("location");
//               closeMenu();
//             }}
//             title="Location"
//           />
//           <Divider />
//           <Menu.Item
//             onPress={() => {
//               setSortBy("id");
//               closeMenu();
//             }}
//             title="Machine ID"
//           />
//           <Divider />
//           <Menu.Item
//             onPress={() => {
//               setSortBy("status");
//               closeMenu();
//             }}
//             title="Status"
//           />
//         </Menu>
//       </View>

//       {/* Vending Machines List */}
//       <FlatList
//         data={sortedData}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <MachineCard
//             location={item.location}
//             status={item.status}
//             onEdit={() => router.push(`/machines/edit/${item._id}`)}
//             onDelete={() => showDialog(item._id)}
//           />
//         )}
//         ListEmptyComponent={
//           <Text
//             style={{
//               textAlign: "center",
//               color: theme.colors.onSurfaceVariant,
//               marginTop: 16,
//             }}
//           >
//             No vending machines found.
//           </Text>
//         }
//       />

//       {/* Delete Confirmation Dialog */}
//       <Portal>
//         <Dialog visible={visible} onDismiss={hideDialog}>
//           <Dialog.Title>Delete Machine</Dialog.Title>
//           <Dialog.Content>
//             <Text>Are you sure you want to inactive this machine?</Text>
//           </Dialog.Content>
//           <Dialog.Actions>
//             <Button onPress={hideDialog}>Cancel</Button>
//             <Button onPress={handleDelete} textColor={theme.colors.error}>
//               Active
//             </Button>
//           </Dialog.Actions>
//         </Dialog>
//       </Portal>
//     </View>
//   );
// }
import { View, Text } from 'react-native'
import React from 'react'

export default function machines() {
  return (
    <View>
      <Text>machines</Text>
    </View>
  )
}