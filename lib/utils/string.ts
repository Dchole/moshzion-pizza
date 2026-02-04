/**
 * Returns the singular or plural form of a word based on count
 * @param count - The number to check
 * @param singular - The singular form of the word
 * @param plural - The plural form of the word
 * @returns The appropriate form of the word
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string
): string {
  return count === 1 ? singular : plural;
}
