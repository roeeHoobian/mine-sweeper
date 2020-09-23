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
}
var timer;


const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
const LIVE = '🖤';

function checkGameOver() {
    console.log('marked:', gGame.markedCount)
    console.log('mines:', gLevel.mines)
    console.log('showed:', gGame.shownCount)
    console.log('total minus mines:', gLevel.size ** 2 - gLevel.mines)
    if (gGame.markedCount === gLevel.mines && gGame.shownCount === (gLevel.size ** 2 - gLevel.mines)) {
        return true;
    } else {
        return false;
    }
}



function init() {
    clearInterval(timer);
    gGame.lives = 3;
    updateLives();
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    updateTime();
    gGame.isOn = false;
    isFirstCellRevealed = false;
    gBoard = buildBoard();
    renderBoard(gBoard);
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

function chooseDifficulty(btn, size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    var elButtons = document.querySelectorAll('.dificultty-btn');
    for (var i = 0; i < elButtons.length; i++) {
        elButtons[i].classList.remove('choosen-btn');
    }
    btn.classList.add('choosen-btn');
    init();
}


function getAllCellsPositions(board) {
    var cellsPositions = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isShown) continue;
            var currPos = { i: i, j: j }
            cellsPositions.push(currPos);
        }

    }
    return cellsPositions;
}


function placeMines(board, minesQty, cellsPos) {
    for (var i = 0; i < minesQty; i++) {
        var randIdx = Math.floor(Math.random() * cellsPos.length);
        var currPos = cellsPos.splice(randIdx, 1);
        board[currPos[0].i][currPos[0].j].isMine = true;
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


function updateTime() {
    var elTimer = document.querySelector('.timer-span');
    elTimer.innerText = gGame.secsPassed < 10 ? `00${gGame.secsPassed}` : `0${gGame.secsPassed}`;
    gGame.secsPassed++;
}