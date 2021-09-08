import '../../globals';
import DragonBones from '../../src/libs/dragonBones'

export class SpriteDragonBones {
    constructor(root, files) {

        console.log(files)
        this.factory = DragonBones.PixiFactory.factory;
        this.factory.parseDragonBonesData(files['sSke'].data);
        this.factory.parseTextureAtlasData(
            files['sTex'].data,
            files['sImg'].texture
        )
    }
}