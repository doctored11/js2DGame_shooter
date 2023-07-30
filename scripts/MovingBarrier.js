import { NonStaticGameObjects } from "./NonStaticGameObject.js";
import { GameObject } from "./GameObject.js";

export class MovingBarrier extends NonStaticGameObjects {
  constructor(game) {
    super(game, Math.random() * game.width, Math.random() * game.height, 30);
  }
  draw(context) {
    super.draw(context, "brown", 0.6);
  }
  update() {
    super.update(this.game.player,this.game.globalSolidObjects);
    //
    //


    //
    //
  }
}
