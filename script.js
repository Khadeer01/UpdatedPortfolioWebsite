// Animated monochrome grid for hero section with enhanced pop-out effect
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector(".hero").offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Grid animation variables
const gridSize = 40;
let t = 0;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  // Glowing grid lines
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 8;
  ctx.strokeStyle = "#fff6";
  ctx.lineWidth = 1.5;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  // Animated glowing nodes
  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      const offset = Math.sin((x + y) / 80 + t) * 10;
      const pulse = 1.5 + Math.abs(Math.sin(t + (x + y) / 200)) * 2.5;
      // Glow effect
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + offset, y + offset, 6 * pulse, 0, 2 * Math.PI);
      const grad = ctx.createRadialGradient(
        x + offset,
        y + offset,
        0,
        x + offset,
        y + offset,
        6 * pulse
      );
      grad.addColorStop(0, "#fff");
      grad.addColorStop(0.5, "#fff8");
      grad.addColorStop(1, "#fff0");
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(x + offset, y + offset, 3 * pulse, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }
  ctx.restore();
}
function animate() {
  t += 0.03;
  drawGrid();
  requestAnimationFrame(animate);
}
animate();

// Pac-Man animation for nav bar
const navCanvas = document.getElementById("nav-canvas");
const navCtx = navCanvas.getContext("2d");

function resizeNavCanvas() {
  navCanvas.width = navCanvas.offsetWidth;
  navCanvas.height = navCanvas.offsetHeight;
}
resizeNavCanvas();
window.addEventListener("resize", resizeNavCanvas);

// Pac-Man nav animation variables
let navT = 0;
const navPacmanRadius = 14;
const navPelletRadius = 3.5;
const navPelletGap = 24;
let navPellets = [];

function setupNavPellets() {
  navPellets = [];
  const y = navCanvas.height / 2;
  const startX = navPacmanRadius * 2 + 6;
  const endX = navCanvas.width - navPacmanRadius * 2 - 6;
  for (let x = startX; x < endX; x += navPelletGap) {
    navPellets.push({ x, y, eaten: false });
  }
}

function drawNavPacman(x, y, mouthAngle) {
  navCtx.save();
  navCtx.beginPath();
  navCtx.arc(
    x,
    y,
    navPacmanRadius,
    mouthAngle,
    2 * Math.PI - mouthAngle,
    false
  );
  navCtx.lineTo(x, y);
  navCtx.closePath();
  navCtx.fillStyle = "#fff";
  navCtx.shadowColor = "#fff";
  navCtx.shadowBlur = 4;
  navCtx.fill();
  navCtx.restore();
}

function drawNavPellet(x, y, visible) {
  if (!visible) return;
  navCtx.save();
  navCtx.beginPath();
  navCtx.arc(x, y, navPelletRadius, 0, 2 * Math.PI);
  navCtx.fillStyle = "#fff";
  navCtx.shadowColor = "#fff";
  navCtx.shadowBlur = 2;
  navCtx.fill();
  navCtx.restore();
}

function animateNavPacman() {
  navCtx.clearRect(0, 0, navCanvas.width, navCanvas.height);
  if (navCanvas.width < 60) return;
  if (navPellets.length === 0) setupNavPellets();
  // Pac-Man movement (slower)
  const pathStart = navPellets[0].x - navPelletGap;
  const pathEnd = navPellets[navPellets.length - 1].x + navPelletGap;
  const speed = 0.5 * (navCanvas.width / 180); // slow for nav
  navT += speed;
  let pacX = pathStart + (navT % (pathEnd - pathStart));
  const pacY = navCanvas.height / 2;
  // Pac-Man mouth animation
  const mouthOpen = Math.abs(Math.sin(navT / 18)) * 0.2 + 0.15; // less open
  const mouthAngle = mouthOpen * Math.PI;

  // Eat pellets
  for (let pellet of navPellets) {
    if (!pellet.eaten && Math.abs(pacX - pellet.x) < navPacmanRadius * 0.7) {
      pellet.eaten = true;
    }
    // Reset pellets when Pac-Man loops
    if (navT % (pathEnd - pathStart) < speed + 1) {
      pellet.eaten = false;
    }
  }

  // Draw pellets
  for (let pellet of navPellets) {
    drawNavPellet(pellet.x, pellet.y, !pellet.eaten);
  }
  // Draw Pac-Man
  drawNavPacman(pacX, pacY, mouthAngle);

  requestAnimationFrame(animateNavPacman);
}

