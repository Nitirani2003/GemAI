import { GoogleGenerativeAI } from "@google/generative-ai";
export const configureGemini = () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_SECRET);
    return genAI;
};
//# sourceMappingURL=openai-config.js.map