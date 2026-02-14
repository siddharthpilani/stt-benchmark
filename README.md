# STT Benchmark

Compare 7 Speech-to-Text providers side by side. Upload audio, select a language, and see who wins.

## Providers

- Deepgram (Nova-2)
- OpenAI Whisper
- Google Cloud STT
- Soniox
- Speechmatics
- ElevenLabs (Scribe v2)
- Sarvam AI

## Features

- 14 language support (English, Hindi, Spanish, French, German, Portuguese, Japanese, Chinese, Korean, Arabic, Italian, Dutch, Russian, Turkish)
- Auto ground truth generation via Gemini 2.5 Flash (with speaker diarization)
- Word Error Rate (WER) calculation with word-level diff view
- Unicode-aware text normalization (works with all scripts)
- Side-by-side provider comparison ranked by accuracy

## Setup

```bash
npm install
cp .env.local.example .env.local  # add your API keys
npm run dev
```

## Environment Variables

```
DEEPGRAM_API_KEY=
OPENAI_API_KEY=
GOOGLE_CLOUD_API_KEY=
SONIOX_API_KEY=
SPEECHMATICS_API_KEY=
ELEVENLABS_API_KEY=
SARVAM_API_KEY=
GEMINI_API_KEY=
```
