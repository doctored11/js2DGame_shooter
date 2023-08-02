export function changeText(el, text) {
  console.log(el, text);
  text += "";
  el.textContent = text;
}

// const hpHud = document.getElementById("progress-bar");

export function changeHpHud(hpNow, hpFull, hudEl) {
  if (hpNow < 0) hpNow = 0;

  const fillEl = hudEl.querySelector(".progress__fill");
  const hpEl = hudEl.querySelector(".progress__hp");
  console.log(fillEl);
  const hpPercent = (hpNow * 100) / hpFull;
  fillEl.style.width = hpPercent + "%";

  changeText(hpEl, Math.ceil(hpNow));
}
export function changeScoreHud(score, hudEl) {
  if (score < 0) score = 0;

  changeText(hudEl, Math.ceil(score));
}
const cursor = document.querySelector(".cursor");
  const point = document.querySelector(".point");
export function addCastomMouse() {
  

  let mouseX = 0;
  let mouseY = 0;
  let circleX = 0;
  let circleY = 0;

  const moveCursor = () => {
    const easingFactor = 0.3;
    const dx = mouseX - circleX;
    const dy = mouseY - circleY;

    circleX += dx * easingFactor;
    circleY += dy * easingFactor;

    cursor.style.left = circleX + "px";
    cursor.style.top = circleY + "px";
    point.style.left = mouseX + "px";
    point.style.top = mouseY + "px";

    requestAnimationFrame(moveCursor);
  };
  document.body.addEventListener("mousemove", (e) => {
    // e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  },{capture: true});
  

  moveCursor();
}

export function setAttackMouse(){
  cursor.classList.add('--attack')
  point.classList.add('--attack')
  

}

export function removeAttackMouse(){
  cursor.classList.remove('--attack')
  point.classList.remove('--attack')
  

}