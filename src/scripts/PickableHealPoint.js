import { NonStaticGameObjects } from "./NonStaticGameObject.js";
import { GameObject } from "./GameObject.js";

export class PickableHealPoints extends NonStaticGameObjects {
  constructor(game, x = Math.random() * (game.spawnX - -game.spawnX) + -game.spawnX, y = Math.random() * (game.spawnY - -game.spawnY) + -game.spawnY) {
    super(
      game,
      x,
      y,
      20, 
      15 * game.pointScale
    );
    this.healValue = Math.random() * (40 - 5) + 5;
    this.scorePofitability = 1;
    this.image = new Image();
    this.image.src = "../source/environment/heal.png";
  }
  draw(context) {
    super.draw(context, "blue", 0.2);
  }
  update(canTakeArray) {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
    super.update([...this.game.boxes, ...this.game.obstacles]);
    canTakeArray.forEach((el) => {
      if (el === this) return;
      const collisionStatus = GameObject.checkCollision(this, el);

      if (collisionStatus.status) {
        el.healPoint += this.healValue;
        el.scared = false;
        this.destroy(this.game.medKits);
      }
    });
  }
  destroy(arrOfSameTypes) {
    const indexInLocal = arrOfSameTypes.indexOf(this);


    arrOfSameTypes.splice(indexInLocal, 1);

  }
}
