document.addEventListener('DOMContentLoaded', () => {
    const periodicTable = document.getElementById('periodicTable');
    const searchInput = document.getElementById('searchInput');
    const searchLanguage = document.getElementById('searchLanguage');
    
    function isGroupB(element) {
        const col = element.position.col;
        return col >= 3 && col <= 12;
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
            
            elementDiv.addEventListener('click', () => showElementDetails(element));
            periodicTable.appendChild(elementDiv);
        });
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
            <p>Атомный номер: ${element.atomic}</p>
            <p>Атомная масса: ${element.mass}</p>
            <p>Группа: ${isGroupB(element) ? 'B (побочная)' : 'A (главная)'}</p>
            <p>Тип: ${element.isMetallic ? 'Металл' : 'Неметалл'}</p>
            ${element.valences ? `<p>Валентность: ${element.valences.join(', ')}</p>` : ''}
        `;
    }
    
    searchInput.addEventListener('input', (e) => searchElements(e.target.value));
    searchLanguage.addEventListener('change', () => {
        updateElementNames();
        searchElements(searchInput.value);
    });
    
    createPeriodicTable();
});
