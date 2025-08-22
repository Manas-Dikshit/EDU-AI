// Function to call the Gemini API with a prompt and return the generated content.
async function callGeminiAPI(prompt) {
    const apiKey = 'AIzaSyC_1HJbHryk0t9mwRSEJnlhjYDIzSuo8oY'; // Your API Key
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (
            data &&
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            data.candidates[0].content.parts[0].text
        ) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected API response format:", data);
            throw new Error("Unexpected API response format");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

// When DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const equationsInput = document.getElementById('equations');
    const variableInput = document.getElementById('variable');
    const showProcessCheckbox = document.getElementById('showProcess');
    const solveBtn = document.getElementById('solveBtn');
    const resultEl = document.getElementById('result');

    solveBtn.addEventListener('click', async () => {
        const equationsRaw = equationsInput.value.trim();
        const variable = variableInput.value.trim();
        const showProcess = showProcessCheckbox.checked;

        if (!equationsRaw) {
            resultEl.textContent = 'Please enter at least one equation.';
            return;
        }
        if (!variable) {
            resultEl.textContent = 'Please specify the variable to solve for.';
            return;
        }

        const equationsList = equationsRaw
            .split('\n')
            .map(eq => eq.trim())
            .filter(eq => eq !== '');

        let prompt = `Solve the following system of equations simultaneously for the variable "${variable}":\n`;
        equationsList.forEach((eq, i) => {
            prompt += `${i + 1}. ${eq}\n`;
        });
        prompt += `\nProvide the solution${showProcess ? " along with the detailed solving process" : ""}.`;

        resultEl.textContent = 'Solving equations, please wait...';

        try {
            const solutionText = await callGeminiAPI(prompt);
            resultEl.textContent = solutionText.trim();
        } catch (error) {
            resultEl.textContent = 'Error: Could not process your request. Please try again later.';
        }
    });
});
