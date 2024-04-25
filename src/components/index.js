import '../pages/index.css';

const CANVAS = document.querySelector('#canvas');
CANVAS.width = 300;
CANVAS.height = 600;

const CTX = canvas.getContext('2d');
const SIZE = 30; // Размер одной клетки на канвасе
const ROWS = 20;
const COLS = 10;
let gameBoard = Array.from({length: ROWS}, () => Array(COLS).fill(0));

let tetromino = getTetromino();
let y = -2;
let x = 3;

function initGame() {
  tetromino = getTetromino();
  y = -2;
  x = 3;
  window.requestAnimationFrame(drawBoard);
  window.addEventListener('keydown', handleKeyPress);
  drawBoard();
}

function drawBoard() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (gameBoard[y][x] === 1) {
        CTX.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
      }
    }
  }
  requestAnimationFrame(drawBoard)
}

function getTetromino() {
  return [
    [1,1,1],
    [0,1,0],
    [0,1,0]
  ];
}

function moveTetrominoDown() {
  y += 1;
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row - 1] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row - 1][x + column] = 0;
    }
  }
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
}

function moveTetrominoRight() {
  x += 1;
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      //if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column - 1] = 0;
    }
  }
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      //if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
}

function moveTetrominoLeft() {
  x -= 1;
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      //if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column + 1] = 0;
    }
  }
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      //if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
}

function rotateTetromino() {
  console.table(gameBoard);
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row - 1] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 0;
    }
  }
  console.table(gameBoard);
  tetromino = tetromino[0].map((val, index) => tetromino.map(row => row[index]).reverse());
  console.log(tetromino);
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
}

function handleKeyPress(ev) {
  switch(ev.key) {
    case 'ArrowDown':
      moveTetrominoDown();
      break;
    case 'ArrowRight':
      moveTetrominoRight();
      break;
    case 'ArrowLeft':
      moveTetrominoLeft();
      break;
    case 'ArrowUp':
      rotateTetromino();
      break;
    default:
      break;
  }
}

initGame();