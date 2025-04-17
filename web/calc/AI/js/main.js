document.addEventListener('DOMContentLoaded', () => {
    // Навигация между страницами
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    let currentPageIndex = 0;

    // Обработка кликов по кнопкам навигации
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            switchToPage(index);
        });
    });

    // Функция переключения страниц
    function switchToPage(newIndex) {
        if (newIndex === currentPageIndex) return;

        const direction = newIndex > currentPageIndex ? 1 : -1;
        
        pages[currentPageIndex].style.transform = `translateX(${-100 * direction}%)`;
        pages[newIndex].style.transform = 'translateX(0)';

        navButtons[currentPageIndex].classList.remove('active');
        navButtons[newIndex].classList.add('active');

        // Сбрасываем стили для неактивных страниц
        pages.forEach((page, i) => {
            if (i !== currentPageIndex && i !== newIndex) {
                page.style.transform = `translateX(${100 * direction}%)`;
            }
        });

        currentPageIndex = newIndex;
    }

    // Обработка свайпов
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const minSwipeDistance = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) < minSwipeDistance) return;

        if (swipeDistance > 0 && currentPageIndex > 0) {
            // Свайп вправо
            switchToPage(currentPageIndex - 1);
        } else if (swipeDistance < 0 && currentPageIndex < pages.length - 1) {
            // Свайп влево
            switchToPage(currentPageIndex + 1);
        }
    }
}); 