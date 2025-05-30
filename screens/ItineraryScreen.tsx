import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { useItineraries } from "../context/ItineraryContext";
import { v4 as uuidv4 } from "uuid";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Define the navigation params for this screen
type RootStackParamList = {
  Home: undefined;
  Itinerary: { id?: string } | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Itinerary">;

export default function ItineraryScreen({ route, navigation }: Props) {
  const { itineraries, addItinerary, updateItinerary } = useItineraries();
  const editing = !!route.params?.id;
  const existing = itineraries.find((i) => i.id === route.params?.id);

  const [title, setTitle] = useState(existing?.title || "");
  const [startDate, setStartDate] = useState(existing?.startDate || "");
  const [endDate, setEndDate] = useState(existing?.endDate || "");

  useEffect(() => {
    if (editing && existing) {
      setTitle(existing.title);
      setStartDate(existing.startDate);
      setEndDate(existing.endDate);
    }
  }, [editing, existing]);

  const handleSave = () => {
    if (!title.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert("Validation", "Please fill all fields.");
      return;
    }
    if (editing && existing) {
      updateItinerary({
        ...existing,
        title,
        startDate,
        endDate,
      });
    } else {
      addItinerary({
        id: uuidv4(),
        title,
        startDate,
        endDate,
        destinations: [],
        activities: [],
        notes: "",
      });
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 8, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Start Date"
        value={startDate}
        onChangeText={setStartDate}
        style={{ marginBottom: 8, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="End Date"
        value={endDate}
        onChangeText={setEndDate}
        style={{ marginBottom: 8, borderWidth: 1, padding: 8 }}
      />
      <Button title={editing ? "Update" : "Save"} onPress={handleSave} />
    </View>
  );
}
