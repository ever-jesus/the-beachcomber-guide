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

export interface LearningResource {
  title: string;
  link: string;
}

export interface LearningResources {
  udemyCourses?: LearningResource[];
  youtubeVideos?: LearningResource[];
  books?: LearningResource[];
  papers?: LearningResource[];
}

export interface Recommendation {
  goal: string;
  activities: string[];
  learningResources?: LearningResources;
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

    Based on the 'Me Now', 'Me Next', and Thoughtworks' guidance, please provide 3-5 SMART goals for this consultant for their time on the beach. For each goal, suggest 2-3 specific, actionable activities AND specific learning resources with actual links.

    For learning resources, provide:
    - **Udemy Courses**: Specific course titles with instructors and actual Udemy URLs (e.g., "AWS Certified Solutions Architect - Associate 2024 by Stephane Maarek" with link to https://www.udemy.com/course/aws-certified-solutions-architect-associate/)
    - **YouTube Videos**: Specific video titles with channels and actual YouTube URLs (e.g., "Microservices Architecture by Tech With Tim" with link to https://www.youtube.com/watch?v=example)
    - **Books**: Specific book titles with authors and Amazon.com URLs (e.g., "Clean Code by Robert C. Martin" with link to https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350884/)
    - **Papers**: Academic papers or industry reports with direct links to PDFs or web pages (e.g., "The Phoenix Project by Gene Kim" with link to https://itrevolution.com/the-phoenix-project/)

    Focus on balancing skill development (both current and new/emerging), internal contributions, and activities that directly improve their staffing readiness.

    Provide the output in a JSON array format, like this example:
    [
      {
        "goal": "Improve proficiency in AWS Cloud Architecture for enterprise solutions.",
        "activities": [
          "Complete AWS Certified Solutions Architect - Associate course.",
          "Participate in the Cloud Guild's weekly knowledge sharing sessions.",
          "Volunteer to support a pre-sales pursuit requiring AWS architecture input."
        ],
        "learningResources": {
          "udemyCourses": [
            {
              "title": "AWS Certified Solutions Architect - Associate 2024 by Stephane Maarek",
              "link": "https://www.udemy.com/course/aws-certified-solutions-architect-associate/"
            },
            {
              "title": "AWS Cloud Practitioner Essentials by AWS Training",
              "link": "https://www.udemy.com/course/aws-cloud-practitioner-essentials/"
            }
          ],
          "youtubeVideos": [
            {
              "title": "AWS Architecture Best Practices by AWS",
              "link": "https://www.youtube.com/watch?v=example1"
            },
            {
              "title": "Microservices on AWS by Tech With Tim",
              "link": "https://www.youtube.com/watch?v=example2"
            }
          ],
          "books": [
            {
              "title": "AWS Well-Architected Framework by AWS",
              "link": "https://www.amazon.com/AWS-Well-Architected-Framework-Cloud-Architecture/dp/0137947134/"
            },
            {
              "title": "Cloud Architecture Patterns by Martin Fowler",
              "link": "https://www.amazon.com/Cloud-Native-Patterns-Martin-Fowler/dp/1617294296/"
            }
          ],
          "papers": [
            {
              "title": "The Twelve-Factor App Methodology",
              "link": "https://12factor.net/"
            },
            {
              "title": "Microservices Architecture Patterns by Chris Richardson",
              "link": "https://microservices.io/patterns/"
            }
          ]
        }
      },
      {
        "goal": "Develop leadership and consulting skills for senior roles.",
        "activities": [
          "Mentor junior consultants in the Agile Guild.",
          "Lead a client proposal presentation.",
          "Facilitate a workshop on digital transformation."
        ],
        "learningResources": {
          "udemyCourses": [
            {
              "title": "Consulting Skills Masterclass by Management Consulted",
              "link": "https://www.udemy.com/course/consulting-skills-masterclass/"
            },
            {
              "title": "Leadership in Tech by Harvard Business School",
              "link": "https://www.udemy.com/course/leadership-in-tech/"
            }
          ],
          "youtubeVideos": [
            {
              "title": "Consulting Case Interview Prep by McKinsey",
              "link": "https://www.youtube.com/watch?v=example3"
            },
            {
              "title": "Leadership Communication by Simon Sinek",
              "link": "https://www.youtube.com/watch?v=example4"
            }
          ],
          "books": [
            {
              "title": "The McKinsey Way by Ethan M. Rasiel",
              "link": "https://www.amazon.com/McKinsey-Way-Ethan-M-Rasiel/dp/0070534489/"
            },
            {
              "title": "The Trusted Advisor by David H. Maister",
              "link": "https://www.amazon.com/Trusted-Advisor-David-H-Maister/dp/0743212347/"
            }
          ],
          "papers": [
            {
              "title": "The Future of Management Consulting by HBR",
              "link": "https://hbr.org/2020/01/the-future-of-management-consulting"
            },
            {
              "title": "Digital Transformation Framework by MIT Sloan",
              "link": "https://sloanreview.mit.edu/article/the-digital-transformation-playbook/"
            }
          ]
        }
      }
    ]

    IMPORTANT: 
    - Only include learning resources that are relevant to the specific goal. If a goal doesn't require formal learning resources, you can omit the learningResources field or include only relevant ones.
    - For Udemy courses, use actual course URLs from udemy.com
    - For YouTube videos, use actual video URLs from youtube.com
    - For books, use Amazon.com URLs (preferably with ISBN numbers)
    - For papers, use direct links to PDFs or web pages where the content is freely available
    - Make sure all links are real and accessible
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