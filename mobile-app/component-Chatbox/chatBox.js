import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { auth, app } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getFirestore, collection, getDocs, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { set } from 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function ChatBox({setChatBox, ridePhaseKey, role}){
    const [chatBoxData, setChatBoxData ] = useState();
    const [messages, setMessages] = useState(null);
    const [riderUID, setRiderUID] = useState(null);
    const [userUID, setUserUID] = useState(null);
    const [riderName, setRiderName] = useState(null);
    const [userName, setUserName] = useState(null);
    const functions = getFunctions(auth.app);
    const scrollViewRef = useRef();

    useEffect(() => {
        const db = getFirestore(app);
    
        const rideDocRef = doc(db, "Rides/Bids/GO", ridePhaseKey);

        const unsubscribe1 = onSnapshot(rideDocRef, (snapshot) => {
            if (snapshot.exists()) {
              const updatedRequest = snapshot.data(); // Retrieve the data of the specific document
              console.log("this is bidkey information " + JSON.stringify(updatedRequest.riderData.rider_id)); 
              setRiderUID(updatedRequest.riderData.rider_id);
              setUserUID(updatedRequest.userData.user_id);
              setRiderName(updatedRequest.riderData.riderInfo.name);
              setUserName(updatedRequest.userData.userInfo.name);
              
            } else {
              console.log("No such document!");
            }
          });
            

        const chatCollectionRef = collection(rideDocRef, "chat");
    
        const unsubscribe = onSnapshot(chatCollectionRef, (snapshot) => {
          const updatedChatData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setChatBoxData(updatedChatData);
          console.log(JSON.stringify(updatedChatData));
        });
    
        // Cleanup subscription when component unmounts
        return () => {
          unsubscribe1();
          unsubscribe();
        };
      }, []);

      useEffect(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, [chatBoxData]);

      ///////////// send message function ////////////////

      const sendMessage = async () => {
        const data = {
          uid: auth.currentUser.uid,
          ridebidKey: ridePhaseKey,
          role: role,
          msg: messages,
          mode: "GO",
        };

        console.log("this is data" + JSON.stringify(data));

        const sendMsgInChat = httpsCallable(functions, "sendMsgInChat");
        try {
          const result = await sendMsgInChat(data);
          console.log(result.data);
        } catch (error) {
          console.error("Error calling sendMsgInChat:", error);
        }

        console.log("sending message " + messages);
        setMessages(null);
      };

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <View style={styles.headerImageContainer}>
                <Image
                  style={styles.driverImg}
                  resizeMode="contain"
                  source={require("../assets/user.png")}
                />
                {auth.currentUser.uid === riderUID ? (
                  <Text style={styles.headerText}>{riderName}</Text>
                ) : auth.currentUser.uid === userUID ? (
                  <Text style={styles.headerText}>{userName}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setChatBox(false);
                }}
              >
                <FontAwesomeIcon icon={faXmark} size={30} color="black" />
              </TouchableOpacity>
            </View>

            <BottomSheetScrollView style={styles.scrollView} ref={scrollViewRef}>
              {chatBoxData && chatBoxData.length > 0 ? (
                chatBoxData
                  .slice() 
                  .sort((a, b) => new Date(a.time) - new Date(b.time)) // Sort the array based on the time property
                  .map((message, index) => (
                    <View
                      key={index}
                      style={
                        message.ROLE === role
                          ? styles.myMessageContainer
                          : styles.otherMessageContainer
                      }
                    >
                      <Text
                        style={
                          message.sender === role
                            ? styles.myMessage
                            : styles.otherMessage
                        }
                      >
                        {message.message}
                      </Text>
                      <Text style={styles.timestamp}>
                        {new Date(message.time).toLocaleString()}
                      </Text>
                    </View>
                  ))
              ) : (
                <Text style={{
                    color: "grey",
                    fontFamily: "Custom",
                    fontSize: 16,
                    margin: 50,
                    textAlign: "center",
                }}>
                No messages yet</Text>
              )}
            </BottomSheetScrollView>

            <View style={styles.footer}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter message"
                  value={messages}
                  onChangeText={setMessages}
                />
                <TouchableOpacity
                  style={styles.SendButton}
                  onPress={sendMessage}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "black",
                      fontFamily: "CustomB",
                    }}
                  >
                    Send
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },

    scrollView:{
        flex:1,
        backgroundColor:"#F5FCFF",
        zIndex:1,
        marginBottom:70,
    },

    hr: {
        backgroundColor: "grey",
        height: 1,
        width: "100%",
        alignSelf: "center",
      },

    header: {
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        alignItems: "center",
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        // Elevation for Android
        elevation: 20,
        // Shadow properties for iOS
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
        },
      },
      

    headerText:{
        fontFamily:'Custom',
        fontSize:20,
        color:'black',
    },

    headerImageContainer:{
        flexDirection:'row',
        gap:10,
        alignItems:'center',
    },

    driverImg: {
        width: 50,
        height: 50,
      },

    footer:{
        backgroundColor:'white',
        position:'absolute',
        bottom:0,
        paddingBottom:10,
        paddingTop:10,
        width:'100%',
        elevation: 30,
        // Shadow properties for iOS
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
    },

    textInputContainer:{
        width:'100%',
        height:50,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10,
        alignItems:'center',
        justifyContent:'space-between',
    },

    input:{
        backgroundColor:'#ECECEC',
        flex:1,
        height:50,
        color:'black',
        fontSize:14,
        paddingLeft:15,
        paddingRight:15,
        borderWidth:0.5,
        borderColor:'grey',
        borderRadius:40,
        marginRight:5,
    },

    SendButton:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "#FF6969",
        paddingLeft:20,
        paddingRight:20,
        width:'20%',
        height:'100%',
        borderRadius:40,
    },

    myMessageContainer:{
        zIndex:-1,
        alignSelf:'flex-end',
        alignItems:'flex-end',
        backgroundColor:'#ECECEC',
        padding:10,
        margin:10,
        borderRadius:10,
        width:'70%',
        elevation: 10,
        // Shadow properties for iOS
        shadowColor: "#000",
        shadowOffset: {
          width: 0
        }
    },

    otherMessageContainer:{
        zIndex:-1,
        alignSelf:'flex-start',
        backgroundColor:'#ECECEC',
        padding:10,
        margin:10,
        borderRadius:10,
        width:'70%',
        elevation: 10,
        // Shadow properties for iOS
        shadowColor: "#000",
        shadowOffset: {
          width: 0
        }
    },

    myMessage:{
        color:'black',
        fontSize:14,
        fontFamily:'Custom',
    },

    otherMessage:{
        color:'black',
        fontSize:14,
        fontFamily:'Custom',
    },

    timestamp:{
        marginTop:4,
        color:'grey',
        fontSize:10,
        fontFamily:'Custom',
    },
})