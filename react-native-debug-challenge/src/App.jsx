import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Select from 'react-select';

const App = () => {
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('data');
        if (storedData) {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data');
      }
    };
    loadData();
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('data', JSON.stringify(data));
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const addEntry = () => {
    if (firstName && surname && age) {
      const newEntry = { firstName, surname, age, gender };
      setData([...data, newEntry]);
      setFirstName('');
      setSurname('');
      setAge('');
      saveData();
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Form</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={addEntry}>
        <Text style={styles.addButtonText}>Add Entry</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{`${item.firstName} ${item.surname}, Age: ${item.age}, Gender: ${item.gender}`}</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
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
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default App;
