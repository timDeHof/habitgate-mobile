import { useSettingsStore } from "../settingsStore";
import { THEME_OPTIONS } from "@/data/user";

describe("Settings Store", () => {
  beforeEach(() => {
    useSettingsStore.getState().resetPreferences();
  });

  it("should initialize with default preferences", () => {
    const { preferences } = useSettingsStore.getState();
    expect(preferences.theme).toBe(THEME_OPTIONS.AUTO);
    expect(preferences.notifications).toBe(true);
    expect(preferences.sound).toBe(true);
    expect(preferences.vibration).toBe(true);
    expect(preferences.strictMode).toBe(false);
  });

  it("should update preferences correctly", () => {
    const { setPreference } = useSettingsStore.getState();

    setPreference("theme", THEME_OPTIONS.DARK);
    expect(useSettingsStore.getState().preferences.theme).toBe(THEME_OPTIONS.DARK);

    setPreference("notifications", false);
    expect(useSettingsStore.getState().preferences.notifications).toBe(false);

    setPreference("strictMode", true);
    expect(useSettingsStore.getState().preferences.strictMode).toBe(true);
  });

  it("should reset preferences to default", () => {
    const { setPreference, resetPreferences } = useSettingsStore.getState();

    setPreference("theme", THEME_OPTIONS.DARK);
    setPreference("notifications", false);

    resetPreferences();

    const { preferences } = useSettingsStore.getState();
    expect(preferences.theme).toBe(THEME_OPTIONS.AUTO);
    expect(preferences.notifications).toBe(true);
  });
});
