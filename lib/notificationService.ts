import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Podesavanje handler-a
Notifications.setNotificationHandler({
handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
}),
});

export const setupAndTriggerNotification = async (spot: any) => {
    // Kreira se kanal za notifikaciju jer novije verzije androida (od verzije 13 pa na dalje) ignorisu zahtev za dozvolu
    if(Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('parking-alerts', {
        name: 'Parking rezervacije',
        importance: Notifications.AndroidImportance.MAX, //MAX osigurava da iskoci na ekranu
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Provera i zahtev za dozvolu
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if(existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if(finalStatus !== 'granted') {
      console.log("Korisnik odbio notifikacije!!!");
      return;
    }

    // Slanje lokalne notifikacije
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚗 Parking je rezervisan!",
        body: `Mesto ${spot.name} Vas čeka`,
      },
      trigger: {
        channelId: "parking-alerts",
        seconds: 1,
      },
    });
  };