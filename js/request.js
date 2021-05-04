const requestURL = 'https://krapipl.imumk.ru:8443/api/mobilev1/update'

const courseList = document.querySelector('.js-section-courses')
const switchPaymentMethod = document.querySelector('.js-payment-switch')
const selections = document.querySelector('.js-selections')

function sendRequest(method, url, body) {
    const headers = {
        'Content-Type': 'application/json'
    }

    return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: headers        
    }).then(response => {
        if (response.ok) {
            return response.json()
        }
        return response.json().then(error => {
            const err = new Error('Что-то пошло не так')
            err.data = error
            throw err
        })
    })
}

const requestBody = { "data": "" }

const courseItemDOMElement = (data, pay = null) =>
`
    <li class="section-courses__item js-course-item">
        <article class="section-courses__article">
            <figure class="section-courses__figure">
                <img src="https://www.imumk.ru/svc/coursecover/${data.courseId}" alt="обложка курса" class="section-courses__img">
                <figcaption class="section-courses__figcaption">
                    <div class="section-courses__about js-about-courses">
                        <h3 class="section-courses__title">${data.subject}</h3>
                        <p class="section-courses__grade js-courses-grade-text">${ renderStages(data.grade) ?? data.grade } класс</p>
                        <p class="section-courses__genre js-courses-genre-text">${data.genre}</p>
                    </div>
                    <div class="section-courses__more">
                        <a href="${data.shopUrl}" class="section-courses__more-link" target="_blank">Подробнее</a>
                    </div>
                    ${data.status !== '' ?
                    `<a href="#" class="section-courses__price-btn js-method-payment">
                        <span>${pay}</span>
                        <span>&ensp;руб.</span>
                    </a>` : `<span style="font-size:21px;">&nbsp;</span>`}
                </figcaption>
            </figure>
        </article>
    </li>
`

const showMessageIfEmptyList = () => {
    const messageEmptyCourses = document.querySelector('.js-empty-courses')

    if (!courseList.children.length) {
        messageEmptyCourses.classList.add('show')
        switchPaymentMethod.classList.add('hidden')
    }
    if (courseList.children.length !== 0) {
        messageEmptyCourses.classList.remove('show')
        switchPaymentMethod.classList.remove('hidden')
    }
}

const removeAllItems = () => {
    document.querySelectorAll('.js-course-item').forEach(item => item.remove())
}

const clearFields = (target) => {
    for (let field of selections.children) {
        if (target.value !== field.value) {
            field.value = ''
        }
    }
}

sendRequest('POST', requestURL, requestBody)
    .then(data => {

        selections.onchange = e => {
            const target = e.target

            for (let field of selections.children) {
                if(field.value === '') {
                    clearCoursesList()
                }
            }
            const schoolSubjectSelectField = selections.children[0]
            const genreSelectField = selections.children[1]
            const gradeSelectField = selections.children[2]

            if (schoolSubjectSelectField.value && schoolSubjectSelectField === target) {
                clearFields(target)
                clearCoursesList()
                const cardsItemTitle = document.querySelectorAll('.js-section-courses li h3')
                return searchRender(cardsItemTitle, target)
            }
            if (genreSelectField.value && genreSelectField === target) {
                clearFields(target)
                clearCoursesList()
                const cardsItemGenre = document.querySelectorAll('.js-section-courses li .js-courses-genre-text')
                searchRender(cardsItemGenre, target)
            }
            if (gradeSelectField.value && gradeSelectField === target) {
                clearFields(target)
                clearCoursesList()
                const cardsItemGrade = document.querySelectorAll('.js-section-courses li .js-courses-grade-text')
                return searchRender(cardsItemGrade, target)
            }
        }

        const clearCoursesList = () => {
            let counter = 0
            if (courseItemsData.length === courseList.children.length) { return }
            for (let i = 0; i < selections.children.length; i++) {
                if (selections.children[i].value) {
                    counter++
                }
            }
            if (counter > 1) {
                return
            }
            removeAllItems()
            renderHTMLToDOM(courseItemsData)
        }


        const courseItemsData = data.items

        const switchRubBtn = document.querySelector('.js-switch-rub')
        const switchBonusBtn = document.querySelector('.js-switch-bonus')

        toggleColorButton(switchRubBtn, switchBonusBtn)

        if (!courseList.children.length) {
            renderHTMLToDOM(courseItemsData)
        }

        const searchRender = (textElement, target) => {
            for (let item of textElement) {
                if (target.value !== '') {
                    if (target.value !== item.innerText && parseInt(item.innerText) !== +target.value) {
                        item.closest('.js-course-item').remove()
                    }
                } else {
                    if (courseList.children.length) { break }
                    renderHTMLToDOM(courseItemsData)
                }
                showMessageIfEmptyList()
            }
        }

    })
    .catch(err => console.log(err))

const renderHTMLToDOM = (courseItemsData) => {
    const switchRubBtn = document.querySelector('.js-switch-rub')
    const switchBonusBtn = document.querySelector('.js-switch-bonus')

    for (let item of courseItemsData) {
        const renderHTMLItems = courseItemDOMElement(item, item.price)

        courseList.innerHTML += renderHTMLItems

        switchPaymentMethod.addEventListener('click', e => {
            const target = e.target
            const dataSetPay = target.dataset.pay

            if (dataSetPay === 'rub') {
                toggleColorButton(switchRubBtn, switchBonusBtn)
                addNewPayment(dataSetPay, item.price)
            }
            if (dataSetPay === 'bonus') {
                toggleColorButton(switchBonusBtn, switchRubBtn)
                addNewPayment(dataSetPay, item.priceBonus)
            }
        })
    }
}

const renderStages = (data) => {
    const stagesArray = data.split(';')

    if (stagesArray.length < 2) { return }
    return  stagesArray[0] + '-' + stagesArray[stagesArray.length -1]
}

const addNewPayment = (item, methodPay) => {
    const payment = document.querySelectorAll('.js-method-payment')

    for (let elem of payment) {
        elem.innerHTML = `
            <span>${methodPay}</span>
            ${item === 'rub' ? `<span>&ensp;руб.</span>` : `<span>&ensp;бонусов</span>`}
        `
    }
}

const toggleColorButton = (onStyle, offStyle) => {
    onStyle.classList.add('active')
    offStyle.classList.remove('active')
}

