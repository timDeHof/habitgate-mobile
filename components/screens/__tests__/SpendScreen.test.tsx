import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Spend from "@/components/screens/SpendScreen";
import { useTimeBankStore } from "@/store/timeBankStore";
import { useAppLockStore } from "@/store/appLockStore";
import { POPULAR_APPS } from "@/data/apps";
import { Alert } from "react-native";

// Mock the stores
jest.mock("@/store/timeBankStore", () => ({
  useTimeBankStore: jest.fn(),
}));

jest.mock("@/store/appLockStore", () => ({
  useAppLockStore: jest.fn(),
}));

describe("Spend Screen Integration", () => {
  const mockDeductBalance = jest.fn();
  const mockUnlockApp = jest.fn();
  const mockAddMonitoredApp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default TimeBank mock
    (useTimeBankStore as unknown as jest.Mock).mockReturnValue({
      balance: 100,
      deductBalance: mockDeductBalance,
    });

    // Default AppLock mock
    (useAppLockStore as unknown as jest.Mock).mockReturnValue({
      monitoredApps: [POPULAR_APPS[0]], // Instagram
      unlockedSessions: {},
      appUsageStats: {},
      isPremium: false,
      availableApps: POPULAR_APPS,
      unlockApp: mockUnlockApp,
      addMonitoredApp: mockAddMonitoredApp,
      getRemainingTime: () => 0,
      cleanupExpiredSessions: jest.fn(),
    });

    // Mock Alert
    jest.spyOn(Alert, "alert");
  });

  it("should render correctly", () => {
    const { getByText } = render(<Spend />);
    expect(getByText("Time Bank")).toBeTruthy();
    expect(getByText("Available Balance")).toBeTruthy();
    expect(getByText("100 Credits")).toBeTruthy();
    expect(getByText("Instagram")).toBeTruthy();
  });

  it("should open unlock modal on app press", async () => {
    const { getByText } = render(<Spend />);

    await act(() => {
      fireEvent.press(getByText("Instagram"));
    });

    // Modal Text
    expect(getByText("Unlock Instagram")).toBeTruthy();
    expect(getByText("15 min")).toBeTruthy();
  });

  it("should handle unlock flow successfully", async () => {
    mockDeductBalance.mockReturnValue({ valid: true });

    const { getByText } = render(<Spend />);

    // Open Modal
    await act(() => {
      fireEvent.press(getByText("Instagram"));
    });

    // Select 15 min option (Cost 15)
    await act(() => {
      fireEvent.press(getByText("15 min"));
    });

    await waitFor(() => {
      expect(mockDeductBalance).toHaveBeenCalledWith(
        15,
        "app_unlock",
        expect.objectContaining({
          appName: "Instagram",
        }),
      );
      expect(mockUnlockApp).toHaveBeenCalledWith("instagram", 15);
    });
  });

  it("should show error on insufficient funds", async () => {
    // Override mock to low balance
    (useTimeBankStore as unknown as jest.Mock).mockReturnValue({
      balance: 5,
      deductBalance: mockDeductBalance,
    });

    const { getByText } = render(<Spend />);

    await act(() => {
      fireEvent.press(getByText("Instagram"));
    });

    // The modal option "15 min" (cost 15) should be disabled or alert if pressed
    // In our implementation we disable buttons, but let's check behaviors
    // If the button is disabled, fireEvent might still trigger if we target text,
    // but the handler check logic: `if(canAfford) onUnlock(...)`.
    // So let's press it and assume `onUnlock` won't be called.

    await act(() => {
      fireEvent.press(getByText("15 min"));
    });

    // Verify unlock logic was NOT triggered
    expect(mockDeductBalance).not.toHaveBeenCalled();
    expect(mockUnlockApp).not.toHaveBeenCalled();
  });

  it("should show emergency options when balance is low", async () => {
    (useTimeBankStore as unknown as jest.Mock).mockReturnValue({
      balance: 10,
      deductBalance: mockDeductBalance,
    });

    const { getByText } = render(<Spend />);
    await act(() => {
      fireEvent.press(getByText("Instagram"));
    });

    expect(getByText("Emergency Unlock")).toBeTruthy();
    expect(getByText("Watch Ad")).toBeTruthy();
  });
});
