document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const ScoreDisplay = document.querySelector('#score')
  const StartBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId

  // The Tetrominoes
  const lTretromino = [
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
    [width, width + 1, width * 2, width * 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetromino = [lTretromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0
  // Select Tetromino at random at first rotation
  let random = Math.floor(Math.random() * theTetromino.length)
  let current = theTetromino[random][currentRotation]

  // draw first rotation in first tetromino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }
  // function to undraw Tetromino
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  // make tetromino move down every second
  

  // assign keycodes
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 32) {
      rotate()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }

  document.addEventListener('keyup', control)

  // function to move tetromino down
  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // function to stop tetromino once it hits the bottom
  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // start a new tetromino falling down
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetromino.length)
      current = theTetromino[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
    }
  }

  // move tetromino left and stop at the edge
  function moveLeft () {
    undraw()
    // check to see if current tetromino position is at the first index at the edge
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    // if it is not at the first index at the edge, then move left by 1
    if (!isAtLeftEdge) {
      currentPosition -= 1
    }
    // move downward until tetromino hits the bottom
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  // move tetromino to the right
  function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) {
      currentPosition += 1
    }
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  // function to rotate tetromino
  function rotate () {
    undraw()
    currentRotation++
    // check to see if current rotation is at the end of the array/end rotation. If it is, then it goes back to the first
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetromino[random][currentRotation]
    draw()
  }

  // show next tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
  ]

  // function to display tetromino in mini-grid
  function displayShape () {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }

  // function for start button
  StartBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 100)
      nextRandom = Math.floor(Math.random() * theTetromino.length)
      displayShape()
    }
  })
})
