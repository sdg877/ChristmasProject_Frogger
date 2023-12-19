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
    const carPositions = [39, 47, 55]
    const carsToGenerate = 5
    let isCarMoving = false
    let carsGenerated = 0
    let direction = ""
    let position = currentPosition
    let intervalIds = []

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

    function shuffleArray(array) {
        if (array.length <= 1){
            return array
        }
        let swapIndex

        for (let i = array.length - 1; i > 0; i--) {
            swapIndex = Math.floor(Math.random() * (i + 1))
            [array[i], array[swapIndex]] = [array[swapIndex], array[i]]
        }
        return array
    }

    function startCarMovements(){
        const availablePositions = cells.map((_, index) => index)
        .filter((index) => !carPositions.includes(index))
        
        const shuffledPositions = shuffleArray(availablePositions)

        shuffledPositions.slice(0, carsToGenerate).forEach((position) => {
            const intervalId = setInterval(() => {
                moveCar(position)
            }, getRandomTimeInterval())
            
            intervalIds.push(intervalId)
        })
        
        setTimeout(() => {
            intervalIds.forEach((id) => clearInterval(id))
        }, 5000) 
    }
    
    function getRandomTimeInterval() {
        return Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
    }

    function addFrog(position){
        cells[position].classList.add('frog')
    }

    function removeFrog(){
        cells[currentPosition].classList.remove('frog')
    }

    function addCar(position) {
        cells[position].classList.add('car')
    }

    function removeCar(position) {
        cells[position].classList.remove('car')
    }

    function moveCar(position) {
        removeCar(position)

        if (position % width === 0) {
            removeCar(position)
            position = width * (Math.floor(position / width) + 1) - 1
            addCar(position)
        } else {
            if (position >= 0 && position < cellCount){
            removeCar(position)
           position--
            addCar(position)
            }
        }
    }
  

    function handleMovement(event){
        const key = event.key
        const up  = "ArrowUp"
        const down = "ArrowDown"
        const left = "ArrowLeft"
        const right = "ArrowRight"

        removeFrog()

        if (!isCarMoving) {
            isCarMoving = true
            startCarMovements()
        }

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
}

window.addEventListener('DOMContentLoaded', init)