"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import BenchmarkRunner from "@/components/BenchmarkRunner";
import ResultsTable from "@/components/ResultsTable";
import { useBenchmark } from "@/hooks/useBenchmark";

export default function Home() {
  const { results, isRunning, runBenchmark } = useBenchmark();
  const [referenceTranscript, setReferenceTranscript] = useState("");

  const handleSubmit = (file: File, reference: string) => {
    setReferenceTranscript(reference);
    runBenchmark(file, reference);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">
          STT Benchmark
        </h1>
        <p className="mt-3 text-zinc-500 text-lg">
          Compare 7 Speech-to-Text providers side by side.
          <br />
          Upload audio, provide a reference transcript, and see who wins.
        </p>
      </div>

      {/* Upload section */}
      <section className="mb-12">
        <FileUpload onSubmit={handleSubmit} isRunning={isRunning} />
      </section>

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