window.addEventListener("resize", () => {
  resizeNavCanvas();
  setupNavPellets();
});

animateNavPacman();

// Hide dino game on small screens or touch devices
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
function hideDinoGameIfNeeded() {
  const dinoCanvas = document.getElementById("dino-canvas");
  const dinoStartText = document.getElementById("dino-start-text");
  if (!dinoCanvas || !dinoStartText) return;
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

// Pixel Naruto runner animation for About Me and Skills sections
(function () {
  // Placeholder sprite: orange square (replace with pixel Naruto sprite if available)
  const narutoColor = "#ff9900";
  const narutoSize = 32; // px
  const speed = 180; // px per second
  function drawRunner(ctx, w, h, t) {
    // Perimeter: top, right, bottom, left
    const perim = 2 * (w + h) - 4 * narutoSize;
    const dist = (t * speed) % perim;
    let x = 0,
      y = 0,
      dir = 0;
    if (dist < w - narutoSize) {
      // Top edge
      x = dist;
      y = 0;
      dir = 0;
    } else if (dist < w + h - 2 * narutoSize) {
      // Right edge
      x = w - narutoSize;
      y = dist - (w - narutoSize);
      dir = 1;
    } else if (dist < 2 * w + h - 3 * narutoSize) {
      // Bottom edge
      x = w - (dist - (w + h - 2 * narutoSize)) - narutoSize;
      y = h - narutoSize;
      dir = 2;
    } else {
      // Left edge
      x = 0;
      y = h - (dist - (2 * w + h - 3 * narutoSize)) - narutoSize;
      dir = 3;
    }
    // Draw Naruto (placeholder: orange square with thick white border, black outline, and shadow)
    ctx.save();
    ctx.translate(x + narutoSize / 2, y + narutoSize / 2);
    ctx.rotate((dir * Math.PI) / 2);
    // Shadow
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 8;
    // Main square
    ctx.fillStyle = narutoColor;
    ctx.fillRect(-narutoSize / 2, -narutoSize / 2, narutoSize, narutoSize);
    // White border
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(-narutoSize / 2, -narutoSize / 2, narutoSize, narutoSize);
    // Black outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#111";
    ctx.strokeRect(-narutoSize / 2, -narutoSize / 2, narutoSize, narutoSize);
    ctx.shadowBlur = 0;
    // Headband (blue stripe)
    ctx.fillStyle = "#0099ff";
    ctx.fillRect(-narutoSize / 2, -narutoSize / 2, narutoSize, 6);
    // Face (peach)
    ctx.fillStyle = "#ffe0b3";
    ctx.fillRect(
      -narutoSize / 4,
      -narutoSize / 4,
      narutoSize / 2,
      narutoSize / 2
    );
    // Direction arrow (black)
    ctx.strokeStyle = "#222";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(narutoSize / 2, 0);
    ctx.stroke();
    ctx.restore();
  }
  function animateAllRunners() {
    const now = performance.now() / 1000;
    document.querySelectorAll(".runner-canvas").forEach((canvas) => {
      const parent = canvas.parentElement;
      const style = getComputedStyle(parent);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      drawRunner(ctx, w, h, now);
    });
    requestAnimationFrame(animateAllRunners);
  }
  animateAllRunners();
})();

// Spinning retro diamond next to Skills using diamond.png
const diamondCanvas = document.getElementById("diamond-canvas");
if (diamondCanvas) {
  const ctx = diamondCanvas.getContext("2d");
  const size = 40;
  const img = new Image();
  img.src = "diamond.png";
  img.onload = function () {
    ctx.clearRect(0, 0, diamondCanvas.width, diamondCanvas.height);
    ctx.save();
    ctx.translate(diamondCanvas.width / 2, diamondCanvas.height / 2);
    // No rotation, no glow
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

// XP Bar Animation with Intersection Observer for mobile
const xpFill = document.querySelector(".xp-fill");
if (xpFill) {
  // Check if device is mobile
  const isMobile = window.innerWidth <= 700;

  if (isMobile) {
    // On mobile, use Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            xpFill.classList.add("animate-xp");
            observer.unobserve(entry.target); // Stop observing once animation starts
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: "0px 0px -50px 0px", // Start animation slightly before element is fully in view
      }
    );
    // Remove animation class initially
    xpFill.classList.remove("animate-xp");
    // Start observing
    observer.observe(xpFill);
  } else {
    // On desktop, animation runs automatically
    xpFill.classList.add("animate-xp");
  }
}

// Auto-update copyright year
document.addEventListener("DOMContentLoaded", function () {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// Simple Project Carousel for Featured Projects with auto-scroll and swipe
(function () {
  const cards = document.querySelectorAll(".project-carousel-card");
  const dots = document.querySelectorAll(".carousel-dot");
  if (!cards.length || !dots.length) return;
  let current = 0;
  let autoScrollTimer = null;
  let isInteracting = false;

  function showCard(idx) {
    current = idx;
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === idx);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === idx);
    });
  }

  function nextCard() {
    showCard((current + 1) % cards.length);
  }
  function prevCard() {
    showCard((current - 1 + cards.length) % cards.length);
  }

  function startAutoScroll() {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(() => {
      if (!isInteracting) nextCard();
    }, 5000);
  }
  function pauseAutoScroll() {
    isInteracting = true;
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    setTimeout(() => {
      isInteracting = false;
      startAutoScroll();
    }, 8000); // Resume after 8s
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      showCard(idx);
      pauseAutoScroll();
    });
  });

  // Touch/swipe support for mobile
  let startX = null;
  let moved = false;
  const container = document.querySelector(".project-carousel-container");
  if (container) {
    container.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        moved = false;
        pauseAutoScroll();
      }
    });
    container.addEventListener("touchmove", (e) => {
      if (startX !== null && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        if (Math.abs(dx) > 30) moved = true;
      }
    });
    container.addEventListener("touchend", (e) => {
      if (startX !== null && moved) {
        const endX = e.changedTouches[0].clientX;
        const dx = endX - startX;
        if (dx < -40) nextCard();
        else if (dx > 40) prevCard();
      }
      startX = null;
      moved = false;
    });
  }

  // Start
  showCard(0);
  startAutoScroll();
})();

