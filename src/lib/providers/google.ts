export async function transcribeWithGoogle(
  audioBuffer: Buffer,
  contentType: string,
  language: string = "en-US"
): Promise<string> {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_CLOUD_API_KEY is not configured");

  const audioContent = audioBuffer.toString("base64");

  const encoding = contentType.includes("mpeg") ? "MP3" : "LINEAR16";

  const res = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: {
          encoding,
          languageCode: language,
          model: "latest_long",
          enableAutomaticPunctuation: false,
        },
        audio: { content: audioContent },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google STT API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const results = data.results ?? [];
  return results
    .map(
      (r: { alternatives?: { transcript?: string }[] }) =>
        r.alternatives?.[0]?.transcript ?? ""
    )
    .join(" ")
    .trim();
}
