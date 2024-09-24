import { NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || "", // Provide a default value if the environment variable is undefined
});

export async function POST(req: Request) {
  const { githubLink } = await req.json();

  try {
    const data = {
      audio: githubLink,
      auto_highlights: true,
    };

    // Call AssemblyAI to transcribe the audio
    const transcript = await client.transcripts.transcribe(data);

    return NextResponse.json({ transcript: transcript.text });
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio." },
      { status: 500 }
    );
  }
}
