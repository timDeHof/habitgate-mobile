import { generateAndIntegrateDummyHabits, HabitGenerator } from "./habits";

describe("Habit Generation System", () => {
  describe("generateAndIntegrateDummyHabits", () => {
    it("should generate habits and completions without seed", () => {
      const result = generateAndIntegrateDummyHabits();
      expect(result.habits.length).toBe(15);
      expect(result.completions.length).toBeGreaterThan(0);
    });

    it("should generate deterministic results with seed", () => {
      const result1 = generateAndIntegrateDummyHabits(123);
      const result2 = generateAndIntegrateDummyHabits(123);

      expect(result1.habits).toEqual(result2.habits);
      expect(result1.completions).toEqual(result2.completions);
    });

    it("should generate different results with different seeds", () => {
      const result1 = generateAndIntegrateDummyHabits(123);
      const result2 = generateAndIntegrateDummyHabits(456);

      expect(result1.habits).not.toEqual(result2.habits);
      expect(result1.completions).not.toEqual(result2.completions);
    });
  });

  describe("HabitGenerator", () => {
    describe("generateDummyHabits", () => {
      it("should generate habits with default config", () => {
        const habits = HabitGenerator.generateDummyHabits();
        expect(habits.length).toBe(10);
      });

      it("should generate habits with custom config", () => {
        const habits = HabitGenerator.generateDummyHabits({ count: 5 });
        expect(habits.length).toBe(5);
      });

      it("should generate deterministic habits with random function", () => {
        const mockRandom = () => 0.5;
        const habits1 = HabitGenerator.generateDummyHabits(
          { count: 5 },
          mockRandom
        );
        const habits2 = HabitGenerator.generateDummyHabits(
          { count: 5 },
          mockRandom
        );

        expect(habits1).toEqual(habits2);
      });
    });

    describe("generateRealisticCompletions", () => {
      it("should generate completions for habits", () => {
        const habits = HabitGenerator.generateDummyHabits({ count: 3 });
        const completions = HabitGenerator.generateRealisticCompletions(habits);

        expect(completions.length).toBeGreaterThan(0);
      });

      it("should generate deterministic completions with random function", () => {
        const habits = HabitGenerator.generateDummyHabits({ count: 3 });
        const mockRandom = () => 0.5;
        const completions1 = HabitGenerator.generateRealisticCompletions(
          habits,
          7,
          mockRandom
        );
        const completions2 = HabitGenerator.generateRealisticCompletions(
          habits,
          7,
          mockRandom
        );

        expect(completions1).toEqual(completions2);
      });
    });
  });
});
