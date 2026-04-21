import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as SMS from "expo-sms";
import { useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

export default function ScannerScreen() {
    // -- PERMISIJE -- 
    const [permission, requestPermission] = useCameraPermissions();

    // -- STATE ZA KONTROLU SKENIRANJA --
    const [scanned, setScanned] = useState(false);

    // Parking zone
    const zelena = 1234;
    const zuta = 5678;
    const crvena = 9999;

    // -- PROVERA DOZVOLA --
    if (!permission) return <View />
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            Potrebna dozvola za kameru
          </Text>
          <Button onPress={requestPermission} title="Odobri" />
        </View>
      )
    }

    // -- LOGIKA SKENIRANJA --
    const handleBarCodeScanned = async ({ data }: { data: string }) => {
      setScanned(true);

      console.log("Skenirani podaci: ", data);
      
      if(
        data.includes(zelena.toString()) ||
        data.includes(zuta.toString()) ||
        data.includes(crvena.toString())
      ) {
        const savedPlates = await AsyncStorage.getItem("user_plates");
        const destinationNumber = data;

        const isAvailable = await SMS.isAvailableAsync();

        if(isAvailable) {
          await SMS.sendSMSAsync(
            [destinationNumber],
            `${savedPlates || "Nisu unete"}`,
          );
        } else {
            alert("SMS servis nije dostupan na ovom uređaju");
        }
      } else {
        alert("Neadekvatan QR kod. Molimo skenirajte zvaničnu parking tablu");
      }
    }

    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {scanned && (
          <View style={styles.bottomContainer}>
            <Pressable
              style={styles.customButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.buttonText}>Skeniraj ponovo</Text>
            </Pressable>
          </View>
        )}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  customButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})