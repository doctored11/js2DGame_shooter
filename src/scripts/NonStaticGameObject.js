import { GameObject } from "./GameObject.js";

export class NonStaticGameObjects extends GameObject {
  constructor(game, posX, posY, collisionRadius, spriteWidth = 20* game.pointScale) {
    super(game, posX, posY, collisionRadius,spriteWidth);
    this.scorepPofitability = Math.random() * 2 + 1;
  }

  update(colisionArr) {
    let collisonObject = colisionArr
    collisonObject.forEach((obj) => {
      if (obj === this) return;
      const collisionStatus = GameObject.checkCollision(this, obj);

      if (collisionStatus.status) {
        const unit_x = collisionStatus.dx / collisionStatus.distance;
        const unit_y = collisionStatus.dy / collisionStatus.distance;
        this.collisionX =
          obj.collisionX + (collisionStatus.sumOfRad + 1) * unit_x;
        this.collisionY =
          obj.collisionY + (collisionStatus.sumOfRad + 1) * unit_y;
      }
    });
    this.borderLimit(1);
  }
  destroy(arrayOfAlivesType) {
    const indexInLocal = arrayOfAlivesType.indexOf(this);
    const indexInGlobal = this.game.globalSolidObjects.indexOf(this);

    arrayOfAlivesType.splice(indexInLocal, 1);
    this.game.globalSolidObjects.splice(indexInGlobal, 1);

    this.game.score+=this.scorepPofitability
  }
}
