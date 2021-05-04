const inputSearch = document.querySelector('.js-search-input')

const removeAllHideClasses = () => {
    for (let child of courseList.children) {
        child.classList.remove('hide')
    }
}

inputSearch.oninput = () => {
    const inputTextValue = inputSearch.value.toLowerCase().trim()
    const cardsItem = document.querySelectorAll('.js-about-courses h3')
    const formSelect = document.querySelectorAll('select')

    formSelect.forEach(select => select.value = '')

    if (inputTextValue !== '') {
        removeAllHideClasses()
        cardsItem.forEach(listItem => {
            const searchObjectsNameToLowerCase = listItem.innerText.toLowerCase().trim()
            const searchLetters = searchObjectsNameToLowerCase.search(inputTextValue === '?' ? '-1' : inputTextValue)
            const WRONG_SEARCH_LETTER = -1

            if (searchLetters === WRONG_SEARCH_LETTER) {
                listItem.closest('.js-course-item').classList.add('hide')
                listItem.innerHTML = listItem.innerText

            } else {
                listItem.classList.remove('hide')
                const string = listItem.innerText
                listItem.innerHTML = insertMark(string, searchLetters, inputTextValue.length)
            }
        })
    } else {
        cardsItem.forEach(listItem => {
            listItem.closest('.js-course-item').classList.remove('hide')
            listItem.innerHTML = listItem.innerText
        })
    }
}

const insertMark = (string, position, length) => {
    return `${string.slice(0, position)}<mark>${string.slice(position, position + length)}</mark>${string.slice(position + length)}`
}
