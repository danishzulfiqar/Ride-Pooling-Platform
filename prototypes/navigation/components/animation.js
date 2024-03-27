import react, { useRef, useState } from "react";
import { View,Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

export default function Animation(){
    const ani = useRef(new Animated.Value(0)).current; // initial value.
    const animarg = useRef(new Animated.Value(0)).current;

    function animate(){
        Animated.timing(ani,{
            toValue:1,
            duration:2000,
            useNativeDriver:true,
        }).start();
        Animated.timing(animarg,{
            toValue:20,
            duration:2000,
            useNativeDriver:true,
        }).start();
    }
    

    return(
        <View style={styles.container}>
            <Animated.View style={{transform: [{translateY: animarg}]}}>
            <Animated.Text style={[styles.text,{opacity: ani}]}>Hello</Animated.Text>
            </Animated.View>
            <TouchableOpacity style={[styles.button]} 
            onPress={()=>{
                    animate();
                }}>
                <Text style={styles.btntext} >
                    Animate
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },

    text:{
        fontSize:30
    },

    btntext:{
        color:'white',
        fontWeight:'bold'
    },

    button:{
        width:'50%',
        height:30,
        borderRadius:10,
        backgroundColor:'#FF9800',
        alignItems:'center',
        justifyContent:'center',
    }
})