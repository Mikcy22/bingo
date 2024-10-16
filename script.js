let selectedNumbers = [];
let bingoCardNumbers = [];

document.addEventListener('DOMContentLoaded', () => {
    generateBingoCard();
    document.getElementById('generateBall').addEventListener('click', generateBall);
    document.getElementById('checkLine').addEventListener('click', checkLine);
    document.getElementById('checkBingo').addEventListener('click', checkBingo);
});

function generateBingoCard() {
    const bingoCard = document.getElementById("bingoCard");
    bingoCard.innerHTML = "";
    bingoCardNumbers = Array.from({ length: 3 }, () => Array(9).fill(null));

    let columns = Array.from({ length: 9 }, (_, i) => {
        const start = i * 10 + 1;
        const end = i === 8 ? 90 : start + 9;
        let columnNumbers = Array.from({ length: end - start + 1 }, (_, j) => start + j);
        columnNumbers = shuffleArray(columnNumbers).slice(0, 2);
        return columnNumbers.sort((a, b) => a - b);
    });

    columns = adjustColumnsTo15(columns);
    distributeNumbers(columns);
    renderBingoCard(bingoCard);
}

function distributeNumbers(columns) {
    let rowIndex;
    columns.forEach((col, colIndex) => {
        col.forEach(num => {
            do {
                rowIndex = getRandomInt(0, 3);
            } while (bingoCardNumbers[rowIndex][colIndex] !== null || bingoCardNumbers[rowIndex].filter(Boolean).length >= 5);
            bingoCardNumbers[rowIndex][colIndex] = num;
        });
    });
}

function renderBingoCard(bingoCard) {
    bingoCardNumbers.forEach(row => {
        row.forEach(num => {
            const cell = document.createElement("div");
            cell.textContent = num !== null ? num : "";
            cell.classList.add("cell");
            if (num !== null) cell.dataset.number = num;
            bingoCard.appendChild(cell);
        });
    });
}

function generateBall() {
    let ball;
    do {
        ball = getRandomInt(1, 91);
    } while (selectedNumbers.includes(ball));

    selectedNumbers.push(ball);

    console.log("Número generado de la bola:", ball);
    document.getElementById('ballNumber').textContent = ball;

    document.querySelectorAll('.cell').forEach(cell => {
        if (parseInt(cell.dataset.number) === ball) {
            cell.classList.add('marked');
        }
    });
}

function checkLine() {
    const result = bingoCardNumbers.some(row => row.filter(num => num && selectedNumbers.includes(num)).length === 5);
    document.getElementById('result').textContent = result ? "¡Línea!" : "No hay línea";
    console.log(result ? "¡Línea!" : "No hay línea");
}

function checkBingo() {
    const result = bingoCardNumbers.flat().filter(num => num && selectedNumbers.includes(num)).length === 15;
    document.getElementById('result').textContent = result ? "¡Bingo!" : "No hay Bingo";
    console.log(result ? "¡Bingo!" : "No hay Bingo");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function adjustColumnsTo15(columns) {
    let flatNumbers = columns.flat();

    while (flatNumbers.length > 15) {
        const colIndex = getRandomInt(0, 9);
        if (columns[colIndex].length > 1) {
            columns[colIndex].pop();
            flatNumbers = columns.flat();
        }
    }

    while (flatNumbers.length < 15) {
        const colIndex = getRandomInt(0, 9);
        const start = colIndex * 10 + 1;
        const end = colIndex === 8 ? 90 : (colIndex + 1) * 10;
        const columnNumbers = Array.from({ length: end - start + 1 }, (_, j) => start + j);
        const availableNumbers = columnNumbers.filter(num => !flatNumbers.includes(num));
        if (availableNumbers.length > 0) {
            columns[colIndex].push(availableNumbers[0]);
            flatNumbers = columns.flat();
        }
    }
    return columns;
}
