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
    this.iq = 0;
  }

  static catchTarget(catchingUp, target, speed) {
    let approachDistance =
      catchingUp.gun == null ? 0 : catchingUp.gun.shotDistance * 0.7;

    const dx = target.collisionX - catchingUp.collisionX;
    const dy = target.collisionY - catchingUp.collisionY;
    const distance = Math.hypot(dx, dy);

    switch (catchingUp.iq) {
      case 0:
        approachDistance *= 0.6;
        break;
      case 1:
        approachDistance *= 0.8;
        break;
      case 2:
        approachDistance = approachDistance;
        break;
      case 3:
        break;
    }

    if (distance > approachDistance) {
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

      // Вместо изменения this, вернем массив с координатами
      const newX = this.collisionX + unit_x * this.speed;
      const newY = this.collisionY + unit_y * this.speed;

      //для перемещение ПРИРАВНЯТЬ колайдеру возвращаемое значение
      return [newX, newY];
    }

    // Если нет подходящего оружия, вернем null
    return [0, 0];
  }

  static RanAwayFromTarget(
    runAway,
    target,
    speed,
    attentiveRadius = runAway.attentiveRadius || 500
  ) {
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
          let [buffX, buffY] = executingObject.ScanGameZone(
            executingObject.game.pickableWeapons,
            attentiveRadius / 3
          );

          if (buffX != 0) {
            executingObject.collisionX = buffX;
            executingObject.collisionY = buffY;
            executingObject.aggressive = true;
          } else {
            AliveObject.RanAwayFromTarget(
              executingObject,
              target,
              executingObject.speed * 1.6,
              attentiveRadius
            );
          }
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
        let [buffX, buffY] = executingObject.ScanGameZone(
          executingObject.game.pickableWeapons,
          attentiveRadius / 3
        );

        if (buffX != 0) {
          executingObject.collisionX = buffX;
          executingObject.collisionY = buffY;
        } else {
          AliveObject.RanAwayFromTarget(
            executingObject,
            target,
            executingObject.speed * 0.8,
            attentiveRadius
          );
        }
        dx = buffX - executingObject.collisionX;
        dy = buffY - executingObject.collisionY;
      }

      angleOfMoving = Math.atan2(dy, dx);
    });

    return -angleOfMoving + Math.PI / 2;
  }
}
