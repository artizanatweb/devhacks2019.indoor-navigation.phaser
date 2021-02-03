import Phaser from 'phaser';
import SectionBox from "./SectionBox";

class Section extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sectionId) {
        super(scene, x, y, 'section', 0);

        this.scene = scene;

        this.sectionId = sectionId;

        this.scene.add.existing(this);

        this.setOrigin(0.5, 0.75);
        this.setScale(2);

        this.isDone = false;
        this.windowOnScreen = false;

        this.items = null;
        this.itemsHandler();
        this.done.bind(this);

        this.sectionWindow = new SectionBox(this.scene);
    }

    itemsHandler() {
        this.scene.game.emitter.on('section', (sectionId, action, items) => {
            if (!(parseInt(sectionId) === this.sectionId)) {
                return;
            }

            if ('done' === action) {
                this.done();
                return;
            }

            if ('setList' === action) {
                this.items = items;
                return;
            }
        });
    }

    done() {
        this.isDone = true;
        this.setFrame(1);
        // this.setScale(2.5);
        this.scene.tweens.add({
            targets: this,
            scale: 2.5,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.user.walk();
            }
        });
    }

    // requestProducts() {
    //     this.scene.shoppingList.then((result) => {
    //         console.log(result);
    //     });
    //     /**
    //      * {"ingredients":[{"category":{"id":1,"name":"Fructe & Legume"},"cost":10,"img":"varza","name":"Varz\u0103","price":10,"quantity":1},{"category":{"id":2,"name":"Carne"},"cost":50,"img":"carne-porc","name":"Carne de porc","price":50,"quantity":1},{"category":{"id":7,"name":"Alimente de baz\u0103"},"cost":10,"img":"orez","name":"Orez","price":10,"quantity":1},{"category":{"id":1,"name":"Fructe & Legume"},"cost":2.5,"img":"ceapa","name":"Ceap\u0103","price":5,"quantity":0.5}],"total":72.5}
    //      */
    //     return new Promise((resolve, reject) => {
    //         let response = {"ingredients":[{"category":{"id":1,"name":"Fructe & Legume"},"cost":10,"img":"varza","name":"Varz\u0103","price":10,"quantity":1},{"category":{"id":2,"name":"Carne"},"cost":50,"img":"carne-porc","name":"Carne de porc","price":50,"quantity":1},{"category":{"id":7,"name":"Alimente de baz\u0103"},"cost":10,"img":"orez","name":"Orez","price":10,"quantity":1},{"category":{"id":1,"name":"Fructe & Legume"},"cost":2.5,"img":"ceapa","name":"Ceap\u0103","price":5,"quantity":0.5}],"total":72.5};
    //         let ingredients = response.ingredients;
    //
    //         let data = {};
    //         ingredients.forEach((elem, index) => {
    //             let catId = elem.category.id;
    //             if (!data[catId]) {
    //                 data[catId] = {
    //                     name: elem.category.name,
    //                     products: [elem]
    //                 };
    //                 return;
    //             }
    //
    //             data[catId].products.push(elem);
    //         });
    //
    //         resolve(data);
    //     });
    // }

    openList() {
        this.windowOnScreen = true;
        // this.scene.sectionWindow.show(this.sectionId, this.items);
        if (!this.items) {
            this.scene.game.emitter.emit('section', this.sectionId, 'done');
            return;
        }

        this.sectionWindow.show(this.sectionId, this.items);
    }
}

export default Section;