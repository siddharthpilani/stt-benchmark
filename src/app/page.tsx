"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import BenchmarkRunner from "@/components/BenchmarkRunner";
import ResultsTable from "@/components/ResultsTable";
import { useBenchmark } from "@/hooks/useBenchmark";
import { LANGUAGES } from "@/lib/types";

export default function Home() {
  const { results, isRunning, runBenchmark } = useBenchmark();
  const [referenceTranscript, setReferenceTranscript] = useState("");
  const [groundTruthStatus, setGroundTruthStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [groundTruthError, setGroundTruthError] = useState("");

  const handleSubmit = async (file: File, language: string) => {
    setGroundTruthStatus("loading");
    setGroundTruthError("");
    setReferenceTranscript("");

    try {
      const langLabel =
        LANGUAGES.find((l) => l.code === language)?.label ?? "English";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", langLabel);

      const res = await fetch("/api/ground-truth", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setGroundTruthStatus("error");
        setGroundTruthError(data.error);
        return;
      }

      const transcript = data.transcript || "";
      setReferenceTranscript(transcript);
      setGroundTruthStatus("done");

      runBenchmark(file, transcript, language);
    } catch (err) {
      setGroundTruthStatus("error");
      setGroundTruthError(
        err instanceof Error ? err.message : "Failed to generate ground truth"
      );
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          STT Benchmark
        </h1>
        <p className="mt-3 text-gray-500 text-lg">
          Compare 7 Speech-to-Text providers side by side.
          <br />
          Upload audio, select a language, and see who wins.
        </p>
      </div>

      {/* Upload section */}
      <section className="mb-12">
        <FileUpload
          onSubmit={handleSubmit}
          isRunning={isRunning || groundTruthStatus === "loading"}
        />
      </section>

      {/* Ground truth status */}
      {groundTruthStatus === "loading" && (
        <section className="mb-8">
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-700">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating ground truth via Gemini 2.5 Flash...
          </div>
        </section>
      )}

      {groundTruthStatus === "error" && (
        <section className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
            Ground truth generation failed: {groundTruthError}
          </div>
        </section>
      )}

      {groundTruthStatus === "done" && referenceTranscript && (
        <section className="mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Ground Truth (via Gemini 2.5 Flash)
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed">
              {referenceTranscript}
            </p>
          </div>
        </section>
      )}

      {/* Progress section */}
      {results.length > 0 && (
        <section className="mb-12">
          <BenchmarkRunner results={results} />
        </section>
      )}

      {/* Results table */}
      {results.some((r) => r.status === "done") && (
        <section>
          <ResultsTable
            results={results}
            referenceTranscript={referenceTranscript}
          />
        </section>
      )}
    </main>
  );
}
