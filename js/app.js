function init () {

    //! Variables and elements
    // create grid
    const grid = document.querySelector('.grid')

    //board config
    const width = 10
    const height = 10
    const cellCount = width * height
    let cells = []


    //character config
    const startingPosition = 95
    let currentPosition = startingPosition
    const moveSpeed = 500
    const lilyRows = [1, 2, 3, 4]
    const validRows = [5, 6, 7, 8]
    const lilyStartPositions = [10, 20, 30, 40]
    const fixedStartingPositions = [50, 60, 70, 80]
    let direction = "right"
    let collided = false
    let lilyGenerationInterval
    let lilyMovementInterval
    let carGenerationInterval


    //! functions
    function createGrid() {
        for (let i = 0; i < cellCount; i++){
            const cell = document.createElement('div')
            // cell.innerText = i
            cell.dataset.index = i
            cell.style.height = `${100 / height}%`
            cell.style.width = `${100 / width}%`
            grid.appendChild(cell)
            cells.push(cell)
            const row = Math.floor(i / width)
            cell.classList.add(`row-${row}`)
        }

        addFrog(startingPosition)
        createCars()
        moveCars()
        createLilyPads()
        moveLilyPads()
        startMovements()

    }

    function addFrog(position){
        cells[position].classList.add('frog')
    }

    function removeFrog(){
        cells[currentPosition].classList.remove('frog')
    }

    function addCar(position) {
        if (position >= 0 && position < cellCount) {
            if (cells[position]) {
                cells[position].classList.add('carright')
            } 
        }
    }

    function removeCar(position) {
            if (cells[position] && cells[position].classList.contains('carright')){
                cells[position].classList.remove('carright')
            }
        }

    function  isValidRow(position) {
        const row = Math.floor(position / width)
        return validRows.includes(row)
    } 

    function hasSpaceAround(position) {
        const adjacentPositions = [
            position - width,
            position - 1,
            position + 1,
            position + width
        ]

        return adjacentPositions.every(
            (adjPos) =>
            adjPos >= 0 &&
            adjPos < cellCount &&
            !cells[adjPos].classList.contains('carright')
        )
    }

    function createCars() {
        const carGenerationInterval = setInterval(() => {
            const emptyStartingPositions = fixedStartingPositions.filter(
                (position) => !cells[position].classList.contains('carright')
            )
        
            if (emptyStartingPositions.length > 0) {
                const randomStartingPosition =
                    emptyStartingPositions[Math.floor(Math.random() * emptyStartingPositions.length)]
                addCar(randomStartingPosition)
            } else {
                clearInterval(carGenerationInterval)
            }
        }, moveSpeed * 1.5)
        }

    function moveCars() {
        const carIndices = cells.reduce((acc, cell, index) => {
            if (cell.classList.contains('carright') && isValidRow(index)) {
                acc.push(index)
            }
            return acc
        }, [])
        
        carIndices.forEach((currentPosition) => {
            cells[currentPosition].classList.remove('carright')
            const nextPosition = currentPosition + 1
        
            if (nextPosition % width !== 0) {
                cells[nextPosition].classList.add('carright')
            } else {
                cells[currentPosition].classList.remove('carright')
            }
        
            checkCollision()
        })
    }

    function createLilyPads() {
        // const lilyGenerationInterval = setInterval(() => {
            const emptyLilyStartingPositions = lilyStartPositions.filter(
                (position) => !cells[position].classList.contains('lilypad')
            )

            if (emptyLilyStartingPositions.length > 0) {
                const randomLilyStartPositions =
                emptyLilyStartingPositions[Math.floor(Math.random() * emptyLilyStartingPositions.length)]
                addLilyPads(randomLilyStartPositions)
        //     } else {
        //         clearInterval(lilyGenerationInterval)
        //     }
        // }, moveSpeed * 0.5)
            }
    }

    function moveLilyPads() {
        const lilyIndices = lilyStartPositions.filter((position) => cells[position].classList.contains('lilypad'));
    
        lilyIndices.forEach((position, index) => {
            cells[position].classList.remove('lilypad');
    
            // Ensure lilypads stay within their rows
            const row = Math.floor(position / width);
            const nextPosition = position + 1;
            const isAtRowEnd = nextPosition % width === 0;
            const isValidMove = nextPosition < (row + 1) * width && !isAtRowEnd;
    
            if (isValidMove) {
                cells[nextPosition].classList.add('lilypad');
                lilyStartPositions[index] = nextPosition;
            } else {
                // If at row end, wrap around to the beginning of the same row
                lilyStartPositions[index] = row * width;
                cells[row * width].classList.add('lilypad');
            }
        });
    }

// working logic except on wrong rows...
    // function moveLilyPads() { 
    //     const lilyIndices = lilyStartPositions.filter((position) => cells[position].classList.contains('lilypad'));
        
    //     lilyIndices.forEach((position, index) => {
    //         cells[position].classList.remove('lilypad');
    //         lilyStartPositions[index] = position + 1;
    //     });
    
    //     lilyStartPositions.forEach((position) => {
    //         if (position < cellCount && isValidRow(position)) {
    //             cells[position].classList.add('lilypad');
    //         }
    //     });
    // }

    // function moveLilyPads() {
    //     const lilyIndices = cells.reduce((acc, cell, index) => {
    //         if (cell.classList.contains('lilypad') && isValidRow(index)) {
    //             acc.push(index)
    //         }
    //         return acc
    //     }, [])

    //     lilyIndices.forEach((currentPosition) => {
    //         cells[currentPosition].classList.remove('lilypad')
    //         const nextPosition = currentPosition + 1

    //         if (nextPosition % width !== 0) {
    //             cells[nextPosition].classList.add('lilypad')
    //         } else {
    //             cells[currentPosition].classList.remove('lilypad')
    //         }
    //     })
    // }



    function startMovements() {
        setInterval(moveCars, moveSpeed)
        lilyGenerationInterval = setInterval(createLilyPads, moveSpeed * 3)
        lilyMovementInterval = setInterval(moveLilyPads, moveSpeed)
        }

    function addLilyPads(position) {
        if (position >= 0 && position < cellCount) {
              if (cells[position]) {
                  cells[position].classList.add('lilypad')
              }
          }
      }


    function removeLilyPads(position) {
            if (cells[position] && cells[position].classList.contains('lilypad')){
                cells[position].classList.remove('lilypad')
            }
        }

    function checkCollision() {
        if (currentPosition >= 0 && currentPosition < cells.length && cells[currentPosition]) {
            if (cells[currentPosition].classList.contains('carright')) {
                stopGame()
            }
        }
    }

    function resetGame() {
        clearInterval(lilyGenerationInterval)
        clearInterval(lilyMovementInterval)
        clearInterval(carGenerationInterval)
        cells.forEach(cell => {
            cell.classList.remove('frog', 'carright', 'lilypad')
        })
        currentPosition = startingPosition
        addFrog(startingPosition)
        collided = false
        document.addEventListener('keyup', handleMovement)
        createCars()
        startMovements()
        createLilyPads()
        moveLilyPads()
    }

    function stopGame() {
        if (!collided) {
            collided = true
            clearInterval(lilyGenerationInterval)
            clearInterval(lilyMovementInterval)
            clearInterval(carGenerationInterval)
            alert("GAME OVER - YOU LOSE!!")
            document.removeEventListener('keyup', handleMovement)
            resetGame()
        }
    }

    function handleMovement(event){
        const key = event.key
        const up  = "ArrowUp"
        const down = "ArrowDown"
        const left = "ArrowLeft"
        const right = "ArrowRight"

        removeFrog()

        if (key === up && currentPosition >= width) {
            direction = "up"
            currentPosition -= width
        } else if (key === down && currentPosition + width <= cellCount - 1) {
            direction = "down"
            currentPosition += width
        } else if (key === left && currentPosition % width !== 0) {
            currentPosition--
            direction = "left"
        } else if (key === right && currentPosition % width !== width - 1) {
            direction = "right"
            currentPosition++
        }

        position = currentPosition
        addFrog(currentPosition)
    }

//! Events
document.addEventListener('keyup', handleMovement)
    createGrid()
    // createCars()
    // startMovements()
    // createLilyPads()
    // moveLilyPads()
}

window.addEventListener('DOMContentLoaded', init)