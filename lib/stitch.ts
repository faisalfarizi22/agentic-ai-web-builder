import { stitch, StitchError } from "@google/stitch-sdk";
import axios from "axios";

/**
 * Validates the Stitch API Key exists.
 */
if (!process.env.STITCH_API_KEY) {
  console.warn("STITCH_API_KEY is not defined in environment variables.");
}

/**
 * Generates a design using Google Stitch based on a PRD or prompt.
 */
export async function generateStitchDesign(prompt: string, projectName: string = "WUUS AI Project") {
  try {
    const project = await stitch.createProject(projectName);
    const screen = await project.generate(prompt, "DESKTOP");
    
    const htmlUrl = await screen.getHtml();
    let guideUrl = "";
    try {
      if ((screen as any).getGuide) guideUrl = await (screen as any).getGuide();
      else if ((screen as any).getMarkdown) guideUrl = await (screen as any).getMarkdown();
      else if ((screen as any).getInstructions) guideUrl = await (screen as any).getInstructions();
    } catch (e) {}

    let htmlContent = "";
    let guideContent = "";
    
    if (htmlUrl) {
      const res = await axios.get(htmlUrl).catch(() => null);
      if (res) htmlContent = res.data;
    }
    
    if (guideUrl) {
      const res = await axios.get(guideUrl).catch(() => null);
      if (res) guideContent = res.data;
    }

    return {
      projectId: project.id,
      screenId: screen.id,
      htmlContent,
      guideContent,
      htmlUrl,
      guideUrl
    };
  } catch (error) {
    if (error instanceof StitchError) {
      console.error("Stitch SDK Error:", error.code, error.message);
      throw new Error(`Stitch Design Generation Failed: ${error.message}`);
    }
    console.error("Unexpected Stitch Error:", error);
    throw error;
  }
}

/**
 * Edits an existing screen using Stitch.
 */
export async function editStitchDesign(projectId: string, screenId: string, prompt: string) {
  try {
    const project = stitch.project(projectId);
    const screen = await project.getScreen(screenId);
    const updatedScreen = await screen.edit(prompt);
    
    const htmlUrl = await updatedScreen.getHtml();
    let guideUrl = "";
    try {
      if ((updatedScreen as any).getGuide) guideUrl = await (updatedScreen as any).getGuide();
      else if ((updatedScreen as any).getMarkdown) guideUrl = await (updatedScreen as any).getMarkdown();
    } catch (e) {}

    let htmlContent = "";
    let guideContent = "";
    
    if (htmlUrl) {
      const res = await axios.get(htmlUrl).catch(() => null);
      if (res) htmlContent = res.data;
    }
    
    if (guideUrl) {
      const res = await axios.get(guideUrl).catch(() => null);
      if (res) guideContent = res.data;
    }

    return {
      screenId: updatedScreen.id,
      htmlContent,
      guideContent,
      htmlUrl,
      guideUrl
    };
  } catch (error) {
    console.error("Stitch Edit Error:", error);
    throw error;
  }
}
