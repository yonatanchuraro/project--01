'use strict'
const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'
const LIFE = '❤️'

const elHeader = document.querySelector('h2')
const elBtn = document.querySelector('.conteiner button')
const elFlagCounter = document.querySelector('.flag')
const elMineCounter = document.querySelector('.mine')
const elLife = document.querySelector('.life')

var size = 4
var minesCount = 2
var flagCounter = minesCount
var lifeCounter = 3
var gStarterInterval
var gBoard = buildBoard()
var gameOver = false


// onInit function
function onInit() {

    clearInterval(gStarterInterval)
    elBtn.innerText = '😃'
    elHeader.innerText = ''

    // implement the function of the game
    gBoard = buildBoard()
    setMine(gBoard)
    renderBoard(gBoard)

    //restet the life/mine/flag counters
    lifeCounter = 3
    flagCounter = minesCount
    gameOver = false
    elFlagCounter.innerText = `${FLAG}: ${minesCount}`
    elMineCounter.innerText = `${MINE}: ${minesCount}`
    elLife.innerText = `${LIFE}: ${lifeCounter}`
}


// build board function
function buildBoard() {
    var board = []
    // First, build the entire board
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}


// set mines and their negs function
function setMine(gBoard) {
    var minesPlaced = 0

    while (minesPlaced < minesCount) {
        var randI = getRandomInt(0, gBoard.length)
        var randJ = getRandomInt(0, gBoard.length)

        var cell = gBoard[randI][randJ]
        if (!cell.isMine) {
            cell.isMine = true
            minesPlaced++
            console.log("Mine placed at:", randI, randJ)
        }
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                var cell = gBoard[i][j];
                if (!cell.isMine) {
                    cell.minesAroundCount = setMinesNegsCount(gBoard, i, j)
                }
            }
        }
    }

}


// render board function
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})"
            oncontextmenu="onRightClick(this,${i},${j})">${EMPTY}</td>`
        }


        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


// change level function
function changeLevel(newSize, newMinesCount) {
    var sound = new Audio('js/butoon.mp3')
    size = newSize
    minesCount = newMinesCount
    sound.play()
    onInit()
}


// set mines negs count function
function setMinesNegsCount(board, rowIdx, collIdx) {
    var negsCounter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = collIdx - 1; j <= collIdx + 1; j++) {

            if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
                if (!(i === rowIdx && j === collIdx) && board[i][j].isMine === true) {
                    negsCounter++
                }
            }
        }
    }
    return negsCounter
}


// on cell click function
function onCellClicked(elCell, i, j) {
    var sound = new Audio('js/click.mp3')
    const cell = gBoard[i][j]
    const negsCounter = setMinesNegsCount(gBoard, i, j)
    if (gameOver) return

    sound.play()
    elCell.style.backgroundColor = 'grey'

    if (!cell.isShown) {
        cell.isShown = true

        if (cell.isMine) {
            var sound1 = new Audio('js/boom.mp3')
            sound1.play()
            mineExplode(elCell)

            if (lifeCounter === 0) {
                gameOver = true
                gameIsOver()
                return
            }
        }

        else {
            if (negsCounter === 0) {
                elCell.innerText = EMPTY
                expandShown(gBoard, elCell, i, j)
            }
            else {
                elCell.innerText = negsCounter
            }

        }
    }
    checkGameOver(gBoard)
}


// on right click function
function onRightClick(elCell, i, j) {
    var sound = new Audio('js/click.mp3')
    var elFlagCounter = document.querySelector('.flag')
    var cell = gBoard[i][j]

    elFlagCounter.innerText = `${FLAG}: ${minesCount}`

    if (flagCounter <= 0) return
    flagCounter--
    elFlagCounter.innerText = `${FLAG}:${flagCounter}`
    sound.play()

    if (gameOver) return
    if (!cell.isMarked) {
        cell.isMarked = true
        elCell.innerText = FLAG
    }
    checkGameOver(gBoard)
}


// one safe cell clicked function
function expandShown(board, elCell, rowIdx, colIdx) {
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) {
                continue
            }
            if (i === rowIdx && j === colIdx) {
                continue
            }
            const cell = board[i][j];
            const elCells = document.querySelector(`.cell-${i}-${j}`)

            if (!cell.isShown && !cell.isMine && !cell.isMarked) {
                cell.isShown = true;
                elCells.style.backgroundColor = 'grey'

                if (cell.minesAroundCount === 0) {
                    expandShown(board, elCells, i, j)
                } else {
                    elCells.innerText = cell.minesAroundCount
                }
            }
        }
    }
}


// game over function
function gameIsOver() {
    var sound = new Audio('js/gameover.mp3')
    sound.play()
    elHeader.innerText = 'Game Over 😭'
    elBtn.innerText = '🤯'
    gStarterInterval = setInterval(onInit, 4000)

}


// check game over function
function checkGameOver(board) {
    var allCellsCount = size * size
    var markedCells = 0
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            if (cell.isMarked && cell.isMine || cell.isShown) markedCells++
        }
    }
    if (allCellsCount === markedCells) victory()

}


// victory function
function victory() {
    var sound = new Audio('js/win.mp3')
    sound.play()
    elHeader.innerText = 'You Winn 👑'
    elBtn.innerText = '😎'
    gStarterInterval = setInterval(onInit, 4000)

}


// step on mine function
function mineExplode(elCell) {
    var sound = new Audio('js/looselife.mp3')
    sound.play()
    elCell.innerText = MINE
    lifeCounter--
    elLife.innerText = `${LIFE}: ${lifeCounter}`
    // alert(`oops you steped on mine😭 but you have more${lifeCounter}  lifes`)
}
