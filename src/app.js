document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const hamburgerBtn = document.querySelector('.toggler')
    const gameOverMsg = document.querySelector('.game-over-msg')
    const arrowPadLeft = document.querySelector('.arrowbtn-left')
    const arrowPadRight = document.querySelector('.arrowbtn-right')
    const arrowPadUp = document.querySelector('.arrowbtn-up')
    const arrowPadDown = document.querySelector('.arrowbtn-down')
    const menu = document.querySelector('.menu')
    const span = document.getElementsByClassName('close')[0]
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const newGameBtn = document.querySelector('#new-game')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'url(src/images/blue_block.png',
        'url(src/images/green_block.png)',
        'url(src/images/pink_block.png)',
        'url(src/images/yellow_block.png)',
        'url(src/images/purple_block.png)'
    ]

    // start create game grid

    // end create game grid


    // The Tetrominoes

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino]

    let currentPosition = 4
    let currentRotation = 0

    // randomly select a Tetromino + its first rotation

    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    // draw Tetromino

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundImage = colors[random]
            squares[currentPosition + index].style.backgroundSize = 'cover'
        })
    }

    // undraw Tetromino

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundImage = ''
        })
    }

    // make Tetromino move down every second

    // timerId = setInterval(moveDown, 1000)

    // assign functions to key

    function control(e) {
        if (e.key === 'ArrowLeft') {
            moveLeft()
        } else if (e.key === 'ArrowUp') {
            rotate()
        } else if (e.key === 'ArrowRight') {
            moveRight()
        } else if (e.key === 'ArrowDown') {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    // assign move functions to arrow pad click on mobile

    arrowPadLeft.addEventListener('click', () => {
        moveLeft()
    })

    arrowPadRight.addEventListener('click', () => {
        moveRight()
    })

    arrowPadUp.addEventListener('click', () => {
        rotate()
    })

    arrowPadDown.addEventListener('click', () => {
        moveDown()
    })

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // freeze function

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // move tetromino to left, unless it is at edge or blocked

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    // move tetromino to right, unless it is at edge or blocked

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    // check rotation position at edge

    function ifAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }

    function ifAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    function checkRotatedPosition(P) {
        P = P || currentPosition
        if ((P + 1) % width < 4) {
            if (ifAtRight()) {
                currentPosition += 1
                checkRotatedPosition(P)
            }
        }
        else if (P % width > 5) {
            if (ifAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }

    // rotate tetromino

    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) { // if current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    // show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 5


    // the Tetrominoes without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ]

    // display shape in mini-grid display
    function displayShape() {
        // remove any trace of a tetromino from entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundImage = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
            displaySquares[displayIndex + index].style.backgroundSize = 'cover'
        })
    }

    // add start + pause functionality to button

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    // add score

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundImage = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over

    function stopDraw() {
        draw = function () { }
    }

    function stopDisplay() {
        displayShape = function () { }
    }

    function stopUndraw() {
        undraw = function () { }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = score + ' [GAME OVER]'
            clearInterval(timerId)
            stopDraw()
            stopDisplay()
            stopUndraw()            
        }
    }

    // new game    

    newGameBtn.addEventListener('click', () => {
        window.location.reload()       
    })

    // rules menu display

    hamburgerBtn.addEventListener('click', () => {
        menu.style.display = 'flex'
    })
    span.addEventListener('click', () => {
        menu.style.display = 'none'
    })

})
