const ROWS = 20;
const COLUMNS = 10;
const TETROMINO_NAMES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
const TETROMINOES = {
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  'J': [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'O': [
    [1, 1],
    [1, 1],
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  'T': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ]
};
let timeoutId;
let requestId;

const getRandomElement = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
const convertPositionToIndex = (row, col) => {
  return row * COLUMNS + col;
}
const rotateMatrix = (matrix) => {
  const length = matrix.length;
  const rotatedMatrix= [];
  for (let i = 0; i < length; i++) {
    rotatedMatrix[i] = [];
    for (let j = 0; j < length; j++) {
      rotatedMatrix[i][j] = matrix[length - j - 1][i];
    }
  }
  return rotatedMatrix;
}



class Tetris {
  constructor() {
    this.playField = [];
    this.tetromino = {};
    this.isGameOver = false;
    this.init();
  }

  init () {
    this.generatePlayField();
    this.generateTetromino();
  }

  generatePlayField() {
    this.playField = new Array(ROWS).fill().map((i) => new Array(COLUMNS).fill(0));
    console.table(this.playField);
  }

  generateTetromino() {
    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = COLUMNS/2 - Math.floor(matrix.length / 2);
    const row = -2;

    this.tetromino = {name, matrix, column, row};
  }

  moveTetrominoDown() {
    this.tetromino.row += 1;
    if (!this.isValid()) {
      this.tetromino.row -= 1;
      this.placeTetromino();
    }
  }

  moveTetrominoLeft() {
    this.tetromino.column -= 1;
    if (!this.isValid()) {
      this.tetromino.column += 1;
    }
  }

  moveTetrominoRight() {
    this.tetromino.column += 1;
    if (!this.isValid()) {
      this.tetromino.column -= 1;
    }
  }

  rotateTetromino() {
    const oldMatrix = this.tetromino.matrix;
    const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
    this.tetromino.matrix = rotatedMatrix;
    if (!this.isValid()) {
      this.tetromino.matrix = oldMatrix;
    }
  }

  isValid () {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
      for (let col = 0; col < matrixSize; col++) {
        if (!this.tetromino.matrix[row][col]) continue;
        if (this.isOutsideTheBoard(row, col)) return false;
        if (this.isCollides(row, col)) return false;
      }
    }
    return true;
  }

  isOutsideTheBoard (row, col) {
    return this.tetromino.column + col < 0 ||
      this.tetromino.column + col >= COLUMNS ||
      this.tetromino.row + row >= this.playField.length;
  }

  placeTetromino () {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
      for (let col = 0; col < matrixSize; col++) {
        if (!this.tetromino.matrix[row][col]) continue;
        if (this.isOutsideOfTopBoard(row)){
          this.isGameOver = true;
          return;
        }
        this.playField[this.tetromino.row + row][this.tetromino.column + col] = this.tetromino.name;
      }
    }
    this.deleteFillRows();
    this.generateTetromino();
  }

  isCollides (row, col) {
    return this.playField[this.tetromino.row + row]?.[this.tetromino.column + col];
  }

  deleteFillRows () {
    const filledRows = this.findFilledRows();
    this.removeRows(filledRows);
  }

  findFilledRows() {
    const filledRows = [];
    for (let row = 0; row < ROWS; row++) {
      if (this.playField[row].every(cell => Boolean(cell))) {
        filledRows.push(row);
      }
    }
    return filledRows;
  }

  removeRows (filledRows) {
    filledRows.forEach((row) => {
      this.dropRowsAbove(row);
    })
  }

  dropRowsAbove (rowToDelete) {
    for (let row = rowToDelete; row > 0; row--) {
      this.playField[row] = this.playField[row - 1];
    }
    this.playField[0] = new Array(COLUMNS).fill(0);
  }

  isOutsideOfTopBoard (row) {
    return this.tetromino.row + row < 0;
  }
}




const drawPlayfield = () => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (!tetris.playField[row][col]) continue;
      const name = tetris.playField[row][col];
      const cellIndex = convertPositionToIndex(row, col);
      cells[cellIndex].classList.add(name);
    }
  }
}
const draw = () => {
  cells.forEach(cell => cell.removeAttribute('class'));
  drawPlayfield();
  drawTetromino();
}
const drawTetromino = () => {
  const name = tetris.tetromino.name;
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.row + row < 0) continue;
      const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
      cells[cellIndex].classList.add(name);
    }
  }
}
const initKeyDown = () => {
  document.addEventListener('keydown', onKeyDown);
}
const onKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowUp': rotate(); break;
    case 'ArrowDown': moveDown(); break;
    case 'ArrowLeft': moveLeft(); break;
    case 'ArrowRight': moveRight(); break;
    default: break;
  }
}
const moveDown = () => {
  tetris.moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();

  if (tetris.isGameOver) {
    gameOver();
  }
}
const moveLeft = () => {
  tetris.moveTetrominoLeft();
  draw();
}
const moveRight = () => {
  tetris.moveTetrominoRight();
  draw();
}
const rotate = () => {
  tetris.rotateTetromino();
  draw();
}
const startLoop = () => {
  timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700);
}
const stopLoop = () => {
  cancelAnimationFrame(requestId);
  clearTimeout(timeoutId);
}
const gameOver = () => {
  stopLoop();
  document.removeEventListener('keydown', onKeyDown);
}

const tetris = new Tetris();
tetris.init();
const cells = document.querySelectorAll('.grid>div');
initKeyDown();
// draw();
moveDown();