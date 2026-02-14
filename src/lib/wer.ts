import { WERResult } from "./types";

function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length > 0);
}

export function calculateWER(
  reference: string,
  hypothesis: string
): WERResult {
  const ref = normalizeText(reference);
  const hyp = normalizeText(hypothesis);

  const n = ref.length;
  const m = hyp.length;

  if (n === 0) {
    return {
      wer: m === 0 ? 0 : 1,
      substitutions: 0,
      deletions: 0,
      insertions: m,
      totalWords: 0,
    };
  }

  // DP table for edit distance on word arrays
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0)
  );

  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (ref[i - 1] === hyp[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1 // insertion
        );
      }
    }
  }

  // Backtrace to get S, D, I counts
  let substitutions = 0;
  let deletions = 0;
  let insertions = 0;
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && ref[i - 1] === hyp[j - 1]) {
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      substitutions++;
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      deletions++;
      i--;
    } else {
      insertions++;
      j--;
    }
  }

  const wer = (substitutions + deletions + insertions) / n;

  return { wer, substitutions, deletions, insertions, totalWords: n };
}
