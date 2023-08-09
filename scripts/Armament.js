import { Bullet } from "./Bullet.js";
import { GameObject } from "./GameObject.js";

export class Armament {
  constructor(
    game,
    shotDamage = 10,
    shotSpeed = 10,
    bulletsInShot = 1,
    shotInterval = 200,
    shotDistance = 600,
    shotMode = "single"
  ) {
    this.game = game;
    this.shotDamage = shotDamage;
    this.shotSpeed = shotSpeed;
    this.shotDistance = shotDistance;

    this.bulletsInShot = bulletsInShot;
    this.shotInterval = shotInterval;
    this.shotMode = shotMode;

    this.lastShotTime = 0;

    this.image = new Image();
    this.image.src = "../source/PlayerSkin/playerGun.png";
    this.spriteHeight = 25 * game.pointScale;
  }
  draw(
    context,
    owner,
    moveAngle,
    fillStyle = "black",
    alfa = 1,
    width = 50,
    height = 13
  ) {
    let angle = moveAngle;
    if (owner == this.game.player) {
      angle = this.game.mouseStatus.liveAngle;
    }
    // this.spriteX = owner.collisionX -  this.spriteHeight * 0.5;
    // this.spriteY = owner.collisionY -  this.spriteHeight * 0.5;

    const correctionAngle = -(angle - Math.PI / 2);

    context.save();
    context.translate(owner.collisionX, owner.collisionY);
    context.rotate(correctionAngle);
    context.translate(-this.spriteHeight * 0.5, -this.spriteHeight * 0.5);

    if (angle < 0) {
      context.save();
      context.scale(1, -1); // Отражение по горизонтали

      context.drawImage(
        this.image,
        0,
        0 - this.spriteHeight,
        this.spriteHeight,
        this.spriteHeight
      );

      context.restore();
    } else {
      context.drawImage(this.image, 0, 0, this.spriteHeight, this.spriteHeight);
    }

    // Смещение

    context.restore();
  }

  shot(owner, angle = 0) {
    // console.log(owner);
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime >= this.shotInterval) {
      this.lastShotTime = currentTime;

      // Создание и спавн пули здесь
      for (let i = 0; i < this.bulletsInShot; i++) {
        this.spawnBullet(owner, angle);
      }
    }
  }
  spawnBullet(owner, angleShot) {
    const bulletSpawn = this.getBulletSpawn(owner, angleShot);
    let collisionDetected = false;

    this.game.globalSolidObjects.forEach((element) => {
      if (GameObject.checkCollision(bulletSpawn, element).status) {
        collisionDetected = true;
        return;
      }
    });
    if (collisionDetected) {
      return;
    }

    const bullet = new Bullet(
      this.game,
      owner,
      bulletSpawn.collisionX,
      bulletSpawn.collisionY,
      this.shotDamage,
      this.shotSpeed,
      this.shotDistance
    );

    let angle = angleShot;
    if (owner == this.game.player) {
      angle = this.game.mouseStatus.liveAngle;
    }
    const directionX = Math.sin(angle);
    const directionY = Math.cos(angle);
    bullet.setDirection(directionX, directionY);

    // Добавьте созданную пулю в массив активных пуль вашей игры
    this.game.activeBullets.push(bullet);
  }
  getBulletSpawn(owner, angle = 0) {
    let correctionAngle = -angle;

    if (owner == this.game.player) {
      correctionAngle = -this.game.mouseStatus.liveAngle;
    }

    let rotatedX, rotatedY;

    if (correctionAngle > 0) {
      rotatedX =
        owner.collisionX + this.spriteHeight * 0.15 * Math.cos(correctionAngle);
      rotatedY =
        owner.collisionY + this.spriteHeight * 0.15 * Math.sin(correctionAngle);
    } else {
      rotatedX =
        owner.collisionX - this.spriteHeight * 0.15 * Math.cos(correctionAngle);
      rotatedY =
        owner.collisionY - this.spriteHeight * 0.15 * Math.sin(correctionAngle);
    }

    const edgeX =
      rotatedX +
      this.spriteHeight * 0.5 * Math.cos(correctionAngle + Math.PI / 2);
    const edgeY =
      rotatedY +
      this.spriteHeight * 0.5 * Math.sin(correctionAngle + Math.PI / 2);

    return {
      collisionX: edgeX,
      collisionY: edgeY,
      collisionRadius: this.game.pointScale * 2,
    };
  }
}
