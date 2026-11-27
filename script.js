
/* =====================================
   1. GET HTML ELEMENTS
===================================== */

const promptInput = document.getElementById("promptInput");

const checkBtn = document.getElementById("checkBtn");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");

const scoreElement = document.getElementById("score");
const ratingElement = document.getElementById("rating");
const ratingDescription = document.getElementById("ratingDescription");

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

const componentResults = document.getElementById("componentResults");
const suggestionsElement = document.getElementById("suggestions");

const errorMessage = document.getElementById("errorMessage");
const wordCount = document.getElementById("wordCount");

const scoreCircle = document.querySelector(".score-circle");


/* =====================================
   2. COMPONENT KEYWORDS
===================================== */

// Each component has a list of keywords.
// The prompt is converted to lowercase so
// detection is case-insensitive.

const components = {

    Role: {
        keywords: [
            "act as",
            "you are",
            "role",
            "expert",
            "teacher",
            "developer",
            "designer",
            "professional",
            "specialist",
            "assume the role"
        ],

        suggestion:
            "Add a clear role. Example: 'Act as an experienced teacher' or 'You are a professional web developer'."
    },

    Task: {
        keywords: [
            "explain",
            "write",
            "create",
            "generate",
            "develop",
            "design",
            "analyze",
            "summarize",
            "describe",
            "compare",
            "build",
            "prepare",
            "solve",
            "evaluate"
        ],

        suggestion:
            "Clearly mention what you want the AI to do. Example: 'Explain artificial intelligence' or 'Create a student management system'."
    },

    Context: {
        keywords: [
            "context",
            "background",
            "college students",
            "students",
            "beginners",
            "for example",
            "purpose",
            "audience",
            "scenario",
            "for my project",
            "for my assignment",
            "university",
            "real-world"
        ],

        suggestion:
            "Provide background information. Explain the purpose, target audience, or situation. Example: 'This is for first-year college students'."
    },

    Constraints: {
        keywords: [
            "limit",
            "maximum",
            "minimum",
            "within",
            "under",
            "less than",
            "more than",
            "must",
            "should",
            "avoid",
            "do not",
            "don't",
            "only",
            "without",
            "no more than",
            "at least"
        ],

        suggestion:
            "Add specific restrictions or requirements. Example: 'Keep the explanation under 300 words' or 'Use simple language'."
    },

    "Output Format": {
        keywords: [
            "bullet points",
            "bullet point",
            "table",
            "list",
            "paragraph",
            "format",
            "headings",
            "steps",
            "numbered",
            "json",
            "markdown",
            "code",
            "report",
            "in points",
            "structured"
        ],

        suggestion:
            "Specify how the answer should look. Example: 'Present the answer in bullet points' or 'Create a comparison table'."
    }

};


/* =====================================
   3. SAMPLE PROMPT
===================================== */

const samplePrompt = `Act as an experienced computer science teacher.

Explain Artificial Intelligence to first-year college students.

The purpose is to help beginners understand AI and its real-world applications.

Use simple language and keep the explanation under 300 words. Avoid complicated technical terms.

Present the answer using headings and bullet points with suitable examples.`;


/* =====================================
   4. WORD COUNTER
===================================== */

promptInput.addEventListener("input", function () {

    const text = promptInput.value.trim();

    const words = text === ""
        ? 0
        : text.split(/\s+/).length;

    wordCount.textContent = words + " words";

    // Hide the error message when user starts typing.
    errorMessage.classList.remove("show");

});


/* =====================================
   5. CHECK PROMPT FUNCTION
===================================== */

