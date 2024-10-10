import '../pages/index.css';
import {TETROMINOS} from './tetrominos.js';

const SCORES = document.querySelector('#scores');
const LEVEL = document.querySelector('#level');
const GAMEOVERDIV = document.querySelector('#gameOver');
const GAMEOVERMES = GAMEOVERDIV.querySelector('#gameOverMessage');

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

let scores = 0;
let level = 1;
let speed = 1000; //ms

SCORES.textContent = scores;
LEVEL.textContent = level;

function initGame() {
  if(checkGameBoardOverflow()) {
    window.removeEventListener('keydown', handleTetrominoMovement);
    showGameOverDiv();
    return
  } else {
      const {res, rowsForDeletion} = checkFilledRows();
      if(res) {
        removeFilledRows(rowsForDeletion);
      }
      tetromino = getTetromino();
      y = -tetromino.length;
      x = 3;
      drawBoard();
      window.addEventListener('keydown', handleTetrominoMovement);  
  }
}

function updateLevel() {
  if(scores % 80 === 0) {
    level+=1;
    LEVEL.textContent = level;
    speed -= 100;
    clearInterval(intervalId);
    intervalId = setInterval(moveTetrominoDown, speed);
  };
}

function showGameOverDiv() {
  GAMEOVERDIV.style.visibility = "visible";
  GAMEOVERMES.textContent = "GAME OVER";
  CANVAS.style.filter = 'blur(2px)';
  CTX.globalAlpha = 0.6;
}

function checkGameBoardOverflow() {
  if(gameBoard[0].includes(1)) return true
  return false
}

function checkFilledRows() {
  let res = false;
  let rowsForDeletion = [];
  for(let rows = 0; rows < ROWS; rows++) {
    if(gameBoard[rows].every(cell => cell === 1)) {
      rowsForDeletion.push(rows);
      res = true;
    }
  }
  return {res, rowsForDeletion};
}

function removeFilledRows(rows) {
  rows.forEach(row => {
    gameBoard.splice(row, 1);
    gameBoard.unshift(Array(COLS).fill(0));
  });
  //gameBoard.splice(rows,1);
  scores += COLS;
  updateScores();
}

function updateScores() {
  SCORES.textContent = scores;
  updateLevel();
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

function canMoveSideways(x, y) {
  let rib;
  tetromino.forEach(item => rib = item.length);
  if(x < 0 || x + rib > COLS) {
    return false
  }
  return true
}

function canMoveDown(x, y) {
  if(y + tetromino.length > ROWS) {
    return false
  }
  for(let rows = 0; rows < tetromino.length; rows++) {
    for(let cols = 0; cols < tetromino[rows].length; cols++) {
      if(tetromino[rows][cols] === 0) continue // пропускаем пустые клетки в матрице тетромино
      if(gameBoard[y + rows] === undefined) continue // пропускаем несуществующие строки на доске (начальная координата минусовая)
      // проверка на движение вниз
      // заходим в цикл, если: ниже нет строки (тетромино кончилось) или если ниже в матрице тетромино 0
      if(tetromino[rows + 1] === undefined || tetromino[rows + 1][cols] === undefined || tetromino[rows + 1][cols] === 0) {
        if(gameBoard[y + rows][cols + x]) {
          return false
        }
      }
    }
  }
  return true
}

function canMoveLeft(x, y) {
  for(let rows = 0; rows < tetromino.length; rows++) {
    for(let cols = 0; cols < tetromino[rows].length; cols++) {
      if(tetromino[rows][cols] === 0) continue
      if(tetromino[rows] === undefined || tetromino[rows][cols - 1] === 0 || tetromino[rows][cols - 1] === undefined) {
        if(gameBoard[y + rows] === undefined) continue;
        if(gameBoard[y + rows][cols + x]) {
          return false
        }
      }
    }
  }
  return true
}

function canMoveRight(x, y) {
  // TODO: проверить на коллизии слева и справа
  for(let rows = 0; rows < tetromino.length; rows++) {
    for(let cols = 0; cols < tetromino[rows].length; cols++) {
      if(tetromino[rows][cols] === 0) continue
      if(tetromino[rows] === undefined || tetromino[rows][cols + 1] === 0 || tetromino[rows][cols + 1] === undefined) {
        if(gameBoard[y + rows] === undefined) continue;
        if(gameBoard[y + rows][cols + x]) {
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
    setNewPosition();
  } else {
    initGame();
  }
}

function moveTetrominoRight() {
  let newX = x + 1;
  let newY = y;
  if(canMoveSideways(newX, newY) && canMoveRight(newX, newY)) {
    clearPreviousPosition();
    x += 1;
    setNewPosition();
  }
}

function moveTetrominoLeft() {
  let newX = x - 1;
  let newY = y;
  if(canMoveSideways(newX, newY) && canMoveLeft(newX, newY)) {
    clearPreviousPosition();
    x -= 1;
    setNewPosition();
  }
}

function rotateTetromino() {
  let copiedGameboard = JSON.parse(JSON.stringify(gameBoard));
  clearPreviousPosition();
  let newTetromino = tetromino[0].map((val, index) => tetromino.map(row => row[index]).reverse());
  let previousTetromino = tetromino;
  tetromino = newTetromino;
  x = x;
  y = y;
  if(canMoveDown(x,y) && canMoveSideways(x,y) && canMoveLeft(x,y) && canMoveRight(x,y)) {
    clearPreviousPosition();
    setNewPosition();
  } else {
    tetromino = previousTetromino;
    gameBoard = copiedGameboard;
  };
}

function drawBoard() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (gameBoard[y][x] === 1) {
        CTX.fillStyle = '#000001';
        CTX.fillRect(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
      }
    }
  };
  requestAnimationFrame(drawBoard);
}

initGame();
let intervalId = setInterval(moveTetrominoDown, speed);