'use strict'

function cellClicked(cell, i, j) {
    var currCell = gBoard[i][j];
    if (currCell.isMarked) return;
    if (!isFirstCellRevealed) firstCellReveal(cell, i, j);
    if (!gGame.isOn) return;
    if (currCell.isShown) return;
    if (gGame.isHint) {
        var positions = hintRevealNegs(i, j, gBoard);
        hintTimeOut = setTimeout(() => {
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
        var clearMineTimeOut = setTimeout(() => {
            cell.innerText = EMPTY;
            cell.classList.remove('mine-revaeled');
        }, 1000);
        if (currCell.isMine && gGame.lives === 0) {
            clearTimeout(clearMineTimeOut);
            clearInterval(timer);
            cell.innerText = MINE;
            cell.classList.add('mine-revaeled');
            showAllMines(gBoard, cell);
            revealAllNegsCounts(gBoard);
            var elSmile = document.querySelector('.smile');
            elSmile.innerText = LOOSE;
            gGame.isOn = false;
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
}


function fullExpand(i, j) {
    emptyPositions = revealAllNegs(i, j, gBoard);
    if (!emptyPositions.length === 0) return;
    for (var f = 0; f < emptyPositions.length; f++) {
        var currPosI = emptyPositions[f].i;
        var currPosJ = emptyPositions[f].j;
        emptyPositions.splice(f, 1);
        revealAllNegs(currPosI, currPosJ, gBoard);
    }

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
                emptyPositions.push(pos);
            }
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.innerText = (negsCount === 0) ? EMPTY : negsCount;
            elCell.classList.add('shown');
        }
    }
    console.log(emptyPositions)
    return emptyPositions;
}

function firstCellReveal(cell, i, j) {
    if (isFirstCellRevealed) return;
    var currCell = gBoard[i][j];
    currCell.isShown = true;
    gGame.shownCount++;
    if (!currCell.isMarked) revealCell(cell);
    var allCellsPos = getAllCellsPositions(gBoard);
    placeMines(gBoard, gLevel.mines, allCellsPos);
    gGame.isOn = true;
    if (!timer) timer = setInterval(updateTime, 1000);
    isFirstCellRevealed = true;
    var negsCount = setMinesNegsCount(i, j, gBoard);
    if (negsCount === 0) {
        cell.innerText = EMPTY;
        revealAllNegs(i, j, gBoard, cell);
    } else {
        cell.innerText = negsCount;
    }
    return;
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
    if (!timer) timer = setInterval(updateTime, 1000);
    cell.innerText = FLAG;
    currCell.isMarked = true;
    gGame.markedCount++;
    updateMarkedCounter();
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