interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: string;
}

export const integration: Integration[] = [
  {
    id: "int_001",
    name: "Strava",
    description: "Auto-track running & cycling",
    connected: true,
    icon: "Activity",
  },
  {
    id: "int_002",
    name: "Apple Health",
    description: "Sync health metrics",
    connected: false,
    icon: "Heart",
  },
];