// Typewriter Terminal Animation
(function () {
  const typewriterOutput = document.getElementById("typewriterOutput");
  const typewriterLine1 = document.getElementById("typewriterLine1");

  if (!typewriterOutput || !typewriterLine1) return;

  // Add some terminal-like sound effects (optional)
  function addTerminalSound() {
    // Create a subtle beep sound
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  // Add sound on click (optional - uncomment if you want sound)
  // typewriterOutput.addEventListener('click', addTerminalSound);
})();

// Scroll-triggered animations
(function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const elementsToAnimate = document.querySelectorAll(
    ".about-horizontal, .skills-section, .portfolio-trailer, .projects, .project-carousel-card, .skills-list li"
  );

  elementsToAnimate.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
})();

// Pixel white mouse trail effect
(function () {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  document.body.appendChild(canvas);

  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let isMouseMoving = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2; // Increased size for better visibility
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.98;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 6; // Increased shadow blur for better visibility
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.restore();
    }
  }

  function createParticles() {
    if (isMouseMoving) {
      for (let i = 0; i < 3; i++) {
        // Increased number of particles
        particles.push(new Particle(mouseX, mouseY));
      }
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => particle.draw());
  }

  function animate() {
    createParticles();
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
  }

  // Start the animation
  console.log("Mouse trail animation initialized");
  animate();

  // Mouse event listeners
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;

    // Reset mouse moving flag after a short delay
    clearTimeout(window.mouseTimeout);
    window.mouseTimeout = setTimeout(() => {
      isMouseMoving = false;
    }, 100);
  });

  document.addEventListener("mouseleave", () => {
    isMouseMoving = false;
  });
})();
