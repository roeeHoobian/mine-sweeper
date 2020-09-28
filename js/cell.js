'use strict'

function cellClicked(cell, i, j) {
    var currCell = gBoard[i][j];
    if (gGame.isManualMode) {
        currCell.isMine = true;
        cell.innerText = MINE
        gGame.isMineSet = true;
        gLevel.mines++;
        updateMinesCounter();
    }
    if (currCell.isMarked) return;
    if (!isFirstCellRevealed && !gGame.isMineSet) firstCellReveal(cell, i, j);
    if (!gTimer && isFirstCellRevealed) {
        gTimer = setInterval(updateTime, 1000);
    }
    if (!gGame.isOn) return;
    if (currCell.isShown) return;
    if (gGame.isHint) {
        var positions = hintRevealNegs(i, j, gBoard);
        gHintTimeOut = setTimeout(() => {
            gGame.isHint = false;
            hintHideNegs(positions, gBoard, i, j);
        }, 600);
        return;
    }
    if (currCell.isMine) {
        blastEffect();
        cell.innerText = MINE;
        cell.classList.add('mine-revaeled');
        gGame.lives--;
        updateLives();
        gHideMineTimeOut = setTimeout(() => {
            cell.innerText = EMPTY;
            cell.classList.remove('mine-revaeled');
        }, 1000);
        if (gGame.lives === 0) {
            gameOver(cell);
        }
    } else {
        currCell.isShown = true;
        gGame.shownCount++;
        checkGameOver(gBoard);
        revealCell(cell);
        var negsCount = setMinesNegsCount(i, j, gBoard);
        cell.innerText = (negsCount === 0) ? EMPTY : negsCount;
        if (negsCount === 0) {
            fullExpand(i, j);
        }
    }
    saveMove();
}

function fullExpand(i, j) {
    revealAllNegs(i, j, gBoard);
    if (!gEmptyPositions.length) return;
    for (var f = 0; f < gEmptyPositions.length; f++) {
        var currPosI = gEmptyPositions[f].i;
        var currPosJ = gEmptyPositions[f].j;
        gEmptyPositions.splice(f, 1)
        revealAllNegs(currPosI, currPosJ, gBoard);
    }
    fullExpand(i, j);

}

function firstCellReveal(cell, i, j) {
    if (gGame.isManualMode) return;
    if (isFirstCellRevealed) return;
    var currCell = gBoard[i][j];
    currCell.isShown = true;
    gGame.shownCount++;
    if (!currCell.isMarked) revealCell(cell);
    var allCellsPos = getAllCellsPositions(gBoard);
    placeMines(gBoard, gLevel.mines, allCellsPos);
    gGame.isOn = true;
    if (!gTimer) gTimer = setInterval(updateTime, 1000);
    isFirstCellRevealed = true;
    var negsCount = setMinesNegsCount(i, j, gBoard);
    if (negsCount === 0) {
        cell.innerText = EMPTY;
        revealAllNegs(i, j, gBoard, cell);
    } else {
        cell.innerText = negsCount;
    }
    saveMove();

    return;
}


function revealAllNegs(iPos, jPos, board) {
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= board.length || i === iPos && j === jPos) continue;
            var currCell = board[i][j];
            if (currCell.isMine) continue;
            if (currCell.isShown) continue;
            if (currCell.isMarked) continue;
            currCell.isShown = true;
            gGame.shownCount++;
            var negsCount = setMinesNegsCount(i, j, board);
            if (!negsCount) {
                var pos = { i: i, j: j };
                gEmptyPositions.push(pos);
            }
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.innerText = (negsCount === 0) ? EMPTY : negsCount;
            elCell.classList.add('shown');
        }
    }
}


function gameOver(cell) {
    clearInterval(gTimer);
    clearTimeout(gHideMineTimeOut);
    cell.innerText = MINE;
    cell.classList.add('mine-revaeled');
    showAllMines(gBoard, cell);
    revealAllNegsCounts(gBoard);
    var elSmile = document.querySelector('.smile');
    elSmile.innerText = LOOSE;
    gGame.isOn = false;
}


function hintHideNegs(positions, board) {
    for (var h = 0; h < positions.length; h++) {
        var currPos = { i: +`${positions[h].i}`, j: +`${positions[h].j}` }
        var elCell = document.querySelector(`.cell${currPos.i}-${currPos.j}`);
        var cell = board[currPos.i][currPos.j]
        elCell.classList.remove('shown');
        if (cell.isMine) {
            elCell.innerText = '';
        } else if (cell.isMarked) {
            elCell.innerText = FLAG;
        } else {
            elCell.innerText = EMPTY;
        }

    }
}


function hintRevealNegs(iPos, jPos, board) {
    gGame.isHint = false;
    clearPrevNegs(gPrevPositions);
    var elCell;
    var tempPositions = [];
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            var currCell = board[i][j];
            if (currCell.isShown) continue;
            var negsCount = setMinesNegsCount(i, j, board);
            elCell = document.querySelector(`.cell${i}-${j}`);
            if (currCell.isMine) {
                elCell.innerText = MINE;
            } else {
                elCell.innerText = (negsCount === 0) ? 0 : negsCount;
            }
            var tempPos = { i: +`${i}`, j: +`${j}` };
            tempPositions.push(tempPos);
        }
    }
    return tempPositions;
}


function markCell(cell, i, j) {
    var currCell = gBoard[i][j];
    if (currCell.isMine && !gGame.isOn) return;
    if (cell.classList.contains('mine-revaeled')) return;
    if (currCell.isMarked) {
        cell.innerText = EMPTY;
        currCell.isMarked = false;
        gGame.markedCount--;
        updateMarkedCounter();
        return;
    }
    if (currCell.isShown) return;
    if (!gTimer) gTimer = setInterval(updateTime, 1000);
    cell.innerText = FLAG;
    currCell.isMarked = true;
    gGame.markedCount++;
    updateMarkedCounter();
    saveMove();
    checkGameOver(gBoard);
}


function setMinesNegsCount(iPos, jPos, board) {
    var minesCounter = 0;
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= board.length || i === iPos && j === jPos) continue;
            if (board[i][j].isMine) minesCounter++;
        }
    }
    return minesCounter;
}


function borderNegs(iPos, jPos) {
    if (!gGame.isHint) return;
    var tempPos = { i: iPos, j: jPos };
    gPrevPositions.push(tempPos);

    var elCell;
    var tempPositions = [];
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            var currCell = gBoard[i][j];
            if (currCell.isShown) continue;
            tempPos = { i: +`${i}`, j: +`${j}` };
            tempPositions.push(tempPos);
            for (var n = 0; n < tempPositions.length; n++) {
                elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.classList.add('shown');
            }
        }
    }
}


function clearPrevNegs(gPrevPos) {
    if (!gGame.isHint) return;
    if (!gPrevPos.length) return;
    var iPos = gPrevPos[gPrevPos.length - 1].i;
    var jPos = gPrevPos[gPrevPos.length - 1].j;
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            var currCell = gBoard[i][j];
            if (currCell.isShown) continue;
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.classList.remove('shown');
        }
    }
}


function revealCell(cell) {
    cell.classList.add('shown');
}


function blastEffect() {
    var body = document.querySelector('body');
    body.classList.add('blasted');
    setTimeout(() => {
        body.classList.remove('blasted');

    }, 80);
}