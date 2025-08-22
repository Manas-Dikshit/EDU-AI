// Call Gemini API to generate content
async function callGeminiAPI(prompt) {
    const apiKey = 'AIzaSyC_1HJbHryk0t9mwRSEJnlhjYDIzSuo8oY'; // 🔐 Replace with your actual Gemini API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!result) {
            console.error("Unexpected API response format:", data);
            throw new Error("Unexpected API response format");
        }

        return result;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

// Construct the AI prompt based on user inputs
function constructPrompt(topic, wordCount, type) {
    return `Generate a ${type} on the topic "${topic}". It should be approximately ${wordCount} words. Format it appropriately for a student reader. Make it engaging and clear.`;
}

// Show and hide loading indicator
function showLoadingIndicator() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loading').style.display = 'none';
}

// Handle generation process
async function generateContent() {
    const topic = document.getElementById('topic').value.trim();
    const wordCount = document.getElementById('wordCount').value;
    const type = document.getElementById('type').value;
    const output = document.getElementById('output');

    if (!topic) {
        alert("Please enter a topic.");
        return;
    }

    showLoadingIndicator();
    output.innerHTML = '';

    const prompt = constructPrompt(topic, wordCount, type);

    try {
        const result = await callGeminiAPI(prompt);
        output.innerHTML = `<strong>Generated ${capitalize(type)}:</strong><br><br>` + result;
    } catch (error) {
        output.innerHTML = "❌ Failed to generate content. Please try again later.";
    } finally {
        hideLoadingIndicator();
    }
}

// Capitalize helper
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add event listener if using a form (optional)
document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.querySelector('button');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateContent);
    }
});
