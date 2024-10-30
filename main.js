const renderDim = {
  x: canvas.clientWidth,
  y: canvas.clientHeight,
};

const pixelRatio = window.devicePixelRatio;

const ctx = canvas.getContext("2d");

let angle = 0; // Canvas rotation angle in radians
let gravity = 0.2; // Gravitational acceleration constant

const balls = [];

const width = ctx.canvas.clientWidth;
const height = ctx.canvas.clientHeight;
const cols = 50;
const radius = width / cols;
const startLeft = radius;
const rows = height / 2 / (radius * 2);
const startBottom = height - radius;

const setup = () => {
  ctx.imageSmoothingQuality = "high";
  ctx.canvas.width = renderDim.x * pixelRatio;
  ctx.canvas.height = renderDim.y * pixelRatio;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(pixelRatio, pixelRatio);
};

const loadBalls = () => {
  for (let i = 0; i < cols - 1; i++) {
    const x = startLeft + i * radius * 2;
    for (let j = 0; j < rows; j++) {
      const y = startBottom - j * radius * 2;
      balls.push({
        x,
        y,
        vx: 0,
        vy: 0,
      });
    }
  }
};

const update = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2 / pixelRatio, canvas.height / 2 / pixelRatio);
  ctx.rotate(angle);
  ctx.translate(
    -canvas.width / 2 / pixelRatio,
    -canvas.height / 2 / pixelRatio
  );

  for (const ball of balls) {
    ball.vx += gravity * Math.sin(angle);
    ball.vy += gravity * Math.cos(angle);

    // Update position

    // Boundaries
    if (
      ball.x - radius * 2 < 0 ||
      ball.x + radius * 2 > canvas.width / pixelRatio
    ) {
      ball.vx *= -0.8; // Reverse on X boundary
    } else {
      ball.x += ball.vx;
    }
    if (
      ball.y - radius * 2 < 0 ||
      ball.y + radius * 2 > canvas.height / pixelRatio
    ) {
      ball.vy *= -0.8; // Reverse on Y boundary
    } else {
      ball.y += ball.vy;
    }

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();

  requestAnimationFrame(update);
};

// Rotate canvas with keys (left and right arrows)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") angle -= 0.1;
  if (e.key === "ArrowRight") angle += 0.1;
});

setup();

loadBalls();

update();
