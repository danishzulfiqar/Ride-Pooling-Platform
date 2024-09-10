import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard,ScrollView } from "react-native";
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import firestore from  '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';

export default function ChatBox({sheetRef}){

    const scrollViewRef = useRef();  
    const [chatBoxData, setChatBoxData ] = useState();
    const [messages, setMessages] = useState(null);
    const [riderUID, setRiderUID] = useState(null);
    const [userUID, setUserUID] = useState(null);
    const [riderName, setRiderName] = useState(null);
    const [userName, setUserName] = useState(null);
    const snapPoints = useMemo(() => ['22%'  ,'100%']);
    const [sortedMessages, setSortedMessages] = useState([]);
    const UID = useSelector(state => state.appEssentials.uid);
    const role = useSelector(state => state.appEssentials.role);
    const ridePhaseKey = useSelector(state => state.appEssentials.ridePhaseKey);
    const dispatch = useDispatch();

    function MessageList(messages) {
      // Sort messages by timestamp
      console.log('This is the list of messages: ', JSON.stringify(messages));
    
      const sortedMessages = messages.sort((a, b) => {
        // Check if timestamp exists and has the seconds/nanoseconds properties
        const timeA = a.timestamp && a.timestamp.seconds !== undefined && a.timestamp.nanoseconds !== undefined
          ? a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1000000
          : 0; // Default value if timestamp is missing or malformed
        const timeB = b.timestamp && b.timestamp.seconds !== undefined && b.timestamp.nanoseconds !== undefined
          ? b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1000000
          : 0; // Default value if timestamp is missing or malformed
    
        return timeA - timeB;
      });
    
      setChatBoxData(sortedMessages);
    }

    useEffect(() => {
      if (chatBoxData && chatBoxData.length > 0) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, [chatBoxData]);

    useEffect(() => {
      const rideDocRef = firestore().collection("Rides").doc("Bids").collection("GO").doc(ridePhaseKey);
  
      // Listen for changes to the ride document
      const unsubscribe1 = rideDocRef.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const updatedRequest = snapshot.data();
          console.log("this is bidkey information " + JSON.stringify(updatedRequest.riderData.rider_id));
          setRiderUID(updatedRequest.riderData.rider_id);
          setUserUID(updatedRequest.userData.user_id);
          setRiderName(updatedRequest.riderData.riderInfo.name);
          setUserName(updatedRequest.userData.userInfo.name);
        } else {
          console.log("No such document!");
        }
      });
  
      // Listen for changes to the chat collection
      const chatCollectionRef = rideDocRef.collection("chat");
  
      const unsubscribe2 = chatCollectionRef.onSnapshot((snapshot) => {
        const updatedChatData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        MessageList(updatedChatData);
        // setChatBoxData(updatedChatData);
        console.log(JSON.stringify(updatedChatData));
      });
  
      // Cleanup subscriptions when component unmounts
      return () => {
        unsubscribe1();
        unsubscribe2();
      };
    }, []);


      ///////////// send message function ////////////////

      const sendMessage = async () => {
        const data = {
          uid: UID,
          ridebidKey: ridePhaseKey,
          role: role,
          msg: messages,
          mode: "GO",
          timestamp: firestore.FieldValue.serverTimestamp(), // Add a timestamp
        };
      
        console.log("this is data " + JSON.stringify(data));
      
        try {
          const chatCollectionRef = firestore()
            .collection("Rides")
            .doc("Bids")
            .collection("GO")
            .doc(ridePhaseKey)
            .collection("chat");
      
          await chatCollectionRef.add(data);
      
          console.log("Message sent successfully");
          setMessages(null);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      
        console.log("sending message " + messages);
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
                { UID === riderUID ? (
                  <Text style={styles.headerText}>{riderName}</Text>
                ) : UID === userUID ? (
                  <Text style={styles.headerText}>{userName}</Text>
                ) : null}
              </View>
            </View>
              <ScrollView ref={scrollViewRef} style={{marginBottom: 100}}>
                {chatBoxData && chatBoxData.length > 0 ? (
                  chatBoxData.map((message, index) => (
                      <View
                        key={index}
                        style={
                          message.role === role
                            ? styles.myMessageContainer
                            : styles.otherMessageContainer
                        }
                      >
                        <Text
                          style={
                            message.role === role
                              ? styles.myMessage
                              : styles.otherMessage
                          }
                        >
                          {message.msg}
                        </Text>
                        <Text style={styles.timestamp}>
                        {message.timestamp ? new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
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
              </ScrollView>
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
        justifyContent: "space-around",
        alignSelf: "center",
        alignItems: "center",
        width: "100%",
        paddingBottom: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
      },

    headerText:{
        fontFamily:'custom',
        fontSize: responsiveFontSize(2.5),
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
        height:responsiveHeight(7),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
    },

    input:{
        backgroundColor:'#ECECEC',
        flex:1,
        height:responsiveHeight(7),
        color:'black',
        fontSize:responsiveFontSize(2),
        fontFamily:'custom',
        paddingLeft:15,
        paddingRight:15,
        borderWidth:0.5,
        borderColor:'grey',
        borderRadius:5,
        marginRight:5,
        marginLeft:5,
    },

    SendButton:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "#FF6969",
        width:'20%',
        height:'100%',
        borderRadius:5,
    },

    myMessageContainer:{
        zIndex:-1,
        alignSelf:'flex-end',
        alignItems:'flex-end',
        backgroundColor:'#ECECEC',
        padding:10,
        margin:10,
        borderRadius:5,
        width:'70%',
        elevation: 5,
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
        borderRadius:5,
        width:'70%',
        elevation: 5,
        // Shadow properties for iOS
        shadowColor: "#000",
        shadowOffset: {
          width: 0
        }
    },

    myMessage:{
        color:'black',
        fontSize:responsiveFontSize(2),
        fontFamily:'custom',
    },

    otherMessage:{
        color:'black',
        fontSize:responsiveFontSize(2),
        fontFamily:'custom',
    },

    timestamp:{
        marginTop:4,
        color:'grey',
        fontSize:responsiveFontSize(1.8) ,
        fontFamily:'custom',
    },
})