const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//resize
const baseWidth = 1600;
const baseHeight = 900;
function resizeCanvas() {
  const rect = document.body.getBoundingClientRect();
  const scale = Math.min(rect.width / baseWidth, rect.height / baseHeight);
  canvas.style.width = `${baseWidth * scale}px`;
  canvas.style.height = `${baseHeight * scale}px`;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

//initializare obiecte si constante

let gravity = 2;
let bounciness = 0.95;
let friction = 0.8;
let canShoot = false;
let points = 20;
const teren = {
  left: 0,
  top: 0,
  width: 1600,
  height: 800,
  panouX: 36,
  panouSus: 121,
  panouJos: 343,
};
const ball = {
  x: 800,
  y: 450,
  speedX: 0,
  speedY: 0,
  radius: 30,
};
const stamp = {
  x: 0,
  y: 0,
  speedX: 0,
  speedY: 0,
  radius: 30,
};

const stamps = [];

//imagini
const terenImage = new Image();
terenImage.src = "img/teren.png";

const ballImage = new Image();
ballImage.src = "img/ball.svg";

const ringImage = new Image();
ringImage.src = "img/ring.png";

//update points
const pointsElement = document.getElementById("points");
pointsElement.addEventListener("input", (e) => {
  points = e.target.value;
});

//start button click
const startPanel = document.getElementById("start_panel");
const startButton = document.getElementById("start");
startButton.addEventListener("click", () => {
  startPanel.style.display = "none";
  console.log("start game");
});
function updatePoints(valoare) {
  console.log("update points", valoare);
  points = parseFloat(valoare);
  console.log(points);
}

//bounce
function bounce(obj,x, y) {
  let dx = obj.x - x;
  let dy = obj.y - y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance <= obj.radius) {
    //ma intorc pana nu mai ating
    do {
      obj.x += -1 * obj.speedX * 0.1;
      obj.y += -1 * obj.speedY * 0.1;
      dx = obj.x - x;
      dy = obj.y - y;
      distance = Math.sqrt(dx * dx + dy * dy);
    } while (distance <= obj.radius);
    let normalX = dx / distance;
    let normalY = dy / distance;
    let dot = obj.speedX * normalX + obj.speedY * normalY;
    obj.speedX -= 2 * normalX * dot;
    obj.speedY -= 2 * normalY * dot;
    obj.speedX *= bounciness;
    obj.speedY *= bounciness;
  }
}

//move
function move(obj, points) {
  obj.speedY += gravity;
  obj.x += obj.speedX;
  obj.y += obj.speedY;
  if (points > 20) {
    
    if (obj.x - obj.radius < teren.left) {
      obj.x = teren.left + obj.radius;
      obj.speedX *= -bounciness;
      obj.speedY *= bounciness;
    }

    if (obj.x + obj.radius > teren.width) {
      obj.x = teren.width - obj.radius;
      obj.speedX *= -bounciness;
      obj.speedY *= bounciness;
    }
    if (obj.y - obj.radius < teren.top) {
      obj.y = teren.top + obj.radius;
      obj.speedY *= -bounciness;
      obj.speedX *= bounciness;
    }
    if (obj.y + obj.radius > teren.height) {
      obj.y = teren.height - obj.radius;
      obj.speedY *= -bounciness;
      obj.speedX *= bounciness;
    }
    //cu panoul
    if (obj.x - obj.radius < teren.panouX) {
      if (
        obj.y + obj.radius > teren.panouSus &&
        obj.y - obj.radius < teren.panouJos
      ) {
        obj.x = teren.panouX + obj.radius;
        obj.speedX *= -bounciness;
        obj.speedY *= bounciness;
      }
    }
    bounce(obj, teren.panouX, teren.panouSus);
    bounce(obj, teren.panouX, teren.panouJos);
    bounce(obj, 169, 312);
    bounce(obj, 62, 312);
  }
}



//initialBallSpeed
function initialBallSpeed(e) {
  stamps.length = 0;
  const rect = canvas.getBoundingClientRect();
  const xCss = e.clientX - rect.left;
  const yCss = e.clientY - rect.top;
  const clickX = (xCss / rect.width) * canvas.width;
  const clickY = (yCss / rect.height) * canvas.height;
  console.log(clickX, clickY);

  ball.speedX = (clickX - ball.x) / 10;
  ball.speedY = (clickY - ball.y) / 10;
}

//Events =====================================================================

//stamps
canvas.addEventListener("mousemove", (e) => {
  //memorare in stamps la mousemove
  initialBallSpeed(e);

  stamp.speedX = ball.speedX;
  stamp.speedY = ball.speedY;
  stamp.x = ball.x;
  stamp.y = ball.y;
  for (let i = 0; i < points; i++) {
    //memorare stamps
    move(stamp, points);
    stamps.push({ ...stamp });
  }
  canShoot = true;
});

//click shoot
canvas.addEventListener("click", (e) => {
  //La click se stabilesc speedX si speedY initiale
  if (!canShoot || stamps.length == 0) {
    return;
  }
  initialBallSpeed(e);

  canShoot = false;
});

// Sfarsit events

//updateBall
const updateBall = () => {
  if (stamps.length > 0 || canShoot) {
    //update dupa click
    return;
  }
  move(ball, 1000);
};

//drawBall
const drawBall = () => {
  ctx.drawImage(
    ballImage,
    ball.x - ball.radius,
    ball.y - ball.radius,
    ball.radius * 2,
    ball.radius * 2
  );
};

//drawStamps
const drawStamps = () => {
  let transparency = 1;
  let rStamp = 5;
  stamps.forEach((stamp) => {
    ctx.beginPath();
    ctx.arc(stamp.x, stamp.y, rStamp, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${transparency})`;
    ctx.fill();
    transparency *= 1;
    rStamp *= 1;
  });
};

//loop game
function gameLoop() {
  updateBall(); //update ball dupa click
  ctx.clearRect(0, 0, baseWidth, baseHeight); //clear canvas
  if (terenImage.complete && ballImage.complete && ringImage.complete) {
    ctx.drawImage(terenImage, 0, 0, baseWidth, baseHeight); //draw teren
    drawBall(); //draw ball
    drawStamps(); //draw stamps cand stamps>0 la mousemove
    ctx.drawImage(ringImage, 60, 296);
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
