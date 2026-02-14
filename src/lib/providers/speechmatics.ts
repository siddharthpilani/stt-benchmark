export async function transcribeWithSpeechmatics(
  audioBuffer: Buffer,
  contentType: string,
  language: string = "en"
): Promise<string> {
  const apiKey = process.env.SPEECHMATICS_API_KEY;
  if (!apiKey) throw new Error("SPEECHMATICS_API_KEY is not configured");

  const blob = new Blob([new Uint8Array(audioBuffer)], { type: contentType });
  const file = new File([blob], "audio.mp3", { type: contentType });

  const formData = new FormData();
  formData.append("data_file", file);
  formData.append(
    "config",
    JSON.stringify({
      type: "transcription",
      transcription_config: {
        language: language,
        operating_point: "enhanced",
      },
    })
  );

  // Submit job
  const submitRes = await fetch(
    "https://asr.api.speechmatics.com/v2/jobs",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  );

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`Speechmatics submit error ${submitRes.status}: ${text}`);
  }

  const submitData = await submitRes.json();
  const jobId = submitData.id;

  // Poll for completion
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const statusRes = await fetch(
      `https://asr.api.speechmatics.com/v2/jobs/${jobId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!statusRes.ok) continue;

    const statusData = await statusRes.json();
    const job = statusData.job;

    if (job?.status === "done") {
      // Fetch transcript
      const transcriptRes = await fetch(
        `https://asr.api.speechmatics.com/v2/jobs/${jobId}/transcript?format=txt`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );

      if (!transcriptRes.ok) {
        const text = await transcriptRes.text();
        throw new Error(
          `Speechmatics transcript error ${transcriptRes.status}: ${text}`
        );
      }

      return (await transcriptRes.text()).trim();
    }

    if (job?.status === "rejected" || job?.status === "deleted") {
      throw new Error(`Speechmatics job ${job.status}`);
    }
  }

  throw new Error("Speechmatics transcription timed out");
}
