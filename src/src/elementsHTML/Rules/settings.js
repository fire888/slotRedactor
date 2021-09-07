export const createLanguagePage = gameContext => {
    const locale = gameContext.components.locale

    const content = document.createElement('div')

    const title = document.createElement('div')
    title.classList.add('rules-title')
    title.innerText = locale.getRulesPhrase('Language')
    content.appendChild(title)

    const bodyContent = document.createElement('div')
    bodyContent.classList.add('rules-body')
    content.appendChild(bodyContent)

    const table = document.createElement('div')
    table.classList.add('lang-wrapper')
    bodyContent.appendChild(table)

    const buttEn = document.createElement('div')
    buttEn.classList.add('settings-button')
    buttEn.classList.add('butt-lang-en')
    table.appendChild(buttEn)

    const buttRu = document.createElement('div')
    buttRu.classList.add('settings-button')
    buttRu.classList.add('butt-lang-ru')
    table.appendChild(buttRu)

    return {
        content,
        title,
        buttEn,
        buttRu,
    }
}



export const createVolumePage = (gameContext, config) => {
    const locale = gameContext.components.locale

    let audio_vals = {}

    if (config.config.AUDIO_VAL_FOR_RULE_CONFIG) {
        const s = config.config.AUDIO_VAL_FOR_RULE_CONFIG
        audio_vals['allVolume'] = (localStorage.hasOwnProperty(APP_NAME + 'allVolume') && localStorage.getItem(APP_NAME + 'allVolume')) || s['allVolume']
        audio_vals['gameSound'] = (localStorage.hasOwnProperty(APP_NAME + 'gameSound') && localStorage.getItem(APP_NAME + 'gameSound')) || s['gameSound']
        audio_vals['controlsSound'] = (localStorage.hasOwnProperty(APP_NAME + 'controlsSound') && localStorage.getItem(APP_NAME + 'controlsSound')) || s['controlsSound']
        audio_vals['backSound'] = (localStorage.hasOwnProperty(APP_NAME + 'backSound') && localStorage.getItem(APP_NAME + 'backSound')) || s['backSound']
    }

    const content = document.createElement('div')

    const title = document.createElement('div')
    title.classList.add('rules-title')
    title.innerText = locale.getRulesPhrase('Volume')
    content.appendChild(title)

    const bodyContent = document.createElement('div')
    bodyContent.classList.add('rules-body')
    bodyContent.classList.add('volume-wrapper')
    content.appendChild(bodyContent)

    const allVolums = createInput(locale.getRulesPhrase('All volume'), 0, 1, 0.05, audio_vals.allVolume)
    bodyContent.appendChild(allVolums.container)

    const backVolums = createInput(locale.getRulesPhrase('Background volume'), 0, 1, 0.05, audio_vals.backSound)
    bodyContent.appendChild(backVolums.container)

    const gameVolums = createInput(locale.getRulesPhrase('Game volume'), 0, 1, 0.05, audio_vals.gameSound)
    bodyContent.appendChild(gameVolums.container)

    const controlsVolums = createInput(locale.getRulesPhrase('Controls volume'), 0, 1, 0.05, audio_vals.controlsSound)
    bodyContent.appendChild(controlsVolums.container)

    return { 
        content,
        title,
        allVolums,
        gameVolums,
        backVolums,
        controlsVolums,
    } 
}


const createInput = (titleText, min, max, step, value) => {
    const container = document.createElement('div')
    container.classList.add('item-volume') 

    const title = document.createElement('div')
    title.innerText = titleText
    container.appendChild(title)

    const range = document.createElement('input')
    range.classList.add('range')
    range.type = 'range'
    range.min = min
    range.max = max
    range.step = step
    range.value = value

    container.appendChild(range)

    return { title, range, container }
}