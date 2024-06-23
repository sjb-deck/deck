const LENGTH_THRESHOLD = 3;

/**
 * Finds the best potential match for the user input from the given items array.
 * Uses the Levenshtein distance algorithm with pruning.
 *
 * @param {string} userInput - The user input string to match against.
 * @param {Array} items - The array of items to compare with the user input.
 * @param {number} threshold - The maximum threshold for the Levenshtein distance.
 * @return {string|null} - The best match found or null if no match is found.
 */
function findPotentialMatch(userInput, items, threshold) {
  let bestMatch = null;
  let bestDistance = Infinity;

  for (let i = 0; i < items.length; i++) {
    const string = items[i].name;
    const distance = levenshteinDistanceWithPruning(
      userInput,
      string,
      LENGTH_THRESHOLD,
    );

    if (distance <= threshold && distance < bestDistance) {
      bestMatch = string;
      bestDistance = distance;
    }
  }

  return bestMatch;
}

/**
 * Calculates the Levenshtein distance between two strings with pruning.
 * The Levenshtein distance is normalized by dividing it by the maximum length of the input strings.
 *
 * @param {string} source - The source string.
 * @param {string} target - The target string.
 * @param {number} threshold - The maximum threshold for the Levenshtein distance.
 * @return {number} - The normalized Levenshtein distance between the strings.
 */
function levenshteinDistanceWithPruning(source, target, threshold) {
  const m = source.length;
  const n = target.length;

  // Prune if the difference in string lengths exceeds the threshold
  if (Math.abs(m - n) > threshold) {
    return (threshold + 1) / Math.max(m, n);
  }

  // Create the matrix
  const matrix = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => 0),
  );

  // Initialize the matrix
  for (let i = 0; i <= m; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
  }

  // Perform the dynamic programming algorithm to calculate the Levenshtein distance
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost =
        source[i - 1].toLowerCase() === target[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }

    // Prune if the current row exceeds the threshold
    if (Math.min(...matrix[i]) > threshold) {
      return (threshold + 1) / Math.max(m, n);
    }
  }

  return matrix[m][n] / Math.max(m, n);
}

export default findPotentialMatch;
