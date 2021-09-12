import '../../stylesheets/rulesStyle.css'
import {
    createLanguagePage,
    createVolumePage,
} from './settings'


export class Rules {
    constructor(gameContext, config) {
        this._eventEmitter = gameContext.components.eventEmitter
        this._gameContext = gameContext
        this._locale = this._gameContext.components.locale
        this._CONFIG = config.config
        this._locale.setRulesLocale(this._CONFIG.LOCALE)
        this._config = config


        this.container = document.createElement('div')
        this._gameContext.components.app.containerDOM.appendChild(this.container)

        this.container.classList.add('rules-container')
        this._CONFIG.styleRules && this._CONFIG.styleRules.className
            ? this.container.classList.add(this._CONFIG.styleRules.className)
            : this.container.classList.add('lepr')

        this.buttonClose = document.createElement('div')
        this.buttonClose.classList.add('button-close')
        this.buttonClose.addEventListener('mouseup', this.hide.bind(this))
        this.buttonClose.addEventListener('touchup', this.hide.bind(this))
        this.container.appendChild(this.buttonClose)

        this.wrapper = document.createElement('div')
        this.wrapper.classList.add('rules-wrapper')
        this.container.appendChild(this.wrapper)

        this.content = document.createElement('div')
        this.content.classList.add('rules-content')
        this.content.setAttribute("id", "paytable");

        this.wrapper.appendChild(this.content)

        this.pages = {}

        this._createPages()

        this._eventEmitter.subscribe('changeLanguage', () => {
            this.content.innerHTML = ''
            this._createPages()
        })

        this._isOpened = false
        this._gameContext.components.eventEmitter.subscribe('resizeWindow', () => {
            if (this._gameContext.data.windowData.deviceMode === 'desktop') {
                this.container.style.width = this._gameContext.data.windowData.wApp + 'px'
                this.container.style.height = this._gameContext.data.windowData.hApp + 'px'
                this.container.style.transform = `translate(0, -${this._gameContext.data.windowData.hApp + 3}px)`

                this.wrapper.style.width = this._gameContext.data.windowData.wApp + 'px'
                this.wrapper.style.height = this._gameContext.data.windowData.hApp + 'px'
            }
            //this._isOpened && this.hide()
        })
    }

    show (mode) {
        if (mode === 'info') {
            this.pages['controls'].content.classList.remove('hidden')
            this.pages['gameData'].content.classList.remove('hidden')
        }
        if (mode === 'rules') {
            this.pages['paytable-header'].content.classList.remove('hidden')
            this.pages['symbols_01'].content.classList.remove('hidden')

            for (let i = 0; i < this._CONFIG.PLAYTABLE_TWO['tables'].length; i++) {
                const key = this._CONFIG.PLAYTABLE_TWO['tables'][i]['title']
                this.pages[key].content.classList.remove('hidden')
            }

            this.pages['lines'].content.classList.remove('hidden')
        }
        if (mode === 'settings') {
            this.pages['language'].content.classList.remove('hidden')
            this.pages['volume'].content.classList.remove('hidden')
        }

        this.container.classList.add('show')
        this._isOpened = true
        this._eventEmitter.emit('openRules', null)
    }


    hide() {
        for (let key in this.pages) {
            this.pages[key].content.classList.add('hidden')
        }
        this.container.classList.remove('show')
        this._isOpened = false
        this._eventEmitter.emit('closeRules', null)
    }


