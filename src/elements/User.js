import Phaser from 'phaser';

class User extends Phaser.Physics.Arcade.Image {
    constructor(scene, path) {
        super(scene, 0, 0, 'userIcon');

        this.scene = scene;
        this.setOrigin(0.5, 1);
        this.setX(this.scene.cameras.main.centerX - 15);
        this.setY(this.scene.cameras.main.displayHeight);
        this.setScale(2);

        this.scene.add.existing(this);

        this.path = path;
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.speed = 0.5/6000;

        this.update.bind(this);
        this.scene.events.on('update', (time, delta) => {
            this.update([time, delta]);
        });

        this.move = false;

        this.stop.bind(this);
    }

    update([time, delta]) {
        if (!this.move) {
            return;
        }

        this.follower.t += this.speed * delta;

        this.path.getPoint(this.follower.t, this.follower.vec);

        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }

    walk() {
        this.move = true;
    }

    stop() {
        this.move = false;
    }
}

export default User;