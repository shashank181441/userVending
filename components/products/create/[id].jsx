import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Checkbox, Text, HelperText, Card, Dialog, Portal } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { categories } from '../../../../components/category';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoveLeft } from 'lucide-react-native';
import { createProduct } from '../../../../components/api';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminProductAdd() {
  const [name, setName] = useState('hello');
  const [stock, setStock] = useState('1');
  const [price, setPrice] = useState('1');
  const [productNumber, setProductNumber] = useState('1');
  const [active, setActive] = useState(true);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('snack');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient()
  
  const { id } = useLocalSearchParams();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !category || !stock || !price || !productNumber) {
      alert('Please fill in all fields.');
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('stock', parseInt(stock));  // Convert to string
    formData.append('price', parseInt(price));  // Convert to string
    formData.append('productNumber', parseInt(productNumber));  // Convert to string
    formData.append('active', active ? true : false);  // Convert boolean to string
    formData.append("machineId", id.toString());
  
      // ✅ Correctly handle the image file
  if (image) {
    const fileName = image.split('/').pop();
    const fileType = fileName.split('.').pop();
    formData.append('image_url', {
      uri: image,
      name: fileName,
      type: `image/${fileType}`,
    });
  }

    console.log(Array.from(formData.entries()))
  
    try {
      const response = await createProduct(formData);
      queryClient.invalidateQueries("products")
      router.back();
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert(error.message)
    } finally {
      setLoading(false);
    }
  };
  

  const router = useRouter()

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Button onPress={()=>router.back()}><MoveLeft /> </Button>
        <Card.Title title="Admin Product Add" titleStyle={styles.title} />
        <Card.Content>
          <View style={styles.field}>
            <TextInput label="Name" mode="outlined" value={name} onChangeText={setName} />
            <HelperText type="error" visible={!name}>Name is required</HelperText>
          </View>

          <View style={styles.field}>
            <Button mode="outlined" onPress={() => setDialogVisible(true)} style={styles.button}>
              {category ? categories.find(c => c.slug === category)?.name : "Select Category"}
            </Button>
            <Portal>
              <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Title>Select a Category</Dialog.Title>
                <Dialog.Content>
                  {categories.map((item) => (
                    <Button key={item.slug} onPress={() => { setCategory(item.slug); setDialogVisible(false); }}>
                      {item.name}
                    </Button>
                  ))}
                </Dialog.Content>
              </Dialog>
            </Portal>
            <HelperText type="error" visible={!category}>Category is required</HelperText>
          </View>

          <View style={styles.field}>
            <TextInput label="Stock" mode="outlined" keyboardType="numeric" value={stock} onChangeText={setStock} />
            <HelperText type="error" visible={!stock}>Stock is required</HelperText>
          </View>

          <View style={styles.field}>
            <TextInput label="Price" mode="outlined" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
            <HelperText type="error" visible={!price}>Invalid price format</HelperText>
          </View>

          <View style={styles.field}>
            <TextInput label="Product Number" mode="outlined" keyboardType="numeric" value={productNumber} onChangeText={setProductNumber} />
            <HelperText type="error" visible={!productNumber}>Product number is required</HelperText>
          </View>

          <View style={styles.checkboxField}>
            <Checkbox status={active ? "checked" : "unchecked"} onPress={() => setActive(!active)} />
            <Text style={styles.checkboxLabel}>Active</Text>
          </View>

          <View style={styles.field}>
            <Button mode="outlined" onPress={pickImage} style={styles.button}>
              {image ? 'Change Image' : 'Upload Image'}
            </Button>
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          </View>

          <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.submitButton}>
            Submit
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 8, paddingVertical: 24 },
  card: { padding: 8, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 'bold' },
  field: { marginBottom: 12 },
  checkboxField: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  button: { marginBottom: 8 },
  imagePreview: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 8, borderRadius: 8 },
  submitButton: { marginTop: 8 },
  checkboxLabel: { marginLeft: 8 },
});
