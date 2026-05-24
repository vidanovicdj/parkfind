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