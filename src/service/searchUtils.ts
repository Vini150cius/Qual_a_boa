function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () =>
    Array<number>(cols).fill(0),
  );

  for (let i = 0; i < rows; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j < cols; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[rows - 1][cols - 1];
}

function getAllowedDistance(wordLength: number): number {
  if (wordLength <= 4) {
    return 1;
  }

  if (wordLength <= 8) {
    return 2;
  }

  return 3;
}

function isWordMatch(queryWord: string, candidateWord: string): boolean {
  if (candidateWord.includes(queryWord) || queryWord.includes(candidateWord)) {
    return true;
  }

  const distance = levenshteinDistance(queryWord, candidateWord);
  return distance <= getAllowedDistance(queryWord.length);
}

export function fuzzyNameMatch(query: string, target: string): boolean {
  const normalizedQuery = normalizeText(query);
  const normalizedTarget = normalizeText(target);

  if (!normalizedQuery) {
    return true;
  }

  if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  const targetWords = normalizedTarget.split(/\s+/).filter(Boolean);

  if (queryWords.length === 0 || targetWords.length === 0) {
    return false;
  }

  return queryWords.every((queryWord) =>
    targetWords.some((targetWord) => isWordMatch(queryWord, targetWord)),
  );
}
