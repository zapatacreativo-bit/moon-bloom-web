export default async function handler(req, res) {
    try {
        const apiKey = "AIzaSyCH1Dh_2vhu9mCSwI1xec9RsDHbFMdXwgs"; // Hardcoded for check
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        // Return the list directly to the user (via the chatbot error message for visibility)
        return res.status(200).json({
            choices: [{
                message: {
                    content: "AVAILABLE MODELS: " + JSON.stringify(data.models?.map(m => m.name))
                }
            }]
        });
    } catch (error) {
        return res.status(500).json({ error: { message: error.message } });
    }
}
