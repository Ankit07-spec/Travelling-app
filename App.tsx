import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ItineraryProvider } from "./context/ItineraryContext";
import HomeScreen from "./screens/HomeScreen";
import ItineraryScreen from "./screens/ItineraryScreen";
import ItineraryDetailScreen from "./screens/ItineraryDetailScreen";

const Stack = createNativeStackNavigator<{
  Home: undefined;
  Itinerary: { id?: string } | undefined;
  ItineraryDetail: { id: string };
}>();

export default function App() {
  return (
    <ItineraryProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Itinerary" component={ItineraryScreen} />
          <Stack.Screen name="ItineraryDetail" component={ItineraryDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ItineraryProvider>
  );
}
