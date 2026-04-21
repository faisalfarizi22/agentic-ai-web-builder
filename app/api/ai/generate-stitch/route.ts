import { generateStitchDesign } from "@/lib/stitch";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { projectId, prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 1. Generate design via Stitch
    const design = await generateStitchDesign(prompt, `WUUS Project ${projectId || Date.now()}`);

    // 2. Update project in database if projectId is provided
    if (projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          stitchProjectId: design.projectId,
          stitchScreenId: design.screenId,
        },
      });
    }

    return NextResponse.json(design);
  } catch (error: any) {
    console.error("Stitch Generation Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
