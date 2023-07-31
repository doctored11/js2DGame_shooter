import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Obstacle } from "./Obstacle.js";
import { MovingBarrier } from "./MovingBarrier.js";
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.gameWidth = 6000;
    this.gameHeight = 6000;

    this.spawnX = (this.gameWidth * 0.8) / 2;
    this.spawnY = (this.gameHeight * 0.8) / 2;

    this.cameraX = 0;
    this.cameraY = 0;

    this.player = new Player(this);
    this.globalSolidObjects = [];

    this.boxTimer = 0;
    this.boxInterval = 3000;
    this.numberOfBox = 40;
    this.boxes = [];

    this.numberOfEnemies = 35;
    this.enemies = [];

    this.numberOfPickableWeapon = 35;
    this.pickableWeapons= [];

    this.numberOfObstacles = 50;
    this.obstacles = [];

    this.activeBullets = [];

    this.fps = 80;
    this.timer = 0;
    this.interval = 1000 / this.fps;

    this.mouseStatus = {
      x: this.width / 2,
      y: this.height / 2,
      pressed: false,
      liveAngle: 0,
    };

    this.canvas.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        this.mouseStatus.x = event.offsetX - this.cameraX;
        this.mouseStatus.y = event.offsetY - this.cameraY;
        this.mouseStatus.pressed = true;
      }
    });

    this.canvas.addEventListener("mouseup", (event) => {
      if (event.button === 0) {
        this.mouseStatus.x = event.offsetX - this.cameraX;
        this.mouseStatus.y = event.offsetY - this.cameraY;
        this.mouseStatus.pressed = false;
      }
    });

    this.canvas.addEventListener("mousemove", (event) => {
      if (event.button === 0 && this.mouseStatus.pressed) {
        this.mouseStatus.x = event.offsetX - this.cameraX;
        this.mouseStatus.y = event.offsetY - this.cameraY;
        this.mouseStatus.pressed = true;
      }
    });

    this.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      //стрельба видимо
      this.player.gun.shot();
    });

    this.canvas.addEventListener("mousemove", (event) => {
      this.mouseStatus.liveAngle = Math.atan2(
        event.offsetX - this.cameraX - this.player.collisionX,
        event.offsetY - this.cameraY - this.player.collisionY
      );
    });
  }

  render(context, deltaTime) {
    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.cameraX = this.canvas.width / 2 - this.player.collisionX; // Здесь player.x - это координата X игрока
      this.cameraY = this.canvas.height / 2 - this.player.collisionY;

      this.timer = 0;
      context.translate(this.cameraX, this.cameraY);
      this.drawBackground(context);

      this.enemies.forEach((en) => {
        en.draw(context);
        en.update();
      });
      this.obstacles.forEach((obs) => obs.draw(context));
      this.activeBullets.forEach((bullet) => {
        bullet.update([...this.boxes, ...this.enemies, ...this.activeBullets]);
        bullet.draw(context);
      });
      this.boxes.forEach((obs) => {
        obs.draw(context);
        obs.update();
      });
      this.player.update();
      this.player.draw(context);

      context.translate(-this.cameraX, -this.cameraY);
    }
    this.timer += deltaTime;

    if (
      this.boxTimer > this.boxInterval &&
      this.boxes.length < this.numberOfBox
    ) {
      this.addBox();

      this.boxTimer = 0;
    } else {
      this.boxTimer += deltaTime;
    }
  }

  addBox() {
    const box = new MovingBarrier(this);
    this.boxes.push(box);
    this.globalSolidObjects.push(box);
  }
  addEnemy() {
    const en = new Enemy(this);
    this.enemies.push(en);
    this.globalSolidObjects.push(en);
  }

  init() {
    for (let i = 0; i < this.numberOfEnemies; ++i) {
      this.addEnemy();
    }

    for (let i = 0; i < this.numberOfBox; ++i) {
      this.addBox();
    }

    for (let i = 0; i < this.numberOfObstacles; ++i) {
      let buffObs = new Obstacle(this);
      let checkOverlap = false;

      this.obstacles.forEach((obs) => {
        const dx = buffObs.collisionX - obs.collisionX;
        const dy = buffObs.collisionY - obs.collisionY;

        const dist = Math.hypot(dx, dy);
        const sumOfRad = buffObs.collisionRadius + obs.collisionRadius;

        if (dist < sumOfRad) {
          checkOverlap = true;
        }
      });
      if (!checkOverlap) {
        this.obstacles.push(buffObs);
        this.globalSolidObjects.push(buffObs);
      }
    }
    this.globalSolidObjects.push(this.player);
  }
  canvasPaintDecor() {
    context.strokeRect(0, 0, this.gameWidth, this.gameHeight);
  }
  drawBackground(context) {
    context.save();
    const multiplayer = 0.9;
    const buffX = (this.gameWidth * multiplayer) / 2;
    const buffY = (this.gameHeight * multiplayer) / 2;

    const startX = 0;
    const startY = 0;

    // Отрисовка красных границ поля
    context.strokeStyle = "red";
    context.lineWidth = 10;

    const leftBorder = Math.max(-buffX, startX - buffX);
    const topBorder = Math.max(-buffY, startY - buffY);
    const rightBorder = Math.min(buffX, startX + buffX);
    const bottomBorder = Math.min(buffY, startY + buffY);

    context.strokeRect(
      leftBorder,
      topBorder,
      rightBorder - leftBorder,
      bottomBorder - topBorder
    );

    context.restore();
  }
}
