import { NextRequest, NextResponse } from "next/server";
import { transcribeWithProvider } from "@/lib/providers";
import { ProviderName, PROVIDERS, LANGUAGES } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const provider = formData.get("provider") as string | null;
    const languageCode = (formData.get("language") as string) || "en";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!provider || !PROVIDERS.includes(provider as ProviderName)) {
      return NextResponse.json(
        { error: `Invalid provider: ${provider}` },
        { status: 400 }
      );
    }

    const lang = LANGUAGES.find((l) => l.code === languageCode) ?? LANGUAGES[0];
    const providerLang = lang[provider as ProviderName];

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || "audio/mpeg";

    const start = Date.now();
    const transcript = await transcribeWithProvider(
      provider as ProviderName,
      buffer,
      contentType,
      providerLang
    );
    const durationMs = Date.now() - start;

    return NextResponse.json({ transcript, durationMs });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ transcript: "", durationMs: 0, error: message });
  }
}
