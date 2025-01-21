import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, // Error: VS Code  underline this as an undefined component: 'TouchableOpac' is declared but its value is never read.ts(6133)" This should be TouchableOpacity. 
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
  const [gender, setGender] = useState('Male'); // Warning: This state is not settable, it should be setGender.

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

  // // Save data to AsyncStorage whenever the data state changes
  // useEffect(() => {
  //   AsyncStorage.setItem('userData', JSON.stringify(data)); // Warning: AsyncStorage.setItem does not handle errors, add a try-catch block.
  // }, [data]);

// Save data to AsyncStorage whenever the data state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save data to AsyncStorage', error);
      }
    };
    saveData();
}, [data]);

  // Function to handle adding new data
  const addData = () => {
    if (firstName && surname && age && gender) { // Warning: gender might not be settable as mentioned above.
      const newData = {
        id: Date.now().toString(),
        firstName: firstName.trim(),
        surname: surname.trim(),
        age: age.trim(),
        gender, // Warning: This might be flagged if gender is not settable as mentioned above.
      };
      setData([...data, newData]);
      
      // console.log('Please fill in all fields.');
      
   
// Clear input fields
      setFirstName('');
      setSurname('');
      setAge('');
      setGender('Male');
      document.title = "User Information Manager"; // Reset tab title if no errors
    } else {
      Alert.alert('Error', 'Please fill all fields'); // Warning: This might not be flagged, but it's good practice to handle empty fields with alert messages rather than logging to the console.
      document.title = "Error: Please fill all fields"; // Set tab title to error message
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
      `Name: ${item.firstNames} ${item.surnames}\nAge: ${item.ages}\nGender: ${item.genders}`
    // Error: Missing backticks for template literals. VS Code highlighted this as a syntax error.
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
        onChangeText={setSurname} // changed from onChangeText-{setSurname}, VS code hiughlighted it as an error
     

      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      {/* <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View> */}

      <Select // Changed: Using react-select instead of Picker for web compatibility
        value={{ label: gender, value: gender }}
        onChange={(selectedOption) => setGender(selectedOption.value)}
        options={[
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ]}
      />
      <TouchableOpacity style={styles.addButton} onPress={addData}> {/* Error: This should be TouchableOpacity. */}
        <Text style={styles.addButtonText}>Add</Text> {/* Error: Missing closing tag for <Text>. */}
      </TouchableOpacity> {/* Error: This should be TouchableOpacity. */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id} // Changed to lowercase 'id'
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
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
// changed from picker to select
selectContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
},
select: {
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