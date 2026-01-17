export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, model, temperature, max_tokens } = req.body;

        // Retrieve API Key from Environment Variable (Secure)
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error("Missing OPENAI_API_KEY environment variable");
            return res.status(500).json({ error: { message: "Server configuration error: Missing API Key" } });
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
