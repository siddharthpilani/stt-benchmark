const BASE_URL = "http://13.234.40.75:8888";

export async function transcribeWithParrot(
  audioBuffer: Buffer,
  contentType: string,
  language: string = "en"
): Promise<string> {
  // Step 1: Upload file
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: contentType });
  const file = new File([blob], "audio.mp3", { type: contentType });

  const uploadForm = new FormData();
  uploadForm.append("file", file);

  const uploadRes = await fetch(`${BASE_URL}/v1/audio/files`, {
    method: "POST",
    body: uploadForm,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Parrot upload error ${uploadRes.status}: ${text}`);
  }

  const uploadData = await uploadRes.json();
  const fileId = uploadData.id;

  // Step 2: Create transcription
  const transcribeRes = await fetch(`${BASE_URL}/v1/audio/transcriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file_id: fileId,
      model: "stt-async-v4",
      language_hints: [language],
    }),
  });

  if (!transcribeRes.ok) {
    const text = await transcribeRes.text();
    throw new Error(`Parrot transcription error ${transcribeRes.status}: ${text}`);
  }

  const transcribeData = await transcribeRes.json();
  const transcriptionId = transcribeData.id;

  // Step 3: Poll for completion
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const statusRes = await fetch(
      `${BASE_URL}/v1/audio/transcriptions/${transcriptionId}`
    );

    if (!statusRes.ok) continue;

    const statusData = await statusRes.json();

    if (statusData.status === "completed") {
      const transcriptRes = await fetch(
        `${BASE_URL}/v1/audio/transcriptions/${transcriptionId}/transcript`
      );
      if (!transcriptRes.ok) {
        const text = await transcriptRes.text();
        throw new Error(`Parrot transcript fetch error ${transcriptRes.status}: ${text}`);
      }
      const transcriptData = await transcriptRes.json();
      return transcriptData.text ?? "";
    }
    if (statusData.status === "error") {
      throw new Error(`Parrot transcription failed: ${statusData.error}`);
    }
  }

  throw new Error("Parrot transcription timed out");
}
