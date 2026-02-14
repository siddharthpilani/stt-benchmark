"use client";

import { useState, useCallback } from "react";
import {
  BenchmarkResult,
  PROVIDERS,
  ProviderName,
  TranscriptionResult,
} from "@/lib/types";
import { calculateWER } from "@/lib/wer";

export function useBenchmark() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runBenchmark = useCallback(
    async (file: File, referenceTranscript: string, language: string) => {
      setIsRunning(true);

      // Initialize all providers as pending
      const initial: BenchmarkResult[] = PROVIDERS.map((p) => ({
        provider: p,
        transcript: "",
        durationMs: 0,
        wer: null,
        status: "pending" as const,
      }));
      setResults(initial);

      // Fire all requests in parallel
      const promises = PROVIDERS.map(async (provider: ProviderName) => {
        // Mark as running
        setResults((prev) =>
          prev.map((r) =>
            r.provider === provider ? { ...r, status: "running" as const } : r
          )
        );

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("provider", provider);
          formData.append("language", language);

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const data: TranscriptionResult = await res.json();

          if (data.error) {
            setResults((prev) =>
              prev.map((r) =>
                r.provider === provider
                  ? { ...r, status: "error" as const, error: data.error }
                  : r
              )
            );
            return;
          }

          const wer = calculateWER(referenceTranscript, data.transcript);

          setResults((prev) =>
            prev.map((r) =>
              r.provider === provider
                ? {
                    ...r,
                    transcript: data.transcript,
                    durationMs: data.durationMs,
                    wer,
                    status: "done" as const,
                  }
                : r
            )
          );
        } catch (err) {
          setResults((prev) =>
            prev.map((r) =>
              r.provider === provider
                ? {
                    ...r,
                    status: "error" as const,
                    error:
                      err instanceof Error ? err.message : "Network error",
                  }
                : r
            )
          );
        }
      });

      await Promise.allSettled(promises);
      setIsRunning(false);
    },
    []
  );

  return { results, isRunning, runBenchmark };
}
