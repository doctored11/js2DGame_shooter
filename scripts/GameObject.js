export class GameObject {
  constructor(
    game,
    posX,
    posY,
    collisionRadius = 4 * game.pointScale,
    spriteWidth = 20* game.pointScale
  ) {
    this.game = game;
    this.collisionX = posX;
    this.collisionY = posY;
    this.collisionRadius = collisionRadius;

    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteWidth;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.image = null;

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
  }
  draw(context, fillStyle = "gray", alfa = 0.2) {
    if (this.image != undefined) {
      context.drawImage(
        this.image,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
    }else{
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

    context.save();
    }
    
    context.restore();
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
    let inZone = true;

    if (this.collisionX < -(this.game.gameWidth * acceptablePart) / 2) {
      inZone = false;
      this.collisionX = -(this.game.gameWidth * acceptablePart) / 2;
    } else if (this.collisionX > (this.game.gameWidth * acceptablePart) / 2) {
      inZone = false;
      this.collisionX = (this.game.gameWidth * acceptablePart) / 2;
    }

    if (this.collisionY < -(this.game.gameHeight * acceptablePart) / 2) {
      inZone = false;
      this.collisionY = -(this.game.gameHeight * acceptablePart) / 2;
    } else if (this.collisionY > (this.game.gameHeight * acceptablePart) / 2) {
      inZone = false;
      this.collisionY = (this.game.gameHeight * acceptablePart) / 2;
    }
    return inZone;
  }
}
