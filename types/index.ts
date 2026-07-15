export interface Event {
  id: string;
  title: string;
  host: string;
  hostAvatar?: string;
  hostAvatars?: string[]; // Overlapping hosts list matching reference
  coHost?: string;
  dateTime: string;         // ISO date-time string
  eventTimezone: string;    // Timezone code, e.g. "GMT-3"
  displayTimeLocal: string; // Display string for local/event time
  city: string;             // Filter city tag, e.g. "Mendoza"
  location: string;         // E.g. "Capital, Argentina"
  tagColor: string;         // Tag visual styling (pink, emerald, orange, blue, etc.)
  capacityStatus?: string;   // E.g. "Near Capacity", "Open", "Waitlist"
  attendeesCount: number;
  description: string;
  imageUrl?: string;
  coordinates: { x: number; y: number }; // Percentage coordinate on world map
}

export interface CityInfo {
  name: string;
  count: number;
}
