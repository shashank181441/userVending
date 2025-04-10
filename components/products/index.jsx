import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import ProductCard from "../../../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../../components/api";
import { Link, useRouter } from "expo-router";


function AdminProducts() {

  const router = useRouter()
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getProducts();
      return res.data.data; // Ensure you return this
    },
  });
  
  if (error) {
    router.push("/login")
    console.log(error)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <View style={styles.actionsHeader}>
        <Link href={"/products/create"} style={styles.addButton}>
          <Text style={styles.addButtonText} >Add Product</Text>
        </Link>
        <Link href={"/sales/purchaselogs"} style={styles.logsButton}>
          <Text style={styles.logsButtonText}>Purchase Logs</Text>
        </Link>
      </View>
      {isLoading ? <Text> Loading...</Text> : (
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No products available.</Text>}
      />
      )}
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
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#f97316",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  logsButton: {
    backgroundColor: "#1f2937",
    padding: 10,
    borderRadius: 8,
  },
  logsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  list: {
    paddingBottom: 16,
    marginBottom: 12
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 32,
    fontSize: 16,
  },
});
