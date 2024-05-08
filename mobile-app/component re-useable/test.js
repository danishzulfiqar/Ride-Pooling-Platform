import react from "react";
import { View, Text, StyleSheet } from "react-native";

export default function test(){
    return(
        <View style={styles.container}>
            <Text> Navigation </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'Center'
    },
})