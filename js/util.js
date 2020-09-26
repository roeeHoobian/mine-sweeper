'use strict'

function SaveBestTime(difficulty, time) {
    if (!time) return;
    switch (difficulty) {
        case 'EASY':
            if (time < gGame.bestTimeEasy && time > 0) {
                gGame.bestTimeEasy = time - 1;
                localStorage.setItem("bestTimeEasy", time);
            }
            break;
        case 'MEDIUM':
            if (time < gGame.bestTimeMedium && time > 0) {
                gGame.bestTimeMedium = time - 1;
                localStorage.setItem("bestTimeMedium", time);
            }
            break;
        case 'HARD':
            if (time < gGame.bestTimeHard && time > 0) {
                gGame.bestTimeHard = time - 1;
                localStorage.setItem("bestTimeHard", time);
            }
            break;
    }
}

function updateBestTime(difficulty) {
    var bestTime = document.querySelector('.best-time-container');
    bestTime.classList.add('hidden');
    switch (difficulty) {
        case 'EASY':
            if (!localStorage.getItem("bestTimeEasy")) return;
            gGame.bestTimeEasy = localStorage.getItem("bestTimeEasy");
            if (gGame.bestTimeEasy) {
                var elBestTime = document.querySelector('.best-time');
                elBestTime.innerText = `${gGame.bestTimeEasy - 1} sec`;
                bestTime.classList.remove('hidden');
            }
            break;
        case 'MEDIUM':
            if (!localStorage.getItem("bestTimeMedium")) return;
            gGame.bestTimeMedium = localStorage.getItem("bestTimeMedium");
            if (gGame.bestTimeMedium) {
                var elBestTime = document.querySelector('.best-time');
                elBestTime.innerText = `${gGame.bestTimeMedium - 1} sec`;
                bestTime.classList.remove('hidden');
            }
            break;
        case 'HARD':
            if (!localStorage.getItem("bestTimeHard")) return;
            gGame.bestTimeHard = localStorage.getItem("bestTimeHard");
            if (gGame.bestTimeHard) {
                var elBestTime = document.querySelector('.best-time');
                elBestTime.innerText = `${gGame.bestTimeHard - 1} sec`;
                bestTime.classList.remove('hidden');
            }
            break;
    }
}

function getAllEmptyCells(board) {
    var emptyCellPositions = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];
            if (currCell.isShown) continue;
            if (currCell.isMine) continue;
            if (currCell.isMarked) continue;
            var currPos = { i: i, j: j };
            emptyCellPositions.push(currPos);
        }
    }
    return emptyCellPositions;
}

function getAllCellsPositions(board) {
    var cellsPositions = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isShown) continue;
            var currPos = { i: i, j: j };
            cellsPositions.push(currPos);
        }
    }
    return cellsPositions;
}

function updateTime() {
    var elTimer = document.querySelector('.timer-span');
    if (gGame.secsPassed < 10) {
        elTimer.innerText = `00${gGame.secsPassed}`;
    } else if (gGame.secsPassed < 99) {
        elTimer.innerText = `0${gGame.secsPassed}`;
    } else {
        elTimer.innerText = gGame.secsPassed;
    }
    gGame.secsPassed++;
}

function revealAllNegsCounts(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) continue;
            var negsCount = setMinesNegsCount(i, j, board);
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.innerText = (negsCount === 0) ? EMPTY : negsCount;
            elCell.classList.add('shown');
            board[i][j].isShown = true;
        }
    }
}

function showAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) {
                var currCell = document.querySelector(`.cell${i}-${j}`);
                currCell.innerText = MINE;
            }
        }
    }
}


window.oncontextmenu = (e) => {
    e.preventDefault();
}