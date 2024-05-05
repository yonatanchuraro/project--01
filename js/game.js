'use strict'
const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'
const size = 4
var gLevel1 = {
    SIZE: 4,
    MINES: 2
}
var gLevel2 = {
    SIZE: 8,
    MINES: 14
}
var gLevel1 = {
    SIZE: 12,
    MINES: 32
}
var gBoard = buildBoard()
var gameOver = false
const elBtn = document.querySelector('.conteiner button')


// onInit function
function onInit() {
    elBtn.innerText = '😃'
    gBoard = buildBoard()
    renderBoard(gBoard)
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
    // Then, update the minesAroundCount for cells with mines
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if ((i === 2 && j === 1 || i === 3 && j === 2)) {
                board[i][j].isMine = true
            } else {
                board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
            }
        }
    }
    return board
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


// set mines negs count function
function setMinesNegsCount(board, rowIdx, collIdx) {
    var negsCounter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > 3) continue

        for (var j = collIdx - 1; j <= collIdx + 1; j++) {
            if (j < 0 || j > 3) continue
            if (i === rowIdx && j === collIdx) continue
            if (board[i][j].isMine === true) negsCounter++
        }
    }
    return negsCounter
}


// on cell click function
function onCellClicked(elCell, i, j) {
    var sound = new Audio('js/click.mp3')
    const cell = gBoard[i][j]
    const negsCounter = setMinesNegsCount(gBoard, i, j)
    if (gameOver) {
        return
    }
    sound.play()
    elCell.style.backgroundColor = 'grey'
    if (!cell.isShown) {
        cell.isShown = true
        if (cell.isMine) {
            elCell.innerText = MINE
            gameOver = true
            gameIsOver()
            return
        }
        else {
            if (negsCounter === 0) {
                elCell.innerText = EMPTY
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
    sound.play()
    var cell = gBoard[i][j]
    if (gameOver) return
    if (!cell.isMarked) {
        cell.isMarked = true
        elCell.innerText = FLAG
    }
    checkGameOver(gBoard)
}


// game over function
function gameIsOver() {
    const elHeader =document.querySelector('h2')
    elHeader.innerText='Game Over 😭'
    const elBtn = document.querySelector('.conteiner button')
    var sound = new Audio('js/boom.mp3')
    sound.play()
    elBtn.innerText = '🥺'

}


// check game over function
function checkGameOver(board) {
    var allCellsCount = size * size
    var markedCells = 0
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            var cells = board[i][j]
            if (cells.isMarked && cells.isMine || cells.isShown) markedCells++
        }
    }
    if (allCellsCount === markedCells) victory()

}


// victory function
function victory() {
    const elHeader =document.querySelector('h2')
    elHeader.innerText='You Winn 👑'
    onInit()
    
}
