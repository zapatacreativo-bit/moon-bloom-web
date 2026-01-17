export default async function handler(req, res) {
    try {
        const apiKey = "AIzaSyCH1Dh_2vhu9mCSwI1xec9RsDHbFMdXwgs"; // Hardcoded for check
        const { messages } = req.body;

        // --- GEMINI ADAPTER LOGIC ---
        // 1. Extract System Prompt (usually first message)
        const systemMessage = messages.find(m => m.role === 'system')?.content || "";

        // 2. Extract User Query (last message)
        const userMessage = messages.reverse().find(m => m.role === 'user')?.content || "";

        // 3. Construct Gemini Prompt
        const finalPrompt = `${systemMessage}\n\n---\n\nUser Query: ${userMessage}`;

        // 4. Call Gemini 2.5 Flash API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
        return res.status(500).json({ error: { message: error.message } });
    }
}
