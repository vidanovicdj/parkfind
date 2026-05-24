import * as Haptics from "expo-haptics";
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export const authUser = async (): Promise<boolean> => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if(!hasHardware || !isEnrolled) {
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autentifikacija",
    });

    if(!result.success) {
      Alert.alert("Greška", "Autentifikacija nije uspela. Pokušajte ponovo.");
      return false;
    }

    return true;
  } catch (error) {
      Alert.alert("Greška", "Došlo je do greške prilikom autentifikacije. Pokušajte ponovo.");
      return false;
  }
};

export const verifyBluetoothPresence = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isBeaconDetected = true; // Simulacija prisustva Bluetooth uređaja
        if(!isBeaconDetected) {
          Alert.alert("Greška", "Nije detektovan Bluetooth uređaj. Pokušajte ponovo.");
          resolve(false);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert("Uspešno", "Bluetooth uređaj detektovan.");
          resolve(true);
        }
    }, 1000);
  });
};