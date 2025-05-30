import React, { useState } from "react";
import { View, Text, Button, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useItineraries } from "../context/ItineraryContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { v4 as uuidv4 } from "uuid";
import * as ImagePicker from "expo-image-picker";
import { Destination } from "../models/Itinerary";

type RootStackParamList = {
  Home: undefined;
  Itinerary: { id?: string } | undefined;
  ItineraryDetail: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "ItineraryDetail">;

export default function ItineraryDetailScreen({ route, navigation }: Props) {
  const { itineraries, addActivity, removeActivity, addDestination, removeDestination } = useItineraries();
  const itinerary = itineraries.find(i => i.id === route.params.id);

  const [activityName, setActivityName] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityNotes, setActivityNotes] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationPhoto, setDestinationPhoto] = useState<string | undefined>(undefined);

  if (!itinerary) {
    return (
      <View style={styles.container}>
        <Text>Itinerary not found.</Text>
      </View>
    );
  }

  const handleAddActivity = () => {
    if (!activityName.trim() || !activityDate.trim()) {
      Alert.alert("Validation", "Please enter activity name and date.");
      return;
    }
    addActivity(itinerary.id, {
      id: uuidv4(),
      name: activityName,
      date: activityDate,
      notes: activityNotes,
    });
    setActivityName("");
    setActivityDate("");
    setActivityNotes("");
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setDestinationPhoto(result.assets[0].uri);
    }
  };

  const handleAddDestination = () => {
    if (!destination.trim()) {
      Alert.alert("Validation", "Please enter a destination.");
      return;
    }
    addDestination(itinerary.id, { name: destination, photoUri: destinationPhoto });
    setDestination("");
    setDestinationPhoto(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{itinerary.title}</Text>
      <Text style={styles.dates}>{itinerary.startDate} - {itinerary.endDate}</Text>
      <Text style={styles.section}>Destinations</Text>
      <FlatList
        data={itinerary.destinations}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.photoUri && (
                <Image source={{ uri: item.photoUri }} style={{ width: 40, height: 40, borderRadius: 6, marginRight: 8 }} />
              )}
              <Text>{item.name}</Text>
            </View>
            <TouchableOpacity onPress={() => removeDestination(itinerary.id, item.name)}>
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No destinations yet.</Text>}
      />
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add destination"
          value={destination}
          onChangeText={setDestination}
          style={styles.input}
        />
        <TouchableOpacity onPress={handlePickPhoto} style={{ marginRight: 8 }}>
          <Text style={{ color: "#007bff" }}>{destinationPhoto ? "Change Photo" : "Add Photo"}</Text>
        </TouchableOpacity>
        <Button title="Add" onPress={handleAddDestination} />
      </View>
      <Text style={styles.section}>Activities</Text>
      <FlatList
        data={itinerary.activities}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text>{item.date}</Text>
              {item.notes ? <Text style={{ fontStyle: "italic" }}>{item.notes}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => removeActivity(itinerary.id, item.id)}>
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No activities yet.</Text>}
      />
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Activity name"
          value={activityName}
          onChangeText={setActivityName}
          style={styles.input}
        />
        <TextInput
          placeholder="Date"
          value={activityDate}
          onChangeText={setActivityDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Notes"
          value={activityNotes}
          onChangeText={setActivityNotes}
          style={styles.input}
        />
        <Button title="Add" onPress={handleAddActivity} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  dates: { color: "#888", marginBottom: 12 },
  section: { fontSize: 16, fontWeight: "bold", marginTop: 16, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 },
  inputRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8, marginRight: 8 },
  deleteText: { color: "#dc3545", marginLeft: 8 }
});
