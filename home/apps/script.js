// Пример JavaScript-кода, если вам нужно добавить интерактивные функции
document.addEventListener("DOMContentLoaded", function() {
    console.log("Список приложений загружен.");
    // Дополнительные функции можно добавить по мере необходимости
});

// Function to toggle between light and dark themes
function toggleTheme() {
    document.body.classList.toggle("dark");
    const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
}

// Event listener for messages
window.addEventListener('message', (event) => {
    if (event.data.type === 'themeChanged') {
        if (event.data.theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }
});

// Initial theme setup based on parent window's theme
window.addEventListener('DOMContentLoaded', () => {
    const parentTheme = window.parent.document.body.classList.contains('dark') ? 'dark' : 'light';
    if (parentTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});


// Initial theme setup
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
    document.body.classList.add("dark");
} else {
    document.body.classList.remove("dark");
}
