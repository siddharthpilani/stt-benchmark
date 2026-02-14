export async function transcribeWithSarvam(
  audioBuffer: Buffer,
  contentType: string,
  language: string = "en-IN"
): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error("SARVAM_API_KEY is not configured");

  const blob = new Blob([new Uint8Array(audioBuffer)], { type: contentType });
  const file = new File([blob], "audio.mp3", { type: contentType });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "saaras:v3");
  formData.append("language_code", language);

  const res = await fetch("https://api.sarvam.ai/speech-to-text", {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sarvam API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.transcript ?? "";
}
