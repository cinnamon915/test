const board = document.getElementById("board");
const rows = 10;
const cols = 10;
const mineCount = 10;
let grid = [];

function init() {
  grid = Array(rows).fill().map(() => Array(cols).fill({}));

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (!grid[r][c].mine) {
      grid[r][c] = { mine: true };
      minesPlaced++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].mine) {
        let count = getNeighborMines(r, c);
        grid[r][c] = { mine: false, count };
      }
    }
  }

  drawBoard();
}

function getNeighborMines(r, c) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let nr = r + i;
      let nc = c + j;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].mine) {
        count++;
      }
    }
  }
  return count;
}

function drawBoard() {
  board.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", onClick);
      board.appendChild(cell);
    }
  }
}

function onClick(e) {
  const cell = e.target;
  const r = parseInt(cell.dataset.row);
  const c = parseInt(cell.dataset.col);
  revealCell(r, c);
}

function revealCell(r, c) {
  const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
  const tile = grid[r][c];
  if (cell.classList.contains("revealed")) return;

  cell.classList.add("revealed");

  if (tile.mine) {
    cell.classList.add("mine");
    cell.textContent = "💣";
    alert("Game Over!");
    revealAll();
  } else {
    if (tile.count > 0) {
      cell.textContent = tile.count;
    } else {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const nr = r + i;
          const nc = c + j;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            revealCell(nr, nc);
          }
        }
      }
    }
  }
}

function revealAll() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
      const tile = grid[r][c];
      if (tile.mine) {
        cell.classList.add("revealed", "mine");
        cell.textContent = "💣";
      } else if (tile.count > 0) {
        cell.classList.add("revealed");
        cell.textContent = tile.count;
      }
    }
  }
}

init();
