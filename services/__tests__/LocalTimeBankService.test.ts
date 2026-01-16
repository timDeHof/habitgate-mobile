import { LocalTimeBankService } from "../timebankService";
import { useTimeBankStore } from "@/store/timeBankStore";

describe('Local Time Bank Service', () => {
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

  it('should add and deduct balance through service', async () => {
    const service = new LocalTimeBankService();

    // Add balance
    const addResult = await service.addBalance(50, 'habit', { habitName: 'Test' });
    expect(addResult.valid).toBe(true);

    // Verify balance updated (45 + 50 = 95)
    const balance = await service.getBalance();
    expect(balance).toBe(95);

    // Deduct balance
    const deductResult = await service.deductBalance(15, 'app_unlock');
    expect(deductResult.valid).toBe(true);

    // Verify final balance (95 - 15 = 80)
    const finalBalance = await service.getBalance();
    expect(finalBalance).toBe(80);
  });

  it('should enforce daily earning cap through service', async () => {
    const service = new LocalTimeBankService();
    // Cap is 180. Fill it in chunks to avoid single transaction limit of 120.

    // 1. Fill up the cap (90 + 90 = 180)
    await service.addBalance(90, 'habit');
    await service.addBalance(90, 'habit');

    const balanceAfterCap = await service.getBalance();

    // 2. Try to add more
    const result = await service.addBalance(10, 'habit');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();

    const balanceFinal = await service.getBalance();
    expect(balanceFinal).toBe(balanceAfterCap);
  });
});
