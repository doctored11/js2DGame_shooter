import { NonStaticGameObjects } from "./NonStaticGameObject.js";
import { PickableHealPoints } from "./PickableHealPoint.js";
import { PickableArmorPoint } from "./PickableArmorPoint.js"
import { GameObject } from "./GameObject.js";

export class MovingBarrier extends NonStaticGameObjects {
  constructor(game, hp = 40) {

    super(
      game,
      Math.random() * (game.spawnX - -game.spawnX) + -game.spawnX,
      Math.random() * (game.spawnY - -game.spawnY) + -game.spawnY,
      game.pointScale * 5,
      game.pointScale * 30,

    );

    this.image = new Image();
    this.image.src = "../source/environment/box.png";
    this.healPoint = hp;
  }
  draw(context) {
    super.draw(context, "brown", 0.6);
  }
  update() {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
    super.update([
      this.game.player,
      ...this.game.obstacles,
      ...this.game.boxes,
    ]); //чтоб мобы не толкали(this.game.obstacles)

    if (this.healPoint <= 0) {
      this.destroy(this.game.boxes);
    }
    this.borderLimit(1);
  }
  destroy(arrayOfAlivesType) {
    super.destroy(arrayOfAlivesType);
    if (this.hasPercentChance(15)) {
      const ad = new PickableArmorPoint(this.game, this.collisionX, this.collisionY);
      this.game.armorDrop.push(ad);
    } else if (this.hasPercentChance(45)) {
      const mk = new PickableHealPoints(this.game, this.collisionX, this.collisionY);
      this.game.medKits.push(mk);
    }

  }
  hasPercentChance(percent) {

    const randomNumber = Math.random() * 100;


    return randomNumber <= percent;
  }
}
