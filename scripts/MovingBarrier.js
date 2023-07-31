import { NonStaticGameObjects } from "./NonStaticGameObject.js";
import { GameObject } from "./GameObject.js";

export class MovingBarrier extends NonStaticGameObjects {
  constructor(game, hp = 40) {
    super(
      game,
      Math.random() * (game.spawnX - -game.spawnX) + -game.spawnX,
      Math.random() * (game.spawnY - -game.spawnY) + -game.spawnY,
      30
    );
    this.healPoint = hp;
  }
  draw(context) {
    super.draw(context, "brown", 0.6);
  }
  update() {
    super.update(this.game.player, [
      ...this.game.obstacles,
      ...this.game.boxes,
    ]); //чтоб мобы не толкали(this.game.obstacles)

    if (this.healPoint <= 0) {
      this.destroy(this.game.boxes);
    }
    this.borderLimit(1);
  }
}
