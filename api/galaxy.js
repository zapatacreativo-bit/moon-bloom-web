export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages } = req.body;

        // Gemini API Key (Hardcoded for Immediate Fix)
        const apiKey = "AIzaSyCH1Dh_2vhu9mCSwI1xec9RsDHbFMdXwgs";

        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY environment variable");
            return res.status(500).json({ error: { message: "Server configuration error: Missing Gemini API Key" } });
        }

        // --- GEMINI ADAPTER LOGIC ---
        // 1. Extract System Prompt (usually first message)
        const systemMessage = messages.find(m => m.role === 'system')?.content || "";

        // 2. Extract User Query (last message)
        const userMessage = messages.reverse().find(m => m.role === 'user')?.content || "";

        // 3. Construct Gemini Prompt
        const finalPrompt = `${systemMessage}\n\n---\n\nUser Query: ${userMessage}`;

        // 4. Call Gemini Flash API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: finalPrompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            throw new Error(data.error.message || "Error calling Gemini API");
        }

        // 5. Extract Text
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "El cosmos está en silencio...";

        // 6. Return in OpenAI Format (to avoid breaking Frontend)
        return res.status(200).json({
            choices: [{
                message: { content: aiText }
            }]
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Internal Server Error: " + error.message } });
    }
}
