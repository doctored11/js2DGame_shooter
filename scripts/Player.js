import { AliveObject } from "./AliveObject.js";
import { Armament } from "./Armament.js";
import { changeText } from "./domHud.js";
import { changeHpHud,changeArmorHud } from "./domHud.js";

let bufferHp = 0;
let bufferArmor = 0;

const abilityBack1 = document.getElementById("ability-1");
const abilityBack2 = document.getElementById("ability-2");
export class Player extends AliveObject {
  constructor(game) {
    super(game, game.width / 2, game.height / 2, 5 * game.pointScale, 3);
    this.gun = new Armament(game);

    this.routePoints = [];
    this.isNavigate = false;
    this.isJumping = false;
    this.statJumpX = null;
    this.startJumpY = null;
    this.distanceTraveled = 0;
    this.jumpBoost = 12;
    this.jumpMaxDistance = this.game.gameWidth * 0.05;
    this.standartHealPoint = 100;
    this.armor = 99999;
    this.healPoint = this.standartHealPoint;
    this.modeAbility = "jump";

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;

    this.image = new Image();
    this.image.src = "../source/PlayerSkin/player.png";
    // this.spriteHeight = 250;

    this.modeValues = [null, "navigate", "jump", "__3"];
  }

  draw(context) {
    const fillPercentage = (3 - this.routePoints.length) / 3 * 100
    abilityBack1.style.height = `${fillPercentage}%`;
    const jumpTimerPercentage = 100-(this.game.jumpInterval - this.game.jumpTimer) / this.game.jumpInterval * 100;
    abilityBack2.style.height = `${jumpTimerPercentage}%`;

    if (this.isJumping && this.game.jumpTimer > this.game.jumpInterval)
      this.paintJumpLine(context);
    else if (this.routePoints.length > 0) {
      this.paintСurvedLine(context);

      //
    } else {
      this.paintStraightLine(context);
    }

    // super.draw(context, "red", 0.1);

    if (this.isDirectionMirrored) {
      context.save();
      context.scale(-1, 1); // Отражение по горизонтали
      context.drawImage(
        this.image,
        -this.spriteX - this.width, // начальная позиция по X на изображении (сдвиг влево)
        this.spriteY,
        this.width,
        this.height
      );
      context.restore();
    } else {
      context.drawImage(
        this.image,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
    }
    this.gun.draw(context, this);
  }
  update() {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
    if (bufferHp != this.healPoint) {
      changeHpHud(this.healPoint, this.standartHealPoint, this.game.huds.hp);
      bufferHp = this.healPoint;
    }
    if (bufferArmor != this.armor) {
      changeArmorHud(this.armor, this.game.huds.armor);
      bufferArmor = this.armorPoint;
    }
    if (this.healPoint <= 0) this.game.gameEnd = true;

    if (this.isNavigate) {
      [this.game.mouseStatus.x, this.game.mouseStatus.y] = this.followTheDots();
    }
    if (this.isJumping && this.game.jumpTimer > this.game.jumpInterval) {
      this.collisionX += this.speedX * (this.speedModifier + this.jumpBoost);
      this.collisionY += this.speedY * (this.speedModifier + this.jumpBoost);
      [this.game.mouseStatus.x, this.game.mouseStatus.y] = this.fastJump(
        this.game.mouseStatus.x,
        this.game.mouseStatus.y
      );
    }
    //////!!101
    this.isDirectionMirrored = false;
    if (this.game.mouseStatus.x < this.collisionX)
      this.isDirectionMirrored = true;

    this.dx = this.game.mouseStatus.x - this.collisionX;
    this.dy = this.game.mouseStatus.y - this.collisionY;

    const distance = Math.hypot(this.dx, this.dy);
    if (distance < this.speedModifier) return;
    this.speedX = this.dx / distance || 0;
    this.speedY = this.dy / distance || 0;

    //

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    super.update([this.game.player, ...this.game.obstacles]); //тут только камни ( чтоб мог толкать коробки и прочее)
  }

  followTheDots() {
    const arrayOfObjectsWithCoords = this.routePoints;
    if (arrayOfObjectsWithCoords.length === 0) {
      this.isNavigate = false;
      // Все точки обойдены, просто останавливаемся
      return [this.collisionX, this.collisionY];
    }

    const target = arrayOfObjectsWithCoords[0];
    const dx = target.x - this.collisionX;
    const dy = target.y - this.collisionY;
    const distance = Math.hypot(dx, dy);

    if (distance <= this.speedModifier) {
      // Игрок достиг точки удаляем ее из массива
      arrayOfObjectsWithCoords.shift();
    }
    return [target.x, target.y];
  }
  paintСurvedLine(context) {
    const points = [
      { x: this.collisionX, y: this.collisionY },
      ...this.routePoints,
    ];
    context.save();
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.strokeStyle = "#67e760c2";
    context.globalAlpha = 0.2;
    context.lineWidth = 6;
    context.setLineDash([10, 5]);
    context.stroke();
    context.restore();

    context.save();
    const lastPoint = points[points.length - 1];
    context.beginPath();
    context.arc(lastPoint.x, lastPoint.y, 8, 0, 2 * Math.PI);
    context.fillStyle = "#67e760c2";
    context.strokeStyle = "#21691fe0";
    context.globalAlpha = 0.5;
    context.stroke();
    context.fill();
    context.restore();
  }

  paintStraightLine(context) {
    context.save();

    context.setLineDash([10, 5]);

    context.strokeStyle = "gray";

    context.globalAlpha = 0.2;
    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    context.lineTo(this.game.mouseStatus.x, this.game.mouseStatus.y);
    context.stroke();
    context.restore();
  }

  fastJump(x, y) {
    if (!this.isJumping) {
      this.startJumpX = this.collisionX;
      this.startJumpY = this.collisionY;
      this.distanceTraveled = 0;
    }
    this.isJumping = true;
    const target = { X: x, Y: y };
    const dx1 = target.X - this.collisionX;
    const dy1 = target.Y - this.collisionY;
    const dx2 = target.X - this.startJumpX;
    const dy2 = target.Y - this.startJumpY;

    const distance = Math.hypot(dx1, dy1); //сколько нужно идти
    const distanceFull = Math.hypot(dx2, dy2); //сколько всего идти со старта

    const maxDistance = this.jumpMaxDistance;

    this.distanceTraveled = distanceFull - distance;

    if (
      this.distanceTraveled >= maxDistance ||
      distance <= this.speedModifier + this.jumpBoost
    ) {
      this.isJumping = false;
      this.startJumpX = null;
      this.startJumpY = null;
      this.distanceTraveled = 0;
      this.game.jumpTimer = 0;
      return [this.collisionX, this.collisionY];
    }
    return [x, y];
  }
  paintJumpLine(context) {
    context.save();

    context.setLineDash([10, 5]);

    context.strokeStyle = "#67e760c2";

    context.globalAlpha = 0.2;

    //
    //----todo refactor - код похож на метод fastJump()----
    //
    const target = { X: this.game.mouseStatus.x, Y: this.game.mouseStatus.y };
    const dx1 = target.X - this.collisionX;
    const dy1 = target.Y - this.collisionY;
    const dx2 = target.X - this.startJumpX;
    const dy2 = target.Y - this.startJumpY;

    const distanceToTarget = Math.hypot(dx1, dy1); //сколько нужно идти
    const distanceFull = Math.hypot(dx2, dy2); //сколько всего идти со старта
    const distance = distanceFull - distanceToTarget; //cколько прошел

    const maxDistance = this.jumpMaxDistance;
    //
    //------------------------------------------------------
    //

    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    let ratio;
    if (distanceFull <= maxDistance) {
      context.lineTo(target.X, target.Y);
    } else {
      // Иначе рисуем путь только на максимальное пройденное расстояние.

      ratio = (maxDistance - distance) / distanceToTarget;
      const endPointX = this.collisionX + dx1 * ratio;
      const endPointY = this.collisionY + dy1 * ratio;
      context.lineTo(endPointX, endPointY);
    }
    context.stroke();
    context.restore();
    context.save();

    context.beginPath();
    context.arc(
      this.collisionX + dx1 * ratio,
      this.collisionY + dy1 * ratio,
      8,
      0,
      2 * Math.PI
    );
    context.fillStyle = "#67e760c2";
    context.strokeStyle = "#21691fe0";
    context.globalAlpha = 0.5;
    context.stroke();
    context.fill();
    context.restore();
  }
}
