export class GameObject {
  constructor(game, posX, posY, collisionRadius = 20) {
    console.log(posX, posY, "2");
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
}
