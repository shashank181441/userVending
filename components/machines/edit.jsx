import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { updateVendingMachine, getVendingMachineDetails } from '../../api/api';

function EditVendingMachine() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { machineId } = route.params; // Extract machineId from route parameters

//   const [formData, setFormData] = useState({
//     location: '',
//     status: false, // Default to false (inactive)
//   });

//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state

//   useEffect(() => {
//     const fetchVendingMachineDetails = async () => {
//       try {
//         const response = await getVendingMachineDetails(machineId);
//         const { location, status } = response.data.data; // Assuming the data is in this structure
//         setFormData({ location, status });
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load vending machine details.');
//         setLoading(false);
//       }
//     };

//     fetchVendingMachineDetails();
//   }, [machineId]);

//   const handleChange = (name, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await updateVendingMachine(machineId, formData);
//       Alert.alert('Success', 'Vending machine updated successfully.');
//       navigation.navigate('AdminVendingMachines'); // Redirect after success
//     } catch (error) {
//       console.error('Error updating vending machine:', error);
//       Alert.alert('Error', 'An error occurred while updating the vending machine.');
//     }
//   };



//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#4f46e5" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Vending Machine</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
        //   value={formData.location}
        //   onChangeText={(text) => handleChange('location', text)}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Active</Text>
          <Switch
            // value={formData.status}
            // onValueChange={(value) => handleChange('status', value)}
          />
        </View>
        <Button title="Save Changes" 
        // onPress={handleSubmit}
        color="#4f46e5" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EditVendingMachine;
