import { verifyBluetoothPresence } from "@/lib/auth";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { default as Mapbox, default as MapboxGL } from '@rnmapbox/maps';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  // Custom pop-up
  const [selectedMarker, setSelectedMarker] = useState(false);

  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== "granted") {
        setErrorMsg("Dozvola za lokaciju je odbijena!");
        return;
      }

      // Ovo je za fizicki teleofon
      let userLocation = await Location.getCurrentPositionAsync({});
      
      // Ovo je za emulator
      // let userLocation = await Location.getLastKnownPositionAsync({});
      // if (!userLocation) {
      //   return (
      //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //       <ActivityIndicator size="large" color="#0000ff" />
      //       <Text>Učitavanje lokacije i parking mesta...</Text>
      //     </View>
      //   );
      // }
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

  const handleReservation = async () => {
    const isNearby = await verifyBluetoothPresence();
    
    if(isNearby) {
      router.push('/parking');
    } else {
      alert("Niste u blizini parkinga! Uključite Bluetooth i pokušajte ponovo.");
    }
  };

  return (
    <View style = {styles.container}>
      {/* <MapView
        provider={PROVIDER_DEFAULT}
        style = {styles.map}
        initialRegion={{
          latitude: 44.8162,
          longitude: 20.4572,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
      >
        <Marker 
          coordinate={{ latitude: 44.8162, longitude: 20.4572 }}
          onPress={() => setSelectedMarker(true)}
        />
      </MapView> */}

      <MapboxGL.MapView
        style = {styles.map}
        styleURL="https://tiles.openfreemap.org/styles/liberty"
      >
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[20.4572, 44.8162]}
        />
        <MapboxGL.PointAnnotation
          id="marker1"
          coordinate={[20.4572, 44.8162]}
          onSelected={() => setSelectedMarker(true)}
        >
          <View style = {styles.marker} />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

      {selectedMarker && (
        <View style = {styles.popup}>
          <Text style = {{ fontWeight: "bold" }}>Garaža Obilićev Venac</Text>
          <Text>Klikni za rezervaciju</Text>

          <View style = {{ flexDirection: "row", marginTop: 12, gap: 8 }}>
            <TouchableOpacity onPress={handleReservation} style = {styles.popupBtn}>
              <Text style = {{color: "white", fontWeight:"bold"}}>Rezerviši</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setSelectedMarker(false)} style = {styles.popupBtn}>
              <Text style = {{color: "white"}}>Zatvori</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  map: {
    width: "100%",
    height: "100%",
    overflow: "visible",
  },
  marker: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0E21"
  },
  popup: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {width:0, height:2},
  },
  popupBtn: {
    flex: 1,
    backgroundColor: "#386FA4",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
})