function checkPrompt() {

    const prompt = promptInput.value.trim();

    // Validate empty input.
    if (prompt === "") {

        errorMessage.textContent =
            "Please enter a prompt before checking.";

        errorMessage.classList.add("show");

        promptInput.focus();

        return;
    }

    errorMessage.classList.remove("show");

    // Convert text into lowercase for
    // case-insensitive keyword detection.
    const lowerPrompt = prompt.toLowerCase();

    let totalScore = 0;

    let detectedCount = 0;

    let resultsHTML = "";

    let suggestionsHTML = "";

    // Check all five components.
    for (const component in components) {

        const keywords = components[component].keywords;

        // Check whether at least one keyword exists.
        const isDetected = keywords.some(keyword =>
            lowerPrompt.includes(keyword.toLowerCase())
        );

        if (isDetected) {

            totalScore += 20;

            detectedCount++;

            resultsHTML += `
                <div class="component-item">
                    <span>${getIcon(component)} ${component}</span>

                    <span class="status success">
                        ✓ Detected (+20)
                    </span>
                </div>
            `;

        } else {

            resultsHTML += `
                <div class="component-item">
                    <span>${getIcon(component)} ${component}</span>

                    <span class="status missing">
                        ✕ Missing (0)
                    </span>
                </div>
            `;

            // Add improvement suggestion.
            suggestionsHTML += `
                <li>
                    <strong>${component}:</strong>
                    ${components[component].suggestion}
                </li>
            `;

        }

    }


    /* =====================================
       6. DISPLAY COMPONENT RESULTS
    ===================================== */

    componentResults.innerHTML = resultsHTML;


    /* =====================================
       7. DISPLAY TOTAL SCORE
    ===================================== */

    scoreElement.textContent = totalScore;

    // Update progress bar.
    progressBar.style.width = totalScore + "%";

    progressPercent.textContent = totalScore + "%";

    // Update circular score indicator.
    const circleDegrees = totalScore * 3.6;

    scoreCircle.style.background =
        `conic-gradient(
            #6657e8 ${circleDegrees}deg,
            #e9e9f5 ${circleDegrees}deg
        )`;


    /* =====================================
       8. DISPLAY PERFORMANCE RATING
    ===================================== */

    let rating = "";
    let description = "";

    if (totalScore === 100) {

        rating = "Excellent! 🏆";
        description = "Outstanding! Your prompt contains all five components.";

    } else if (totalScore === 80) {

        rating = "Very Good! 🌟";
        description = "Great work! Just one component is missing.";

    } else if (totalScore === 60) {

        rating = "Good! 👍";
        description = "Good attempt! Improve the missing components.";

    } else if (totalScore === 40) {

        rating = "Average! 💪";
        description = "Your prompt needs more details and structure.";

    } else {

        rating = "Needs Improvement! 📚";
        description = "Keep practicing! Add more essential prompt components.";

    }

    ratingElement.textContent = rating;

    ratingDescription.textContent = description;


    /* =====================================
       9. DISPLAY SUGGESTIONS
    ===================================== */

    if (suggestionsHTML === "") {

        suggestionsElement.innerHTML = `
            <li>
                🎉 Excellent! All five components
                are detected. Your prompt is well structured.
            </li>
        `;

    } else {

        suggestionsElement.innerHTML = suggestionsHTML;

    }

}


/* =====================================
   10. GET COMPONENT ICON
===================================== */

function getIcon(component) {

    const icons = {
        "Role": "👤",
        "Task": "🎯",
        "Context": "📚",
        "Constraints": "⚙️",
        "Output Format": "📄"
    };

    return icons[component];

}


/* =====================================
   11. LOAD SAMPLE PROMPT
===================================== */

function loadSample() {

    promptInput.value = samplePrompt;

    // Update word count.
    const words = samplePrompt.trim().split(/\s+/).length;

    wordCount.textContent = words + " words";

    errorMessage.classList.remove("show");

    // Automatically analyze the sample.
    checkPrompt();

}


/* =====================================
   12. CLEAR ALL RESULTS
===================================== */

function clearAll() {

    // Clear text area.
    promptInput.value = "";

    // Reset word count.
    wordCount.textContent = "0 words";

    // Reset score.
    scoreElement.textContent = "0";

    // Reset rating.
    ratingElement.textContent = "Not Evaluated";

    ratingDescription.textContent =
        "Your prompt score will appear here.";

    // Reset progress bar.
    progressBar.style.width = "0%";

    progressPercent.textContent = "0%";

    // Reset circular score.
    scoreCircle.style.background =
        "conic-gradient(#6657e8 0deg, #e9e9f5 0deg)";

    // Reset component results.
    componentResults.innerHTML = `
        <div class="component-item">
            <span>👤 Role</span>
            <span class="status neutral">Not checked</span>
        </div>

        <div class="component-item">
            <span>🎯 Task</span>
            <span class="status neutral">Not checked</span>
        </div>

        <div class="component-item">
            <span>📚 Context</span>
            <span class="status neutral">Not checked</span>
        </div>

        <div class="component-item">
            <span>⚙️ Constraints</span>
            <span class="status neutral">Not checked</span>
        </div>

        <div class="component-item">
            <span>📄 Output Format</span>
            <span class="status neutral">Not checked</span>
        </div>
    `;

    // Reset suggestions.
    suggestionsElement.innerHTML = `
        <li>Enter a prompt to receive suggestions.</li>
    `;

    // Hide error.
    errorMessage.classList.remove("show");

}


/* =====================================
   13. BUTTON EVENT LISTENERS
===================================== */

checkBtn.addEventListener("click", checkPrompt);

sampleBtn.addEventListener("click", loadSample);

clearBtn.addEventListener("click", clearAll);
