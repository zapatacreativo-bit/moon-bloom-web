export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, model, temperature, max_tokens } = req.body;

        // Retrieve API Key (Hardcoded for Emergency Fix)
        const apiKey = "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";

        if (!apiKey) {
            return res.status(500).json({ error: { message: "OpenAI API Key not configured on server." } });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || "gpt-4o",
                messages: messages,
                temperature: temperature || 0.7,
                max_tokens: max_tokens || 300
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: { message: "Internal Server Error" } });
    }
}
