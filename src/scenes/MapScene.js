import Phaser from 'phaser';
import User from './../elements/User';
import Section from "../elements/Section";
import SectionBox from "../elements/SectionBox";
import axios from 'axios';

class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');

        this.map = null;
        this.user = null;
        this.path = null;
        this.graphics = null;

        this.sections = null;
        this.sectionWindow = null;

        this.shoppingList = null;
    }

    preload() {}

    create() {
        this.sections = this.physics.add.group({
            classType: Section,
            runChildUpdate: true,
        });

        this.uGroup = this.physics.add.group({
            classType: User
        });

        this.map = this.add.image(0, 0,'floorMap');
        this.map.setOrigin(0);
        this.map.displayWidth = 1060;
        this.map.displayHeight = 1900;

        this.createPath();

        this.createSections();

        this.user = new User(this, this.path);

        this.uGroup.add(this.user);

        // this.physics.add.overlap(this.uGroup, this.sections, this.sectionReached, null, this);
        this.physics.add.collider(this.uGroup, this.sections, this.sectionReached, null, this);

        // this.sectionWindow = new SectionBox(this);

        this.requestShoppingList();

        this.startEventHandler();
    }

    update(time, delta) {}

    createPath() {
        this.graphics = this.add.graphics();
        // user path to folow
        this.path = this.add.path(this.cameras.main.centerX - 15, this.cameras.main.displayHeight);
        this.path.lineTo(this.cameras.main.centerX - 15, this.cameras.main.displayHeight - 520);
        this.path.lineTo(this.cameras.main.centerX + 200, this.cameras.main.displayHeight - 520);
        this.path.lineTo(this.cameras.main.centerX + 200, this.cameras.main.displayHeight - 600);
        this.path.lineTo(this.cameras.main.centerX, this.cameras.main.displayHeight - 600);
        this.path.lineTo(this.cameras.main.centerX, this.cameras.main.displayHeight - 770);
        this.path.lineTo(this.cameras.main.centerX - 400, this.cameras.main.displayHeight - 770);
        this.path.lineTo(this.cameras.main.centerX - 200, this.cameras.main.displayHeight - 770);
        this.path.lineTo(this.cameras.main.centerX - 200, this.cameras.main.displayHeight - 1320);
        this.path.lineTo(this.cameras.main.centerX + 170, this.cameras.main.displayHeight - 1320);
        this.path.lineTo(this.cameras.main.centerX + 300, this.cameras.main.displayHeight - 1320);
        this.path.lineTo(this.cameras.main.centerX + 300, this.cameras.main.displayHeight - 1540);
        this.path.lineTo(180, this.cameras.main.displayHeight - 1540);

        this.graphics.lineStyle(6, 0x000000, 1);
        this.path.draw(this.graphics);
    }

    createSections() {
        this.sectionPositions = [
            new Phaser.Math.Vector2(this.cameras.main.centerX + 200, this.cameras.main.displayHeight - 520),
            new Phaser.Math.Vector2(this.cameras.main.centerX - 395, this.cameras.main.displayHeight - 770),
            new Phaser.Math.Vector2(this.cameras.main.centerX - 200, this.cameras.main.displayHeight - 1340),
            new Phaser.Math.Vector2(this.cameras.main.centerX + 170, this.cameras.main.displayHeight - 1320),
            new Phaser.Math.Vector2(190, this.cameras.main.displayHeight - 1550),
        ];

        this.sectionPositions.forEach((posVector, index) => {
            let id = index+1;
            let section = new Section(this, posVector.x, posVector.y, id);
            this.sections.add(section);
        });
    }

    sectionReached(user, section) {
        if (section.isDone) {
            return;
        }

        if (section.windowOnScreen) {
            return;
        }

        this.user.stop();
        // section.done();
        section.openList();
        // this.time.delayedCall(1000, this.user.walk.bind(this.user));
    }

    requestShoppingList() {
        axios.get('http://104.248.141.254/devhacks19/user/ingredients').then((response) => {
            console.log(response);
            this.setShoppingList(response);
        }).catch((error) => {
            console.log(error);
            this.game.emitter.emit('shoppingList', 'error');
        });
    }

    formatResponse(response) {
        let ingredients = response.data.ingredients;

        let data = {};
        ingredients.forEach((elem, index) => {
            let catId = elem.category.id;
            if (!data[catId]) {
                data[catId] = {
                    name: elem.category.name,
                    products: [elem]
                };
                return;
            }

            data[catId].products.push(elem);
        });

        return data;
    }

    setShoppingList(response) {
        let data = this.formatResponse(response);

        Object.keys(data).forEach((itemId) => {
            let item = data[itemId];
            this.game.emitter.emit('section', itemId, 'setList', item);
        });
    }

    startEventHandler() {
        this.game.emitter.on('app', (action) => {
            console.log(action);
            if ('start' === action) {
                // this.user.walk();
                this.time.delayedCall(1000, this.user.walk.bind(this.user));
            }
        });
    }
}

export default MapScene;