    _createPages() {
        this.pages['controls'] = this._createControlsPage()
        this.pages['controls'].content.classList.add('hidden')
        this.content.appendChild(this.pages['controls'].content)

        this.pages['gameData'] = createVersion(this._gameContext)
        this.content.appendChild(this.pages['gameData'].content)

        ///////////////

        this.pages['paytable-header'] = this._createPaytableTitle();
        this.pages['paytable-header'].content.classList.add('hidden')
        this.content.appendChild(this.pages['paytable-header'].content)
        let scope = this;


        for (let i = 0; i < this._CONFIG.PLAYTABLE_TWO['tables'].length; i++) {
            const data = this._CONFIG.PLAYTABLE_TWO['tables'][i]

            const page = scope._createPlaytableInfoOfRules(data)
            page.content.classList.add('hidden')
            this.content.appendChild(page.content)
            this.pages[data['title']] = page
        }

        this.pages['symbols_01'] = this._createPaytableSymbolValues()
        this.pages['symbols_01'].content.classList.add('hidden')
        this.content.appendChild(this.pages['symbols_01'].content)


        this.pages['lines'] = this._createLinesPage()
        this.pages['lines'].content.classList.add('hidden')
        this.content.appendChild(this.pages['lines'].content)


        ////////////////

        this.pages['language'] = createLanguagePage(this._gameContext)
        this.pages['language'].content.classList.add('hidden')
        this.content.appendChild(this.pages['language'].content)
        this.pages['language'].buttEn.addEventListener('click', () => {
            this._locale.switchLanguage('en')
            this.hide()
        })
        this.pages['language'].buttRu.addEventListener('click', () => {
            this._locale.switchLanguage('ru')
            this.hide()
        })

        this.pages['volume'] = createVolumePage(this._gameContext, this._config)
        this.pages['volume'].content.classList.add('hidden')
        this.content.appendChild(this.pages['volume'].content)
        this.pages['volume'].allVolums.range.addEventListener('change', e =>
            this._eventEmitter.emit('soundVolumeChanged', {group: 'allVolume', val: e.target.value}))
        this.pages['volume'].backVolums.range.onchange = e =>
            this._eventEmitter.emit('soundVolumeChanged', {group: 'backSound', val: e.target.value})
        this.pages['volume'].gameVolums.range.onchange = e =>
            this._eventEmitter.emit('soundVolumeChanged', {group: 'gameSound', val: e.target.value})
        this.pages['volume'].controlsVolums.range.onchange = e =>
            this._eventEmitter.emit('soundVolumeChanged', {group: 'controlsSound', val: e.target.value})
    }

    _createControlsPage() {
        const content = document.createElement('div')

        const title = document.createElement('div')
        title.classList.add('rules-title')
        title.innerText = this._locale.getRulesPhrase("Controls")
        content.appendChild(title)

        const bodyContent = document.createElement('div')
        bodyContent.classList.add('rules-body')
        content.appendChild(bodyContent)

        const controls = this._createControls(this._CONFIG.CONTROLS)
        bodyContent.appendChild(controls.content)

        const text = document.createElement('div')
        text.innerHTML = this._locale.getRulesPhrase(this._CONFIG.CONTROLS['text'])
        text.classList.add('rules-text')
        bodyContent.appendChild(text)

        return {
            content,
            title,
            text,
        }
    }


    _createControls(data) {
        const content = document.createElement('div')
        content.classList.add('controls-table')

        for (let i = 0; i < data['tables'].length; i++) {
            //const img = document.createElement('img')
            //img.setAttribute('src', data['tables'][i]['src']);
            const img = createImage(data['tables'][i]['src'])
            img.classList.add('rules-controls-img')
            content.appendChild(img)

            const text = document.createElement('span')
            text.innerText = this._locale.getRulesPhrase(data['tables'][i]['text'])
            text.classList.add('control-text')
            content.appendChild(text)
        }
        return {
            content,
        }
    }


    _createPaytableSymbolValues() {
        const content = document.createElement('div')
        content.classList.add('rules-symb')

        const bodyContent = document.createElement('div')
        bodyContent.classList.add('paytable_symbols')
        bodyContent.classList.add('rules-body')

        content.appendChild(bodyContent)

        for (let i = 0; i < this._CONFIG.PLAYTABLE['tables'].length; i++) {
                const playTable = this._createFlexPayTableSymbolValues(this._CONFIG.PLAYTABLE['tables'][i])
                bodyContent.appendChild(playTable.content)
        }

        return {
            content,
        }
    }


    _createTableOfPayoutLines(data, notTypicalTable) {
        const table = document.createElement('div')
        table.classList.add('paytable_scores-container')
        let tableData = data['data'];
        for (let j = 0; j < tableData.length; j += 2) {
            const div = document.createElement('div')
            const lineContainer = document.createElement('div')
            lineContainer.classList.add('paytable_score_line')
            const lineNumber = document.createElement('div')
            lineNumber.classList.add('paytable_score_count')
            lineNumber.classList.add('yellow')
            lineNumber.innerHTML = tableData[j]
            lineContainer.appendChild(lineNumber)
            const lineValue = document.createElement('div')
            lineValue.classList.add('paytable_score_value')
            if (notTypicalTable) {
                lineValue.innerHTML = tableData[j + 1][0]
                lineValue.innerHTML += this._locale.getRulesPhrase(tableData[j + 1][1])
            } else {
                lineValue.innerText = tableData[j + 1]
            }
            lineContainer.appendChild(lineValue)
            div.appendChild(lineContainer)
            table.appendChild(div)
        }

        return {
            table,
        }
    }

