document.addEventListener('DOMContentLoaded', () => {
    const periodicTable = document.getElementById('periodicTable');
    const searchInput = document.getElementById('searchInput');
    const searchLanguage = document.getElementById('searchLanguage');
    const colorScheme = document.getElementById('colorScheme');
    
    // Restore saved language
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        searchLanguage.value = savedLanguage;
    }

    // Restore saved color scheme
    const savedColorScheme = localStorage.getItem('preferredColorScheme') || 'default';
    colorScheme.value = savedColorScheme;
    
    function isGroupB(element) {
        const col = element.position.col;
        return col >= 3 && col <= 12;
    }
    
    function determineBlock(element) {
        const col = element.position.col;
        if (col <= 2) return 's-block';
        if (col >= 13) return 'p-block';
        if (col >= 3 && col <= 12) return 'd-block';
        return 'f-block';
    }
    
    function formatValences(valences, group) {
        if (!valences || valences.length === 0) return '';
        return `<div class="valences" style="display: flex; ${group === 'a' ? 'flex-direction: row' : 'flex-direction: row-reverse'}">${valences.join(', ')}</div>`;
    }
    
    function createPeriodicTable() {
        elements.forEach(element => {
            const elementDiv = document.createElement('div');
            elementDiv.className = `element ${element.group === 'a' ? 'group-a' : 'group-b'}`;
            
            elementDiv.style.gridRow = element.position.row;
            elementDiv.style.gridColumn = element.position.col;
            
            elementDiv.innerHTML = `
                <div class="card-up" style="${element.group === 'a' ? 'flex-direction: row' : 'flex-direction: row-reverse'}">
                    <div class="card-up-half ${element.group === 'a' ? 'group-a' : 'group-b'}">
                        <div class="symbol">${element.symbol}</div>
                        <div class="info">
                            <div class="name" style="${element.group === 'a' ? 'flex-direction: row' : 'flex-direction: row-reverse'}">${element.names[searchLanguage.value]}</div>
                            ${formatValences(element.valences, element.group)}
                        </div>
                    </div>
                    <div class="card-up-half-2 ${element.group === 'a' ? 'gr-b' : 'gr-a'}" style="${element.group === 'a' ? 'justify-content: right;' : 'justify-content: left'}">
                        <div class="atomic">${element.atomic}</div>
                        <div class="category-indicator ${element.isMetallic ? 'metal-indicator' : 'nonmetal-indicator'}"></div>
                    </div>
                </div>
                <div class="card-down" style="display: flex; ${element.group === 'a' ? 'justify-content: right;' : 'justify-content: left'}">
                    <div class="mass">${element.mass}</div>
                </div>
            `;
            
            elementDiv._data = element; // Attach element data to the div
            elementDiv.addEventListener('click', () => showElementDetails(element));
            periodicTable.appendChild(elementDiv);
        });
        updateColorScheme(Array.from(periodicTable.children)); // Apply initial color scheme
    }
    
    function updateElementNames() {
        const lang = searchLanguage.value;
        elements.forEach((element, index) => {
            const elementDiv = periodicTable.children[index];
            const infoDiv = elementDiv.querySelector('.info');
            infoDiv.innerHTML = `
                <div class="name">${element.names[lang]}</div>
                ${formatValences(element.valences)}
            `;
        });
    }
    
    function searchElements(query) {
        const lang = searchLanguage.value;
        const searchTerm = query.toLowerCase();
        
        elements.forEach((element, index) => {
            const elementDiv = periodicTable.children[index];
            const matchesSearch = 
                element.names[lang].toLowerCase().includes(searchTerm) ||
                element.symbol.toLowerCase().includes(searchTerm) ||
                element.atomic.toString().includes(searchTerm) ||
                (element.valences && element.valences.join(' ').includes(searchTerm));
                
            elementDiv.style.opacity = matchesSearch ? '1' : '0.3';
        });
    }
    
    function showElementDetails(element) {
        const lang = searchLanguage.value;
        const details = document.getElementById('elementDetails');
        details.innerHTML = `
            <h2>${element.symbol} - ${element.names[lang]}</h2>
            <p>Atomic number: ${element.atomic}</p>
            <p>Atomic mass: ${element.mass}</p>
            <p>Group: ${isGroupB(element) ? 'B (побочная)' : 'A (главная)'}</p>
            <p>Metal?: ${element.isMetallic ? 'Металл' : 'Неметалл'}</p>
            ${element.valences ? `<p>Valence: ${element.valences.join(', ')}</p>` : ''}
            <p>Category: ${element.category}</p>
            <p>Block: ${determineBlock(element)}</p>
        `;
    }

    function updateColorScheme(elements) {
        const scheme = colorScheme.value;
        localStorage.setItem('preferredColorScheme', scheme);
        
        elements.forEach(elementDiv => {
            const element = elementDiv._data;
            elementDiv.dataset.scheme = scheme;
            
            // Remove existing scheme classes
            elementDiv.classList.remove(
                'metallic', 'nonmetallic', 
                'group-a', 'group-b', 
                's-block', 'p-block', 'd-block', 'f-block',
                'alkali-metal', 'alkaline-earth-metal', 'lanthanide', 
                'actinide', 'transition-metal', 'post-transition-metal',
                'metalloid', 'nonmetal', 'noble-gas', 'halogen'
            );
            
            // Apply new scheme classes
            switch(scheme) {
                case 'metal':
                    elementDiv.classList.add(element.isMetallic ? 'metallic' : 'nonmetallic');
                    break;
                case 'groups':
                    elementDiv.classList.add(isGroupB(element) ? 'group-b' : 'group-a');
                    break;
                case 'blocks':
                    elementDiv.classList.add(`${element.group}-block`);
                    break;
                case 'types':
                    elementDiv.classList.add(element.category);
                    break;
            }
        });
    }
    
    searchInput.addEventListener('input', (e) => searchElements(e.target.value));
    searchLanguage.addEventListener('change', () => {
        updateElementNames();
        searchElements(searchInput.value);
        localStorage.setItem('preferredLanguage', searchLanguage.value);
    });

    colorScheme.addEventListener('change', () => {
        updateColorScheme(Array.from(periodicTable.children));
        localStorage.setItem('preferredColorScheme', colorScheme.value);
    });
    
    createPeriodicTable();
});
