document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const startScreen = document.getElementById("startScreen");
  const gameOverScreen = document.getElementById("gameOverScreen");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const currentScoreElement = document.getElementById("currentScore");
  const finalScoreElement = document.getElementById("finalScore");
  const highScoreElement = document.getElementById("highScore");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");

  let gameRunning = false;
  let score = 0;
  let highScore = localStorage.getItem("cyberflapHighScore") || 0;
  highScoreElement.textContent = highScore;

  const bird = {
    x: 100,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jumpForce: -10,
    color: "#00ffff",
  };

  const pipes = [];
  const pipeWidth = 60;
  const pipeGap = 150;
  const pipeSpeed = 3;
  let pipeTimer = 0;
  const pipeInterval = 1500;

  const stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3,
      speed: Math.random() * 1 + 0.5,
      alpha: Math.random(),
    });
  }

  const buildings = [];
  for (let i = 0; i < 10; i++) {
    buildings.push({
      x: i * (canvas.width / 10),
      width: Math.random() * 100 + 50,
      height: Math.random() * 150 + 50,
      color: `hsl(${Math.random() * 60 + 240}, 70%, 20%)`,
      windows: [],
    });

    for (let j = 0; j < 20; j++) {
      buildings[i].windows.push({
        x: Math.random() * buildings[i].width,
        y: Math.random() * buildings[i].height,
        lit: Math.random() > 0.3,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`,
      });
    }
  }

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (!gameRunning) {
        startGame();
      } else {
        flap();
      }
      e.preventDefault();
    }
  });

  canvas.addEventListener("click", () => {
    if (gameRunning) {
      flap();
    }
  });

  function startGame() {
    // Reset game state
    gameRunning = true;
    score = 0;
    currentScoreElement.textContent = score;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    pipeTimer = 0;

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    scoreDisplay.classList.remove("hidden");

    requestAnimationFrame(gameLoop);
  }

  function flap() {
    bird.velocity = bird.jumpForce;

    for (let i = 0; i < 10; i++) {
      particles.push({
        x: bird.x,
        y: bird.y + bird.height / 2,
        size: Math.random() * 4 + 2,
        color: "#00ffff",
        speedX: (Math.random() - 0.5) * 3,
        speedY: Math.random() * -2 - 1,
        life: 30,
      });
    }
  }

  let particles = [];

  function gameLoop(timestamp) {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    updatePipes();
    drawPipes();

    updateBird();
    drawBird();

    updateParticles();
    drawParticles();

    currentScoreElement.textContent = score;

    if (checkCollisions()) {
      gameOver();
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0f0c29");
    gradient.addColorStop(0.5, "#302b63");
    gradient.addColorStop(1, "#24243e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);

      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    buildings.forEach((building) => {
      ctx.fillStyle = building.color;
      ctx.fillRect(
        building.x,
        canvas.height - building.height,
        building.width,
        building.height
      );

      building.windows.forEach((window) => {
        if (window.lit) {
          ctx.fillStyle = window.color;
          ctx.fillRect(
            building.x + window.x,
            canvas.height - building.height + window.y,
            5,
            5
          );
        }
      });
    });

    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function updateBird() {
    // Apply gravity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0) {
      bird.y = 0;
      bird.velocity = 0;
    }

    if (bird.y + bird.height > canvas.height) {
      bird.y = canvas.height - bird.height;
      bird.velocity = 0;
    }
  }

  function drawBird() {
    // Draw bird body
    ctx.fillStyle = bird.color;
    ctx.beginPath();
    ctx.ellipse(
      bird.x + bird.width / 2,
      bird.y + bird.height / 2,
      bird.width / 2,
      bird.height / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(
      bird.x + bird.width / 1.5,
      bird.y + bird.height / 3,
      3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#008b8b";
    ctx.beginPath();
    const wingY = bird.y + bird.height / 2;
    const wingHeight = (bird.height / 2) * (1 + Math.abs(bird.velocity) * 0.1);
    ctx.ellipse(
      bird.x + bird.width / 3,
      wingY,
      bird.width / 3,
      wingHeight,
      (Math.PI / 4) * (bird.velocity * 0.2),
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowColor = bird.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(
      bird.x + bird.width / 2,
      bird.y + bird.height / 2,
      bird.width / 2,
      bird.height / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  function updatePipes() {
    pipeTimer += 16;
    if (pipeTimer >= pipeInterval) {
      addPipe();
      pipeTimer = 0;
    }

    pipes.forEach((pipe) => {
      pipe.x -= pipeSpeed;

      if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
        pipe.passed = true;
        score++;

        for (let i = 0; i < 20; i++) {
          particles.push({
            x: pipe.x + pipeWidth / 2,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 2,
            color: "#ff00ff",
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            life: 40,
          });
        }
      }
    });

    while (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }
  }

  function addPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const height =
      Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
      x: canvas.width,
      height: height,
      passed: false,
      color: `hsl(${Math.random() * 60 + 240}, 80%, 50%)`,
    });
  }

  function drawPipes() {
    pipes.forEach((pipe) => {
      const gradientTop = ctx.createLinearGradient(
        pipe.x,
        0,
        pipe.x + pipeWidth,
        0
      );
      gradientTop.addColorStop(0, pipe.color);
      gradientTop.addColorStop(1, "#4d00ff");

      ctx.fillStyle = gradientTop;
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);

      const bottomPipeY = pipe.height + pipeGap;
      const gradientBottom = ctx.createLinearGradient(
        pipe.x,
        bottomPipeY,
        pipe.x + pipeWidth,
        bottomPipeY
      );
      gradientBottom.addColorStop(0, "#4d00ff");
      gradientBottom.addColorStop(1, pipe.color);

      ctx.fillStyle = gradientBottom;
      ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, canvas.height - bottomPipeY);

      ctx.shadowColor = pipe.color;
      ctx.shadowBlur = 15;
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);
      ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, canvas.height - bottomPipeY);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#00ffff";
      ctx.fillRect(pipe.x, pipe.height - 10, pipeWidth, 10);
      ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, 10);
    });
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].x += particles[i].speedX;
      particles[i].y += particles[i].speedY;
      particles[i].life--;

      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    particles.forEach((particle) => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life / 30;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function checkCollisions() {
    if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
      return true;
    }

    for (const pipe of pipes) {
      if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipeWidth &&
        (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipeGap)
      ) {
        return true;
      }
    }

    return false;
  }

  function gameOver() {
    gameRunning = false;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("cyberflapHighScore", highScore);
      highScoreElement.textContent = highScore;
    }

    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove("hidden");
    scoreDisplay.classList.add("hidden");

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: bird.x + bird.width / 2,
        y: bird.y + bird.height / 2,
        size: Math.random() * 6 + 2,
        color: `hsl(${Math.random() * 60 + 240}, 100%, 50%)`,
        speedX: (Math.random() - 0.5) * 10,
        speedY: (Math.random() - 0.5) * 10,
        life: 60,
      });
    }
  }
});
