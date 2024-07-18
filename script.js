
const gridContainer = document.getElementById("game-board");
let grid = [];
let score = 0;

const scoreElement = document.querySelector(".score");
const bestElement = document.querySelector(".best");
let bestScore = localStorage.getItem("bestScore") || 0;
bestElement.textContent = bestScore;

const gameOverOverlay = document.getElementById("game-over-overlay"); 

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

  // Hide the game over overlay when starting a new game
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
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    renderBoard(true);
  } else {
    // No empty cells - check if game over
    if (isGameOver()) {
      gameOverOverlay.style.opacity = 1; 
      gameOverOverlay.style.pointerEvents = 'auto'; 
    }
  }
}

// ... rest of your script.js code ...

function isGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0 ||
        (col > 0 && grid[row][col] === grid[row][col - 1]) ||
        (col < 3 && grid[row][col] === grid[row][col + 1]) ||
        (row > 0 && grid[row][col] === grid[row - 1][col]) ||
        (row < 3 && grid[row][col] === grid[row + 1][col])) {
        return false; // A move is still possible
      }
    }
  }
  // No possible moves found 
  gameOverOverlay.style.opacity = 1;
  gameOverOverlay.style.pointerEvents = 'auto';
  return true; // Game is over
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
    case '8':  // Numpad 8
      moveUp();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
    case '2':  // Numpad 2
      moveDown();
      break;
    case 'ArrowLeft':
    case 'a': 
    case 'A':
    case '4':  // Numpad 4
      moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
    case '6':  // Numpad 6
      moveRight();
      break;
  }
  renderBoard();

  // Check for game over after every move
  if (isGameOver()) {
    // You might want to add a more prominent game over message here
    console.log('Game Over!');
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
          updateScore(score + grid[row][currentCol + 1]); // Update score on merge
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
