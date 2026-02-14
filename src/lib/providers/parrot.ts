export async function transcribeWithParrot(
  audioBuffer: Buffer,
  contentType: string,
  language: string = "en"
): Promise<string> {
  const ext = contentType.includes("mpeg") ? "mp3" : "wav";
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: contentType });
  const file = new File([blob], `audio.${ext}`, { type: contentType });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", language);
  formData.append("response_format", "text");

  const res = await fetch("http://13.234.40.75:8888/v1/audio/stream", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Parrot STT API error ${res.status}: ${text}`);
  }

  return (await res.text()).trim();
}
