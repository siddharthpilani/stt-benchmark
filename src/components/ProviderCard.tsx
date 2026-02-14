"use client";

import { BenchmarkResult, PROVIDER_DISPLAY_NAMES, ProviderName } from "@/lib/types";

interface ProviderCardProps {
  result: BenchmarkResult;
}

export default function ProviderCard({ result }: ProviderCardProps) {
  const displayName =
    PROVIDER_DISPLAY_NAMES[result.provider as ProviderName] ?? result.provider;

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        result.status === "done"
          ? "border-green-500/30 bg-green-500/5"
          : result.status === "error"
            ? "border-red-500/30 bg-red-500/5"
            : result.status === "running"
              ? "border-blue-500/30 bg-blue-500/5"
              : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900">{displayName}</span>
        <StatusBadge status={result.status} />
      </div>
      {result.status === "done" && result.wer && (
        <div className="mt-2 text-sm text-gray-500">
          WER: {(result.wer.wer * 100).toFixed(1)}% | {result.durationMs}ms
        </div>
      )}
      {result.status === "error" && (
        <div className="mt-2 text-sm text-red-400 truncate">
          {result.error}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: BenchmarkResult["status"] }) {
  switch (status) {
    case "pending":
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-500">
          Pending
        </span>
      );
    case "running":
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 animate-pulse">
          Running
        </span>
      );
    case "done":
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
          Done
        </span>
      );
    case "error":
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
          Error
        </span>
      );
  }
}
