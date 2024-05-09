'use strict'
const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'
const LIFE = '❤️'

const elBtn = document.querySelector('.conteiner button')
const elHintBtn = document.querySelector('.hint')
const elFlagCounter = document.querySelector('.flag')
const elMineCounter = document.querySelector('.mine')
const elLife = document.querySelector('.life')

var manualyMineCount = 0
var size = 4
var minesCount = 2
var flagCounter = 2
var lifeCounter = 3
var hintCount
var gStarterInterval
var gBoard = buildBoard()
var gameOver = false
var isFirstClick
var isManualy
var isManualGameRun


// onInit function
function onInit() {
    isFirstClick = true
    isManualy = false
    isManualGameRun = false
    clearInterval(gStarterInterval)
    elBtn.innerText = '😃'
    elHintBtn.innerText = '💡💡💡'

    // implement the function of the game
    gBoard = buildBoard()
    if (!isManualy) renderBoard(gBoard)

    //restet the life/mine/flag counters
    manualyMineCount = 0
    lifeCounter = 3
    hintCount = 3
    if (size === 4) {
        minesCount = 2
        lifeCounter = 2
    }

    if (size === 8) minesCount = 14
    if (size === 12) minesCount = 32
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
        if (!cell.isMine && !isManualGameRun) {
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


// set mines manualy function
function setMinesManualy() {
    isManualy = true
    isFirstClick = false
    alert('your playing in manual mode⚙️  you got 5 second to place your mines')
}


// function manualy game
function startManualGame() {
    isManualGameRun = true
    isManualy = false
    gameOver = false
    flagCounter = manualyMineCount
    minesCount = manualyMineCount
    lifeCounter = 3
    elFlagCounter.innerText = `${FLAG}: ${flagCounter}`;
    elMineCounter.innerText = `${MINE}: ${minesCount}`;
    elLife.innerText = `${LIFE}: ${lifeCounter}`;

}


// hide mines in manual game function
function hideMinesManualy(elCell) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                cell.isShown = false
                elCell.innerText = EMPTY
                elCell.style.backgroundColor = 'lightslategrey'
            }
        }
    }
    manualyMineCount++
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
function changeLevel(newSize) {
    var sound = new Audio('js/butoon.mp3')
    size = newSize
    if (newSize === 4) minesCount = 2
    if (newSize === 8) minesCount = 14
    if (newSize === 12) minesCount = 32
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


// on first click function
function onFirstClick(elCell) {
    elCell.style.backgroundColor = 'grey'
    isFirstClick = false
    setMine(gBoard)
    return
}


// on cell click function
function onCellClicked(elCell, i, j) {
    var sound = new Audio('js/click.mp3')
    const cell = gBoard[i][j]
    const negsCounter = setMinesNegsCount(gBoard, i, j)
    if (gameOver) return

    if (!isManualy) {
        sound.play()
        elCell.style.backgroundColor = 'grey'

        if (isFirstClick && !cell.isShown) {
            onFirstClick(elCell)
            cell.isShown = true
            return
        }


        if (!cell.isShown) {
            cell.isShown = true

            if (cell.isMine) {
                mineExplode(elCell)

                if (lifeCounter === 0) {
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
    }
    else {
        if (!cell.isMine) {
            cell.isMine = true
            cell.isShown = true
            elCell.style.backgroundColor = 'red';
            elCell.innerText = MINE
            setTimeout(() => hideMinesManualy(elCell), 5000);
            setMinesNegsCount(gBoard, i, j)
            setTimeout(startManualGame, 7000)
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

    if (flagCounter > 0 && !cell.isMarked) {
        flagCounter--
        elFlagCounter.innerText = `${FLAG}  :  ${flagCounter}`
        sound.play()
    }

    if (gameOver) return
    if (!cell.isMarked) {
        cell.isMarked = true
        elCell.innerText = FLAG
    }
    checkGameOver(gBoard)
}


// one safe cell clicked function
function expandShown(board, elCell, rowIdx, colIdx) {
    if (isFirstClick) return

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


// revel mines function
function revelMines() {
    var sound = new Audio('js/gameover.mp3')
    sound.play()

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            var cell = gBoard[i][j]
            if (cell.isMine && !cell.isShown) {
                cell.isShown = true
                elCell.style.backgroundColor = 'red'
                elCell.innerText = MINE
            }
        }
    }
}


// game over function
function gameIsOver() {
    gameOver = true
    revelMines()
    openModal()

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
    const elheading = document.querySelector('.gameover h1')
    var sound = new Audio('js/win.mp3')
    sound.play()
    elBtn.innerText = '😎'
    openModal()
    gStarterInterval = setInterval(onInit, 4000)

}


// step on mine function
function mineExplode(elCell) {
    var sound1 = new Audio('js/boom.mp3')
    sound1.play()
    elCell.style.backgroundColor = 'red'
    elCell.innerText = MINE

    lifeCounter--
    minesCount--
    flagCounter--

    elLife.innerText = `${LIFE} :   ${lifeCounter}`
    elMineCounter.innerText = `${MINE} :  ${minesCount}`
    elFlagCounter.innerText = `${FLAG} :  ${flagCounter}`
    // alert(`oops you steped on mine😭 but you have more${lifeCounter}  lifes`)
}


// open modal function
function openModal() {
    const elgameOverModal = document.querySelector('.gameover ')
    const elheading = document.querySelector('.gameover h1')
    elgameOverModal.style.display = 'block'
    if (gameOver) elheading.innerText = 'Oops!! Game over🥺'
    else elheading.innerText = 'You won 👑'
    setTimeout(closeModal, 4000)
}


// close modal function
function closeModal() {
    const elgameOverModal = document.querySelector('.gameover ')
    elgameOverModal.style.display = 'none'
}

// dark mode
function darkMode() {
    const elBody = document.body
    const elBtnHead = document.querySelector('.darkMode')
    elBtnHead.innerText = elBody.classList.contains('darkmode') ? 'Light Mode' : 'Dark Mode';
    elBody.classList.toggle('darkmode')
}


// use hint function
function useHint() {
    var randI = getRandomInt(0, gBoard.length)
    var randJ = getRandomInt(0, gBoard.length)
    var cell = gBoard[randI][randJ]
    var elCell = document.querySelector(`.cell-${randI}-${randJ}`)
    var sound = new Audio('js/hint.mp3')

    if (gameOver) return

    if (hintCount <= 0) {
        elHintBtn.innerText = ''
        alert('No more hints for you😵')
        return
    }

    if (hintCount === 2) elHintBtn.innerText = '💡💡'
    if (hintCount === 1) elHintBtn.innerText = '💡'
    hintCount--

    if (!cell.isShown) {
        sound.play()
        cell.isShown = true
        elCell.style.backgroundColor = 'grey'
        setMinesNegsCount(gBoard, randI, randJ)
        setTimeout(() => {
            hideHintCell(elCell, randI, randJ)
        }, 3000)

        if (cell.isMine) {
            elCell.innerText = MINE
            elCell.style.backgroundColor = 'red'
            setTimeout(() => {
                hideHintCell(elCell, randI, randJ)
            }, 3000)
        }
    }
}


// hide hint cell function
function hideHintCell(elCell, i, j) {
    var cell = gBoard[i][j]
    cell.isShown = false
    elCell.style.backgroundColor = 'lightslategrey'
    elCell.innerText = EMPTY
}
