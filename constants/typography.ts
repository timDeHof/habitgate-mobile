export const Typography = {
  // Font Families (Plus Jakarta Sans)
  fontFamily: {
    brand: "PlusJakartaSans_400Regular",
    brandMedium: "PlusJakartaSans_500Medium",
    brandSemibold: "PlusJakartaSans_600SemiBold",
    brandBold: "PlusJakartaSans_700Bold",
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
    "3xl": 24,
    "4xl": 32,
    "5xl": 40,
    "6xl": 48,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
