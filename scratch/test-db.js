const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User"
      }
    })
    console.log("User upserted:", user)

    const project = await prisma.project.create({
      data: {
        userId: "test-user-id",
        title: "Test Project",
        prompt: "Test Prompt",
        status: "prompt_input"
      }
    })
    console.log("Project created:", project)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
