import { Bullet } from "./Bullet.js";

export class Armament {
  constructor(
    game,
    shotDamage = 10,
    shotSpeed = 10,
    bulletsInShot = 1,
    shotInterval = 200,
    shotMode = "single"
  ) {
    this.game = game;
    this.shotDamage = shotDamage;
    this.shotSpeed = shotSpeed;

    this.bulletsInShot = bulletsInShot;
    this.shotInterval = shotInterval;
    this.shotMode = shotMode;

    this.lastShotTime = 0;
  }
  draw(context, fillStyle = "black", alfa = 1, width = 50, height = 13) {
    const angle = this.game.mouseStatus.liveAngle;
    const correctionAngle = -(angle - Math.PI / 2);

    context.save();
    const player = this.game.player;
    context.translate(player.collisionX, player.collisionY);
    context.rotate(correctionAngle);
    context.translate(0, -height / 2);
    context.fillStyle = fillStyle;
    context.globalAlpha = alfa;
    context.fillRect(0, 0, width, height);
    context.restore();
    context.stroke();
  }

  shot() {
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime >= this.shotInterval) {
      this.lastShotTime = currentTime;

      // Создание и спавн пули здесь
      for (let i = 0; i < this.bulletsInShot; i++) {
        this.spawnBullet();
      }
    }
  }
  spawnBullet() {
    const bullet = new Bullet(
      this.game,
      this.game.player.collisionX,
      this.game.player.collisionY,
      this.shotDamage,
      this.shotSpeed
    );

    const angle = this.game.mouseStatus.liveAngle;
    const directionX = Math.sin(angle);
    const directionY = Math.cos(angle);
    bullet.setDirection(directionX, directionY);

    console.log(this.game.activeBullets);

    // Добавьте созданную пулю в массив активных пуль вашей игры
    this.game.activeBullets.push(bullet);
  }
}
