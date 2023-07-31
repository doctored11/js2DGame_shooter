import { AliveObject } from "./AliveObject.js";
import { NonStaticGameObjects } from "./NonStaticGameObject.js";

export class Enemy extends AliveObject {
  constructor(game, attentiveRadius = 400) {
    super(game);
    this.game = game;
    this.collisionRadius = 30;

    this.collisionX =
      Math.random() * (this.game.spawnX - -this.game.spawnX) +
      -this.game.spawnX;
    this.collisionY =
      Math.random() * (this.game.spawnY - -this.game.spawnY) +
      -this.game.spawnY;

    this.speed = Math.random() * 2.8 + 0.5;
    this.gun = null;
    this.attentiveRadius = attentiveRadius;
  }
  draw(context, moveAngle = 0) {
    super.draw(context, "green", 0.8);
    if (this.gun != null) this.gun.draw(context, this, moveAngle);
  }
  update(context) {
    super.update(this.game.player, this.game.globalSolidObjects);

    if (this.healPoint <= 0) {
      this.destroy(this.game.enemies);
    }

    const angleMove = AliveObject.idleStatusCheck(400, this, [
      this.game.player,
    ]);
    if (
      NonStaticGameObjects.getDistance(this, this.game.player) <
        this.attentiveRadius &&
      this.gun != null
    ) {
      let angleofMoving =
        // console.log(this);
        this.gun.shot(this, angleMove);
    }
    this.draw(context, angleMove);
  }
}
