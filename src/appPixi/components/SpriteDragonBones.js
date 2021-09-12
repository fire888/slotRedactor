import '../../globals';
import DragonBones from '../SlotMachineLibModified/src/libs/dragonBones'

export class SpriteDragonBones {
    constructor(root, files) {

        console.log(files)

        this.factory = DragonBones.PixiFactory.factory;
        this.factory.parseDragonBonesData(files['skeletonJson'].data);
        this.factory.parseTextureAtlasData(
            files['textureJson'].data,
            files['image'].texture
        )
    }
}