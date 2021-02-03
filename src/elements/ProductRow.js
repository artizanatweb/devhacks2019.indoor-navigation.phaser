import Phaser from 'phaser';

class ProductRow extends Phaser.GameObjects.Container {
    constructor(scene, index, data) {
        super(scene);

        this.scene = scene;
        this.x = 70;
        this.height = 138;
        this.y = index * this.height;
        this.data = data;

        this.scene.add.existing(this);

        this.chkSprite = this.scene.add.sprite(0, 0, 'checkbox', 0);
        this.chkSprite.setOrigin(0);
        this.add(this.chkSprite);

        this.prodName = this.scene.add.text(this.chkSprite.displayWidth + 20, 20, data.name, { color: '#000', fontSize: '2.2rem', stroke: '#000', strokeThickness: 2 });
        this.add(this.prodName);

        this.price = this.scene.add.text(this.chkSprite.displayWidth + 20, 30 + this.prodName.displayHeight, `${data.price} RON`, { color: '#797979', fontSize: '2rem', stroke: '#797979', strokeThickness: 2 });
        this.add(this.price);

        this.bought = false;
        this.chkSprite.setInteractive();
        this.chkSprite.on('pointerdown', this.selected.bind(this));
    }

    selected() {
        if (this.bought) {
            return;
        }

        this.chkSprite.setFrame(1);
        this.bought = true;

        this.scene.game.emitter.emit('bought', this.data.id);
    }
}

export default ProductRow;