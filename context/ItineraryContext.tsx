import React, { createContext, useContext, useState, useEffect } from "react";
import { Itinerary, Activity, Destination } from "../models/Itinerary";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ItineraryContextType {
  itineraries: Itinerary[];
  addItinerary: (itinerary: Itinerary) => void;
  removeItinerary: (id: string) => void;
  updateItinerary: (itinerary: Itinerary) => void;
  addActivity: (itineraryId: string, activity: Activity) => void;
  updateActivity: (itineraryId: string, activity: Activity) => void;
  removeActivity: (itineraryId: string, activityId: string) => void;
  addDestination: (itineraryId: string, destination: Destination) => void;
  removeDestination: (itineraryId: string, destinationName: string) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const ItineraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  // Load itineraries from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem("itineraries").then(data => {
      if (data) setItineraries(JSON.parse(data));
    });
  }, []);

  // Save itineraries to AsyncStorage on change
  useEffect(() => {
    AsyncStorage.setItem("itineraries", JSON.stringify(itineraries));
  }, [itineraries]);

  const addItinerary = (itinerary: Itinerary) => setItineraries(prev => [...prev, itinerary]);
  const removeItinerary = (id: string) => setItineraries(prev => prev.filter(i => i.id !== id));
  const updateItinerary = (itinerary: Itinerary) =>
    setItineraries(prev => prev.map(i => (i.id === itinerary.id ? itinerary : i)));

  // Advanced: Activities
  const addActivity = (itineraryId: string, activity: Activity) => {
    setItineraries(prev =>
      prev.map(i =>
        i.id === itineraryId
          ? { ...i, activities: [...i.activities, activity] }
          : i
      )
    );
  };
  const updateActivity = (itineraryId: string, activity: Activity) => {
    setItineraries(prev =>
      prev.map(i =>
        i.id === itineraryId
          ? { ...i, activities: i.activities.map(a => (a.id === activity.id ? activity : a)) }
          : i
      )
    );
  };
  const removeActivity = (itineraryId: string, activityId: string) => {
    setItineraries(prev =>
      prev.map(i =>
        i.id === itineraryId
          ? { ...i, activities: i.activities.filter(a => a.id !== activityId) }
          : i
      )
    );
  };

  // Advanced: Destinations
  const addDestination = (itineraryId: string, destination: Destination) => {
    setItineraries(prev =>
      prev.map(i =>
        i.id === itineraryId
          ? { ...i, destinations: [...i.destinations, destination] }
          : i
      )
    );
  };
  const removeDestination = (itineraryId: string, destinationName: string) => {
    setItineraries(prev =>
      prev.map(i =>
        i.id === itineraryId
          ? { ...i, destinations: i.destinations.filter(d => d.name !== destinationName) }
          : i
      )
    );
  };

  return (
    <ItineraryContext.Provider
      value={{
        itineraries,
        addItinerary,
        removeItinerary,
        updateItinerary,
        addActivity,
        updateActivity,
        removeActivity,
        addDestination,
        removeDestination,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItineraries = () => {
  const context = useContext(ItineraryContext);
  if (!context) throw new Error("useItineraries must be used within ItineraryProvider");
  return context;
};
