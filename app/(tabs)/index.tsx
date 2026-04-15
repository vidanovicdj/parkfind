import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

  const [plates, setPlates] = useState<string | null>(null);

  useFocusEffect(
    useCallback(()=>{
      const loadPlates = async () => {
        try{
          const savedPlates = await AsyncStorage.getItem("user_plates");
          setPlates(savedPlates);
        } catch (e) {
          console.error("Greška pri učitavanju tablica: ", e);
        }
      };
      loadPlates();
    }, [])
  );

  return (
    <View style = {styles.container}>
      <Text style = {styles.title}>Dobrodošli u Parking App</Text>
      <View style = {styles.card}>
        <Text style = {styles.label}>Vaše tablice</Text>
        <Text style = {styles.plateDisplay}>
          {plates ? plates : "Nema tablica"}
        </Text>
      </View>
      <Text style = {styles.instructions}>
        Tablice možete promeniti klikom na dugme u gornjem desnom uglu navigacije.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333"
  },
  card: {
    width: "100%",
    padding: 25,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textTransform: "uppercase"
  },
  plateDisplay: {
    fontSize: 32,
    fontWeight: "900",
    color: "#007AFF",
    letterSpacing: 2
  },
  instructions: {
    marginTop: 40,
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    lineHeight: 20
  }
});
