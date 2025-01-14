import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, // Fixed: Corrected TouchableOpac to TouchableOpacity
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Select from 'react-select'; // Changed: Using react-select instead of Picker for web compatibility

const App = () => {
  // States to manage form inputs and data
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male'); // Fixed: Added setGender to manage the gender state
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  // Load data from AsyncStorage when the app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          setData(JSON.parse(savedData));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data');
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage whenever the data state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(data));
      } catch (error) {
        Alert.alert('Error', 'Failed to save data');
      }
    };
    saveData();
  }, [data]);

  // Function to handle adding new data
  const addData = () => {
    if (firstName && surname && age && gender) {
      const newData = {
        id: Date.now().toString(),
        firstName: firstName.trim(),
        surname: surname.trim(),
        age: age.trim(),
        gender,
      };
      setData([...data, newData]);
      // Clear input fields
      setFirstName('');
      setSurname('');
      setAge('');
      setGender('Male');
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  // Function to handle deleting an item
  const deleteData = (id) => {
    const filteredData = data.filter((item) => item.id !== id);
    setData(filteredData);
  };

  // Function to display item details
  const handleClick = (item) => {
    Alert.alert(
      'Details',
      `Name: ${item.firstName} ${item.surname}\nAge: ${item.age}\nGender: ${item.gender}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Information Manager</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <Select
        value={genderOptions.find(option => option.value === gender)}
        onChange={(selectedOption) => setGender(selectedOption.value)}
        options={genderOptions}
        styles={{
          container: (provided) => ({
            ...provided,
            marginBottom: 10,
          }),
        }}
      />
      <TouchableOpacity style={styles.addButton} onPress={addData}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => handleClick(item)}>
              <Text style={styles.listText}>
                {item.firstName} {item.surname}
              </Text>
              <Text style={styles.listText}>
                {item.gender} {item.age}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteData(item.id)}>
              <Text style={styles.deleteButton}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
  },
  listText: {
    fontSize: 16,
  },
  deleteButton: {
    color: '#f00',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default App;