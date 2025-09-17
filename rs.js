// ==UserScript==
// @name         Linkify homeTaskItem
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Ищет в элементах с классом "homeTaskItem" текстовые http/https ссылки и заменяет их на <a> теги.
// @author       Ты
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Регулярное выражение для ссылок (чаще всего корректно)
    const urlRegex = /https?:\/\/[^\s<>"'`]+/gi;

    // Создаёт элемент <a> из найденной строки ссылки
    function makeLinkNode(url) {
        const a = document.createElement('a');
        a.href = url;
        a.textContent = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        return a;
    }

    // Обрабатывает один текстовый узел: заменяет все ссылки в нём на узлы <a>
    function replaceLinksInTextNode(textNode) {
        const text = textNode.nodeValue;
        if (!text || !urlRegex.test(text)) return;

        // Восстановим regex (т.к. тест сдвигает флаг)
        urlRegex.lastIndex = 0;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        while ((match = urlRegex.exec(text)) !== null) {
            const url = match[0];
            const idx = match.index;

            // текст до ссылки
            if (idx > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, idx)));
            }

            // сам линк
            frag.appendChild(makeLinkNode(url));

            lastIndex = idx + url.length;
        }

        // остаток текста
        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        // заменяем текстовый узел на фрагмент
        textNode.parentNode.replaceChild(frag, textNode);
    }

    // Обрабатываем конкретный элемент .homeTaskItem: только текстовые узлы (не затрагиваем уже существующие <a>)
    function processHomeTaskItem(el) {
        // Если в элементе нет потенциальной ссылки — быстро выходим
        if (!el.textContent || !/https?:\/\//i.test(el.textContent)) return;

        // Создаём TreeWalker, который возвращает только текстовые узлы,
        // но пропускает текст внутри существующих <a>
        const walker = document.createTreeWalker(
            el,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // если предок — <a>, пропускаем
                    for (let p = node.parentNode; p && p !== el; p = p.parentNode) {
                        if (p.nodeType === 1 && p.tagName.toLowerCase() === 'a') {
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                    // принимаем текстовый узел
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const textNodes = [];
        let tn;
        while ((tn = walker.nextNode())) {
            textNodes.push(tn);
        }

        textNodes.forEach(replaceLinksInTextNode);
    }

    // Найти все текущие элементы и обработать их
    function scanAndProcessAll() {
        document.querySelectorAll('.homeTaskItem').forEach(processHomeTaskItem);
    }

    // Следим за динамически добавленным контентом (например, SPA)
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            // новые элементы
            if (m.addedNodes && m.addedNodes.length) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    // если добавлен сам .homeTaskItem или внутри него есть такие элементы
                    if (node.classList && node.classList.contains('homeTaskItem')) {
                        processHomeTaskItem(node);
                    } else {
                        node.querySelectorAll && node.querySelectorAll('.homeTaskItem').forEach(processHomeTaskItem);
                    }
                });
            }
            // если изменился текст внутри существующего .homeTaskItem
            if (m.type === 'characterData' && m.target) {
                // ищем ближайший предок с нужным классом
                let parent = m.target.parentNode;
                while (parent && parent !== document.body) {
                    if (parent.classList && parent.classList.contains('homeTaskItem')) {
                        processHomeTaskItem(parent);
                        break;
                    }
                    parent = parent.parentNode;
                }
            }
        }
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // стартовый проход
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanAndProcessAll);
    } else {
        scanAndProcessAll();
    }
})();