    _createPlayTable(data) {
        const content = document.createElement('div')
        content.classList.add('controls-table')

        for (let i = 0; i < data['tables'].length; i++) {
            //const img = document.createElement('img')
            //img.setAttribute('src', data['tables'][i]['src']);
            const img = createImage(data['tables'][i]['src'])
            img.classList.add('rules-symbols-img')
            content.appendChild(img)

            const table = document.createElement('div')
            table.classList.add('table-win')

            const tableData = data['tables'][i]['data']
            for (let j = 0; j < tableData.length; j += 2) {
                const leftPart = document.createElement('div')
                leftPart.classList.add('yellow')
                leftPart.innerText = tableData[j]
                const rightPart = document.createElement('div')
                rightPart.innerText = tableData[j + 1]

                table.appendChild(leftPart)
                table.appendChild(rightPart)
            }

            content.appendChild(table)
        }
        return {
            content,
        }
    }

    _createPaytableTitle() {
        const content = document.createElement('div')

        content.classList.add('rules-title')
        content.innerText = this._locale.getRulesPhrase(this._CONFIG.PLAYTABLE['title'])
        this.content.appendChild(content)

        return {
            content,
        }
    }

    _createPlaytableInfoOfRules(data) {
        const title = document.createElement('div')
        title.classList.add('paytable_menu-text')
        title.classList.add('yellow')
        title.innerHTML = this._locale.getRulesPhrase(data['title'])

        const symbText = document.createElement('div');
        symbText.classList.add('paytable_value-container')
        symbText.innerHTML = this._locale.getRulesPhrase(data['text'])
        let content = document.createElement('div')
        content.classList.add('paytable-info-row')
        let container = document.createElement('div')
        container.classList.add('paytable_symbol-values')

        if (data['type'] === 'identicalSize') {
            return this.createRuleWithIdenticalImages(data, container, content, title)
        }

        if (data['symbol']) {
            container = this.createElementOfRuleWithFewImages(container, data['symbol']).container
        } else {
            const symbol = document.createElement('div');
            symbol.classList.add('paytable_symbol-value')
            symbol.setAttribute("style", "width: 100%;");

            const symbolContainer = document.createElement('div');
            symbolContainer.classList.add('paytable_symbol-container')
            const symbolContainerImg = document.createElement('div');
            symbolContainerImg.classList.add('paytable_symbol_img')


            const symbolImg = createImage(data['src'])
            if (data['type'] === 'singleBig') {
                symbolImg.classList.add('paytable-img-12')
            } else if (data['type'] === 'singleBigCenter')  {
                symbolImg.classList.add('paytable-img-10')
            } else  {
                symbolImg.classList.add('paytable-img-7')
            }
            symbolContainerImg.appendChild(symbolImg)
            symbolContainer.appendChild(symbolContainerImg)
            symbol.appendChild(symbolContainer)
            container.appendChild(symbol)

            if (data['data']) {
                const payoutTable = this._createTableOfPayoutLines(data, true)
                symbol.appendChild(payoutTable.table)
            }
        }

        const symbRegularText = document.createElement('div');
        if (this._CONFIG.PLAYTABLE_TWO['text']) {
            symbRegularText.classList.add('pages_regular-text')
            symbRegularText.innerHTML = this._locale.getRulesPhrase(this._CONFIG.PLAYTABLE_TWO['text'])
        } else {
            symbRegularText.classList.add('pages_regular-text')
            symbRegularText.innerHTML = this._locale.getRulesPhrase(data['text'])
        }
        content.appendChild(title)
        content.appendChild(container)
        container.appendChild(symbRegularText)

        return {
            content,
        }

    }

