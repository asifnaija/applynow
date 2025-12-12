import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { AcademicInfo, PredictionResult, AdmissionChance } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists (handled gracefully in UI if missing)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const createChatSession = (): Chat | null => {
  if (!ai) return null;
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
        systemInstruction: "You are a friendly and helpful AI assistant for 'ApplyNow', a university admissions portal. Help applicants with questions about the admission process, requirements, deadlines, and tracking their status. Keep your responses concise, professional, and encouraging.",
    }
  });
};

export const predictAdmissionChance = async (academicData: AcademicInfo): Promise<PredictionResult> => {
  if (!ai) {
    // Fallback Mock Logic if no API key is provided
    console.warn("No API Key provided. Using rule-based fallback.");
    
    // Normalize GPA to a 0-100 scale (weighted 60%)
    const gpaScore = (Math.min(academicData.gpa, 4.0) / 4.0) * 60;
    
    // Normalize Test Score to a 0-100 scale (weighted 40%)
    let testScoreNormalized = 0;
    if (academicData.testType === 'SAT') {
        testScoreNormalized = (Math.min(academicData.testScore, 1600) / 1600) * 40;
    } else if (academicData.testType === 'ACT') {
        testScoreNormalized = (Math.min(academicData.testScore, 36) / 36) * 40;
    } else {
        // For 'Other', we assume a less standardized impact, maxing at 30 points instead of 40
        const score = academicData.testScore > 100 ? 100 : academicData.testScore; 
        testScoreNormalized = (score / 100) * 30;
    }

    const totalScore = gpaScore + testScoreNormalized;

    let category = AdmissionChance.Low;
    if (totalScore > 85) category = AdmissionChance.High;
    else if (totalScore > 65) category = AdmissionChance.Moderate;

    const testTypeNote = academicData.testType === 'Other' ? "Standardized test score impact is reduced for non-standard formats." : "";

    return {
      probability: Math.min(Math.round(totalScore), 99),
      category,
      reasoning: `Rule-based estimation (Demo Mode): Calculated based on GPA (${academicData.gpa}) and ${academicData.testType} score. ${testTypeNote}`
    };
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      probability: {
        type: Type.INTEGER,
        description: "Percentage chance of admission from 0 to 100",
      },
      category: {
        type: Type.STRING,
        enum: ["High", "Moderate", "Low"],
        description: "Categorical chance",
      },
      reasoning: {
        type: Type.STRING,
        description: "A concise explanation of the prediction based on the profile.",
      },
    },
    required: ["probability", "category", "reasoning"],
  };

  const prompt = `
    Act as a university admissions officer. Evaluate the following applicant profile for a competitive undergraduate program.
    
    GPA: ${academicData.gpa} (out of 4.0 scale)
    Test Type: ${academicData.testType}
    Test Score: ${academicData.testScore}
    Extracurricular Activities: ${academicData.activities}
    Personal Statement Excerpt: "${academicData.personalStatement.substring(0, 300)}..."
    
    Note: If Test Type is 'Other', the score may not follow standard SAT/ACT scaling. Evaluate it based on the GPA and Activities more heavily, or treat the score as a generic aptitude metric if reasonable.
    
    Provide a realistic admission probability score, a category (High/Moderate/Low), and a short reasoning paragraph.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3, // Lower temperature for more consistent analytical results
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    return {
      probability: result.probability,
      category: result.category as AdmissionChance,
      reasoning: result.reasoning,
    };

  } catch (error) {
    console.error("AI Prediction failed:", error);
    throw error;
  }
};