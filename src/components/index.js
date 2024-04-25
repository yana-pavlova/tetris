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
  y = -2;
  x = 3;
  window.requestAnimationFrame(drawBoard);
  window.addEventListener('keydown', handleTetrominoMovement);
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

function moveTetrominoDown() {
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 0;
    }
  }
  y += 1;
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
}

function moveTetrominoRight() {
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 0;
    }
  }
  x += 1;
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
}

function moveTetrominoLeft() {
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 0;
    }
  }
  x -= 1;
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
}

function rotateTetromino() {
  console.table(gameBoard);
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 0;
    }
  }
  tetromino = tetromino[0].map((val, index) => tetromino.map(row => row[index]).reverse());
  for(let row = 0; row < tetromino.length; row++) {
    for(let column = 0; column < tetromino[row].length; column++) {
      if(gameBoard[y + row] === undefined) continue;
      if(tetromino[row][column] !== 1) continue;
      gameBoard[y + row][x + column] = 1;
    }
  }
  console.table(gameBoard);
}

initGame();