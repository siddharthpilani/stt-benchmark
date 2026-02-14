export async function transcribeWithElevenLabs(
  audioBuffer: Buffer,
  contentType: string
): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured");

  const blob = new Blob([new Uint8Array(audioBuffer)], { type: contentType });
  const file = new File([blob], "audio.mp3", { type: contentType });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_id", "scribe_v2");

  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ElevenLabs API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.text ?? "";
}
