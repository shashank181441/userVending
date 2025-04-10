import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProductDetails, updateProduct } from "../../../../components/api";
import { categories } from "../../../../components/category";
import { z } from "zod";
import {
  Button,
  TextInput,
  HelperText,
  Checkbox,
  ActivityIndicator,
  Modal,
  Portal,
  Dialog,
  useTheme,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";

// **Validation Schema using Zod**
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  stock: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Stock is required").max(15, "Stock cannot exceed 15")
  ),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Price is required").max(1000, "Price cannot exceed 1000")
  ),
  productNumber: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Product Number is required").max(50, "Cannot exceed 50")
  ),
  active: z.boolean(),
});

const AdminProductEdit = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [defaultCat, setDefaultCat] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await getProductDetails(id);
      return response.data.data;
    },
  });

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "beverages",
      stock: 0,
      price: "",
      productNumber: "",
      active: false,
    },
  });

  const { control, handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    if (isSuccess && product) {
      reset({
        name: product.name || "",
        category: product.category || "beverages",
        stock: product.stock || 0,
        price: product.price || "",
        productNumber: product.productNumber || "",
        active: product.active || false,
      });
    }
  }, [isSuccess, product, reset]);

  const getStockLimit = (productNumber) => {
    const slotNumber = parseInt(productNumber, 10);
    if (slotNumber >= 1 && slotNumber <= 5) return 3;
    if (slotNumber >= 6 && slotNumber <= 10) return 11;
    if (slotNumber >= 11 && slotNumber <= 20) return 14;
    if (slotNumber >= 21 && slotNumber <= 30) return 11;
    if (slotNumber >= 31 && slotNumber <= 40) return 7;
    if (slotNumber >= 41 && slotNumber <= 50) return 6;
    return 0;
  };

  const productNumber = useWatch({
    control,
    name: "productNumber",
    defaultValue: "",
  });
  const stockLimit = getStockLimit(productNumber);

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (formData) => {
      const response = await updateProduct(id, formData);
      return response.data.data;
    },
    onSuccess: () => {
      // Successfully updated
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = async (formData) => {
    if (formData.stock > stockLimit) {
      formData.stock = stockLimit;
    }
    const res = await updateProduct(id, formData);
    queryClient.invalidateQueries("products");
  };

  if (isLoading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.bg,
        }}
      >
        <ActivityIndicator
          animating
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );

  if (error)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.bg,
        }}
      >
        <Text style={{ color: theme.colors.text }}>Error: {error.message}</Text>
      </View>
    );

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          color: theme.colors.text,
        }}
      >
        Edit Product
      </Text>

      <FormProvider {...methods}>
        {/* Name Input */}
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field, fieldState }) => (
            <View style={{ marginBottom: 15 }}>
              <TextInput
                label={(<Text style={{color: theme.colors.text}}>Name</Text>)}
                mode="outlined"
                value={field.value}
                onChangeText={field.onChange}
                textColor={theme.colors.text}
                style={{ backgroundColor: theme.colors.bg }}
              />
              <HelperText
                type="error"
                visible={!!fieldState.error}
                style={{ color: theme.colors.error }}
              >
                {fieldState.error?.message}
              </HelperText>
            </View>
          )}
        />

        {/* Category Select */}
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <View style={{ marginBottom: 15 }}>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 5,
                  color: theme.colors.text,
                }}
              >
                Category
              </Text>
              <Button
                textColor={theme.colors.text}
                mode="outlined"
                onPress={() => setCategoryModalVisible(true)}
                style={{ borderRadius: 2, backgroundColor: theme.colors.bg }}
              >
                {categories.find((c) => c.slug === field.value)?.name ||
                  defaultCat}
              </Button>

              {/* Category Selection Modal */}
              <Portal>
                <Dialog
                  visible={categoryModalVisible}
                  onDismiss={() => setCategoryModalVisible(false)}
                  style={{ backgroundColor: theme.colors.bg }}
                >
                  <Dialog.Title style={{ color: theme.colors.text }}>
                    Select a Category
                  </Dialog.Title>
                  <Dialog.ScrollArea>
                    <FlatList
                      style={{ backgroundColor: theme.colors.bg }}
                      data={categories}
                      keyExtractor={(item) => item.slug}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={{
                            padding: 15,
                            borderBottomWidth: 0.5,
                            borderColor: theme.colors.text,
                            backgroundColor: theme.colors.bg,
                          }}
                          onPress={() => {
                            field.onChange(item.slug);
                            setCategoryModalVisible(false);
                          }}
                        >
                          <Text
                            style={{ fontSize: 16, color: theme.colors.text }}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </Dialog.ScrollArea>
                </Dialog>
              </Portal>
            </View>
          )}
        />

        {/* Stock Input */}
        <Controller
          control={control}
          name="stock"
          rules={{ required: "Stock is required", min: 1 }}
          render={({ field, fieldState }) => (
            <View style={{ marginBottom: 15 }}>
              <TextInput
                label={(<Text style={{color: theme.colors.text}}>Stock</Text>)}
                mode="outlined"
                keyboardType="numeric"
                value={String(field.value)}
                onChangeText={(value) => field.onChange(Number(value))}
                textColor={theme.colors.text}
                style={{ backgroundColor: theme.colors.bg }}
              />
              <HelperText
                type="error"
                visible={!!fieldState.error}
                style={{ color: theme.colors.error }}
              >
                {fieldState.error?.message}
              </HelperText>
            </View>
          )}
        />

        {/* Price Input */}
        <Controller
          control={control}
          name="price"
          rules={{ required: "Price is required", min: 1 }}
          render={({ field, fieldState }) => (
            <View style={{ marginBottom: 15 }}>
              <TextInput
                label={(<Text style={{color: theme.colors.text}}>Price</Text>)}
                mode="outlined"
                keyboardType="numeric"
                value={String(field.value)}
                onChangeText={(value) => field.onChange(Number(value))}
                textColor={theme.colors.text} // Ensures input text color matches theme
                style={{ backgroundColor: theme.colors.bg }}
                theme={{ colors: { primary: theme.colors.text } }} // Makes label color match theme text
              />
              <HelperText
                type="error"
                visible={!!fieldState.error}
                style={{ color: theme.colors.error }}
              >
                {fieldState.error?.message}
              </HelperText>
            </View>
          )}
        />

        {/* Product Number */}
        <Controller
          control={control}
          name="productNumber"
          render={({ field }) => (
            <View style={{ marginBottom: 15 }}>
              <TextInput
                // label="Product Number"
                label={(<Text style={{color: theme.colors.text}}>Product Number</Text>)}
                mode="outlined"
                keyboardType="numeric"
                value={String(field.value)}
                onChangeText={(value) => field.onChange(Number(value))}
                textColor={theme.colors.text}
                style={{ backgroundColor: theme.colors.bg, label: theme.colors }}
              />
              <Text style={{ marginTop: 5, color: theme.colors.text }}>
                Stock Capacity: {getStockLimit(field.value)}
              </Text>
            </View>
          )}
        />

        {/* Active Checkbox */}
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
                color: theme.colors.bg
              }}
            >
              <Checkbox
                status={field.value ? "checked" : "unchecked"}
                onPress={() => field.onChange(!field.value)}
                color={theme.colors.text}
              />
              <Text style={{ marginLeft: 5, color: theme.colors.text }}>
                Active
              </Text>
            </View>
          )}
        />

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isUpdating}
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          textColor="#ffffff"
        >
          Submit
        </Button>
      </FormProvider>
    </ScrollView>
  );
};

export default AdminProductEdit;
