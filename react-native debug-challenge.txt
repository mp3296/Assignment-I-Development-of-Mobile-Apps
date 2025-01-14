import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpac,
  TextInput,
  FlatList,
  Picker,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  // States to manage form inputs and data
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [gender] = useState('Male');

  // Load data from AsyncStorage when the app starts
  useEffect(() => {
    const loadData = async () => {
      const savedData = await AsyncStorage.getItem('userData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage whenever the data state changes
  useEffect(() => {
    AsyncStorage.setItem('userData', JSON.stringify(data));
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
      
      console.log('Please fill in all fields.');
    } else {
// Clear input fields
      setFirstName('');
      setSurname('');
      setAge('');
      setGender('Male');
    }
  };

  // Function to handle deleting an item
  const deleteData = (id) => {
    const filteredData = data.filter((item) => item.id !== id);
    setData(filteredData);
  };

  // Function to display item details
  const handleClick = (item) => {
    console.log(
      'Details',
      Name: ${item.firstNames} ${item.surnames}\nAge: ${item.ages}\nGender: ${item.genders}
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
        onChangeText-{setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>
      <TouchableOpac style={styles.addButton} onPress={addData}>
        <Text style={styles.addButtonText}>Add<Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={(item) => item.ID}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
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