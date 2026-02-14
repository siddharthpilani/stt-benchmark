"use client";

import { useState, useCallback, useRef } from "react";

interface FileUploadProps {
  onSubmit: (file: File, reference: string) => void;
  isRunning: boolean;
}

export default function FileUpload({ onSubmit, isRunning }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [reference, setReference] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) setFile(selected);
    },
    []
  );

  const handleSubmit = () => {
    if (file && reference.trim()) {
      onSubmit(file, reference.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : file
              ? "border-green-500/50 bg-green-500/5"
              : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div>
            <div className="text-green-400 text-lg font-medium">
              {file.name}
            </div>
            <div className="text-zinc-500 text-sm mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB — Click or drop to
              replace
            </div>
          </div>
        ) : (
          <div>
            <div className="text-zinc-400 text-lg">
              Drop an audio file here, or click to browse
            </div>
            <div className="text-zinc-600 text-sm mt-1">
              Supports MP3, WAV, and other audio formats
            </div>
          </div>
        )}
      </div>

      {/* Reference transcript */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Reference Transcript (ground truth)
        </label>
        <textarea
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Paste or type the correct transcript here..."
          rows={4}
          className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-y"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!file || !reference.trim() || isRunning}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium rounded-lg transition-colors"
      >
        {isRunning ? "Running Benchmark..." : "Run Benchmark"}
      </button>
    </div>
  );
}
