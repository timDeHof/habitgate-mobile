import { useTimeBankStore } from "../timeBankStore";
import { DAILY_EARNING_CAP } from "@/data/timebank";

describe("Time Bank Store", () => {
  beforeEach(() => {
    // Reset store state
    useTimeBankStore.setState({
      balance: 45,
      lifetimeEarned: 0,
      lifetimeSpent: 0,
      dailyEarned: 0,
      transactions: [],
      lastResetDate: new Date().toISOString().split("T")[0],
    });
  });

  it("should initialize with default balance of 45", () => {
    const { balance } = useTimeBankStore.getState();
    expect(balance).toBe(45);
  });

  it("should add balance correctly", () => {
    const { addBalance } = useTimeBankStore.getState();
    const success = addBalance(30, "habit", { habitName: "Morning Run" });
    expect(success).toBe(true);
    expect(useTimeBankStore.getState().balance).toBe(75);
    expect(useTimeBankStore.getState().lifetimeEarned).toBe(30);
    expect(useTimeBankStore.getState().dailyEarned).toBe(30);
  });

  it("should prevent spending more than balance", () => {
    const { deductBalance } = useTimeBankStore.getState();
    const success = deductBalance(1000, "app_unlock");
    expect(success).toBe(false);
    expect(useTimeBankStore.getState().balance).toBe(45);
  });

  it("should enforce daily earning cap", () => {
    const { addBalance } = useTimeBankStore.getState();
    // Initial balance is 45, dailyEarned is 0 (180 remaining capacity)
    // Try to earn 200 minutes (over 180 cap)
    const result = addBalance(200, "habit");
    // Should return true (successfully added capped amount)
    expect(result).toBe(true);
    // Balance should increase by 180 (the capped amount, not full 200)
    expect(useTimeBankStore.getState().balance).toBe(45 + 180);
    // dailyEarned should reflect the capped addition (180)
    expect(useTimeBankStore.getState().dailyEarned).toBe(180);
  });

  it("should reject additions when daily cap is already reached", () => {
    const { addBalance } = useTimeBankStore.getState();
    // First fill up to the cap
    addBalance(DAILY_EARNING_CAP, "habit");
    expect(useTimeBankStore.getState().dailyEarned).toBe(DAILY_EARNING_CAP);

    // Try to earn more when cap is already reached
    const result = addBalance(50, "habit");
    // Should return false (cap blocks the transaction)
    expect(result).toBe(false);
    // Balance should not change
    expect(useTimeBankStore.getState().balance).toBe(45 + DAILY_EARNING_CAP);
    // dailyEarned should remain at the cap
    expect(useTimeBankStore.getState().dailyEarned).toBe(DAILY_EARNING_CAP);
  });

  it("should record transactions", () => {
    const { addBalance, getTransactions } = useTimeBankStore.getState();
    addBalance(30, "habit", { habitName: "Test Habit" });
    const transactions = getTransactions();
    expect(transactions.length).toBe(1);
    expect(transactions[0].amount).toBe(30);
    expect(transactions[0].type).toBe("earn");
  });
});
