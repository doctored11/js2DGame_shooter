import { AliveObject } from "./AliveObject.js";
import { Armament } from "./Armament.js";
import { changeText } from "./domHud.js";
import { changeHpHud } from "./domHud.js";

let bufferHp=0;



export class Player extends AliveObject {
  constructor(game) {
    super(game, game.width / 2, game.height / 2, 25, 3);
    this.gun = new Armament(game);
  }
  draw(context) {
    context.save();

    context.setLineDash([10, 5]);
    context.strokeStyle = "gray";

    context.globalAlpha = 0.2;
    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    context.lineTo(this.game.mouseStatus.x, this.game.mouseStatus.y);
    context.stroke();

    context.restore();
    super.draw(context, "red", 0.8);

    this.gun.draw(context, this);
  }
  update() {
    if (bufferHp != this.healPoint) {
      changeHpHud(this.healPoint, this.standartHealPoint, this.game.huds.hp)
      bufferHp = this.healPoint
    }
    if (this.healPoint <= 0) this.game.gameEnd = true;

    this.dx = this.game.mouseStatus.x - this.collisionX;
    this.dy = this.game.mouseStatus.y - this.collisionY;

    const distance = Math.hypot(this.dx, this.dy);
    if (distance < this.speedModifier) return;
    this.speedX = this.dx / distance || 0;
    this.speedY = this.dy / distance || 0;

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    super.update([this.game.player, ...this.game.obstacles]); //тут только камни ( чтоб мог толкать коробки и прочее)
    
  }
}
