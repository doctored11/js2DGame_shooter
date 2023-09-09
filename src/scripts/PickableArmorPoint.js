import { NonStaticGameObjects } from "./NonStaticGameObject.js";
import { GameObject } from "./GameObject.js";

export class PickableArmorPoint extends NonStaticGameObjects {
    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            25
        );
        this.armorValue = Math.random() * (500 - 50) + 50;
        this.scorePofitability = 10;
        this.image = new Image();
        this.image.src = "../source/environment/armor.png";
    }
    draw(context) {
        super.draw(context, "blue", 0.5);
    }
    update(canTakeArray) {
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5;
        super.update([...this.game.boxes, ...this.game.obstacles]);
        canTakeArray.forEach((el) => {
            if (el === this) return;
            const collisionStatus = GameObject.checkCollision(this, el);

            if (collisionStatus.status && el.armor != undefined) {
                console.log("taken" + el.armor)
                el.armor += this.armorValue;
                el.scared = false;
                this.destroy(this.game.armorDrop);
            }
        });
    }
    destroy(arrOfSameTypes) {
        const indexInLocal = arrOfSameTypes.indexOf(this);
        arrOfSameTypes.splice(indexInLocal, 1);

    }
}
