export class GameObject {
  constructor(game, posX, posY, collisionRadius = 20) {
    this.game = game;
    this.collisionX = posX;
    this.collisionY = posY;
    this.collisionRadius = collisionRadius;
  }
  draw(context, fillStyle = "gray", alfa = 0.2) {
    context.save();
    context.fillStyle = fillStyle; //
    context.globalAlpha = alfa;
    context.beginPath();
    context.arc(
      this.collisionX,
      this.collisionY,
      this.collisionRadius,
      0,
      Math.PI * 2,
      false
    );
    context.fill();
    context.restore();
    context.lineWidth = 5;
    context.stroke();
    //
    context.beginPath();
  }

  static checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const dist = Math.hypot(dx, dy);
    const sumOfRad = a.collisionRadius + b.collisionRadius;

    return {
      status: dist < sumOfRad,
      distance: dist,
      sumOfRad: sumOfRad,
      dx: dx,
      dy: dy,
    };
  }
  static getDistance(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const dist = Math.hypot(dx, dy);
    return dist;
  }
  borderLimit(acceptablePart = 0.99) {
    // console.log(this.collisionX, this.collisionY);
    if (acceptablePart > 2) acceptablePart = 2;
    if (acceptablePart <= 0) acceptablePart = 0.5;
    let inZone = true

    if (this.collisionX < -(this.game.gameWidth * acceptablePart) / 2) {
      inZone = false
      this.collisionX = -(this.game.gameWidth * acceptablePart) / 2;
    } else if (this.collisionX > (this.game.gameWidth * acceptablePart) / 2) {
      inZone = false
      this.collisionX = (this.game.gameWidth * acceptablePart) / 2;
    }

    if (this.collisionY < -(this.game.gameHeight * acceptablePart) / 2) {
      inZone = false
      this.collisionY = -(this.game.gameHeight * acceptablePart) / 2;
    } else if (this.collisionY > (this.game.gameHeight * acceptablePart) / 2) {
      inZone = false
      this.collisionY = (this.game.gameHeight * acceptablePart) / 2;
    }
    return inZone
  }

  
}
