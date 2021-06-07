"use strict"
import "./styles/index.scss";
import * as Tone from 'tone';


const gameTitle = document.querySelector('h1');
const startButton = document.querySelector('.start__btn');
const reStartButton = document.querySelector('.reStart');
const start = document.querySelector('.start__content');
const startInput = document.querySelector('.start__input');
const n = document.querySelector('.n');


const state = {
  n: '',
  board: [],
  currentPlayer: 'X',
  gameActive: true,
  i: 0,
};


function appear() {
  startButton.style.transform = "scale(1)";
  startButton.style.transition = "1s";
}
appear()

function displayGamePage() {
  reStartButton.style.display = "block";
  startButton.style.display = "none";
  startInput.style.display = "none";
  start.style.position = "absolute";
  start.style.top = "5%";
  let board = document.querySelector(".board");
  // alert(document.querySelector('body').clientWidth < 500)
  if (document.querySelector('body').clientWidth < 370) {
    board.style.height = "100vmin";
    board.style.width = "100vmin";
  } else {
    board.style.height = "70vmin";
    board.style.width = "70vmin";
  }
  let X = document.createElement('div');
  let O = document.createElement('div');
  X.innerHTML = "X";
  O.innerHTML = "O";
  X.classList.add("X");
  O.classList.add("O");
  document.querySelector(".game").append(O);
  document.querySelector(".game").prepend(X);
}


function getN() {
  let nValue = '';
  nValue = n.value;

  if (nValue >= 5 && nValue <= 40) {
    state.n = parseInt(nValue);
    createBoard(nValue);
    displayGamePage();
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleClick));
  } else {
    alert('Недопустимое поле, введите число от 5 до 40')
  }
}

function createBoard(n) {
  let board = document.querySelector(".board");
  let counter = 0;
  for (let i = 0; i < n; i++) {
    let row = document.createElement("tr");
    for (let x = 0; x < n; x++) {
      let col = document.createElement("td");
      col.className = 'cell'
      col.id = counter;
      counter++;
      row.appendChild(col);
    }
    board.appendChild(row)
  }
}


function checkWinner() {
  let n = state.n;
  const board = state.board;
  for (let i = 0; i < n; i++) {
    let counter = 0;
    for (let j = 0; j < n; j++) {
      const idx = n * i + j;
      if (board[idx]) {
        if (counter == 0 || board[idx] == board[idx - 1]) {
          if (++counter == 5) {
            return Array(5)
              .fill(0)
              .map((e, i) => idx - 4 + i);
          }
        } else {
          counter = 1;
        }
      } else {
        counter = 0;
      }
    }
  } 
  for (let i = 0; i < n; i++) {
    let counter = 0;
    for (let j = 0; j < n; j++) {
      const idx = i + n * j;
      if (board[idx]) {
        if (counter == 0 || board[idx] == board[idx - n]) {
          if (++counter == 5) {
            return Array(5)
              .fill(0)
              .map((e, i) => idx - 4 * (n + n) * i);
          }
        } else {
          counter = 1;
        }
      } else {
        counter = 0;
      }
    }
  }
  for (let i = -n; i < n; i++) {
    let counter = 0;
    for (let j = 0; j < n; j++) {
      const y = i + j;
      if (y < 0 || y >= n) continue;
      const idx = y * n + j;
      if (board[idx]) {
        if (counter == 0 || board[idx] == board[idx - (n + 1)]) {
          if (++counter == 5) {
            return Array(5)
              .fill(0)
              .map((e, i) => idx - 4 * (n + 1) + (n + 1) * i);
          }
        } else {
          counter = 1;
        }
      } else {
        counter = 0;
      }
    }
  }
  for (let i = -n; i < n; i++) {
    let counter = 0;
    for (let j = 0; j < n; j++) {
      const y = i + j;
      if (y < 0 || y >= n) continue;
      const idx = y * n + (n - 1) - j;
      if (board[idx]) {
        if (counter == 0 || board[idx] == board[idx - (n - 1)]) {
          if (++counter == 5) {
            return Array(5)
              .fill(0)
              .map((e, i) => idx - 4 * (n - 1) + (n - 1) * i);
          }
        } else {
          counter = 1;
        }
      } else {
        counter = 0;
      }
    }
  }
  return Array(5).fill(-1);
}


function findWinner(cellId) {
  state.i = ++state.i;
  if (state.i == state.n * state.n) {
    state.gameActive = false;
    gameTitle.innerText = `draw`;
    gameTitle.style.color = '#ff749f';
  }
  if (!state.board[cellId] && state.gameActive) {
    fillCell(cellId);
    let el = document.getElementById(cellId);
    el.style.background = state.currentPlayer === "X" ? "#e8e69f" : "#f0dbf0";
    const result = checkWinner();
    if (result[0] != -1) {
      state.gameActive = false;
      gameTitle.innerText = `${state.board[result[0]]} win`;
      if(state.currentPlayer === "X") {
        document.querySelector(".X").classList.add("winPulse");
      }else {
        document.querySelector(".O").classList.add("winPulse");
      }
      gameTitle.style.color = '#ff749f';
    }
    changePlayer();
  }
}

function handleClick(e) {
  const clickedCell = e.target;
  const cellId = parseInt(clickedCell.id);
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(600, '9n');
  findWinner(cellId);
}


function reStart() {
  state.gameActive = true;
  state.currentPlayer = 'X';
  state.board = Array(15 * 15);
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
  location.reload();
}

function fillCell(cellId) {
  state.board[cellId] = state.currentPlayer;
}

function changePlayer() {
  state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
}

n.oninput = function () {
  document.querySelector('.nFactor').innerHTML = n.value;
}
startButton.addEventListener('click', getN);
reStartButton.addEventListener('click', reStart);