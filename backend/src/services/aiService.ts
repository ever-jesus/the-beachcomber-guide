import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import dotenv from 'dotenv';
import { UserProfile } from '../models/UserProfile';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  // In a real application, you might want to throw an error or handle this more gracefully.
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || ''); // Provide a default empty string if key is undefined

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using the latest available model

export interface Recommendation {
  goal: string;
  activities: string[];
}

export async function getGeminiRecommendations(profile: UserProfile): Promise<Recommendation[]> {
  const { meNow, meNext } = profile;

  // Contextual information from Thoughtworks documents (summarized for prompt)
  const beachExpectations = `
    As a Thoughtworker on the 'beach', your goals are:
    - Support demand / other required efforts (e.g., client proposals, internal projects, interviews).
    - Hone your current skills and learn new and emerging skills.
    - Actively seek to be staffed on projects.
    - Be responsive to staffing team communications (within a few hours).
    - Keep Pathways ('Me Now' and 'Me Next') and Jigsaw profiles updated regularly.
    - Be open to accepting available project work, even if not perfectly aligned with current interests.
    - Manage your time appropriately, avoiding unauthorized overtime.
    - Participate in operational activities and internal contributions.
    - Your performance on the beach is assessed based on meeting these expectations (pursuits, functional area support, skill honing/learning).
  `; // Summarized from provided docs

  const howToGetStaffed = `
    To get staffed effectively:
    - Provide information on skills and aspirations via Pathways ('Me Now' and 'Me Next').
    - Keep Jigsaw profile (resume, industry/domain knowledge, preferences) updated.
    - Be responsive to staffing (within hours).
    - Staffing looks for skills, archetypes, and length of time on beach.
    - Be open to a mix of tenured and new-hire Thoughtworkers.
    - Consider growth ambitions holistically.
  `; // Summarized from provided docs

  const prompt = `
    You are an AI career coach for a Thoughtworks consultant. Your goal is to help them effectively use their time while "on the beach" (unallocated to a project) to grow their skills and get staffed.

    Here's the consultant's current profile and aspirations:
    - **Me Now (Current Skills & Experience):** ${meNow}
    - **Me Next (Career Aspirations & Desired Skills):** ${meNext}

    Here are Thoughtworks' expectations for consultants on the 'beach':
    ${beachExpectations}

    Here's how Thoughtworks advises consultants to get staffed:
    ${howToGetStaffed}

    Based on the 'Me Now', 'Me Next', and Thoughtworks' guidance, please provide 3-5 SMART goals for this consultant for their time on the beach. For each goal, suggest 2-3 specific, actionable activities. Focus on balancing skill development (both current and new/emerging), internal contributions, and activities that directly improve their staffing readiness.

    Provide the output in a JSON array format, like this example:
    [
      {
        "goal": "Improve proficiency in AWS Cloud Architecture for enterprise solutions.",
        "activities": [
          "Complete AWS Certified Solutions Architect - Associate course.",
          "Participate in the Cloud Guild's weekly knowledge sharing sessions.",
          "Volunteer to support a pre-sales pursuit requiring AWS architecture input."
        ]
      },
      {
        "goal": "Contribute to Thoughtworks' demand generation efforts.",
        "activities": [
          "Draft a proposal section for a mock client engagement in the retail sector.",
          "Collaborate with the marketing team on a blog post about industry trends.",
          "Participate in client interview training for upcoming client pitches."
        ]
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Attempt to parse the JSON. Gemini might wrap it in markdown.
    let jsonString = text.replace(/```json\n/g, '').replace(/\n```/g, '');
    const recommendations: Recommendation[] = JSON.parse(jsonString);
    return recommendations;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Attempt to parse if it's a JSON error or return empty array
    if (error instanceof SyntaxError) {
        console.error("Failed to parse JSON from Gemini. Raw text:", (error as any).rawText);
    }
    return []; // Return empty array on error
  }
} 