import { AliveObject } from "./AliveObject.js";
import { NonStaticGameObjects } from "./NonStaticGameObject.js";

export class Enemy extends AliveObject {
  constructor(game, attentiveRadius = 650) {
    super(game);
    this.game = game;
    this.collisionRadius = 5 * this.game.pointScale;

    this.collisionX =
      Math.random() * (this.game.spawnX - -this.game.spawnX) +
      -this.game.spawnX;
    this.collisionY =
      Math.random() * (this.game.spawnY - -this.game.spawnY) +
      -this.game.spawnY;

    this.speed = Math.random() * this.game.player.speedModifier + this.game.player.speedModifier / 10;
    this.gun = null;
    this.armor = 0;
    this.attentiveRadius = attentiveRadius;
    this.isDirectionMirrored = false

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;

    this.image = new Image();
    this.image.src = `../source/EnemySkin/enemy${this.iq}.png`;
    this.imageGun = new Image();
    this.imageGun.src = "../source/EnemySkin/enemyGun.png";


  }
  draw(context, moveAngle = 0) {
    // super.draw(context, "green", 0.8);

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
    if (this.gun != null) this.gun.draw(context, this, moveAngle,this.imageGun);
  }
  update(context) {
    super.update([this.game.player, ...this.game.globalSolidObjects]);
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;


    if (this.healPoint <= 0) {
      this.destroy(this.game.enemies);
    }

    const angleMove = AliveObject.idleStatusCheck(this.attentiveRadius, this, [
      this.game.player,
    ]);
    this.isDirectionMirrored = false;
    if (angleMove < 0.5) //?!!!!!!!!!!!!
      this.isDirectionMirrored = true;

    if (
      this.gun != null &&
      (NonStaticGameObjects.getDistance(this, this.game.player) <
        this.gun.shotDistance ||
        this.aggressive)
    ) {

      this.gun.shot(this, angleMove);
    }
    this.draw(context, angleMove);
  }
}
