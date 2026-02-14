"use client";

import { useState, useCallback, useRef } from "react";
import { LANGUAGES } from "@/lib/types";

interface FileUploadProps {
  onSubmit: (file: File, language: string) => void;
  isRunning: boolean;
}

export default function FileUpload({ onSubmit, isRunning }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("en");
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
    if (file) {
      onSubmit(file, language);
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
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
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
            <div className="text-green-600 text-lg font-medium">
              {file.name}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB — Click or drop to
              replace
            </div>
          </div>
        ) : (
          <div>
            <div className="text-gray-600 text-lg">
              Drop an audio file here, or click to browse
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Supports MP3, WAV, and other audio formats
            </div>
          </div>
        )}
      </div>

      {/* Language selector */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Primary Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-blue-500"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!file || isRunning}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
      >
        {isRunning ? "Running Benchmark..." : "Run Benchmark"}
      </button>
    </div>
  );
}
