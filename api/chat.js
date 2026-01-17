export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { messages, model, temperature, max_tokens } = await request.json();

        // Retrieve API Key (Hardcoded for Emergency Fix)
        const apiKey = "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";

        if (!apiKey) {
            return new Response(JSON.stringify({ error: { message: "OpenAI API Key not configured on server." } }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
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

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: { message: "Internal Server Error" } }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
