import { SpriteDragonBones } from '../components/SpriteDragonBones'


let ContainerDragonSprites = null


export const createContainerDragonSprites = root => {
    if (!ContainerDragonSprites) {
        ContainerDragonSprites = class CCC extends root.PIXI.Container {
            constructor(data) {
                super(data)

                this.spritesFactory = {}
            }

            createDragonFactory (key, dataFile) {
                this.spritesFactory[key] = new SpriteDragonBones(root, dataFile)
            }

            createSpByKey (key) {
                if (!key) {
                    console.log(`dragonSprite "${ key }" not loaded`)
                    return;
                }

                const s = this.spritesFactory[key].factory.buildArmatureDisplay('Armature')

                s.animation.play('scatter_on', 30)
                this.addChild(s)
                return s
            }

        }
    }

    return new ContainerDragonSprites()
}

