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
    this.standartHealPoint = hp;
    this.healPoint = hp;
    this.acceleration = acceleration;

    this.aggressive = false;
    this.scared = false;
    this.target = null;
    this.iq = 2;
    this.defaultDirection = 0;
    this.scorepPofitability = Math.random() * 15 + 5;
    this.isDirectionMirrored = false
  }

  static catchTarget(catchingUp, target, speed, atack = true) {

    
    let approachDistance =
      catchingUp.gun == null ? 0 : catchingUp.gun.shotDistance * 0.8;
   

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
    approachDistance += catchingUp.collisionRadius / 2;


    if (distance > approachDistance && atack) {
      const unit_x = dx / distance;
      const unit_y = dy / distance;

      catchingUp.collisionX += unit_x * speed;
      catchingUp.collisionY += unit_y * speed;
    }
    if (distance > 0 && !atack) {
      const unit_x = dx / distance;
      const unit_y = dy / distance;

      catchingUp.collisionX += unit_x * speed;
      catchingUp.collisionY += unit_y * speed;
    }
  }
  ScanGameZone(searchArray, visibleArea) {
    //возвращает ближнюю  цель или null
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

      return closestObject;
    }

    // Если нет подходящего оружия, вернем null
    return null;
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

  randomWalk() {
    //перемещает объекты движением + возвращает на какое расстояние переместились

    const changeDirectionChance = 5;
    const randomShotChance = 15;

    const randomNum = Math.random() * 100;

    if (randomNum < changeDirectionChance) {
      const angleChange = Math.random() * (Math.PI / 4) - Math.PI / 8;
      this.defaultDirection += angleChange;
    }
    // if (this.gun != null && randomNum < randomShotChance) {
    //   this.gun.shot(this, this.defaultDirection);
    // }

    const dx = Math.cos(this.defaultDirection) * this.speed;
    const dy = Math.sin(this.defaultDirection) * this.speed;

    if (this.borderLimit(0.7)) {
      this.collisionX += dx;
      this.collisionY += dy;
    } else {
      this.defaultDirection += Math.PI;
    }
    return [dx, dy];
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
          let buffTarget = executingObject.ScanGameZone(
            executingObject.game.pickableWeapons,
            attentiveRadius / 3
          );

          if (buffTarget != null) {
            AliveObject.catchTarget(
              executingObject,
              buffTarget,
              executingObject.speed * 1.8
            );

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
        const buffTarget = executingObject.ScanGameZone(
          executingObject.game.pickableWeapons,
          attentiveRadius
        );

        if (buffTarget != null) {
          AliveObject.catchTarget(
            executingObject,
            buffTarget,
            executingObject.speed,
            false
          );
          dx = buffTarget.collisionX - executingObject.collisionX;
          dy = buffTarget.collisionY - executingObject.collisionY;
        } else {
          [dx, dy] = executingObject.randomWalk();
        }
      } else if (
        !executingObject.scared &&
        executingObject.aggressive &&
        executingObject.gun != null
      ) {
        AliveObject.catchTarget(executingObject, target, executingObject.speed);
        dx = target.collisionX - executingObject.collisionX;
        dy = target.collisionY - executingObject.collisionY;
      } else if (executingObject.scared && !executingObject.aggressive) {
        const buffTarget = executingObject.ScanGameZone(
          executingObject.game.pickableWeapons,
          attentiveRadius / 3
        );

        if (buffTarget != null) {
          AliveObject.catchTarget(
            executingObject,
            buffTarget,
            executingObject.speed
          );

          dx = buffTarget.collisionX - executingObject.collisionX;
          dy = buffTarget.collisionY - executingObject.collisionY;
        } else {
          AliveObject.RanAwayFromTarget(
            executingObject,
            target,
            executingObject.speed * 0.8,
            attentiveRadius
          );
          dx = target.collisionX - executingObject.collisionX;
          dy = target.collisionY - executingObject.collisionY;
        }
      } else {
        [dx, dy] = executingObject.randomWalk();
      }

      angleOfMoving = Math.atan2(dy, dx);
    });

    return -angleOfMoving + Math.PI / 2;
  }
}
