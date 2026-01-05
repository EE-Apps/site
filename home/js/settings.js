document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.hideSettSection').forEach(button => {
        const sectionId = button.getAttribute('data-section');
        const sectionDiv = document.getElementById(sectionId);
        sectionDiv.style.height = sectionDiv.scrollHeight + 'px';
        button.querySelector('img').style.rotate = '-90deg';

        button.addEventListener('click', () => {
            if (sectionDiv.style.height === '0px') {
                sectionDiv.style.height = sectionDiv.scrollHeight + 'px';
                button.querySelector('img').style.rotate = '0deg';
            } else {
                sectionDiv.style.height = '0px';
                button.querySelector('img').style.rotate = '-90deg';
            }
        });
    });

});

function twoPages() {
    document.body.classList.toggle('twoPages');
    if (document.body.classList.contains('twoPages')) {
        document.querySelectorAll('.main-content').forEach(page => {
            page.classList.remove('active');
            page.classList.add('active');
        });
    } else {
        document.querySelectorAll('.main-content').forEach((page, index) => {
            if (index === 1) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }
};

document.getElementById('twoBtn-settings').addEventListener('click', twoPages);