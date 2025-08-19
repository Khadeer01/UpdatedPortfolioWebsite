// Dino Jump Game in hero section
const dinoCanvas = document.getElementById("dino-canvas");
const dinoCtx = dinoCanvas ? dinoCanvas.getContext("2d") : null;
const dinoStartText = document.getElementById("dino-start-text");
if (dinoCanvas && dinoCtx && dinoStartText) {
  // Responsive sizing
  function resizeDinoCanvas() {
    dinoCanvas.width = dinoCanvas.offsetWidth;
    dinoCanvas.height = dinoCanvas.offsetHeight;
  }
  resizeDinoCanvas();
  window.addEventListener("resize", resizeDinoCanvas);

  // Game variables
  let dinoY = 0,
    dinoVY = 0,
    isJumping = false,
    groundY = 0;
  let cactusX = 0,
    cactusW = 18,
    cactusH = 38,
    cactusSpeed = 2.5;
  let score = 0,
    gameOver = false,
    dinoRunning = false,
    dinoFirstStart = true;

  function resetDinoGame() {
    groundY = dinoCanvas.height - 18;
    dinoY = groundY;
    dinoVY = 0;
    isJumping = false;
    cactusX = dinoCanvas.width + 100;
    cactusW = Math.max(14, dinoCanvas.width * 0.04);
    cactusH = Math.max(16, dinoCanvas.height * 0.28);
    cactusSpeed = Math.max(2, dinoCanvas.width / 220);
    score = 0;
    gameOver = false;
  }
  resetDinoGame();

  function drawDino() {
    dinoCtx.save();
    dinoCtx.fillStyle = "#fff";
    dinoCtx.beginPath();
    dinoCtx.arc(48, dinoY - 12, 9, 0, 2 * Math.PI);
    dinoCtx.fill();
    dinoCtx.restore();
  }

  function drawCactus() {
    dinoCtx.save();
    dinoCtx.fillStyle = "#fff";
    dinoCtx.fillRect(cactusX, groundY - cactusH, cactusW, cactusH);
    dinoCtx.restore();
  }

  function drawGround() {
    dinoCtx.save();
    dinoCtx.strokeStyle = "#fff";
    dinoCtx.lineWidth = 2;
    dinoCtx.beginPath();
    dinoCtx.moveTo(0, groundY + 10);
    dinoCtx.lineTo(dinoCanvas.width, groundY + 10);
    dinoCtx.stroke();
    dinoCtx.restore();
  }

  function drawScore() {
    dinoCtx.save();
    dinoCtx.font = "bold 18px monospace";
    dinoCtx.fillStyle = "#fff";
    dinoCtx.fillText(score, dinoCanvas.width - 60, 28);
    dinoCtx.restore();
  }

  function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
    // Find the closest point to the circle within the rectangle
    let closestX = Math.max(rx, Math.min(cx, rx + rw));
    let closestY = Math.max(ry, Math.min(cy, ry + rh));
    // Calculate the distance between the circle's center and this closest point
    let dx = cx - closestX;
    let dy = cy - closestY;
    // If the distance is less than the circle's radius, there's a collision
    return dx * dx + dy * dy < cr * cr;
  }

  function dinoGameLoop() {
    dinoCtx.clearRect(0, 0, dinoCanvas.width, dinoCanvas.height);
    drawGround();
    drawDino();
    drawCactus();
    drawScore();

    if (!gameOver) {
      // Dino physics
      if (isJumping) {
        dinoVY += 0.9; // balanced gravity
        dinoY += dinoVY;
        if (dinoY >= groundY) {
          dinoY = groundY;
          dinoVY = 0;
          isJumping = false;
        }
      }
      // Cactus movement
      cactusX -= cactusSpeed;
      if (cactusX + cactusW < 0) {
        cactusX = dinoCanvas.width + 100 + Math.random() * 80;
        cactusH = Math.max(
          12,
          dinoCanvas.height * (0.22 + Math.random() * 0.18)
        );
        cactusW = Math.max(
          12,
          dinoCanvas.width * (0.03 + Math.random() * 0.03)
        );
        score++;
        cactusSpeed += 0.15; // increase speed as score increases
      }
      // Collision (circle vs. rect)
      if (
        circleRectCollision(
          48,
          dinoY - 12,
          9,
          cactusX,
          groundY - cactusH,
          cactusW,
          cactusH
        )
      ) {
        gameOver = true;
        dinoRunning = false;
        dinoStartText.textContent = "Game Over! Press Space to restart";
        dinoStartText.style.display = "";
      }
    } else {
      dinoCtx.save();
      dinoCtx.font = "bold 22px monospace";
      dinoCtx.fillStyle = "#fff";
      dinoCtx.textAlign = "center";
      dinoCtx.fillText(
        "Game Over!",
        dinoCanvas.width / 2,
        dinoCanvas.height / 2
      );
      dinoCtx.restore();
    }
    if (dinoRunning) {
      requestAnimationFrame(dinoGameLoop);
    }
  }

  function startDinoGame() {
    resetDinoGame();
    dinoRunning = true;
    dinoFirstStart = false;
    dinoStartText.style.display = "none";
    dinoCanvas.focus();
    dinoGameLoop();
  }

  dinoStartText.style.display = "";

  dinoCanvas.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      e.preventDefault();
      if (!dinoRunning) {
        startDinoGame();
      } else if (!isJumping && !gameOver && dinoRunning) {
        dinoVY = -16; // balanced jump
        isJumping = true;
      } else if (gameOver) {
        startDinoGame();
      }
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      const rect = dinoCanvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        e.preventDefault();
        if (!dinoRunning) {
          startDinoGame();
        } else if (!isJumping && !gameOver && dinoRunning) {
          dinoVY = -16; // balanced jump
          isJumping = true;
        } else if (gameOver) {
          startDinoGame();
        }
      }
    }
  });
  dinoCanvas.addEventListener("click", function () {
    dinoCanvas.focus();
  });
  // Autofocus for keyboard on load
  setTimeout(() => dinoCanvas.focus(), 500);

  // Hide dino game on small screens or touch devices
  function isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }
  function hideDinoGameIfNeeded() {
    if (window.innerWidth <= 700 || isTouchDevice()) {
      dinoCanvas.classList.add("hide-dino-game");
      dinoStartText.classList.add("hide-dino-game");
    } else {
      dinoCanvas.classList.remove("hide-dino-game");
      dinoStartText.classList.remove("hide-dino-game");
    }
  }
  hideDinoGameIfNeeded();
  window.addEventListener("resize", hideDinoGameIfNeeded);
}
