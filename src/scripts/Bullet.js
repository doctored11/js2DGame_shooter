import { GameObject } from "./GameObject.js";
import { NonStaticGameObjects } from "./NonStaticGameObject.js";
import { Player } from "./Player.js";

export class Bullet extends NonStaticGameObjects {
  constructor(
    game,
    owner,
    posX = 10,
    posY = 10,
    shotDamage = 10,
    shotSpeed = 10,
    shotDistanse = 300,
    collisionRadius = game.pointScale * 1.5,
    endurance = 10
  ) {
    super(game, posX, posY, collisionRadius);
    this.owner = owner;
    this.damage = shotDamage;
    this.speed = shotSpeed;
    this.shotDistanse = shotDistanse;
    this.distanceTraveled = 0;
    this.healPoint = endurance;
  }
  update(canTakeDamageArray) {
    canTakeDamageArray.forEach((obj) => {
      if (obj === this || obj == this.owner) return;
      const collisionStatus = GameObject.checkCollision(this, obj);

      if (collisionStatus.status) {
        obj.healPoint -= obj.armor !== undefined && obj.armor > 0 ? this.damage * 0.04 : this.damage;
        obj.armor = obj.armor < 0 ? 0 : obj.armor - this.damage * 0.3
        obj.aggressive = true;
        this.destroy();
      }
    });
    this.bulletMove();
    super.update([...this.game.obstacles]);
  }


  setDirection(directionX, directionY) {
    const distance = Math.hypot(directionX, directionY);
    if (distance !== 0) {
      this.directionX = directionX / distance;
      this.directionY = directionY / distance;
    }
  }


  bulletMove() {
    if (this.distanceTraveled < this.shotDistanse) {
      this.collisionX += this.directionX * this.speed;
      this.collisionY += this.directionY * this.speed;
      this.distanceTraveled += this.speed;
    } else {
  
      this.destroy();
    }
  }

  destroy() { //желатьльно через пул потом пули реализовать
  
    const index = this.game.activeBullets.indexOf(this);
    if (index !== -1) {
      this.game.activeBullets.splice(index, 1);
    }
  }
}
