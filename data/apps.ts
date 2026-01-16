export interface DistractingApp {
  id: string;
  name: string;
  iconName: string; // Expo vector icon name (Ionicons or MaterialCommunityIcons)
  color: string;
  // Config
  unlockCost: number;
  unlockDuration: number;
  isStrict: boolean;
}

export const POPULAR_APPS: DistractingApp[] = [
  {
    id: "instagram",
    name: "Instagram",
    iconName: "logo-instagram",
    color: "#E1306C",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "tiktok",
    name: "TikTok",
    iconName: "logo-tiktok",
    color: "#000000",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "youtube",
    name: "YouTube",
    iconName: "logo-youtube",
    color: "#FF0000",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "twitter",
    name: "X/Twitter",
    iconName: "logo-twitter",
    color: "#1DA1F2",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "facebook",
    name: "Facebook",
    iconName: "logo-facebook",
    color: "#1877F2",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    iconName: "logo-snapchat",
    color: "#FFFC00",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "reddit",
    name: "Reddit",
    iconName: "logo-reddit",
    color: "#FF4500",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    iconName: "logo-pinterest",
    color: "#E60023",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "netflix",
    name: "Netflix",
    iconName: "film-outline", // Ionicons doesn't have logo-netflix, generic alternative
    color: "#E50914",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
  {
    id: "generic-game",
    name: "Games",
    iconName: "game-controller-outline",
    color: "#4CAF50",
    unlockCost: 15,
    unlockDuration: 15,
    isStrict: false,
  },
];
