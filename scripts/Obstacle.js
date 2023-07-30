import { GameObject } from "./GameObject.js";

export class Obstacle extends GameObject {
  constructor(game) {
    super(game, Math.random() * game.width, Math.random() * game.height, 60);
  }

  draw(context) {
    super.draw(context,"gray",0.6)
    
  }
}
