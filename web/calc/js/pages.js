class PagesManager {
    constructor(parameters) {
        
    }

    pageSwitch(pgid) {
        const navButtons = document.querySelectorAll('.bdown');
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        // Switch to pcoop page
        let btId = pgid;
        btId += '-btn';
        let pageId = 'p';
        pageId += pgid;
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(btId)?.classList.add('active');
        document.getElementById(pageId)?.classList.add('active');
        localStorage.setItem('page', pgid)
    }
}

// Создаем глобальный экземпляр менеджера после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация PagesManager...');
    window.PagesManager = new PagesManager();
    console.log('PagesManager инициализирован:', window.PagesManager);
    window.PagesManager.pageSwitch(localStorage.getItem('page'));
});