    _createPaytableInfo(data) {
        const content = document.createElement('div')
        const bodyContent = document.createElement('div')
        bodyContent.classList.add('rules-body')
        content.appendChild(bodyContent)

        const table = this._createPlayTableMore(data)
        bodyContent.appendChild(table.content)

        const text = document.createElement('div')
        if (this._CONFIG.PLAYTABLE_TWO['text']) {
            text.innerHTML = this._locale.getRulesPhrase(this._CONFIG.PLAYTABLE_TWO['text'])
            text.classList.add('rules-text')
        } else {
            text.innerHTML = this._locale.getRulesPhrase(data['text'])
            text.classList.add('rules-text')
        }
        bodyContent.appendChild(text)

        return {
            content,
            text,
        }
    }

    _createPlayTableMore(data) {
        const content = document.createElement('div')
        if (data['data']) {
            content.classList.add('controls-table-more')
        } else {
            content.classList.add('controls-table-more-without-text')
        }

        const title = document.createElement('div')
        title.classList.add('control-title')
        title.classList.add('title-scatter')
        title.classList.add('yellow')
        title.innerHTML = this._locale.getRulesPhrase(data['title'])
        content.appendChild(title)

        const img = createImage(data['src'])
        if (data['data']) {
            img.classList.add('rules-symbols-img')
        } else {
            img.classList.add('rules-symbols-img-without-text')
        }
        img.classList.add('img-scatter')
        content.appendChild(img)


        const table = document.createElement('div')
        table.classList.add('table-win-more')
        table.classList.add('table-scatter')

        let scope = this;
        if (data['data']) {
            let tableData = data['data'];
            for (let j = 0; j < tableData.length; j += 2) {

                const div = document.createElement('div')
                div.classList.add('yellow')
                div.innerHTML = tableData[j]
                table.appendChild(div)

                const div2 = document.createElement('div')
                div2.innerHTML = tableData[j + 1][0]
                div2.innerHTML += scope._locale.getRulesPhrase(tableData[j + 1][1])
                table.appendChild(div2)
            }
        }
        content.appendChild(table)

        return {
            content,
            title,
        }
    }

    _createLinesPage() {
        const content = document.createElement('div')

        const title = document.createElement('div')
        title.classList.add('rules-title')
        title.innerText = this._locale.getRulesPhrase(this._CONFIG.PLAYLINES['title'])
        content.appendChild(title)

        const bodyContent = document.createElement('div')
        bodyContent.classList.add('rules-body')
        content.appendChild(bodyContent)

        const playLines = createLinesTable(this._CONFIG.PLAYLINES)
        bodyContent.appendChild(playLines.content)

        const text = document.createElement('div')
        text.innerHTML = this._locale.getRulesPhrase(this._CONFIG.PLAYLINES['text'])
        text.classList.add('rules-text')
        bodyContent.appendChild(text)

        return {
            content,
            title,
            text,
        }
    }

    /** Symbol with pay table */
    _createFlexPayTableSymbolValues(data) {
        const symbText = document.createElement('div');
        symbText.classList.add('paytable_value-container')
        symbText.innerHTML = this._locale.getRulesPhrase(data['text'])
        const content = document.createElement('div');
        content.classList.add('paytable_symbol-value')

        if (data['widthPercent']) {
            content.setAttribute("style", "width:" + data['widthPercent'] + "%;");
        }

        const symbolContainer = document.createElement('div');
        symbolContainer.classList.add('paytable_symbol-container')
        const symbolContainerImg = document.createElement('div');
        symbolContainerImg.classList.add('paytable_symbol_img')

        const symbolImg = createImage(data['src'])
        symbolImg.classList.add('paytable-img-7')
        symbolContainerImg.appendChild(symbolImg)
        symbolContainer.appendChild(symbolContainerImg)
        content.appendChild(symbolContainer)

        const payoutTable = this._createTableOfPayoutLines(data);
        symbolContainer.appendChild(payoutTable.table)

        const symbRegularText = document.createElement('div');
        if (this._CONFIG.PLAYTABLE['text']) {
            symbRegularText.classList.add('pages_regular-text')
            symbRegularText.innerHTML = this._locale.getRulesPhrase(this._CONFIG.PLAYTABLE['text'])
        } else {
            symbRegularText.classList.add('pages_regular-text')
            symbRegularText.innerHTML = this._locale.getRulesPhrase(data['text'])
        }

        return {
            content,
        }
    }

