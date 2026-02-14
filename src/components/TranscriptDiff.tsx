"use client";

interface TranscriptDiffProps {
  reference: string;
  hypothesis: string;
  onClose: () => void;
  providerName: string;
}

interface DiffWord {
  word: string;
  type: "match" | "substitution" | "insertion" | "deletion";
}

function computeDiff(reference: string, hypothesis: string): { refDiff: DiffWord[]; hypDiff: DiffWord[] } {
  const normalize = (t: string) =>
    t.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim().split(" ").filter((w) => w.length > 0);

  const ref = normalize(reference);
  const hyp = normalize(hypothesis);
  const n = ref.length;
  const m = hyp.length;

  // Build DP table
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (ref[i - 1] === hyp[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
      }
    }
  }

  // Backtrace
  const refDiff: DiffWord[] = [];
  const hypDiff: DiffWord[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && ref[i - 1] === hyp[j - 1]) {
      refDiff.unshift({ word: ref[i - 1], type: "match" });
      hypDiff.unshift({ word: hyp[j - 1], type: "match" });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      refDiff.unshift({ word: ref[i - 1], type: "substitution" });
      hypDiff.unshift({ word: hyp[j - 1], type: "substitution" });
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      refDiff.unshift({ word: ref[i - 1], type: "deletion" });
      i--;
    } else {
      hypDiff.unshift({ word: hyp[j - 1], type: "insertion" });
      j--;
    }
  }

  return { refDiff, hypDiff };
}

const colorMap: Record<DiffWord["type"], string> = {
  match: "text-gray-800",
  substitution: "text-yellow-400 bg-yellow-400/10",
  insertion: "text-green-400 bg-green-400/10",
  deletion: "text-red-400 bg-red-400/10 line-through",
};

export default function TranscriptDiff({
  reference,
  hypothesis,
  onClose,
  providerName,
}: TranscriptDiffProps) {
  const { refDiff, hypDiff } = computeDiff(reference, hypothesis);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Transcript Diff — {providerName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-6">
          {/* Legend */}
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-400/20 inline-block" /> Substitution
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-400/20 inline-block" /> Deletion
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-400/20 inline-block" /> Insertion
            </span>
          </div>

          {/* Reference */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Reference</h4>
            <div className="bg-gray-50 rounded-lg p-3 leading-relaxed">
              {refDiff.map((w, i) => (
                <span key={i} className={`${colorMap[w.type]} px-0.5 rounded`}>
                  {w.word}{" "}
                </span>
              ))}
            </div>
          </div>

          {/* Hypothesis */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              {providerName} Output
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 leading-relaxed">
              {hypDiff.map((w, i) => (
                <span key={i} className={`${colorMap[w.type]} px-0.5 rounded`}>
                  {w.word}{" "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
