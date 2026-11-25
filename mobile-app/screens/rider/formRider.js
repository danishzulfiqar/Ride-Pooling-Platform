import React, { useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, Platform } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { useSelector } from "react-redux";
import fireStore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';

export default function FormRider({navigation}) {
    const [open, setOpen] = useState(false);
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [email, setemail] = useState('');
    const [selectedDate, setSelectedDate] = useState('2024/09/19');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);


    const callSaveRiderDataFunction = async () => {

        const UID = auth().currentUser.uid;
        const phoneNumber = auth().currentUser.phoneNumber;
        const genderCode = gender === "Male" ? "M" : gender === "Female" ? "F" : gender === "Other" ? "O" : "";
        const dobString = selectedDate;
        const emailString = email.toLowerCase().trim();

        const data = {
            uid: UID,
            fname: fname,
            lname: lname,
            dob: dobString,
            email: emailString,
            gender: genderCode,
            phone: phoneNumber
          }

          console.log(data);

        const saveRiderData = functions().httpsCallable('saveRiderData');
        try {
            const result = await saveRiderData(data);
            console.log(result.data);
            setLoading(false);
            navigation.replace('DrawerNavigationRider');
        } catch (error) {
            console.error("Error calling saveRiderData function:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>| Rider Registration</Text>
            <View style={styles.form}>
                <View style={styles.namePick}>
                    <TextInput style={styles.name} placeholder='First Name' onChangeText={(text) => setfname(text)} />
                    <TextInput style={styles.name} placeholder='Last Name' onChangeText={(text) => setlname(text)} />
                </View>
                <TextInput style={styles.email} placeholder='Email' onChangeText={(text) => setemail(text)} />
                <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
                <Text style={styles.label}>Date of Birth:</Text>
                <Modal 
                visible={open} 
                animationType="slide"
                transparent={true}
                onRequestClose={() => setOpen(false)}>
                <View style={styles.centeredView}>
                <DatePicker
                options={{
                    backgroundColor: 'white',
                    textHeaderColor: '#FF6969',
                    textDefaultColor: 'black',
                    selectedTextColor: 'white',
                    mainColor: '#FF6969',
                    textSecondaryColor: 'black',
                }}
                mode="calendar"
                style={{ borderRadius: 10, elevation: 10, }}
                onSelectedChange={(date) => {setSelectedDate(date); console.log(date)}}/>
                <TouchableOpacity style={styles.datePicker1} onPress={() => setOpen(false)}>
                <Text style={styles.textBtn1}>Confirm</Text>
                </TouchableOpacity>
                </View>
                </Modal>
                <TouchableOpacity style={styles.datePicker} onPress={() => setOpen(true)}>
                    <Text style={styles.textBtn}>{selectedDate}</Text>
                </TouchableOpacity>
                </View>
                

                <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
                <Text style={styles.label}>Select Gender</Text>
                <View style={styles.genderPicker}>
                    <TouchableOpacity style={ gender === 'Male' ? styles.genderSelected : styles.gender } onPress={() => setGender('Male')}>
                    <Text style={ gender === 'Male' ? styles.genderTextselected : styles.genderText }>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={ gender === 'Female' ? styles.genderSelected : styles.gender } onPress={() => setGender('Female')}>
                    <Text style={ gender === 'Female' ? styles.genderTextselected : styles.genderText }>Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={ gender === 'Other' ? styles.genderSelected : styles.gender } onPress={() => setGender('Other')}>
                    <Text style={ gender === 'Other' ? styles.genderTextselected : styles.genderText }>Other</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            <TouchableOpacity style={styles.buttonstyle} onPress={()=>{callSaveRiderDataFunction(); setLoading(true);}}>
            {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.btnText}>Submit</Text>
                      )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 15,
        gap: responsiveHeight(5),
    },

    headerText: {
        fontSize: responsiveFontSize(3),
        fontFamily:'customb',
    },

    form: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    namePick: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

    name: {
        backgroundColor: 'white',
        width: '48%',
        height: responsiveHeight(6),
        padding: 10,
        borderRadius: 5,
        elevation:5,
    },

    email: {
        backgroundColor: 'white',
        width: '100%',
        height: responsiveHeight(6),
        padding: 10,
        borderRadius: 5,
        elevation:5,
    },

    datePicker :{
        backgroundColor: 'white',
        width: '100%',
        height: responsiveHeight(6),
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation:5,
    },

    datePicker1 :{
        backgroundColor: '#FF6969',
        width: '60%',
        height: responsiveHeight(6),
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation:5,
    },

    textBtn: {
        fontSize: responsiveFontSize(2),
        fontFamily:'customb',
    },

    textBtn1: {
        fontSize: responsiveFontSize(2),
        color: 'white',
        fontFamily:'customb',
    },

    centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 211, 211, 0.7)',
  },

  genderPicker :{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },

  gender: {
    backgroundColor: 'white',
    width: '30%',
    height: responsiveHeight(6),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation:5,
    backgroundColor: '#F0F0F0',
  },

  genderSelected: {
    backgroundColor: 'white',
    width: '30%',
    height: responsiveHeight(6),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation:10,
    backgroundColor: '#FF6969',
  },

  genderText: {
    fontSize: responsiveFontSize(2),
    fontFamily:'custom',
  },

  genderTextselected: {
    fontSize: responsiveFontSize(2),
    color: 'white',
    fontFamily:'custom',
  },

  label: {
    fontSize: responsiveFontSize(2.3),
    fontFamily:'custom',
    color: "grey",
  },

  buttonstyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'android' ? responsiveHeight(5) : responsiveHeight(6),
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#FF6969',
    },

    btnText: {
    fontFamily: 'customb',
    fontSize: responsiveFontSize(2),
    color: 'white',
    },
});