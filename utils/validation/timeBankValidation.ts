export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

export function validateEarnTransaction(
  amount: number,
  currentDailyEarned: number,
  dailyCap: number = 180
): ValidationResult {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be positive' };
  }
  if (amount > 120) {
    return { valid: false, error: 'Single transaction cannot exceed 120 minutes' };
  }

  const newDailyEarned = currentDailyEarned + amount;
  if (newDailyEarned > dailyCap) {
    const remaining = dailyCap - currentDailyEarned;
    if (remaining <= 0) {
      return { valid: false, error: 'Daily earning cap reached' };
    }
    return {
      valid: true,
      warning: `Only ${remaining} minutes can be earned today (capped at ${dailyCap})`,
    };
  }

  return { valid: true };
}

export function validateSpendTransaction(
  amount: number,
  currentBalance: number
): ValidationResult {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be positive' };
  }
  if (amount > currentBalance) {
    return {
      valid: false,
      error: `Insufficient balance. You have ${currentBalance} minutes, but need ${amount}.`,
    };
  }
  if (currentBalance - amount < 10) {
    return {
      valid: true,
      warning: 'This will leave you with less than 10 minutes. Consider earning more first.',
    };
  }

  return { valid: true };
}
