document.addEventListener('DOMContentLoaded', function () {
    const guidanceResult = document.getElementById('guidance-result');
    const copyButton = document.getElementById('copy-button');

    const guidance = localStorage.getItem('careerGuidance');
    if (guidance) {
        // Display as HTML (assumes Gemini returns markdown-like or formatted output)
        guidanceResult.innerHTML = formatGuidance(guidance);
    } else {
        guidanceResult.textContent = "No guidance available. Please try again.";
    }

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(guidance || '').then(() => {
            alert("Career guidance copied to clipboard!");
        });
    });

    function formatGuidance(text) {
        const escaped = text
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>");
        return escaped.replace(/- (.*?)\:/g, '<strong>$1:</strong>');
    }
});
