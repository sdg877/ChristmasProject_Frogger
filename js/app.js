function init () {

    //! Variables and elements
    // create grid
    const grid = document.querySelector('.grid')

    //board config
    const width = 8
    const height = 8
    const cellCount = width * height
    let cells = []


    //character config
    const startingPosition = 60
    let currentPosition = startingPosition
    const carSpeed = 1000
    const startingPositions = [32, 40, 48]




    //! functions
    function createGrid() {
        for (let i = 0; i < cellCount; i++){
            const cell = document.createElement('div')
            cell.innerText = i
            cell.dataset.index = i
            cell.style.height = `${100 / height}%`
            cell.style.width = `${100 / width}%`
            grid.appendChild(cell)
            cells.push(cell)
            const row = Math.floor(i / width)
            cell.classList.add(`row-${row}`)
        }

        addFrog(startingPosition)
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
            } else {
                console.error(`No car found at position ${position}.`)
            }
            
        }

    function createCars() {
        startingPositions.forEach(position => {
            addCar(position)
        })
    }

    function moveCars() {
        startingPositions.forEach((position, index) => {
            removeCar(position)
            const nextPosition = position + 1
            if (nextPosition % width !== 0) {
             startingPositions[index] = nextPosition
              } else {
               startingPositions[index] = Math.floor(nextPositions / width) * width
            }
            addCar(startingPositions[index])
        })
    }

    function startCarMovements() {
        setInterval(moveCars, carSpeed)
    }



    function handleMovement(event){
        const key = event.key
        const up  = "ArrowUp"
        const down = "ArrowDown"
        const left = "ArrowLeft"
        const right = "ArrowRight"

        removeFrog()

        // if (!isCarMoving) {
        //     isCarMoving = true
        //     startCarMovements()
        // }

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
    createCars()
    startCarMovements()
}

window.addEventListener('DOMContentLoaded', init)