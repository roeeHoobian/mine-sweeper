'use strict'

var isFirstCellRevealed = false;

function firstCellReveal(cell, i, j) {
    if (isFirstCellRevealed) return;
    var currCell = gBoard[i][j];
    currCell.isShown = true;
    gGame.shownCount++;
    if (!currCell.isMarked) revealCell(cell);
    var allCellsPos = getAllCellsPositions(gBoard);
    placeMines(gBoard, gLevel.mines, allCellsPos);
    gGame.isOn = true;
    timer = setInterval(updateTime, 1000);
    isFirstCellRevealed = true;
    var negsCount = setMinesNegsCount(i, j, gBoard);
    cell.innerText = (negsCount === 0) ? EMPTY : negsCount;
    if (negsCount === 0) {
        revealAllNegs(i, j, gBoard, cell);
    }
    return;
}

function cellClicked(cell, i, j) {
    checkGameOver(gBoard);
    var currCell = gBoard[i][j];
    if (currCell.isMarked) return;
    firstCellReveal(cell, i, j);
    if (!gGame.isOn) return;
    if (currCell.isShown) return;
    else currCell.isShown = true;
    if (currCell.isMine) {
        cell.innerText = MINE;
        cell.classList.add('mine-revaeled');
        gGame.lives--;
        updateLives();
        if (currCell.isMine && gGame.lives === 0) {
            clearInterval(timer)
            cell.innerText = MINE;
            showAllMines(gBoard, cell);
            cell.classList.add('mine-revaeled');
            revealAllNegsCounts(gBoard);
            gGame.isOn = false;
        }
    } else {
        gGame.shownCount++;

        revealCell(cell);
        var negsCount = setMinesNegsCount(i, j, gBoard);
        cell.innerText = (negsCount === 0) ? EMPTY : negsCount;
        if (negsCount === 0) {
            revealAllNegs(i, j, gBoard, cell);

        }
    }

}

function revealAllNegsCounts(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) continue;
            var negsCount = setMinesNegsCount(i, j, board)
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.innerText = negsCount;
            elCell.classList.add('shown');
            board[i][j].isShown = true;
        }
    }
}


function revealAllNegs(iPos, jPos, board) {
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= board.length || i === iPos && j === jPos) continue;
            var negsCount = setMinesNegsCount(i, j, board)
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.innerText = negsCount;
            elCell.classList.add('shown');
            board[i][j].isShown = true;
            gGame.shownCount++;
        }
    }
}

function markCell(cell, i, j) {
    var currCell = gBoard[i][j];
    if (currCell.isMine && !gGame.isOn) return;
    if (currCell.isMarked) {
        cell.innerText = EMPTY;
        currCell.isMarked = false;
        gGame.markedCount--;
        return;
    }
    if (currCell.isShown) return;
    cell.innerText = FLAG;
    currCell.isMarked = true;
    gGame.markedCount++;
    console.log(cell)
        // firstCellReveal(cell, i, j);
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

//find the number of mine nieghbors
function setMinesNegsCount(iPos, jPos, board) {
    var minesCounter = 0;
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= board.length || i === iPos && j === jPos) continue;
            if (board[i][j].isMine) minesCounter++
        }
    }
    return minesCounter
}


function revealCell(cell) {
    cell.classList.add('shown')
}

window.oncontextmenu = (e) => {
    e.preventDefault();
}