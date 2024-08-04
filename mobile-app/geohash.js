import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import ngeohash from "ngeohash";

export default function Geohash() {
    const [geoHash, setGeoHash] = useState(null);

    useEffect(()=>{
        const geohash = ngeohash.encode(37.8267, 76.4233);
        setGeoHash(geohash);
    })

    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text>This is geoHash: {geoHash}</Text>
        </View>
    );
}