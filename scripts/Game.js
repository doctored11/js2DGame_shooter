import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Obstacle } from "./Obstacle.js";
import { MovingBarrier } from "./MovingBarrier.js";
import { Armament } from "./Armament.js";
import { PickableWeapon } from "./PickableWeapon.js";
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.gameEnd = false;

    this.gameWidth = 6000;
    this.gameHeight = this.gameWidth;

    this.spawnX = (this.gameWidth * 0.8) / 2;
    this.spawnY = (this.gameHeight * 0.8) / 2;

    this.cameraX = 0;
    this.cameraY = 0;

    this.player = new Player(this);
    this.globalSolidObjects = [];

    this.numberOfObstacles = (this.gameWidth / 60) * 0.4; //60 радиус камня
    this.obstacles = [];

    this.spawnTimer = 0;
    this.spawnInterval = 3000;
    this.numberOfBox = this.numberOfObstacles * 0.8;
    this.boxes = [];

    this.numberOfEnemies = this.numberOfObstacles * 0.6 + 1;
    this.enemies = [];

    this.numberOfPickableWeapon = 5 * this.numberOfObstacles; //* 0.2+1;
    this.pickableWeapons = [];

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
        // console.log(this.enemies);
        this.mouseStatus.x = event.offsetX - this.cameraX;
        this.mouseStatus.y = event.offsetY - this.cameraY;
        this.mouseStatus.pressed = true;
      }
      if (event.button === 2) {
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
      if (this.mouseStatus.pressed) {
        if (event.buttons === 1) {
          this.mouseStatus.x = event.offsetX - this.cameraX;
          this.mouseStatus.y = event.offsetY - this.cameraY;
        }
        if (event.buttons === 2) {
          event.preventDefault();
          this.player.gun.shot(this.player);
        }
      }

      this.mouseStatus.liveAngle = Math.atan2(
        event.offsetX - this.cameraX - this.player.collisionX,
        event.offsetY - this.cameraY - this.player.collisionY
      );
    });

    this.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();

      //стрельба видимо
      this.player.gun.shot(this.player);
    });
  }

  render(context, deltaTime) {
    if (this.gameEnd) {
      alert("gameOver")
      return;
    }
    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.cameraX = this.canvas.width / 2 - this.player.collisionX; // Здесь player.x - это координата X игрока
      this.cameraY = this.canvas.height / 2 - this.player.collisionY;

      this.timer = 0;
      context.translate(this.cameraX, this.cameraY);
      this.drawBackground(context);

      this.enemies.forEach((en) => {
        en.update(context);
      });

      this.pickableWeapons.forEach((weapon) => {
        weapon.update([this.player, ...this.enemies]);
        weapon.draw(context);
      });

      this.obstacles.forEach((obs) => obs.draw(context));
      this.activeBullets.forEach((bullet) => {
        bullet.update([
          ...this.boxes,
          ...this.enemies,
          ...this.activeBullets,
          this.player,
        ]);
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

    if (this.spawnTimer > this.spawnInterval) {
      if (this.pickableWeapons.length < this.numberOfPickableWeapon)
        this.addPickableWeapon();
      if (this.boxes.length < this.numberOfBox) this.addBox();
      if (this.enemies.length < this.numberOfEnemies) this.addEnemy();

      this.spawnTimer = 0;
    } else {
      this.spawnTimer += deltaTime;
    }
  }
  addPickableWeapon() {
    const damage = getRandomNumber(0.1, 100);
    const speed = getRandomNumber(0.1, 25);
    const distance = getRandomNumber(20, 700);
    const interval = getRandomNumber(10, 1000);
    const weapon = new Armament(this, damage, speed, 1, interval, distance);
    const pickableWeaponProto = new PickableWeapon(this, weapon);

    this.pickableWeapons.push(pickableWeaponProto);
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
    for (let i = 0; i < this.numberOfPickableWeapon; ++i) {
      this.addPickableWeapon();
    }
    console.log(this.pickableWeapons);

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
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
