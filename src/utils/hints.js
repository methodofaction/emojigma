/** First letter of each word plus underscores for the rest (single hint tier). */
export function getFirstLetterHint(puzzle) {
  if (!puzzle) return null;
  const words = puzzle.display.split(/\s+/);
  return words.map((w) => w[0] + "_".repeat(w.length - 1)).join("  ");
}
