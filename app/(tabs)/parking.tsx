import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ParkingGrid() {
  const [spots, setSpots] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
        fetchSpots();
    }, []),
  );

  async function fetchSpots() {
    const { data } = await supabase
      .from("parking_spots")
      .select("*")
      .order("name");
    setSpots(data || []);
  }

  async function reserveSpot(spot: any) {
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const { error: resError } = await supabase
      .from("reservations")
      .insert([{ spot_id: spot.id, ends_at: expiryTime }]);

    await supabase
      .from("parking_spots")
      .update({ is_occupied: true })
      .eq("id", spot.id);

    if(!resError) {
        Alert.alert("Uspeh", `Mesto ${spot.name} je rezervisano!`);
        fetchSpots();
    }
  }

  return (
    <View style = {styles.container}>
      <Text style = {styles.headerTitle}>Garaža Obilićev Venac</Text>

      <View style = {styles.parkingArea}>
        <View style = {styles.middleLine} />

        <FlatList
          data={spots}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.spot,
                item.is_occupied ? styles.occupiedBorder : styles.freeBorder,
              ]}
              onPress={() => !item.is_occupied && reserveSpot(item)}
            >
              {item.is_occupied ? (
                <Text style={{ fontSize: 32 }}>🚗</Text>
              ) : null}
              <Text style={styles.spotName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050A1E",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  parkingArea: {
    flex: 1,
    position: "relative",
  },
  middleLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 2,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#333", // Suptilnija boja za put
    zIndex: 1,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  spot: {
    width: "42%",
    height: 110,
    backgroundColor: "#0A0E21",
    marginVertical: 12,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  freeBorder: { borderColor: "#27AE60" },
  occupiedBorder: { borderColor: "#1D2136", opacity: 0.8 },
  spotName: {
    color: "#8E8E93",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "600",
  },
});