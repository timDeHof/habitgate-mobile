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
      dailySpent: 0,
      transactions: [],
      lastResetDate: new Date().toLocaleDateString("en-CA"),
    });
  });

  it("should initialize with default balance of 45", () => {
    const { balance } = useTimeBankStore.getState();
    expect(balance).toBe(45);
  });

  it("should add balance correctly", () => {
    const { addBalance } = useTimeBankStore.getState();
    const result = addBalance(30, "habit", { habitName: "Morning Run" });

    expect(result.valid).toBe(true);
    expect(useTimeBankStore.getState().balance).toBe(75);
    expect(useTimeBankStore.getState().lifetimeEarned).toBe(30);
    expect(useTimeBankStore.getState().dailyEarned).toBe(30);
  });

  it("should prevent spending more than balance", () => {
    const { deductBalance } = useTimeBankStore.getState();
    const result = deductBalance(1000, "app_unlock");

    expect(result.valid).toBe(false);
    expect(useTimeBankStore.getState().balance).toBe(45);
  });

  it("should enforce daily earning cap", () => {
    const { addBalance } = useTimeBankStore.getState();
    // Initial balance is 45, dailyEarned is 0 (180 remaining capacity)

    // 1. Add 100 (valid, under 120 limit, under 180 cap)
    let result = addBalance(100, "habit");
    expect(result.valid).toBe(true);
    expect(useTimeBankStore.getState().dailyEarned).toBe(100);
    expect(useTimeBankStore.getState().balance).toBe(45 + 100);

    // 2. Try to add 100 more (total would be 200, cap is 180)
    // Should be capped at adding 80 more
    result = addBalance(100, "habit");

    // Should return true (successfully added capped amount)
    expect(result.valid).toBe(true);
    // Balance should increase by 80 more (total 145 + 80 = 225)
    expect(useTimeBankStore.getState().balance).toBe(45 + 100 + 80);
    // dailyEarned should be at cap (180)
    expect(useTimeBankStore.getState().dailyEarned).toBe(180);
  });

  it("should reject additions when daily cap is already reached", () => {
    const { addBalance } = useTimeBankStore.getState();
    // First fill up to the cap (180) using valid chunks (max 120 per txn)
    addBalance(90, "habit");
    addBalance(90, "habit");
    expect(useTimeBankStore.getState().dailyEarned).toBe(DAILY_EARNING_CAP);

    // Try to earn more when cap is already reached
    const result = addBalance(50, "habit");
    // Should return false (cap blocks the transaction)
    expect(result.valid).toBe(false);
    // Balance should not change
    expect(useTimeBankStore.getState().balance).toBe(45 + DAILY_EARNING_CAP);
    // dailyEarned should remain at the cap
    expect(useTimeBankStore.getState().dailyEarned).toBe(DAILY_EARNING_CAP);
  });

  it("should reset daily earned at midnight", () => {
    const { addBalance, resetDailyCounters } = useTimeBankStore.getState();
    addBalance(100, "habit");
    expect(useTimeBankStore.getState().dailyEarned).toBe(100);

    resetDailyCounters();

    expect(useTimeBankStore.getState().dailyEarned).toBe(0);
    expect(useTimeBankStore.getState().dailySpent).toBe(0);
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
