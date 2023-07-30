import { AliveObject } from "./AliveObject.js";

export class Player extends AliveObject{
  constructor(game) {

    super(game,game.width / 2,game.height / 2,25,5)
    
  }
  draw(context) {
    super.draw(context,"red",0.8)
    //
    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    context.lineTo(this.game.mouseStatus.x, this.game.mouseStatus.y);
    context.stroke();
  }
  update() {
    this.dx = this.game.mouseStatus.x - this.collisionX;
    this.dy = this.game.mouseStatus.y - this.collisionY;

    const distance = Math.hypot(this.dx, this.dy);
    if (distance < this.speedModifier) return;
    this.speedX = this.dx / distance || 0;
    this.speedY = this.dy / distance || 0;

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    super.update(this, this.game.obstacles) //тут только камни ( чтоб мог толкать коробки и прочее)

   
  }
}
