import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Obstacle } from "./Obstacle.js";
import { MovingBarrier } from "./MovingBarrier.js";
import { Game } from "./Game.js";
import { changeText } from "./domHud.js";
import { addCastomMouse } from "./domHud.js";

window.addEventListener("load", function () {
  const hpProgressBar = document.getElementById("progress-bar");
  const armorProgressBar = document.getElementById("progress-armor-bar");
  const scoreEl = document.getElementById("score");
  const HudObj = { hp: hpProgressBar, score: scoreEl, armor:armorProgressBar };

  const canvas = document.getElementById("game-field");
  const context = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  context.fillStyle = "red"; //
  context.strokeStyle = "black";
  context.lineWidth = 5;

  const game = new Game(canvas, HudObj);
  game.init();

  console.log(game);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.render(context, deltaTime);

    window.requestAnimationFrame(animate);
  }

  animate(0);

  //не игровое
  //
  function updateCanvasSize() {
    // Устанавливаем размер холста равным размеру окна браузера
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  updateCanvasSize();
  window.addEventListener("resize", () => {
    updateCanvasSize();
  });

  addCastomMouse(canvas);
  //
  //
  //
});
