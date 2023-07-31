import { GameObject } from "./GameObject";

export class PickableWeapon extends GameObject{
    constructor(game) {
        super(
          game,
          Math.random() * (game.spawnX - -game.spawnX) + -game.spawnX,
          Math.random() * (game.spawnY - -game.spawnY) + -game.spawnY,
          10
        );
      }
    
      draw(context) {
        super.draw(context, "gray", 0.8);
      }
}