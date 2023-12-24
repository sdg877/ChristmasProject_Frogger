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
    const carSpeed = 400
    const validRows = [5, 6, 7, 8]
    const fixedStartingPositions = [50, 60, 70, 80]
    // const lilyStartPositions = [19, 29, 39, 49]
    let direction = "right"


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
        createCars()
        moveCars()
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


    function startCarMovements() {
        setInterval(moveCars, carSpeed)
        }

        function createCars() {
            const carGenerationInterval = setInterval(() => {
                const emptyStartingPositions = fixedStartingPositions.filter(
                    (position) => !cells[position].classList.contains('carright')
                );
    
                if (emptyStartingPositions.length > 0) {
                    const randomStartingPosition =
                        emptyStartingPositions[Math.floor(Math.random() * emptyStartingPositions.length)];
                    addCar(randomStartingPosition);
                } else {
                    clearInterval(carGenerationInterval);
                }
            }, carSpeed * 3);
    
            setTimeout(() => {
                clearInterval(carGenerationInterval);
            }, carSpeed * 30);
        }
    
        function moveCars() {
            const carIndices = cells.reduce((acc, cell, index) => {
                if (cell.classList.contains('carright') && isValidRow(index)) {
                    cells[index].classList.remove('carright');
                    acc.push(index);
                }
                return acc;
            }, []);
    
            carIndices.forEach((currentPosition) => {
                cells[currentPosition].classList.remove('carright');
                let nextPosition = currentPosition + 1;
    
                if (nextPosition % width !== 0 && !cells[nextPosition].classList.contains('carright')) {
                    cells[nextPosition].classList.add('carright');
                } else {
                    const currentRow = Math.floor(currentPosition / width);
                    const nextValidRowIndex = (validRows.indexOf(currentRow) + 1) % fixedStartingPositions.length;
                    const nextStartingPosition = fixedStartingPositions[nextValidRowIndex];
    
                    cells[currentPosition].classList.remove('carright');
                    cells[nextStartingPosition].classList.add('carright');
                }
            });
        }


        function addLilyPads() {
            const oppositePositions = [19, 29, 39, 49]; // Opposite positions for lily pads
        
            oppositePositions.forEach((startPosition, index) => {
                let position = startPosition;
        
                const lilyInterval = setInterval(() => {
                    const addLily = () => {
                        if (position >= 0 && position < cellCount) {
                            cells[position].classList.add('lilypad');
                        }
                    };
        
                    const removeLily = () => {
                        if (position >= 0 && position < cellCount) {
                            cells[position].classList.remove('lilypad');
                        }
                    };
        
                    addLily();
        
                    const moveLily = () => {
                        removeLily();
                        position++;
        
                        if (position % width === 0 || position >= cellCount) {
                            clearInterval(lilyInterval);
                        } else {
                            addLily();
                        }
                    };
                    moveLily();
        
                }, carSpeed * 5 * (index + 1));
        
                setTimeout(() => {
                    clearInterval(lilyInterval);
                }, carSpeed * 5 * (index + 1) + carSpeed * 2);
            });
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
        addLilyPads()
    }

//! Events
document.addEventListener('keyup', handleMovement)
    createGrid()
    createCars()
    startCarMovements()
}

window.addEventListener('DOMContentLoaded', init)