import React from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from "react-native";
import { useItineraries } from "../context/ItineraryContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Itinerary: { id?: string } | undefined;
  ItineraryDetail: { id: string };
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

// Use a fallback remote image if the local background image does not exist
const backgroundImg = { uri: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" };

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { itineraries, removeItinerary } = useItineraries();

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Itinerary", "Are you sure you want to delete this itinerary?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeItinerary(id) }
    ]);
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.bg} blurRadius={2}>
      <View style={styles.overlay}>
        <Button title="Add Itinerary" onPress={() => navigation.navigate("Itinerary")} />
        <FlatList
          data={itineraries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.dates}>{item.startDate} - {item.endDate}</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("ItineraryDetail", { id: item.id })}
                  >
                    <Text style={styles.buttonText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Itinerary", { id: item.id })}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => confirmDelete(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ marginTop: 20, color: "#fff" }}>No itineraries yet.</Text>}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center"
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee"
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#222" },
  dates: { color: "#888", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  button: { marginLeft: 8, padding: 8, backgroundColor: "#007bff", borderRadius: 4 },
  deleteButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontWeight: "bold" }
});
