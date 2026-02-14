"use client";

import { BenchmarkResult } from "@/lib/types";
import ProviderCard from "./ProviderCard";

interface BenchmarkRunnerProps {
  results: BenchmarkResult[];
}

export default function BenchmarkRunner({ results }: BenchmarkRunnerProps) {
  if (results.length === 0) return null;

  const done = results.filter((r) => r.status === "done" || r.status === "error").length;
  const total = results.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
        <span className="text-sm text-gray-500">
          {done}/{total} completed
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>

      {/* Provider cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {results.map((r) => (
          <ProviderCard key={r.provider} result={r} />
        ))}
      </div>
    </div>
  );
}
