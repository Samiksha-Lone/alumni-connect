const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateIcebreaker = async (req, res) => {
    const { studentName, studentMajor, alumniName, alumniRole, alumniCompany } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "API Key not configured" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a helpful networking assistant for a university alumni platform.
            Write a short, professional LinkedIn-style icebreaker message (max 60 words).
            Sender: ${studentName}, a student majoring in ${studentMajor}.
            Recipient: ${alumniName}, a ${alumniRole} at ${alumniCompany}.
            Instructions: Mention their company, be respectful, and ask for a small piece of advice. Do not ask for a job.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ icebreaker: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to generate icebreaker" });
    }
};

module.exports = { generateIcebreaker };