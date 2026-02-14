import { ProviderName } from "../types";
import { transcribeWithDeepgram } from "./deepgram";
import { transcribeWithOpenAI } from "./openai";
import { transcribeWithGoogle } from "./google";
import { transcribeWithSoniox } from "./soniox";
import { transcribeWithSpeechmatics } from "./speechmatics";
import { transcribeWithElevenLabs } from "./elevenlabs";
import { transcribeWithSarvam } from "./sarvam";

type TranscribeFn = (
  audioBuffer: Buffer,
  contentType: string
) => Promise<string>;

const providerRegistry: Record<ProviderName, TranscribeFn> = {
  deepgram: transcribeWithDeepgram,
  openai: transcribeWithOpenAI,
  google: transcribeWithGoogle,
  soniox: transcribeWithSoniox,
  speechmatics: transcribeWithSpeechmatics,
  elevenlabs: transcribeWithElevenLabs,
  sarvam: transcribeWithSarvam,
};

export async function transcribeWithProvider(
  provider: ProviderName,
  audioBuffer: Buffer,
  contentType: string
): Promise<string> {
  const fn = providerRegistry[provider];
  if (!fn) throw new Error(`Unknown provider: ${provider}`);
  return fn(audioBuffer, contentType);
}
