const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read .env.local manually
let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match) {
            apiKey = match[1].trim();
            // Remove quotes if present
            if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
                apiKey = apiKey.slice(1, -1);
            }
            console.log("Read API Key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5));
        }
    } catch (e) {
        console.error("Could not read .env.local", e);
    }
}

async function listModels() {
    const key = apiKey;
    if (!key) {
        console.error("GEMINI_API_KEY is not set");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);
    // Note: listModels is not directly on GoogleGenerativeAI instance in some versions, 
    // but let's check the SDK documentation pattern or try to use the model manager if available.
    // Actually, in the Node SDK, it might be different.
    // Let's try a direct fetch if the SDK doesn't make it obvious, or use the SDK's way.
    // The SDK usually exposes a ModelManager or similar. 
    // Wait, the SDK version is 0.21.0.

    // Let's try to just use a simple fetch to the API endpoint to be sure, 
    // avoiding SDK version ambiguities for this debug step.

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
