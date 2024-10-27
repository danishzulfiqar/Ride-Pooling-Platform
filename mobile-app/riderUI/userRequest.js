import React, { useEffect, useState, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, BackHandler } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { ProgressBar } from 'react-native-paper';
import { useSelector, useDispatch } from "react-redux";
import BottomSheet from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import firestore from "@react-native-firebase/firestore";
import functions  from "@react-native-firebase/functions";
import { SetRidePhaseKey, SetCurrentScreenRider } from "../redux/action";



export default function UserRequest({ setCheckUserReq, mode }) {
    const [requests, setRequests] = useState([]);
    const [searching, SetSearching] = useState(false);
    const snapPoints = useMemo(() => [responsiveHeight(20), responsiveHeight(80)], []);

    const dispatch = useDispatch();
    const UID = useSelector(state => state.appEssentials.uid);
    const role = useSelector(state => state.appEssentials.role);

    useEffect(() => {
      const RiderRef = firestore().collection('riders').doc(UID).collection('requests');
    
      const unsubscribe = RiderRef.onSnapshot((snapshot) => {
        setRequests(prevRequests => {
          const updatedRequests = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            progressTime: 1
          }));
    
          // Filter out duplicates based on user_id
          const uniqueRequests = updatedRequests.filter(newReq => 
            !prevRequests.some(existingReq => existingReq.basicInfo.user_id === newReq.basicInfo.user_id)
          );
    
          return [...prevRequests, ...uniqueRequests];
        });
      });
    
      return () => unsubscribe();
    }, []);
    

      useEffect(() => {
        const timer = setInterval(() => {
          setRequests(prevRequests => 
            prevRequests.map(request => {
              const updatedRequest = {
                ...request,
                progressTime: Math.max(0, request.progressTime - 0.05)
              };

              // If the timer has ended, delete the request from Firestore
              if (updatedRequest.progressTime <= 0) {
                deleteRequestDocument(request.basicInfo.user_id);
              }

              return updatedRequest;
            }).filter(request => request.progressTime > 0)
          );
        }, 1000);
      
        return () => {clearInterval(timer);};
      }, []);

      async function deleteRequestDocument(user_id) {
        try {
          await firestore()
            .collection('riders')
            .doc(UID)
            .collection('requests')
            .doc(user_id)
            .delete();
          console.log('Request document deleted successfully');
    
          // Remove the request from local state
          setRequests(prevRequests => prevRequests.filter(request => request.basicInfo.user_id !== user_id));
        } catch (error) {
          console.error('Error deleting request document:', error);
        }
      }      

      const setAvailability = async (available) => {
        const availabilityRef = firestore().collection("riders").doc(UID);
        
        const updateData = {
          availability: available,
        };
      
        try {
          await availabilityRef.update(updateData);
          console.log("Availability updated successfully!");
        } catch (error) {
          console.error("Error updating availability: ", error);
        }
      };

      const acceptingRide = async (userId, pickup, dropoff, loc1, loc2, price) => {
        const data = {
          uid: UID,
          mode: mode,
          userId: userId,
          riderId: UID,
          pickup: pickup,
          dropoff: dropoff,
          pickup_lat: loc1.latitude,
          pickup_lng: loc1.longitude,
          dropoff_lat: loc2.latitude,
          dropoff_lng: loc2.longitude,
          price: price,
        };
        console.log("this is data", data);
      
        const makeNewGoRideBid = functions().httpsCallable('makeNewGoRideBid');
        try {
          const result = await makeNewGoRideBid(data);
          dispatch(SetRidePhaseKey(result.data.bidKey));
          if(result.data.status === true) {
            setCheckUserReq(false);
            deleteRequestDocument(userId);
            dispatch(SetCurrentScreenRider('rideNavigatioState'));
          }
        } catch (error) {
          console.error("Error calling makeNewGoRideBid:", error);
        }
      };

      useEffect(()=>{
        const onBackPress = ()=>{
          setAvailability(false);
          setCheckUserReq(false);

          return true;
        }

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return ()=>{
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }
      },[]);

    return(
        <SafeAreaView style={styles.container}>
            <BottomSheet index={1} snapPoints={snapPoints}>
            <View style={styles.sheetContainer}>
            <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Searchng for user request....</Text>
            <TouchableOpacity style={styles.headerBtn} onPress={()=>{
                setAvailability(false);
                setCheckUserReq(false);}}>
                <Text style={styles.headerBtnText}>Stop</Text>
            </TouchableOpacity>
            </View>
            </View>
            <ScrollView>
            { requests.length === 0 ? (
              <View style={{flexDirection:'row',gap:5, alignItems:'center', justifyContent:'center',marginTop:responsiveHeight(10)}}>
              <Text style={{fontFamily:'custom', fontSize: responsiveFontSize(2), color:'lightgrey'}}>
                   Searching
                </Text>
                <ActivityIndicator size="small" color="lightgrey" />
              </View>
            ) : (
        requests.map((data) => (
                                <View style={styles.cardContainer} key={data.id}>
                                <ProgressBar color='black' style={{ height: 5 }} progress={data.progressTime} />
                                    <View style={styles.card}>
                                        <View style={styles.leftCardSide}>
                                            <Text style={styles.cardHeadText}>{data.basicInfo.first_name} {data.basicInfo.last_name}</Text>
                                            <Text style={styles.cardText}>{data.basicInfo.phone_number}</Text>
                                            <Text style={styles.cardText2}><Text style={{ fontFamily: "customb", fontSize: responsiveFontSize(2) }}>Pickup: </Text>{data.route.pickup}</Text>
                                        </View>
                                        <View style={styles.rightCardSide}>
                                            <Text style={styles.cardHeadText}>{data.price} PKR</Text>
                                            <Text style={styles.cardText}>{data.rating.value}</Text>
                                            <Text style={styles.cardText2}><Text style={{ fontFamily: "customb", fontSize: responsiveFontSize(2) }}>Dropoff: </Text>{data.route.dropoff}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.btnContainer}>
                                        <TouchableOpacity style={styles.btn3}
                                            onPress={() => {
                                                acceptingRide(data.basicInfo.user_id, data.route.pickup, data.route.dropoff, data.route.pickup_location, data.route.dropoff_location, data.price);
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily: "customb",
                                                    color: "white",
                                                    fontSize: responsiveFontSize(2),
                                                }}
                                            >
                                                Accept
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.btn31}>
                                            <Text
                                                style={{
                                                    fontFamily: "customb",
                                                    color: "white",
                                                    fontSize: responsiveFontSize(2),
                                                }}
                                                onPress={() => deleteRequestDocument(data.basicInfo.user_id)}
                                            >
                                                Reject
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
            ) }
            </ScrollView>
            </BottomSheet>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sheetContainer: {
    width: responsiveWidth(100),
    padding: responsiveWidth(3),
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  headerText: {
    width: responsiveWidth(80),
    fontFamily:'customb',
    fontSize: responsiveFontSize(3),
  },

  headerBtn: {
    backgroundColor: 'black',
    padding: responsiveWidth(2),
    justifyContent: 'center',
    borderRadius: 5,
  },

  headerBtnText: {
    color: 'white',
    fontFamily:'customb',
    fontSize: responsiveFontSize(2),
  },

  cardContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "black",
    marginBottom: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    flexDirection: "row",
  },
  btnContainer:{
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    paddingBottom:10,
    justifyContent:"space-between",
  },

  rightCardSide: {
    width: "50%",
    alignItems: "flex-end",
    padding: 10,
  },
  leftCardSide: {
    width: "50%",
    alignItems: "flex-start",
    padding: 10,
  },
  cardHeadText: {
    fontFamily: "customb",
    fontSize: responsiveFontSize(2.2),
  },
  cardText: {
    fontFamily: "custom",
    fontSize: responsiveFontSize(2),
  },
  cardText2: {
    fontFamily: "custom",
    fontSize: responsiveFontSize(1.5),
  },
  btn3: {
    backgroundColor: "#FF6969",
    height: 35,
    width: 100,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  btn31: {
    backgroundColor: "black",
    height: 35,
    width: 100,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});