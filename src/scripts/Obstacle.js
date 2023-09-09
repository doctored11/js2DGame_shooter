import { GameObject } from "./GameObject.js";

export class Obstacle extends GameObject {
  constructor(game) {
    super(
      game,
      Math.random() * (game.spawnX - -game.spawnX) + -game.spawnX,
      Math.random() * (game.spawnY - -game.spawnY) + -game.spawnY,
      16 * game.pointScale,
      110 * game.pointScale
    );
    this.image = new Image();
    this.image.src = "../source/environment/mountain.png";
  }

  draw(context) {
    super.draw(context, "gray", 0.6);
  }
}
