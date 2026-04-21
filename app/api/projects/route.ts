import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("GET Projects Error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, title, prompt, prd, metadata, frontendCode, backendCode, stack, questions } = await req.json()

    // 1. Ensure user exists in prisma DB using upsert
    await prisma.user.upsert({
      where: { email: user.primaryEmailAddress?.emailAddress || "" },
      update: {},
      create: {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName || "Unknown User"
      }
    })

    // 2. Insert or update the project
    if (id) {
      // Update existing project
      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(prompt && { prompt }),
          ...(prd !== undefined && { prd: prd || null }),
          ...(frontendCode !== undefined && { frontendCode }),
          ...(backendCode !== undefined && { backendCode }),
          ...(stack && { stack }),
          ...(questions && { questions }),
          projectStructure: metadata || undefined,
          status: prd ? "prd_generated" : "prompt_input"
        }
      })
      return NextResponse.json({ project: updatedProject })
    } else {
      // Create new project
      const newProject = await prisma.project.create({
        data: {
          userId: user.id,
          title: title || (prompt || "Untitled Project").substring(0, 30) + "...",
          prompt: prompt,
          prd: prd || null,
          stack: stack || "html",
          questions: questions || undefined,
          projectStructure: metadata || undefined,
          status: prd ? "prd_generated" : "prompt_input"
        }
      })
      return NextResponse.json({ project: newProject })
    }

  } catch (error) {
    console.error("POST Projects Error:", error)
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 })
  }
}
