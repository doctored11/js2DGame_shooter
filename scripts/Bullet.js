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
    collisionRadius = game.pointScale *1.5,
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
        obj.healPoint -= this.damage;
        obj.aggressive = true;
        this.destroy();
      }
    });
    this.bulletMove();
    super.update([ ...this.game.obstacles]);
  }

  // Метод для установки направления пули
  setDirection(directionX, directionY) {
    const distance = Math.hypot(directionX, directionY);
    if (distance !== 0) {
      this.directionX = directionX / distance;
      this.directionY = directionY / distance;
    }
  }

  // Метод для обновления позиции пули и пройденного расстояния
  bulletMove() {
    if (this.distanceTraveled < this.shotDistanse) {
      this.collisionX += this.directionX * this.speed;
      this.collisionY += this.directionY * this.speed;
      this.distanceTraveled += this.speed;
    } else {
      // Уничтожить пулю, если она преодолела максимальное расстояние
      this.destroy();
    }
  }

  // Метод для уничтожения пули
  destroy() {
    // Вы можете удалить пулю из игры или выполнить другие действия здесь
    // Например, вы можете удалить пулю из массива активных пуль
    const index = this.game.activeBullets.indexOf(this);
    if (index !== -1) {
      this.game.activeBullets.splice(index, 1);
    }
  }
}
