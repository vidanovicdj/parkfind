import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ReservationsScreen() {
  const [myRes, setMyRes] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
        fetchUserReservations();
    }, []),
  );

  async function fetchUserReservations() {
    const { data, error } = await supabase
      .from("reservations")
      .select("*, parking_spots(name)");

    if(data) setMyRes(data);
  }

  async function extendReservation(id:string, currentEndAt: string) {
    const newTime = new Date(
        new Date(currentEndAt).getTime() + 60 * 60 * 1000,
    ).toISOString();

    const { error } = await supabase
      .from("reservation")
      .update({ends_at: newTime})
      .eq("id", id);

    if(!error) {
        Alert.alert("Produženo", "Vaša rezervacija je produžena za 60 minuta.");
        fetchUserReservations();
    }
  }

  async function cancelReservation(id: string, spotId: string) {
    const { error: delError } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id);

    const { error: spotError } = await supabase
      .from("parking_spots")
      .update({ is_occupied: false })
      .eq("id", spotId);

    if (!delError && !spotError) {
      Alert.alert("Otkazano", "Uspešno ste otkazali parking.");
      fetchUserReservations();
    }
  }

  return (
    <View style = {styles.container}>
      <Text style = {styles.header}>Moje Rezervacije</Text>

      {myRes.length === 0 ? (
        <Text style = {{ color: "#aaa", textAlign:"center", marginTop: 50 }}>
          Nemate aktivnih rezervacija.
        </Text>
      ) : (
        <FlatList
          data={myRes}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style = {styles.card}>
              <View>
                <Text style = {styles.spotName}>
                  Mesto: {item.parking_spots?.name}
                </Text>
                <Text style = {styles.timeText}>
                    Važi do: {new Date(item.ends_at).toLocaleDateString()}
                </Text>
              </View>

              <View style = {styles.actions}>
                <TouchableOpacity
                  style = {[styles.btn, styles.extendBtn]}
                  onPress={() => extendReservation(item.id, item.ends_at)}
                >
                  <Text style = {styles.btnText}>+1h</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style = {[styles.btn, styles.cancelBtn]}
                  onPress={() => cancelReservation(item.id, item.ends_at)}
                >
                  <Text style = {styles.btnText}>Otkaži</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E21",
    padding: 20,
    paddingTop: 50,
  },
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1D2136",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "column",
  },
  spotName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  timeText: {
    color: "#27AE60",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  extendBtn: {
    backgroundColor: "#27AE60",
  },
  cancelBtn: {
    backgroundColor: "#E74C3C",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});