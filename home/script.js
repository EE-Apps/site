console.log("2024-11-24-18-45")
const searchEngines = {
    google: {
        url: "https://www.google.com/search?q=",
        assistant: { url: "https://gemini.google.com/", icon: "./icons/gemini.svg" }
    },
    bing: {
        url: "https://www.bing.com/search?q=",
        assistant: { url: "https://copilot.microsoft.com/", icon: "./icons/copilot.svg" }
    },
    yandex: {
        url: "https://yandex.com/search/?text=",
        assistant: { url: "https://alice.yandex.ru/", icon: "./icons/alice.svg" }
    }
};

const searchEngineSelect = document.getElementById("search-engine-select");
const assistantBtn = document.getElementById("assistant-btn");
const assistantIcon = document.getElementById("assistant-icon");
const themeToggle = document.getElementById("theme-toggle");
const iframeWrapper = document.getElementById("iframe-wrapper");
const iframeDisplay = document.getElementById("iframe-display");

document.addEventListener("DOMContentLoaded", () => {
    // Retrieve and apply saved search engine settings
    const savedEngine = localStorage.getItem("searchEngine");
    if (savedEngine) {
        searchEngineSelect.value = savedEngine;
    }
    updateSearchSettings();

    // Apply saved theme (light or dark)
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
});

// Event listeners
searchEngineSelect.addEventListener("change", updateSearchSettings);
assistantBtn.addEventListener("click", () => window.open(getAssistantUrl(), "_blank"));
themeToggle.addEventListener("click", toggleTheme);

// Update search engine and assistant settings
function updateSearchSettings() {
    const engine = searchEngineSelect.value;
    const engineData = searchEngines[engine];

    // Store selected search engine in localStorage
    localStorage.setItem("searchEngine", engine);
    assistantIcon.src = engineData.assistant.icon;
}

// Get the assistant URL based on the selected engine
function getAssistantUrl() {
    const engine = searchEngineSelect.value;
    return searchEngines[engine].assistant.url;
}

// Add event listener for app buttons to load iframe content
document.querySelectorAll(".app-btn").forEach(button => {
    button.addEventListener("click", (event) => {
        const company = event.target.closest(".app-btn").dataset.company;
        loadIframe(company);
    });
});

// Function to load iframe
function loadIframe(company) {
    const src = `apps/${company}.html`;

    if (iframeDisplay.src.includes(src)) {
        // Hide iframe if it's already showing the same content
        iframeWrapper.style.display = 'none';
        iframeDisplay.src = '';
    } else {
        // Show and load iframe with new content
        iframeWrapper.style.display = 'block';
        iframeDisplay.src = src;
    }
}

// Toggle between light and dark themes
function toggleTheme() {
    document.body.classList.toggle("dark");
    const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
}
