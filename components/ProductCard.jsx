import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Clipboard } from "react-native";
import { Edit, Trash2, Repeat, Clipboard as ClipboardIcon, Plus, PlusCircle, MinusCircle } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import { TapGestureHandler, GestureHandlerRootView, State } from "react-native-gesture-handler";

const ProductCard = ({ product, showDialog }) => {
  const router = useRouter();

  const handleDoubleTap = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      router.push({
        pathname: "/products/edit/[id]",
        params: { id: product._id },
      });
    }
  };
  const increase=(val)=>{
    
  }

  const stockRatio = product.stock / product.stockLimit;
  const backgroundColor =
    stockRatio <= 0.1
      ? "#f7c2bc"  // Low stock
      : stockRatio < 0.4
      ? "#f1f79e" // Medium stock
      : "white"; // Sufficient stock

  return (
    <GestureHandlerRootView>
      <TapGestureHandler numberOfTaps={2} onHandlerStateChange={handleDoubleTap}>
        <View style={[styles.card, { backgroundColor }]}>
          {/* Top Section: Image & Details */}
          <View style={styles.topSection}>
            {/* Product Image */}
            <Image source={{ uri: product.image_url }} style={styles.image} />
            {/* <View><Text>Hello</Text></View> */}

            {/* Product Details */}
            <View style={styles.details}>
              <Text style={styles.title} numberOfLines={2}>
                {product.name}
              </Text>

              {/* Product ID */}
              <View style={styles.row}>
                <Text style={styles.productId}>Product No.: {product.productNumber} </Text>
                <TouchableOpacity onPress={() => Clipboard.setString(product.productNumber)}>
                  <ClipboardIcon size={16} color="#ef4444" style={styles.icon} />
                </TouchableOpacity>
              </View>

              {/* Price and Stock */}
              <Text style={styles.price}>NPR {product.price}</Text>
              <Text style={styles.stock}>Stock: {product.stock}</Text>
            </View>
            <View style={styles.bottomIcons}>
            <Link
              href={`/products/edit/${product._id}`}>
              <Edit size={20} color="#6b7280" />
            </Link>
            <TouchableOpacity style={styles.icon} onPress={showDialog}>
              <Trash2 size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          </View>

          {/* Bottom Section: Icons */}

          
        </View>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: 'red',
    padding: 16,
    // marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    alignSelf: "stretch",
    width: "100%",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  productId: {
    color: "#6b7280",
    fontSize: 14,
  },
  icon: {
    marginLeft: 8,
  },
  price: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
  stock: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  bottomIcons: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    justifyContent: "flex-end",
  },
  icon: {
    marginHorizontal: 6
  }
});

export default ProductCard;
