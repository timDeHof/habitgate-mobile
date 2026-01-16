import { useAppLockStore } from "../appLockStore";
import { POPULAR_APPS } from "@/data/apps";

describe("App Lock Store", () => {
  beforeEach(() => {
    useAppLockStore.setState({
      monitoredApps: [],
      unlockedSessions: {},
      appUsageStats: {},
      isPremium: false,
      availableApps: POPULAR_APPS,
    });
  });

  it("should initialize with default state", () => {
    const state = useAppLockStore.getState();
    expect(state.monitoredApps).toEqual([]);
    expect(state.isPremium).toBe(false);
  });

  describe("App Selection", () => {
    it("should add an app to the vault", () => {
      const app = POPULAR_APPS[0];
      const result = useAppLockStore.getState().addMonitoredApp(app.id);

      expect(result.success).toBe(true);
      expect(useAppLockStore.getState().monitoredApps).toHaveLength(1);
      expect(useAppLockStore.getState().monitoredApps[0].id).toBe(app.id);
    });

    it("should prevent adding duplicate apps", () => {
      const app = POPULAR_APPS[0];
      useAppLockStore.getState().addMonitoredApp(app.id);

      const result = useAppLockStore.getState().addMonitoredApp(app.id);

      expect(result.success).toBe(false);
      expect(result.error).toContain("already in your vault");
      expect(useAppLockStore.getState().monitoredApps).toHaveLength(1);
    });

    it("should enforce free tier limit of 5 apps", () => {
      const appsToAdd = POPULAR_APPS.slice(0, 5);
      appsToAdd.forEach(app => {
        useAppLockStore.getState().addMonitoredApp(app.id);
      });

      expect(useAppLockStore.getState().monitoredApps).toHaveLength(5);

      // Try adding 6th app
      const extraApp = POPULAR_APPS[5];
      const result = useAppLockStore.getState().addMonitoredApp(extraApp.id);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Upgrade to Premium");
      expect(useAppLockStore.getState().monitoredApps).toHaveLength(5);
    });

    it("should allow unlimited apps for premium users", () => {
      useAppLockStore.getState().setPremium(true);

      const appsToAdd = POPULAR_APPS.slice(0, 6);
      appsToAdd.forEach(app => {
        useAppLockStore.getState().addMonitoredApp(app.id);
      });

      expect(useAppLockStore.getState().monitoredApps).toHaveLength(6);
    });
  });

  describe("Unlock Logic", () => {
    it("should unlock an app and set expiry", () => {
      const appId = "instagram";
      const duration = 15;

      const start = Date.now();
      useAppLockStore.getState().unlockApp(appId, duration);

      const expiry = useAppLockStore.getState().unlockedSessions[appId];
      // Allow small delta for execution time
      expect(expiry).toBeGreaterThanOrEqual(start + duration * 60 * 1000);
      expect(expiry).toBeLessThan(start + duration * 60 * 1000 + 1000);
    });

    it("should correctly identify unlocked status", () => {
      const appId = "instagram";
      useAppLockStore.getState().unlockApp(appId, 15);

      expect(useAppLockStore.getState().isAppUnlocked(appId)).toBe(true);
    });

    it("should track usage stats on unlock", () => {
        const appId = "instagram";
        useAppLockStore.getState().unlockApp(appId, 15);

        let stats = useAppLockStore.getState().appUsageStats[appId];
        expect(stats).toEqual({ unlockCount: 1, minutesUnlocked: 15 });

        // Unlock again
        useAppLockStore.getState().unlockApp(appId, 30);

        stats = useAppLockStore.getState().appUsageStats[appId];
        expect(stats).toEqual({ unlockCount: 2, minutesUnlocked: 45 });
    });

    it("should cleanup expired sessions", () => {
        const appId = "expired-app";
        // Manually set an expired session
        useAppLockStore.setState(state => ({
            unlockedSessions: {
                ...state.unlockedSessions,
                [appId]: Date.now() - 1000 // Expired 1s ago
            }
        }));

        expect(useAppLockStore.getState().unlockedSessions[appId]).toBeDefined();

        useAppLockStore.getState().cleanupExpiredSessions();

        expect(useAppLockStore.getState().unlockedSessions[appId]).toBeUndefined();
    });
  });
});