    createRuleWithIdenticalImages(data, container, content, title) {
        let tableData = data['symbol'];
        const symbol = document.createElement('div');
        symbol.classList.add('paytable_symbol-value')
        symbol.setAttribute("style", "width: 100%;");
        const symbolContainer = document.createElement('div');
        symbolContainer.classList.add('paytable_symbol-container')
        const symbolContainerImg = document.createElement('div');
        symbolContainerImg.classList.add('paytable_symbol_img')

        for (let j = 0; j < tableData.length; j++) {

            //const symbolImg = document.createElement('img');
            //symbolImg.setAttribute("src", tableData[j]['src']);
            const symbolImg = createImage(tableData[j]['src'])
            symbolImg.classList.add('paytable-img-7')
            symbolContainerImg.appendChild(symbolImg)


            if (tableData[j]['data']) {
                const payoutTable = this._createTableOfPayoutLines(tableData[j], true)
                symbol.appendChild(payoutTable.table)
            }
            symbolContainer.appendChild(symbolContainerImg)
            symbol.appendChild(symbolContainer)
            container.appendChild(symbol)
        }

        const symbRegularText = document.createElement('div');
        symbRegularText.classList.add('pages_regular-text')
        symbRegularText.innerHTML = this._locale.getRulesPhrase(data['text'])
        content.appendChild(title)
        content.appendChild(container)
        container.appendChild(symbRegularText)

        return {
            content,
        }
    }

    createElementOfRuleWithFewImages(container, tableData,) {
        for (let j = 0; j < tableData.length; j++) {
            const symbol = document.createElement('div');
            symbol.classList.add('paytable_symbol-value')
            symbol.setAttribute("style", "width: 33%;");
            const symbolContainer = document.createElement('div');
            symbolContainer.classList.add('paytable_symbol-container')
            const symbolContainerImg = document.createElement('div');
            symbolContainerImg.classList.add('paytable_symbol_img')

            //const symbolImg = document.createElement('img');
            //symbolImg.setAttribute("src", tableData[j]['src']);
            const symbolImg = createImage(tableData[j]['src'])
            symbolImg.classList.add('paytable-img-7')
            symbolContainerImg.appendChild(symbolImg)
            symbolContainer.appendChild(symbolContainerImg)
            symbol.appendChild(symbolContainer)

            if (tableData[j]['data']) {
                const payoutTable = this._createTableOfPayoutLines(tableData[j], true)
                symbol.appendChild(payoutTable.table)
            }
            container.appendChild(symbol)
        }

        return {
            container,
        }
    }
}



/** Line table */

const createLinesTable = data => {
    const content = document.createElement('div')
    content.classList.add('paytable_lines-container')


    for (let i = 0; i < data['tables'].length; i++) {
        const line = document.createElement('div')
        line.classList.add('paytable_line-container')

        const text = document.createElement('div')
        text.classList.add('yellow')
        text.classList.add('rules-table-ul')
        text.innerText = (i + 1) + '.'
        line.appendChild(text)

        const table = document.createElement('div')
        table.classList.add('table-lines')

        const tableData = data['tables'][i]
        for (let j = 0; j < tableData.length; j++) {
            const div = document.createElement('div')
            tableData[j] === 1 ? div.classList.add('back-yellow') : div.classList.add('back-white')
            table.appendChild(div)
        }

        line.appendChild(table)
        content.appendChild(line)

    }
    return {
        content: content,
    }
}



const createVersion = (gameContext) => {
    const content = document.createElement('div')

    const title = document.createElement('div')
    title.classList.add('rules-title')
    content.appendChild(title)

    const version = document.createElement('div')
    version.classList.add('version')

    const appData = `${ APP_NAME }.${ APP_VERSION }.${ APP_BRANCH.replace(/\s+/g, '') }.${ APP_NUM_COMMITS }`
    const moduleData = `${ SUBMODULE_NAME }.${ SUBMODULE_VERSION }.${ SUBMODULE_BRANCH.replace(/\s+/g, '') }.${ SUBMODULE_NUM_COMMITS }`

    const isNotShowWebp = gameContext.data.windowData.isIOSLess14

    version.innerHTML = `${ appData }<br>${ moduleData }<br>Not webp: ${ isNotShowWebp }`
    content.appendChild(version)

    content.classList.add('hidden')
    return {
        content,
    }
}




const createImage = imageSrc => {
    const img = document.createElement("img");
    img.src = imageSrc

    let count = 0
    img.onerror = () => ++count < 10 && setTimeout(() => img.src = imageSrc, 500)

    return img
}
