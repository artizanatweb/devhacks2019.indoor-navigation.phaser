import Phaser from 'phaser';
import ProductRow from "./ProductRow";

class SectionBox extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);

        this.scene = scene;

        this.scene.add.existing(this);
        this.depth = 10;

        this.boxBg = this.scene.add.image(0, 0, 'windowBg');
        this.boxBg.setScale(1.5);
        this.boxBg.setOrigin(0, 0);
        this.add(this.boxBg);

        this.boxHeight = this.boxBg.displayHeight;
        this.boxWidth = this.boxBg.displayWidth;
        this.y = (0 - this.boxHeight - 20);
        this.x = Math.ceil((this.scene.cameras.main.displayWidth - this.boxWidth) / 2);
        this.targetY = Math.ceil((this.scene.cameras.main.displayHeight - this.boxHeight) / 2);
        this.originalY = this.y;

        this.header = this.scene.add.image(-16, 100, 'windowTopBar');
        this.header.setScale(1.5);
        this.header.setOrigin(0, 0);
        this.add(this.header);

        this.prodsTopStart = this.header.y + this.header.displayHeight;

        this.sectionId = null;

        this.loader = this.scene.add.image(this.boxWidth/2, this.boxHeight/2, 'boxLoader');
        this.loader.setOrigin(0.5);
        this.loader.setScale(3);
        this.loader.alpha = 0;
        this.add(this.loader);
        this.loaderTween = null;

        this.countProds = null;
        this.prodsBought = [];
    }

    setName(name) {
        let catName = this.scene.add.text(this.header.displayWidth / 2, 150, name, { color: '#ffffff', fontSize: '2.8rem', stroke: '#fff', strokeThickness: 2 });
        catName.setOrigin(0.5);
        this.add(catName);
    }

    show(sectionId, data) {
        this.sectionId = sectionId;
        this.loaderRotate();
        this.setName(data.name);

        this.scene.tweens.add({
            targets: this,
            y: this.targetY,
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                console.log('box on screen');
                this.loaderStop(data);
            }
        });
    }

    hide() {
        this.scene.tweens.add({
            targets: this,
            y: this.originalY,
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.countProds = null;
                this.prodsBought = [];
                // remove listener
                this.scene.game.emitter.off('bought', this.productBought, this, false);
                this.scene.game.emitter.emit('section', this.sectionId, 'done');
                this.sectionId = null;
            }
        });
    }

    loaderRotate() {
        if (!this.loaderTween) {
            this.loaderTween = this.scene.tweens.add({
                targets: this.loader,
                angle: 360,
                duration: 1000,
                ease: 'Linear',
                repeat: -1,
                paused: true,
            });
        }

        this.loader.alpha = 1;
        this.loaderTween.resume();
    }

    loaderStop(data) {
        this.scene.tweens.add({
            targets: this.loader,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.loaderTween.pause();
                console.log(data);
                this.showProducts(data);
            }
        });
    }

    showProducts(data) {
        let items = data.products;
        this.countProds = items.length;
        items.forEach((prod, index) => {
            let product = new ProductRow(this.scene, index, prod);
            product.y = this.prodsTopStart + index * product.height;
            this.add(product);
        });

        this.scene.game.emitter.on('bought', this.productBought.bind(this));
    }

    productBought(prodId) {
        this.prodsBought.push(prodId);
        if (this.prodsBought.length >= this.countProds) {
            this.hide();
        }
    }
}

export default SectionBox;