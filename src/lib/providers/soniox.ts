export async function transcribeWithSoniox(
  audioBuffer: Buffer,
  contentType: string
): Promise<string> {
  const apiKey = process.env.SONIOX_API_KEY;
  if (!apiKey) throw new Error("SONIOX_API_KEY is not configured");

  // Step 1: Upload file
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: contentType });
  const file = new File([blob], "audio.mp3", { type: contentType });

  const uploadForm = new FormData();
  uploadForm.append("file", file);

  const uploadRes = await fetch("https://api.soniox.com/v1/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: uploadForm,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Soniox upload error ${uploadRes.status}: ${text}`);
  }

  const uploadData = await uploadRes.json();
  const fileId = uploadData.id;

  // Step 2: Create transcription
  const transcribeRes = await fetch(
    "https://api.soniox.com/v1/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_id: fileId,
        model: "stt-async-v4",
      }),
    }
  );

  if (!transcribeRes.ok) {
    const text = await transcribeRes.text();
    throw new Error(
      `Soniox transcription error ${transcribeRes.status}: ${text}`
    );
  }

  const transcribeData = await transcribeRes.json();
  const transcriptionId = transcribeData.id;

  // Step 3: Poll for completion
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const statusRes = await fetch(
      `https://api.soniox.com/v1/transcriptions/${transcriptionId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!statusRes.ok) continue;

    const statusData = await statusRes.json();

    if (statusData.status === "completed") {
      return statusData.text ?? statusData.result?.text ?? "";
    }
    if (statusData.status === "error" || statusData.status === "failed") {
      throw new Error(`Soniox transcription failed: ${statusData.error}`);
    }
  }

  throw new Error("Soniox transcription timed out");
}
