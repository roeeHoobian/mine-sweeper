'use strict'

function showInfo() {
    var htmlStr = `<div class="modal-blackout"></div>
                    <div class="modal-body">
                        <div class="modal-header">
                            <button class="close-modal-btn" onclick="closeModal()">X</button>
                            <h1>Information</h1>
                        </div>
                        <p>🖤🖤🖤 - Lives - If by mistake you blowed yourself up three times
                                      the game will over. </p>
                         <p>💣X 12 - This counter show you how many mines
                                      there on the board. you need the mark 
                                      all of them with red flags to win the game.</p>
                            <p>🚩 - Red flag - You put it with right click on a cell </p>
                            <p>⏰ - The timer - You need to find all the mines as fast as you can.</p>
                            <p>👁️‍🗨️ - Hint - Press on it and then press on the board. it will give you
                            a quick peek to the neighbors of the desired cell.</p>
                            <p>☮️ - Safe Spot- Use it to get a sure cell to click on. (pay attention:
                                the safe spot apears for very short time).</p>
                               <p><img style="width: 30px;" src="./imges/undo-btn.png" > - Undo - This 
                               button let you go back one step on each press.</p>
                             <p>  <img style="width: 10px;" src="./imges/shovel.png"> - Manual Mode - 
                             press once, then place mines wherever you want, then press again to play.</p>
                    </div>`;
    var elBody = document.querySelector('body');
    elBody.innerHTML += htmlStr;
}

function closeModal() {
    document.querySelector('.modal-blackout').remove();
    document.querySelector('.modal-body').remove();
}


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