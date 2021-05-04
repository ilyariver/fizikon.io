'use strict'

const openNavMenu = () => {
    const headerNav = document.querySelector('.js-header-nav-list')
    document.addEventListener('click', e => {
        const target = e.target
        if (!target.closest('.js-header-nav')) {
             headerNav.classList.remove('open')
        }
        if (target.classList.contains('js-nav-burger')) {
            headerNav.classList.toggle('open')
        }
    })
}
openNavMenu()
