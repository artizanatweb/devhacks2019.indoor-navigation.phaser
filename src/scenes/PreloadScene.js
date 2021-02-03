import Phaser from 'phaser';
import FloorMap from './../assets/floorplan.png';
import UserIcon from './../assets/user.png';
import SectionSprite from './../assets/section2.png';
import BoxImage from './../assets/box.png';
import BoxTopImage from './../assets/top_bar.png';
import BoxLoader from './../assets/box_loading.png';
import ItemsCheckbox from './../assets/checkbox.png';

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('floorMap', FloorMap);
        this.load.image('userIcon', UserIcon);
        this.load.image('userIcon', UserIcon);
        this.load.spritesheet('section', SectionSprite, {
            frameHeight: 96,
            frameWidth: 30,
        });
        this.load.image('windowBg', BoxImage);
        this.load.image('windowTopBar', BoxTopImage);
        this.load.image('boxLoader', BoxLoader);
        this.load.spritesheet('checkbox', ItemsCheckbox, {
            frameWidth: 128,
            frameHeight: 128,
        });
    }

    create() {
        this.scene.start('MapScene');
    }

    update(time, delta) {}
}

export default PreloadScene;