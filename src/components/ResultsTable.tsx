"use client";

import { useState } from "react";
import { BenchmarkResult, PROVIDER_DISPLAY_NAMES, ProviderName } from "@/lib/types";
import TranscriptDiff from "./TranscriptDiff";

interface ResultsTableProps {
  results: BenchmarkResult[];
  referenceTranscript: string;
}

export default function ResultsTable({
  results,
  referenceTranscript,
}: ResultsTableProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const completed = results.filter((r) => r.status === "done" && r.wer);
  if (completed.length === 0) return null;

  const ranked = [...completed].sort(
    (a, b) => (a.wer?.wer ?? 1) - (b.wer?.wer ?? 1)
  );

  const selectedResult = results.find((r) => r.provider === selectedProvider);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-200">Results</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400">
              <th className="text-left py-3 px-4 font-medium">Rank</th>
              <th className="text-left py-3 px-4 font-medium">Provider</th>
              <th className="text-left py-3 px-4 font-medium">WER</th>
              <th className="text-left py-3 px-4 font-medium">Accuracy</th>
              <th className="text-left py-3 px-4 font-medium">Time</th>
              <th className="text-left py-3 px-4 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => {
              const wer = r.wer!;
              const accuracy = Math.max(0, (1 - wer.wer) * 100);
              const displayName =
                PROVIDER_DISPLAY_NAMES[r.provider as ProviderName] ??
                r.provider;

              return (
                <tr
                  key={r.provider}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        i === 0
                          ? "bg-yellow-500/20 text-yellow-400"
                          : i === 1
                            ? "bg-zinc-400/20 text-zinc-300"
                            : i === 2
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-zinc-700/50 text-zinc-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-zinc-200">
                    {displayName}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono ${
                        wer.wer < 0.05
                          ? "text-green-400"
                          : wer.wer < 0.15
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {(wer.wer * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 w-48">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-zinc-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            accuracy > 95
                              ? "bg-green-500"
                              : accuracy > 85
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(100, accuracy)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-12 text-right">
                        {accuracy.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-mono">
                    {r.durationMs < 1000
                      ? `${r.durationMs}ms`
                      : `${(r.durationMs / 1000).toFixed(1)}s`}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedProvider(r.provider)}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                    >
                      View Diff
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Error providers */}
      {results.filter((r) => r.status === "error").length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">
            Failed Providers
          </h3>
          <div className="space-y-2">
            {results
              .filter((r) => r.status === "error")
              .map((r) => (
                <div
                  key={r.provider}
                  className="text-sm bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  <span className="text-red-400 font-medium">
                    {PROVIDER_DISPLAY_NAMES[r.provider as ProviderName] ??
                      r.provider}
                    :
                  </span>{" "}
                  <span className="text-red-300/70">{r.error}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Diff modal */}
      {selectedProvider && selectedResult && (
        <TranscriptDiff
          reference={referenceTranscript}
          hypothesis={selectedResult.transcript}
          providerName={
            PROVIDER_DISPLAY_NAMES[selectedProvider as ProviderName] ??
            selectedProvider
          }
          onClose={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}
