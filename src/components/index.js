import '../pages/index.css';
import {TETROMINOS} from './tetrominos.js';

const CANVAS = document.querySelector('#canvas');
CANVAS.width = 300;
CANVAS.height = 600;

const CTX = canvas.getContext('2d');
const SIZE = 30; // Размер одной клетки на канвасе
const ROWS = 20;
const COLS = 10;
let gameBoard = Array.from({length: ROWS}, () => Array(COLS).fill(0));

let tetromino;
let y = -2;
let x = 3;

function initGame() {
  tetromino = getTetromino();
  y = -tetromino.length;
  x = 3;
  window.requestAnimationFrame(drawBoard);
  window.addEventListener('keydown', handleTetrominoMovement);
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
  const ranNum = Math.floor(Math.random() * TETROMINOS.length);
  return TETROMINOS[ranNum]
}

function handleTetrominoMovement(ev) {
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

function clearPreviousPosition() {
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 0;
    }
  }
}

function setNewPosition() {
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
}

function canMoveDown(x, y) {
  if(y + tetromino.length > ROWS) {
    return false
  }
  for(let rows = 0; rows < tetromino.length; rows++) {
    for(let cols = 0; cols < tetromino[rows].length; cols++) {
      console.log('y:', y, 'rows:', rows, 'x:', x, 'cols:', cols);
      if(tetromino[rows][cols] === 0) continue // пропускаем пустые клетки в матрице тетромино
      if(gameBoard[y + rows] === undefined) continue // пропускаем несуществующие строки на доске (начальная координата минусовая)
      // проверка на движение вниз
      // заходим в цикл, если: ниже нет строки (тетромино кончилось) или если ниже в матрице тетромино 0
      if(tetromino[rows + 1] === undefined || tetromino[rows + 1][cols] === undefined || tetromino[rows + 1][cols] === 0) {
        if(gameBoard[y + rows][cols + x]) {
          console.log("столкновение!");
          return false
        }
      }
    }
  }
  return true
}

function moveTetrominoDown() {
  let newX = x;
  let newY = y + 1;
  if(canMoveDown(newX, newY)) {
    clearPreviousPosition();
    y += 1;
    setNewPosition()
  } else {
    initGame()
  }
  console.table(gameBoard);
}

function canMoveSideways(x, y) {
  let rib;
  tetromino.forEach(item => rib = item.length);
  if(x < 0 || x + rib > COLS) {
    return false
  }
  return true
}

function moveTetrominoRight() {
  let newX = x + 1;
  let newY = y;
  if(canMoveSideways(newX, newY)) {
    clearPreviousPosition();
    x += 1;
    setNewPosition();
  }
}

function moveTetrominoLeft() {
  let newX = x - 1;
  let newY = y;
  if(canMoveSideways(newX, newY)) {
    clearPreviousPosition();
    x -= 1;
    setNewPosition();
  }
}

function rotateTetromino() {
  clearPreviousPosition();
  tetromino = tetromino[0].map((val, index) => tetromino.map(row => row[index]).reverse());
  if(canMoveDown())
    setNewPosition()
  else console.log("нельзя вращать, кончается доска!");
  //console.table(gameBoard);
}

initGame();