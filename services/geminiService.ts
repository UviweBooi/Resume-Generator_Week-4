
import { GoogleGenAI } from "@google/genai";
import { ResumeData } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Please set it to use the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const enhanceWithAI = async (textToEnhance: string, section: string): Promise<string> => {
    const prompt = `
        Rewrite and enhance the following text for a resume's "${section}" section.
        Make it professional, impactful, and concise. 
        If it is a job description, use action verbs and focus on achievements. 
        Return only the enhanced text, without any introductory phrases.

        Original text:
        "${textToEnhance}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error enhancing with AI:", error);
        return "Error generating content. Please check your API key and try again.";
    }
};

export const generateCoverLetter = async (resumeData: ResumeData, jobTitle: string, company: string): Promise<string> => {
    const prompt = `
        Write a professional and compelling cover letter for a "${jobTitle}" position at "${company}".
        Use the following resume data to tailor the letter. The tone should be enthusiastic but professional.
        The letter should be well-structured with an introduction, body paragraphs highlighting how the candidate's experience and skills align with the job, and a concluding paragraph with a call to action.
        Do not include placeholders like '[Your Name]' or '[Date]'. Format the output as plain text with line breaks.

        Resume Data:
        - Name: ${resumeData.fullName}
        - Email: ${resumeData.email}
        - Phone: ${resumeData.phone}
        - Summary: ${resumeData.summary}
        - Experience: ${resumeData.experience.map(exp => `${exp.jobTitle} at ${exp.company}: ${exp.description}`).join('\n')}
        - Skills: ${resumeData.skills}

        Generate the cover letter now.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating cover letter:", error);
        return "Error generating cover letter. Please check your API key and try again.";
    }
};
