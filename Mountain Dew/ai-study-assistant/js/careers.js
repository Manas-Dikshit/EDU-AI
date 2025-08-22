// Function to call the Gemini API
async function callGeminiAPI(prompt) {
    const apiKey = 'AIzaSyC_1HJbHryk0t9mwRSEJnlhjYDIzSuo8oY'; // IMPORTANT: Move this to a secure backend in production!
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (result) {
            return result;
        } else {
            console.error("Unexpected API response format:", data);
            throw new Error("Unexpected API response format");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

// Function to generate structured career guidance
async function getCareerGuidance(academicLevel, favoriteHobby, strangePoints) {
    const prompt = `
Based on the following inputs, suggest 3–5 suitable career paths with this format:

- **Career Title**
  - **Why it's a good fit**: [Brief explanation]
  - **Steps to get started**: [Actionable steps for the student]
  - **Skills needed**: [Key skills required]
  - **Confidence score**: [From 1 to 10]

Inputs:
- Academic Level: ${academicLevel}
- Favorite Hobby: ${favoriteHobby}
- Unique Strengths/Interests: ${strangePoints}

Be concise, clear, and provide varied options without overlap.
`;

    try {
        const guidance = await callGeminiAPI(prompt);
        return guidance;
    } catch (error) {
        console.error("Error generating career guidance:", error);
        return "⚠️ Could not generate career guidance at this time. Please try again later.";
    }
}

// Show loading indicator
function showLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'block';
}

// Hide loading indicator
function hideLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'none';
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function () {
    const careerForm = document.getElementById('career-form');

    careerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const academicLevel = document.getElementById('academic-level').value;
        const favoriteHobby = document.getElementById('favorite-hobby').value.trim();
        const strangePoints = document.getElementById('strange-points').value.trim();

        if (!academicLevel || !favoriteHobby || !strangePoints) {
            alert("Please fill out all fields.");
            return;
        }

        showLoadingIndicator();

        try {
            const guidance = await getCareerGuidance(academicLevel, favoriteHobby, strangePoints);

            // Save the result and timestamp to localStorage
            const timestamp = new Date().toLocaleString();
            localStorage.setItem('careerGuidance', guidance);
            localStorage.setItem('careerGuidanceTime', timestamp);

            // Redirect to results page
            window.location.href = 'career-result.html';
        } catch (error) {
            alert("An error occurred while fetching career guidance.");
        } finally {
            hideLoadingIndicator();
        }
    });
});
