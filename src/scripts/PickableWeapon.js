import { GameObject } from "./GameObject.js";
import { NonStaticGameObjects } from "./NonStaticGameObject.js";

export class PickableWeapon extends NonStaticGameObjects {
  constructor(game, armamentProto) {
    super(
      game,
      Math.random() * (game.spawnX - -game.spawnX) + -game.spawnX,
      Math.random() * (game.spawnY - -game.spawnY) + -game.spawnY,
      2.5 * game.pointScale,10* game.pointScale
    );
    this.armamentProto = armamentProto;
   
    this.image = new Image();
    this.image.src = "../source/environment/armament.png";
  }

  draw(context) {
    super.draw(context, "gray", 0.8);
  }
  update(weaponHoldersArray) {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
    super.update([...this.game.boxes, ...this.game.obstacles]);
    weaponHoldersArray.forEach((holder) => {
      if (holder === this) return;
      const collisionStatus = GameObject.checkCollision(this, holder);

      if (collisionStatus.status) {
        holder.gun = this.armamentProto;
        holder.gun.holderPosition = {
          x: holder.collosionX,
          y: holder.collosionY,
        };
        holder.scared = false;
        this.destroy(this.game.pickableWeapons);
      }
    });
  }
  destroy(arrOfSameTypes) {
    const indexInLocal = arrOfSameTypes.indexOf(this);
    const indexInGlobal = this.game.globalSolidObjects.indexOf(this);

    arrOfSameTypes.splice(indexInLocal, 1);
    this.game.globalSolidObjects.splice(indexInGlobal, 1);
  }
}
