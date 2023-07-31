import { AliveObject } from "./AliveObject.js";

export class Enemy extends AliveObject {
  constructor(game) {
    super(game);
    this.game = game;
    this.collisionRadius = 30;

    this.collisionX =
      Math.random() * (this.game.spawnX - -this.game.spawnX) +
      -this.game.spawnX;
    this.collisionY =
      Math.random() * (this.game.spawnY - -this.game.spawnY) +
      -this.game.spawnY;

    this.speed = Math.random() * 2.8 + 0.2;
  }
  draw(context) {
    super.draw(context, "green", 0.8);
  }
  update() {
    super.update(this.game.player, this.game.globalSolidObjects);

    if (this.healPoint <= 0) {
      this.destroy(this.game.enemies);
    }

    AliveObject.idleStatusCheck(400, this, [this.game.player]);
  }
}
