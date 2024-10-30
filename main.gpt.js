const ctx = canvas.getContext("2d");

const setup = () => {
  const size = Math.min(window.innerHeight, window.innerWidth);
  ctx.imageSmoothingQuality = "high";
  ctx.canvas.width = size;
  ctx.canvas.height = size;
};

setup();

let angle = 0; // Canvas rotation angle in radians
let gravity = 0.2; // Gravitational acceleration constant
let balls = []; // Array to hold multiple balls

// Create initial balls
for (let i = 0; i < 100; i++) {
  balls.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 10,
    vx: 0,
    vy: 0,
  });
}

// Function to update ball positions and apply rotated gravity
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  for (let ball of balls) {
    // Apply rotated gravity to each ball
    ball.vx += gravity * Math.sin(angle);
    ball.vy += gravity * Math.cos(angle);

    // Update position
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Boundaries - prevent balls from exiting the viewport
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius; // Keep ball inside on the left
      ball.vx *= -0.8; // Reverse X velocity
    }
    if (ball.x + ball.radius > canvas.width) {
      ball.x = canvas.width - ball.radius; // Keep ball inside on the right
      ball.vx *= -0.8;
    }
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius; // Keep ball inside on the top
      ball.vy *= -0.8;
    }
    if (ball.y + ball.radius > canvas.height) {
      ball.y = canvas.height - ball.radius; // Keep ball inside on the bottom
      ball.vy *= -0.8;
    }
  }

  // Collision detection between balls
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let ballA = balls[i];
      let ballB = balls[j];
      let dx = ballB.x - ballA.x;
      let dy = ballB.y - ballA.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ballA.radius + ballB.radius) {
        // Simple collision response by swapping velocities
        [ballA.vx, ballB.vx] = [ballB.vx, ballA.vx];
        [ballA.vy, ballB.vy] = [ballB.vy, ballA.vy];

        // Separate overlapping balls
        let overlap = ballA.radius + ballB.radius - distance;
        let angle = Math.atan2(dy, dx);
        ballA.x -= (overlap * Math.cos(angle)) / 2;
        ballA.y -= (overlap * Math.sin(angle)) / 2;
        ballB.x += (overlap * Math.cos(angle)) / 2;
        ballB.y += (overlap * Math.sin(angle)) / 2;
      }
    }
  }

  // Draw balls with canvas rotation
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  for (let ball of balls) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  requestAnimationFrame(update);
}

// Rotate canvas with keys (left and right arrows)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") angle -= 0.1;
  if (e.key === "ArrowRight") angle += 0.1;
});

setTimeout(() => {
  // Check for DeviceMotionEvent support
  if (window.DeviceMotionEvent) {
    // Request permission for iOS 13+ and Android Chrome (if required)
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener("devicemotion", handleMotion);
          } else {
            console.log("Permission denied");
          }
        })
        .catch(console.error);
    } else {
      // For browsers that don't require permission
      window.addEventListener("devicemotion", handleMotion);
    }
  } else {
    console.log("DeviceMotionEvent is not supported on this device.");
  }

  const handleMotion = (event) => {
    const span = document.createElement("span");
    span.innerHTML = `${event.x} - ${event.y} - ${event.z}`;
    document.body.appendChild(span);
    angle = event.x;
  };
}, 100);

// Start the animation
update();
