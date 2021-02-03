import Phaser from 'phaser';
import PreloadScene from './../scenes/PreloadScene';
import MapScene from './../scenes/MapScene';

class FloorPlan extends Phaser.Game {
    constructor(container) {
        const config = {
            type: Phaser.AUTO,
            // backgroundColor: 0x2b115a,
            backgroundColor: 0xffffff,
            scale: {
                mode: Phaser.Scale.FIT,
                parent: container,
                width: 1080,
                height: 1920,
            },
            scene: [
                PreloadScene,
                MapScene,
            ],
            physics: {
                default: "arcade",
                arcade: {
                    fps: 30,
                    debug: false,
                    gravity: { y: 0 }
                },
            },
        };

        super(config);

        this.emitter = new Phaser.Events.EventEmitter();
    }
}

export default FloorPlan;