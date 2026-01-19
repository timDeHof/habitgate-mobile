/**
 * Safely adds opacity to a hex color string.
 * @param color Hex color string (e.g., "#3B82F6" or "#FFF")
 * @param opacity Opacity value between 0 and 1
 * @returns Hex color string with alpha channel (e.g., "#3B82F620")
 */
export const withOpacity = (color: string, opacity: number): string => {
  if (!color || typeof color !== "string" || !color.startsWith("#")) {
    return color;
  }

  // Normalize opacity to 0-1 range
  const alpha = Math.max(0, Math.min(1, opacity));
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

  // Handle #RGB
  if (color.length === 4) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}${alphaHex}`;
  }

  // Handle #RRGGBB
  if (color.length === 7) {
    return `${color}${alphaHex}`;
  }

  // Handle #RRGGBBAA (override existing alpha if present)
  if (color.length === 9) {
    return `${color.substring(0, 7)}${alphaHex}`;
  }

  return color;
};
