import { Bullet } from "./Bullet.js";

export class Armament {
  constructor(
    game,
    shotDamage = 10,
    shotSpeed = 10,
    bulletsInShot = 1,
    shotInterval = 200,
    shotDistance = 350,
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

    const correctionAngle = -(angle - Math.PI / 2);

    context.save();

    context.translate(owner.collisionX, owner.collisionY);
    context.rotate(correctionAngle);
    context.translate(0, -height / 2);
    context.fillStyle = fillStyle;
    context.globalAlpha = alfa;
    context.fillRect(0, 0, width, height);
    context.restore();
    context.stroke();
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
    const bullet = new Bullet(
      this.game,
      owner,
      owner.collisionX,
      owner.collisionY,
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

    console.log(this.game.activeBullets);

    // Добавьте созданную пулю в массив активных пуль вашей игры
    this.game.activeBullets.push(bullet);
  }
}
