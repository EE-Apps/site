document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const downloadBtn = document.getElementById('download-btn');
    const premiumBtn = document.getElementById('premium-btn');
    const modal = document.getElementById('download-modal');
    const downloadStatus = document.getElementById('download-status');
    
    // Cookie management functions
    const setCookie = (name, value, days = 365) => {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    // Premium state management
    let isPremium = false;
    let hasDownloadedOnce = getCookie('hasDownloaded') === 'true';
    let downloadedRAM = parseInt(getCookie('downloadedRAM')) || 0;

    // Get device memory
    const getDeviceMemory = () => {
        if ('deviceMemory' in navigator) {
            return navigator.deviceMemory;
        }
        
        if ('memory' in performance) {
            return Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024 * 1024));
        }
        
        return null;
    };

    const deviceRAM = getDeviceMemory();

    // Display current device RAM and downloaded RAM if available
    const heroSubtitle = document.querySelector('[data-i18n="hero.subtitle"]');
    if (deviceRAM) {
        const memoryText = i18n.t('modal.device.memory').replace('{ram}', deviceRAM);
        heroSubtitle.innerHTML = `${heroSubtitle.textContent}<br>${memoryText}`;
    }

    // Update translations for premium requirement
    if (!translations[i18n.currentLang]['modal.premium.required']) {
        translations.en['modal.premium.required'] = 'Premium required for multiple RAM downloads';
        translations.ru['modal.premium.required'] = 'Требуется премиум для многократной загрузки RAM';
        translations.ua['modal.premium.required'] = 'Потрібен преміум для багаторазового завантаження RAM';
    }

    // Simulated download function with random errors
    const simulateDownload = (isPremiumDownload = false) => {
        return new Promise((resolve, reject) => {
            if (!isPremiumDownload && hasDownloadedOnce) {
                reject(new Error(i18n.t('modal.premium.required')));
                return;
            }

            const duration = isPremiumDownload ? 
                Math.random() * 2000 + 1000 : 
                Math.random() * 4000 + 2000;

            const shouldFail = Math.random() < (isPremiumDownload ? 0.1 : 0.3);

            setTimeout(() => {
                if (shouldFail) {
                    reject(new Error(i18n.t('modal.error')));
                } else {
                    const downloadAmount = parseInt(document.getElementById('ram-amount').value);
                    downloadedRAM += downloadAmount;
                    setCookie('downloadedRAM', downloadedRAM);
                    if (!isPremiumDownload) {
                        hasDownloadedOnce = true;
                        setCookie('hasDownloaded', 'true');
                    }
                    const currentRAM = deviceRAM || 0;
                    const successMessage = i18n.t('modal.success')
                        .replace('{current}', currentRAM)
                        .replace('{downloaded}', downloadedRAM)
                        .replace('{total}', currentRAM + downloadedRAM);
                    resolve(successMessage);
                }
            }, duration);
        });
    };

    // Handle RAM download
    const handleDownload = async (isPremiumDownload = false) => {
        modal.classList.add('active');
        downloadStatus.textContent = i18n.t('modal.downloading');
        downloadStatus.classList.remove('error');

        try {
            const result = await simulateDownload(isPremiumDownload);
            downloadStatus.textContent = result;
            setTimeout(() => {
                modal.classList.remove('active');
            }, 3000);
        } catch (error) {
            downloadStatus.textContent = error.message;
            downloadStatus.classList.add('error');
            setTimeout(() => {
                modal.classList.remove('active');
            }, 3000);
        }
    };

    // Regular download button
    downloadBtn.addEventListener('click', () => {
        const ramType = document.getElementById('ram-type').value;
        const ramAmount = document.getElementById('ram-amount').value;
        console.log(`Downloading ${ramAmount}GB of ${ramType} RAM...`);
        handleDownload(isPremium);
    });

    // Premium button (simulated payment and upgrade)
    let premiumButtonClicked = false;
    premiumBtn.addEventListener('click', async () => {
        if (premiumButtonClicked) return; // Prevent multiple clicks
        premiumButtonClicked = true;

        modal.classList.add('active');
        downloadStatus.textContent = i18n.t('modal.downloading');
        downloadStatus.classList.remove('error');

        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                downloadStatus.textContent = i18n.t('premium.success');
                premiumBtn.style.display = 'none';
                isPremium = true;
                // Don't add another event listener, just update the isPremium flag
            } else {
                downloadStatus.textContent = i18n.t('premium.error');
                downloadStatus.classList.add('error');
                premiumButtonClicked = false; // Allow retry on failure
            }
            setTimeout(() => {
                modal.classList.remove('active');
            }, 2000);
        }, 2000);
    });

    // Close modal on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Theme switching
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
});