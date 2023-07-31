import { NonStaticGameObjects } from "./NonStaticGameObject.js";
export class AliveObject extends NonStaticGameObjects {
  constructor(game, posX, posY, collisionRad, speedModificator, hp = 30) {
    super(game, posX, posY, collisionRad);

    this.speedClassicModificator = speedModificator;

    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = this.speedClassicModificator;
    this.healPoint = hp;
  }

  static catchTarget(catchingUp, target, speed) {
    const dx = target.collisionX - catchingUp.collisionX;
    const dy = target.collisionY - catchingUp.collisionY;
    const distance = Math.hypot(dx, dy);

    if (distance !== 0) {
      const unit_x = dx / distance;
      const unit_y = dy / distance;

      catchingUp.collisionX += unit_x * speed;
      catchingUp.collisionY += unit_y * speed;
    }
  }

  static idleStatusCheck(attentiveRadius, executingObject, arrOfTargets) {
    arrOfTargets.forEach((target) => {
      // console.log(NonStaticGameObjects.getDistance(this, target))

      if (
        NonStaticGameObjects.getDistance(executingObject, target) <
        attentiveRadius
      ) {
        AliveObject.catchTarget(executingObject, target, executingObject.speed);
      } else {
        this.speedX = 0;
        this.speedY = 0;
        this.dx = 0;
        this.dy = 0;
      }
    });
  }
 
}
