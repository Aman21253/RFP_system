const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateText(prompt, options = {}) {
    const model = options.model || "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        console.log("Gemini raw response:", JSON.stringify(response, null, 2));

        const text =
            response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        if (!text) {
            throw new Error("Gemini returned empty response");
        }

        return text;
    } catch (error) {
        console.error("Gemini generateText error:", error.message);
        throw error;
    }
}

module.exports = {
    generateText,
};