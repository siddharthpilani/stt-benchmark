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

export interface Language {
  code: string;
  label: string;
  deepgram: string;
  openai: string;
  google: string;
  soniox: string;
  speechmatics: string;
  elevenlabs: string;
  sarvam: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", deepgram: "en", openai: "en", google: "en-US", soniox: "en", speechmatics: "en", elevenlabs: "en", sarvam: "en-IN" },
  { code: "hi", label: "Hindi", deepgram: "hi", openai: "hi", google: "hi-IN", soniox: "hi", speechmatics: "hi", elevenlabs: "hi", sarvam: "hi-IN" },
  { code: "es", label: "Spanish", deepgram: "es", openai: "es", google: "es-ES", soniox: "es", speechmatics: "es", elevenlabs: "es", sarvam: "en-IN" },
  { code: "fr", label: "French", deepgram: "fr", openai: "fr", google: "fr-FR", soniox: "fr", speechmatics: "fr", elevenlabs: "fr", sarvam: "en-IN" },
  { code: "de", label: "German", deepgram: "de", openai: "de", google: "de-DE", soniox: "de", speechmatics: "de", elevenlabs: "de", sarvam: "en-IN" },
  { code: "pt", label: "Portuguese", deepgram: "pt", openai: "pt", google: "pt-BR", soniox: "pt", speechmatics: "pt", elevenlabs: "pt", sarvam: "en-IN" },
  { code: "ja", label: "Japanese", deepgram: "ja", openai: "ja", google: "ja-JP", soniox: "ja", speechmatics: "ja", elevenlabs: "ja", sarvam: "en-IN" },
  { code: "zh", label: "Chinese (Mandarin)", deepgram: "zh", openai: "zh", google: "zh", soniox: "zh", speechmatics: "cmn", elevenlabs: "zh", sarvam: "en-IN" },
  { code: "ko", label: "Korean", deepgram: "ko", openai: "ko", google: "ko-KR", soniox: "ko", speechmatics: "ko", elevenlabs: "ko", sarvam: "en-IN" },
  { code: "ar", label: "Arabic", deepgram: "ar", openai: "ar", google: "ar-SA", soniox: "ar", speechmatics: "ar", elevenlabs: "ar", sarvam: "en-IN" },
  { code: "it", label: "Italian", deepgram: "it", openai: "it", google: "it-IT", soniox: "it", speechmatics: "it", elevenlabs: "it", sarvam: "en-IN" },
  { code: "nl", label: "Dutch", deepgram: "nl", openai: "nl", google: "nl-NL", soniox: "nl", speechmatics: "nl", elevenlabs: "nl", sarvam: "en-IN" },
  { code: "ru", label: "Russian", deepgram: "ru", openai: "ru", google: "ru-RU", soniox: "ru", speechmatics: "ru", elevenlabs: "ru", sarvam: "en-IN" },
  { code: "tr", label: "Turkish", deepgram: "tr", openai: "tr", google: "tr-TR", soniox: "tr", speechmatics: "tr", elevenlabs: "tr", sarvam: "en-IN" },
];
