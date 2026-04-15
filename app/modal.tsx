import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

export default function ModalScreen() {

  const [plates, setPlates] = useState("");
  const router = useRouter();

  const savePlates = async () => {
    try{
      await AsyncStorage.setItem("user_plates", plates);
      alert("Tablice sačuvane!");
      router.back();
    } catch (e) {
      console.error("Greška pri čuvanju tablica: ", e);
    }
  };

  return (
    <View style = {styles.container}>
      <TextInput 
        placeholder="Unesite registarske tablice"
        value={plates}
        onChangeText={setPlates}
        style={styles.input}
      />
      <Button title="Sačuvaj" onPress={savePlates} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, fontSize: 18 }
});
