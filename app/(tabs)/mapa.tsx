import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== "granted") {
        setErrorMsg("Dozvola za lokaciju je odbijena!");
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  if(!location && !errorMsg) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  return (
    <View style = {styles.container}>
      <MapView
        style = {styles.map}
        initialRegion={{
          latitude: 44.8162,
          longitude: 20.4572,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
      >
        <Marker coordinate={{ latitude: 44.8162, longitude: 20.4572 }}>
          <Callout onPress={() => router.push("/parking")}>
            <View style = {{ padding: 10 }}>
              <Text style = {{ fontWeight: "bold" }}>Garaža Obilićev Venac</Text>
              <Text>Klikni za rezervaciju</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0E21"
  }
})