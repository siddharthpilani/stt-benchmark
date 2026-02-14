export async function transcribeWithDeepgram(
  audioBuffer: Buffer,
  contentType: string
): Promise<string> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error("DEEPGRAM_API_KEY is not configured");

  const res = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=false",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": contentType,
      },
      body: new Uint8Array(audioBuffer),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Deepgram API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
}
