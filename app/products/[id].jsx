import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions } from "react-native";
import ProductCard from "../../components/ProductCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getProductsByMachine } from "../../components/api";
import { Link, useLocalSearchParams } from "expo-router";
import { Dialog, Portal, Button, Menu } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

function AdminProducts() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [ascending, setAscending] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    setMenuVisible(false);  // Close the menu after selection
  };

  const showDialog = (productId) => {
    setDeleteId(productId);
    setVisible(true);
  };
  const hideDialog = () => setVisible(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await getProductsByMachine(id);
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      await deleteProduct(productId);
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries(["products", id]);
      const previousProducts = queryClient.getQueryData(["products", id]);
      queryClient.setQueryData(["products", id], (old) =>
        old ? old.filter((product) => product._id !== productId) : []
      );
      return { previousProducts };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(["products", id], context.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products", id]);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(deleteId);
    hideDialog();
    setDeleteId("");
  };

  const filteredProducts = products
    ?.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (ascending) {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <View style={{justifyContent: "space-between", display: "flex", flexDirection: "row"}}>
        <Link href={`/products/create/${id}`} className="bg-orange-500 px-3 py-2 rounded-md font-bold justify-end mb-3">Add Product</Link>
        <Link href={`/sales/purchaselogs/${id}`} className="bg-black text-white px-3 py-2 rounded-md font-bold justify-end mb-3">Purchase Logs</Link>
      </View>
      <View style={styles.actionsHeader}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => {setMenuVisible(true); console.log("clicked")}}>
              <MaterialIcons name="filter-list" size={24} color="black" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => handleSort("name")} title="Name" />
          <Menu.Item onPress={() => handleSort("productNumber")} title="Product No." />
          <Menu.Item onPress={() => handleSort("price")} title="Price" />
          <Menu.Item onPress={() => handleSort("stock")} title="Stock" />
        </Menu>
        
        <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
          <MaterialIcons name="search" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAscending(!ascending)}>
          <MaterialIcons name={ascending ? "arrow-upward" : "arrow-downward"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {searchVisible && (
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          autoFocus
        />
      )}
      
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlashList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={isMobile ? 1 : 2}
          renderItem={({ item }) => (
            <View style={styles.productCardWrapper}>
              <ProductCard product={item} showDialog={() => showDialog(item._id)} />
            </View>
          )}
          estimatedItemSize={100}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No products available.</Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: "white" }}>
          <Dialog.Title style={{ color: "black" }}>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this product?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="black">Cancel</Button>
            <Button onPress={handleDelete} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

export default AdminProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1f2937",
  },
  actionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 32,
    fontSize: 16,
  },
  productCardWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  separator: {
    height: 16,
  },
});