
const gridContainer = document.getElementById("game-board");
let grid = [];
let score = 0;
let touchStartX = 0;
let touchStartY = 0;
let gameWon = 0;
let gamePaused = false;

const scoreElement = document.querySelector(".score");
const bestElement = document.querySelector(".best");
const gameOverOverlay = document.getElementById("game-over-overlay"); 
const winModal = document.getElementById("win-modal");
let bestScore = localStorage.getItem("bestScore") || 0;
bestElement.textContent = bestScore;

gridContainer.addEventListener('touchstart', handleTouchStart, false);
gridContainer.addEventListener('touchmove', handleTouchMove, false);

function initializeGrid() {
  grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  score = 0;
  updateScore(0);
  addRandomTile();
  addRandomTile();
  renderBoard();

  gameOverOverlay.style.opacity = 0;
  gameOverOverlay.style.pointerEvents = 'none';
}

function updateScore(newScore) {
  score = newScore;
  scoreElement.textContent = score;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    bestElement.textContent = bestScore;
  }
}

function reloadGame() {
  gameWon = 0;
  gamePaused = false;
  initializeGrid();
}

function addRandomTile() {
  const emptyCells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    grid[row][col] = Math.random() < 0.9 ? 512 : 512;
    renderBoard(true);
  } else {
    if (isGameOver()) {
      gameOverOverlay.style.opacity = 1; 
      gameOverOverlay.style.pointerEvents = 'auto'; 
    }
  }
}

function isGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0 ||
        (col > 0 && grid[row][col] === grid[row][col - 1]) ||
        (col < 3 && grid[row][col] === grid[row][col + 1]) ||
        (row > 0 && grid[row][col] === grid[row - 1][col]) ||
        (row < 3 && grid[row][col] === grid[row + 1][col])) {
        return false;
      }
    }
  }
  gameOverOverlay.style.opacity = 1;
  gameOverOverlay.style.pointerEvents = 'auto';
  return true;
}

function checkWin() {
    if (gameWon > 0) { 
    return true;
  }

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 2048) {

          // 🎉 Trigger Confetti here 🎉
        var duration = 15 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
          var timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          var particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        winModal.style.opacity = 1;
        winModal.style.pointerEvents = 'auto';
        gameWon = 1;
        return true;
      }
    }
  }
  return false;
}

function continuePlaying() {
  gamePaused = false;
  winModal.style.opacity = 0;
  winModal.style.pointerEvents = 'none';
}

function endGame() {
  gameWon = 0;
  gamePaused = false;
  initializeGrid(); 
  winModal.style.opacity = 0;
  winModal.style.pointerEvents = 'none'; 
}


function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (gamePaused || gameWon === 1) {
    gameWon = 2;
    return;
  }
      const touchEndX = event.touches[0].clientX;
      const touchEndY = event.touches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) { 
          if (deltaX > 0) {
              moveRight();
          } else {
              moveLeft();
          }
      } else {
          if (deltaY > 0) {
              moveDown();
          } else {
              moveUp();
          }
      }

      event.preventDefault();

      renderBoard();

      if (isGameOver()) {
          console.log('Game Over!');
      } else if (checkWin() && gameWon === 1) { 
          gamePaused = true; 
      }
}

document.addEventListener('keydown', (event) => {
  if (gamePaused || gameWon === 1) {
    gameWon = 2;
    return;
  }
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
    case '8':
      moveUp();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
    case '2':
      moveDown();
      break;
    case 'ArrowLeft':
    case 'a': 
    case 'A':
    case '4':
      moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
    case '6':
      moveRight();
      break;
  }
  renderBoard();

    if (isGameOver()) {
    console.log('Game Over!');
  } else if (checkWin() && gameWon === 1) {
    gamePaused = true;
  }
});

function renderBoard(isNewTile = false) {
  gridContainer.innerHTML = '';
  gridContainer.classList.add("grid-container");

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const tileValue = grid[row][col];
      const tileElement = document.createElement("div");
      tileElement.classList.add("tile");

      if (tileValue > 0) {
        tileElement.classList.add(`tile-${tileValue}`);
        tileElement.textContent = tileValue;
        if (isNewTile) {
          tileElement.classList.add("new-tile");
          setTimeout(() => {
            tileElement.classList.remove("new-tile");
          }, 200);
        }

        if (tileValue.toString().length > 4) { 
          tileElement.style.fontSize = '1.5em';  
        } else if (tileValue.toString().length > 3) { 
          tileElement.style.fontSize = '1.8em'; 
        } else if (tileValue.toString().length > 2) { 
          tileElement.style.fontSize = '2.1em'; 
        } else {
          tileElement.style.fontSize = '2.5em';   
        }
      }
      tileElement.classList.add("tile-0"); 

      gridContainer.appendChild(tileElement);
    }
  }
}

function moveUp() {
  let moved = false;
  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (grid[row][col] !== 0) {
        let currentRow = row;
        while (currentRow > 0 && grid[currentRow - 1][col] === 0) {
          grid[currentRow - 1][col] = grid[currentRow][col];
          grid[currentRow][col] = 0;
          currentRow--;
          moved = true;
        }

        if (currentRow > 0 && grid[currentRow - 1][col] === grid[currentRow][col]) {
          grid[currentRow - 1][col] *= 2;
          updateScore(score + grid[currentRow - 1][col]); // Update score on merge
          grid[currentRow][col] = 0;
          moved = true;
        }
      }
    }
  }
  if (moved) {
    addRandomTile();
  }
}

function moveDown() {
  let moved = false;
  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (grid[row][col] !== 0) {
        let currentRow = row;
        while (currentRow < 3 && grid[currentRow + 1][col] === 0) {
          grid[currentRow + 1][col] = grid[currentRow][col];
          grid[currentRow][col] = 0;
          currentRow++;
          moved = true;
        }

        if (currentRow < 3 && grid[currentRow + 1][col] === grid[currentRow][col]) {
          grid[currentRow + 1][col] *= 2;
          updateScore(score + grid[currentRow + 1][col]); // Update score on merge
          grid[currentRow][col] = 0;
          moved = true;
        }
      }
    }
  }
  if (moved) {
    addRandomTile();
  }
}

function moveLeft() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      if (grid[row][col] !== 0) {
        let currentCol = col;
        while (currentCol > 0 && grid[row][currentCol - 1] === 0) {
          grid[row][currentCol - 1] = grid[row][currentCol];
          grid[row][currentCol] = 0;
          currentCol--;
          moved = true;
        }

        if (currentCol > 0 && grid[row][currentCol - 1] === grid[row][currentCol]) {
          grid[row][currentCol - 1] *= 2;
          updateScore(score + grid[row][currentCol - 1]); // Update score on merge
          grid[row][currentCol] = 0;
          moved = true;
        }
      }
    }
  }
  if (moved) {
    addRandomTile();
  }
}

function moveRight() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (grid[row][col] !== 0) {
        let currentCol = col;
        while (currentCol < 3 && grid[row][currentCol + 1] === 0) {
          grid[row][currentCol + 1] = grid[row][currentCol];
          grid[row][currentCol] = 0;
          currentCol++;
          moved = true;
        }

        if (currentCol < 3 && grid[row][currentCol + 1] === grid[row][currentCol]) {
          grid[row][currentCol + 1] *= 2;
          updateScore(score + grid[row][currentCol + 1]);
          grid[row][currentCol] = 0;
          moved = true;
        }
      }
    }
  }
  if (moved) {
    addRandomTile();
  }
}

initializeGrid();
