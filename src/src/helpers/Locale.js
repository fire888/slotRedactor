export class Locale {
    constructor (gameContext, config) {
        this._localeMode = (localStorage.hasOwnProperty(APP_NAME + 'locale') && localStorage.getItem(APP_NAME + 'locale')) || 'en'

        this._data = config.config
        this._rulesData = null

        this._eventEmitter = gameContext.components.eventEmitter
    }

    switchLanguage (key) {
        localStorage.setItem(APP_NAME + 'locale', key);
        this._localeMode = this._data[key] ? key : this._localeMode
        this._eventEmitter.emit('changeLanguage', null)
    }

    getPhrase (key) {
        return this._data[this._localeMode][key] || this._data['en'][key] || key
    }

    getRulesPhrase (key) {
        return this._rulesData[this._localeMode][key] ||
            this._rulesData['en'][key] ||
            this._data[this._localeMode][key] ||
            key
    }

    setRulesLocale (data) {
        this._rulesData = data
    }
}