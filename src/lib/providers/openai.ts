export async function transcribeWithOpenAI(
  audioBuffer: Buffer,
  contentType: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const ext = contentType.includes("mpeg") ? "mp3" : "wav";
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: contentType });
  const file = new File([blob], `audio.${ext}`, { type: contentType });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "whisper-1");
  formData.append("response_format", "text");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${text}`);
  }

  return (await res.text()).trim();
}
