export interface WERResult {
  wer: number;
  substitutions: number;
  deletions: number;
  insertions: number;
  totalWords: number;
}

export interface TranscriptionResult {
  provider: string;
  transcript: string;
  durationMs: number;
  error?: string;
}

export interface BenchmarkResult {
  provider: string;
  transcript: string;
  durationMs: number;
  wer: WERResult | null;
  status: "pending" | "running" | "done" | "error";
  error?: string;
}

export const PROVIDERS = [
  "deepgram",
  "openai",
  "google",
  "soniox",
  "speechmatics",
  "elevenlabs",
  "sarvam",
] as const;

export type ProviderName = (typeof PROVIDERS)[number];

export const PROVIDER_DISPLAY_NAMES: Record<ProviderName, string> = {
  deepgram: "Deepgram",
  openai: "OpenAI Whisper",
  google: "Google Cloud STT",
  soniox: "Soniox",
  speechmatics: "Speechmatics",
  elevenlabs: "ElevenLabs",
  sarvam: "Sarvam",
};
