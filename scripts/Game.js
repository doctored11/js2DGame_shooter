import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Obstacle } from "./Obstacle.js";
import { MovingBarrier } from "./MovingBarrier.js";
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.cameraX = 0;
    this.cameraY = 0;

    this.player = new Player(this);
    this.globalSolidObjects = [];

    this.boxTimer = 0;
    this.boxInterval = 3000;
    this.numberOfBox = 5;
    this.boxes = [];

    this.numberOfEnemies = 10;
    this.enemies = [];

    this.numberOfObstacles = 10;
    this.obstacles = [];

    this.fps = 80;
    this.timer = 0;
    this.interval = 1000 / this.fps;

    this.mouseStatus = {
      x: this.width / 2,
      y: this.height / 2,
      pressed: false,
    };

    this.canvas.addEventListener("mousedown", (event) => {
      this.mouseStatus.x = event.offsetX - this.cameraX;
      this.mouseStatus.y = event.offsetY - this.cameraY;
      this.mouseStatus.pressed = true;
    });
    this.canvas.addEventListener("mouseup", (event) => {
      this.mouseStatus.x = event.offsetX - this.cameraX;
      this.mouseStatus.y = event.offsetY - this.cameraY;
      this.mouseStatus.pressed = false;
    });

    this.canvas.addEventListener("mousemove", (event) => {
      if (!this.mouseStatus.pressed) return;
      this.mouseStatus.x = event.offsetX - this.cameraX;
      this.mouseStatus.y = event.offsetY - this.cameraY;
      this.mouseStatus.pressed = true;
    });
  }
  render(context, deltaTime) {
    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.cameraX = this.canvas.width / 2 - this.player.collisionX; // Здесь player.x - это координата X игрока
      this.cameraY = this.canvas.height / 2 - this.player.collisionY;

      this.timer = 0;
      context.translate(this.cameraX, this.cameraY);
      this.enemies.forEach((en) => {
        en.draw(context);
        en.update();
      });
      this.obstacles.forEach((obs) => obs.draw(context));
      this.boxes.forEach((obs) => {
        obs.draw(context);
        obs.update();
      });
      this.player.draw(context);
      this.player.update();
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
    this.boxes.push(new MovingBarrier(this));
  }
  addEnemy() {
    this.enemies.push(new Enemy(this));
  }

  init() {
    for (let i = 0; i < this.numberOfEnemies; ++i) {
      this.addEnemy();
      console.log(this.enemies);
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
        console.log(buffObs);
      }
    }
    this.globalSolidObjects = [
      ...this.obstacles,
      ...this.boxes,
      ...this.enemies,
      this.player,
    ];
  }
}
