import { GameObject } from "./GameObject.js";

export class Obstacle extends GameObject {
  constructor(game) {
    super(
      game,
      Math.random() * (game.spawnX - -game.spawnX) + -game.spawnX,
      Math.random() * (game.spawnY - -game.spawnY) + -game.spawnY,
      60
    );
  }

  draw(context) {
    super.draw(context, "gray", 0.6);
  }
}
