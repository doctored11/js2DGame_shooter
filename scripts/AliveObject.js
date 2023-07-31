import { NonStaticGameObjects } from "./NonStaticGameObject.js";
export class AliveObject extends NonStaticGameObjects {
  constructor(
    game,
    posX,
    posY,
    collisionRad,
    speedModificator,
    hp = 100,
    acceleration = 0.5
  ) {
    super(game, posX, posY, collisionRad);

    this.speedClassicModificator = speedModificator;

    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = this.speedClassicModificator;
    this.healPoint = hp;
    this.acceleration = acceleration;

    this.aggressive = false;
    this.scared = false;
    this.target = null;
  }

  static catchTarget(catchingUp, target, speed) {
    let approachDistance =
      catchingUp.gun == null ? 0 : catchingUp.gun.shotDistance * 0.7;

    const dx = target.collisionX - catchingUp.collisionX;
    const dy = target.collisionY - catchingUp.collisionY;
    const distance = Math.hypot(dx, dy);

    if (distance !== approachDistance) {
      const unit_x = dx / distance;
      const unit_y = dy / distance;

      catchingUp.collisionX += unit_x * speed;
      catchingUp.collisionY += unit_y * speed;
    }
  }
  ScanGameZone(searchArray, visibleArea) {
    let closestDistance = Infinity;
    let closestObject = null;

    searchArray.forEach((searchObj) => {
      const dx = searchObj.collisionX - this.collisionX;
      const dy = searchObj.collisionY - this.collisionY;
      const distance = Math.hypot(dx, dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestObject = searchObj;
      }
    });

    if (closestObject && closestDistance < visibleArea) {
      const dx = closestObject.collisionX - this.collisionX;
      const dy = closestObject.collisionY - this.collisionY;
      const distance = Math.hypot(dx, dy);

      const unit_x = dx / distance;
      const unit_y = dy / distance;

      this.collisionX += unit_x * this.speed;
      this.collisionY += unit_y * this.speed;

      // Вместо изменения this, вернем массив с координатами
      const newX = this.collisionX + unit_x * this.speed;
      const newY = this.collisionY + unit_y * this.speed;
      return [newX, newY];
    }

    // Если нет подходящего оружия, вернем null
    return [0, 0];
  }

  static RanAwayFromTarget(runAway, target, speed, attentiveRadius = 500) {
    const dx = target.collisionX - runAway.collisionX;
    const dy = target.collisionY - runAway.collisionY;
    const distance = Math.hypot(dx, dy);

    // Если расстояние больше чем зона видимости в два раза
    if (distance < attentiveRadius * 3) {
      const unit_x = -dx / distance;
      const unit_y = -dy / distance;
      // if (runAway.speed > 3 * speed) runAway.speed = speed;
      // runAway.speed += runAway.acceleration;

      runAway.collisionX += unit_x * speed;
      runAway.collisionY += unit_y * speed;
    }
  }

  static idleStatusCheck(attentiveRadius, executingObject, arrOfTargets) {
    let dx, dy;
    let angleOfMoving;
    arrOfTargets.forEach((target) => {
      // console.log(NonStaticGameObjects.getDistance(this, target))
      if (
        NonStaticGameObjects.getDistance(executingObject, target) >
        2 * attentiveRadius
      ) {
        executingObject.scared = false;
      }

      //в зоне видимости
      if (
        NonStaticGameObjects.getDistance(executingObject, target) <
        attentiveRadius
      ) {
        dx = target.collisionX - executingObject.collisionX;
        dy = target.collisionY - executingObject.collisionY;

        if (executingObject.gun == null) {
          executingObject.scared = true;
          executingObject.aggressive = false;
        } else {
          executingObject.scared = false;
        }

        if (!executingObject.scared && !executingObject.aggressive) {
          AliveObject.catchTarget(
            executingObject,
            target,
            executingObject.speed
          );
        } else if (!executingObject.scared && executingObject.aggressive) {
          AliveObject.catchTarget(
            executingObject,
            target,
            executingObject.speed * 1.5
          );
        } else {
          AliveObject.RanAwayFromTarget(
            executingObject,
            target,
            executingObject.speed * 1.6,
            attentiveRadius
          );
        }
      }

      //не в зоне видимости
      else if (!executingObject.scared && !executingObject.aggressive) {
        let [buffX, buffY] = executingObject.ScanGameZone(
          executingObject.game.pickableWeapons,
          450
        );

        dx = buffX - executingObject.collisionX;
        dy = buffY - executingObject.collisionY;
      } else if (!executingObject.scared) {
        executingObject.speedX = 0;
        executingObject.speedY = 0;
        executingObject.dx = 0;
        executingObject.dy = 0;
      } else if (executingObject.scared && !executingObject.aggressive) {
        AliveObject.RanAwayFromTarget(
          executingObject,
          target,
          executingObject.speed * 0.8,
          attentiveRadius
        );
        if (dx != 0 && dy != 0) {
          
        }
      }

      angleOfMoving = Math.atan2(dy, dx);
    });

    return -angleOfMoving + Math.PI / 2;
  }
}
