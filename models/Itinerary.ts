export interface Destination {
  name: string;
  photoUri?: string; // local file URI or remote URL
}

export interface Activity {
  id: string;
  name: string;
  date: string; // ISO string
  notes?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  destinations: Destination[];
  activities: Activity[];
  notes?: string;
}
