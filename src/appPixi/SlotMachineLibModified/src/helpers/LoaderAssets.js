
export class LoaderAssets {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._eventEmitter = gameContext.components.eventEmitter
        this._PIXI = gameContext.PIXI


        this._resources = null
        this._loader = new this._PIXI.Loader()
        this._loader.onError.add(this._loadHandler.bind(this))
        this._loader.onProgress.add(e => {
            this._eventEmitter.emit('updateProgressBar', e.progress)
        })


        this._loader.pre((res, next) => {
            if (!res.url.includes(FILES_NAMES_PRE)) {
                const path = res.url.substring(0, res.url.lastIndexOf('/')+1)
                const name = res.url.substring(res.url.lastIndexOf('/')+1)
                res.url = `${ path }${ FILES_NAMES_PRE }${ name }`
            }
            next()
        })


        this._compressOptionsTextures = null
        this._compressOptionsAtlases = null

        const { deviceMode } = this._gameContext.components.deviceResizer.dataForComponents
        if (deviceMode === 'phone' || deviceMode === 'phoneTop' || deviceMode === 'phoneLong') {
            if (
                //window.devicePixelRatio > 2 && // check is not iPad
                config &&
                config.config &&
                config.config['phone']
            ) {
                const { resolution, compressOptionsTextures, compressOptionsAtlases } = config.config['phone']
                const extensions = PIXI.compressedTextures.detectExtensions(this._gameContext.components.app.renderer, resolution, 1)
                this._loader.pre(this._PIXI.compressedTextures.extensionChooser(extensions))
                this._compressOptionsTextures = compressOptionsTextures
                this._compressOptionsAtlases = compressOptionsAtlases
            }
        }
    }

    load (data, callback, fast, type = 'textures') {
        let isLoadComplete = false
        let minDelayValue = 1500

        let minTimer = null

        !fast && (minTimer = setTimeout(() => {
            isLoadComplete && callback(this.resources)
            minTimer = null
        }, minDelayValue))


        for (let key in data) {
            if (type === 'textures') {
                if (key.includes('AtlasJson')) {
                    this._loader.add(key, data[key], this._compressOptionsAtlases)
                } else if (key.includes('.fnt')) {
                    this._loader.add(key, data[key])
                } else {
                    this._loader.add(key, data[key], this._compressOptionsTextures)
                }
            }
            if (type === 'audio') this._loader.add(key, data[key])
        }


        this._loader.load(data => {
            this._resources = data.resources
            !minTimer && callback(this._resources)
            isLoadComplete = true
        })
    }


    loadAnimated(data, callback) {
        for (let key in data) {
            const objectData = data[key]

            for (let keyRes in objectData) {
                this._PIXI.Loader.shared.add(keyRes, objectData[keyRes])
            }
        }

        this._PIXI.Loader.shared
            .load((loader, res) => {
                callback(res)
            });
    }


    loadAnimatedSpine(data, callback) {
        for (let key in data)
            this._loader.add(key, data[key])

        this._loader.load((loader, res) => callback(res))
    }



    _loadHandler (loader, resource) {
        console.log("loading error: " + resource.url);
        console.log("progress error: " + loader.progress + "%");
    }
}

