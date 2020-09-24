'use strict'
var gBoard;
var gLevel = {
    size: 8,
    mines: 12,
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    difficulty: 'MEDIUM',
    bestTimeEasy: Infinity,
    bestTimeMedium: Infinity,
    bestTimeHard: Infinity,
    hints: 3,
    safeMoves: 3,
    isHint: false
}
var isFirstCellRevealed = false;
var emptyPositions = [];
var timer;
var hintTimeOut;

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
const LIVE = '🖤';
const PLAYER = '🙂';
const WON = '😎';
const LOOSE = '🤯';
const HINT = '👁️‍🗨️';
const SAFE = '☮️';

function init() {
    clearInterval(timer);
    initStats();
    updateLives();
    updateTime();
    gBoard = buildBoard();
    renderBoard(gBoard);
    updateBestTime(gGame.difficulty);
    updateHints();
    updateSafes();
}

function initStats() {
    timer = 0;
    gGame.lives = 3;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.hints = 3;
    gGame.safeMoves = 3;
    gGame.isHint = false;
    gGame.isOn = false;
    isFirstCellRevealed = false;
    var elSmile = document.querySelector('.smile');
    elSmile.innerText = PLAYER;
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return board;
}

function renderBoard(board) {
    var htmlStr = '';
    for (var i = 0; i < board.length; i++) {
        htmlStr += '<tr>';
        for (var j = 0; j < board.length; j++) {
            htmlStr += `<td class = "cell${i}-${j}" onclick = 
            "cellClicked(this,${i},${j})"
             oncontextmenu="markCell(this,${i},${j})">`;
            htmlStr += '</td>';
        }
        htmlStr += '</td>';
    }
    var elTable = document.querySelector('.mines-table');
    elTable.innerHTML = htmlStr;
}

function placeMines(board, minesQty, cellsPos) {
    for (var i = 0; i < minesQty; i++) {
        var randIdx = Math.floor(Math.random() * cellsPos.length);
        var currPos = cellsPos.splice(randIdx, 1);
        board[currPos[0].i][currPos[0].j].isMine = true;
    }
}

function chooseDifficulty(btn, size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    var elButtons = document.querySelectorAll('.dificultty-btn');
    for (var i = 0; i < elButtons.length; i++) {
        elButtons[i].classList.remove('choosen-btn');
    }
    btn.classList.add('choosen-btn');
    gGame.difficulty = btn.innerText;
    init();
}

function checkGameOver() {
    console.log()
    console.log()
    console.log()
    if (gGame.markedCount === gLevel.mines &&
        gGame.shownCount === (gLevel.size ** 2 - gLevel.mines)) {
        clearInterval(timer);
        var elSmile = document.querySelector('.smile');
        elSmile.innerText = WON;
        SaveBestTime(gGame.difficulty, gGame.secsPassed);
        updateBestTime(gGame.difficulty);
        gGame.isOn = false;
        return true;
    } else {
        return false;
    }
}

function useSafe(elSafe) {
    if (elSafe.classList.contains('safe-used')) return;
    if (!isFirstCellRevealed) {
        alert('Sorry, You Cant Use "SAFE-MOVE" On First Move.')
        return;
    }
    elSafe.classList.add('safe-used');
    gGame.safeMoves--;
    var emptyCells = getAllEmptyCells(gBoard);
    var randIdx = Math.floor(Math.random() * emptyCells.length + 1);
    var currCell = emptyCells.splice(randIdx, 1);
    var currPos = {
        i: +`${currCell[0].i}`,
        j: +`${currCell[0].j}`
    };
    var elCell = document.querySelector(`.cell${currPos.i}-${currPos.j}`)
    elCell.classList.add('safe-cell')
    setTimeout(() => {
        elCell.classList.remove('safe-cell')
    }, 500);
    console.log(elCell)
}

function updateSafes() {
    var elSafe;
    for (var i = 0; i < gGame.safeMoves; i++) {
        elSafe = document.querySelector(`.safe${i}`);
        elSafe.innerText = SAFE;
    }
    if (!gGame.isOn) {
        for (var i = 0; i < gGame.safeMoves; i++) {
            elSafe = document.querySelector(`.safe${i}`);
            elSafe.classList.remove('safe-used');
        }
    }
}

function useHint(elHint) {
    if (elHint.classList.contains('hint-used')) return;
    if (!isFirstCellRevealed) {
        alert('Sorry, You Cant Use "Hint" On First Move.')
        return;
    }
    gGame.isHint = true;
    elHint.classList.add('hint-used');
    gGame.hints--;
}

function updateHints() {
    var elHint;
    for (var i = 0; i < gGame.hints; i++) {
        elHint = document.querySelector(`.hint${i}`);
        elHint.innerText = HINT;
    }
    if (!gGame.isOn) {
        for (var i = 0; i < gGame.hints; i++) {
            elHint = document.querySelector(`.hint${i}`);
            elHint.classList.remove('hint-used');
        }
    }
}

function updateLives() {
    var elLives = document.querySelector('.lives-span');
    var liveStr = '';
    for (var i = 0; i < gGame.lives; i++) {
        liveStr += LIVE;
    }
    elLives.innerText = liveStr
}