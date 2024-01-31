import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';


const GenderSelector = ({ selectedGender, onSelectGender }) => {
  return (
    <View style={styles.genderSelector}>
      {['Male', 'Female', 'Other'].map((gender) => (
        <TouchableOpacity
          key={gender}
          style={[
            styles.genderOption,
            selectedGender === gender && styles.genderOptionSelected,
          ]}
          onPress={() => onSelectGender(gender)}
        >
          <Text
            style={[
              styles.genderText,
              selectedGender === gender && styles.genderTextSelected,
            ]}
          >
            {gender}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


export default function form({ backbutton, currentUser, sethaveaccount }) {

  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [email, setemail] = useState('');
  const [dob, setdob] = useState(new Date());
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const functions = getFunctions(auth.app);

  const UID = currentUser.uid;
  const phoneNumber = currentUser.phoneNumber;
  const genderCode = gender === "Male" ? "M" : gender === "Female" ? "F" : gender === "Other" ? "O" : "";
  const dobString = dob.toDateString();
  const emailString = email.toLowerCase();

  const data = {
    uid: UID,
    fname: fname,
    lname: lname,
    dob: dobString,
    email: emailString,
    gender: genderCode,
    phone: phoneNumber
  }

  async function senddata() {
    setLoading(true);
    console.log("sending data for user", data);
    await callSavePassengerDataFunction(data)
      .catch((error) => {
        console.error("Error in senddata:", error);
      })
  }

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setdob(selectedDate);
    }
    setShowDatePicker(false);
  };

  const callSavePassengerDataFunction = async (data) => {
    const savePassengerData = httpsCallable(functions, 'savePassengerData');
    try {
      const result = await savePassengerData(data);
      console.log(result.data);
      setLoading(false);
      sethaveaccount(result.data.status);
    } catch (error) {
      console.error("Error calling Savepassenger Function:", error);
    }
  };

  const setback = () => {
    backbutton(0);
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        visible={loading}
        textContent={'Please wait'}
        textStyle={{ color: 'white' }}
        overlayColor="rgba(0,0,0,0.5)"
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {
          <View>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.container}>
                <TouchableOpacity style={styles.backbtn} onPress={setback}>
                  <Icon name="arrow-left" size={30} color="grey" />
                </TouchableOpacity>

                <View style={styles.ddcontainer}>
                  <Image
                    style={styles.imgstyle}
                    resizeMode="contain"
                    source={require('../assets/Hlogo.png')}
                  />
                </View>
                <View>
                  <View style={styles.name}>
                    <TextInput style={styles.inputStyles1}
                      placeholder=" FIRST NAME..."
                      onChangeText={(text) => setfname(text)}
                      value={fname}
                    />
                    <TextInput style={styles.inputStyles1}
                      placeholder=" LAST NAME..."
                      onChangeText={(text) => setlname(text)}
                      value={lname}
                    />
                  </View>
                  <TextInput style={styles.inputStyles}
                    inputMode='email'
                    placeholder=" EMAIL..."
                    onChangeText={(text) => setemail(text)}
                    value={email}
                  />
                  <View style={styles.datePickerContainer}>
                    <Text style={styles.label}>Date of Birth:</Text>
                    <TouchableOpacity
                      style={styles.datePicker}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={{ fontFamily: 'Custom', }}>{dob.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                      />
                    )}
                  </View>
                  <Text style={{ marginTop: 20, marginBottom: 10, color: "grey", fontSize: 15 }}>Gender:</Text>
                  <GenderSelector selectedGender={gender} onSelectGender={setGender} />
                  <TouchableOpacity style={styles.buttonstyle} onPress={senddata}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        }
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 40
  },

  ddcontainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 30,
  },

  name: {
    flexDirection: 'row',
    width: '100%'

  },

  inputStyles1: {
    width: '49%',
    height: 35,
    fontSize: 16,
    marginRight: 4,
    padding: 5,
    marginBottom: Platform.OS === 'ios' ? 18 : 24,
    backgroundColor: 'white',
    fontFamily: 'Custom',
    borderRadius: 5,
    borderWidth: 0.3,
    borderColor: "grey"
  },

  inputStyles2: {
    height: 10,
    marginBottom: Platform.OS === 'ios' ? 18 : 24,
    backgroundColor: 'white',
    fontFamily: 'Custom',
    borderRadius: 5,
    borderColor: "black"
  },

  inputStyles: {
    height: 35,
    fontSize: 16,
    marginBottom: Platform.OS === 'ios' ? 18 : 24,
    backgroundColor: 'white',
    padding: 5,
    fontFamily: 'Custom',
    borderRadius: 5,
    borderWidth: 0.3,
    borderColor: "grey"
  },

  imgstyle: {
    width: 450,
    height: 200,
  },
  buttonstyle: {
    justifyContent: 'center',
    marginTop: 40,
    alignSelf: 'center',
    height: 40,
    width: 320,
    borderBlockColor: "white",
    borderWidth: 0,
    borderRadius: 10,
    alignItems: 'center',
    // backgroundColor: '#198754',
    backgroundColor: "#f34a5e"
  },
  datePickerContainer: {
    flexDirection: 'column',
    // alignItems: 'flex-start',
    marginVertical: 0,
  },
  label: {
    fontSize: 16,
    color: "grey",
    marginBottom: 5,
  },
  datePicker: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 0,
  },
  genderOption: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    backgroundColor: '#f9f9f9',
  },
  genderOptionSelected: {
    backgroundColor: '#f34a5e',
    borderColor: '#f34a5e',
  },
  genderText: {
    textAlign: 'center',
    color: '#555',
  },
  genderTextSelected: {
    color: '#fff',
  },
});
