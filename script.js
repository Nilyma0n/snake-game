const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const gameMessage = document.getElementById("gameMessage");
const restartBtn = document.getElementById("restartBtn");


// ===============================
// GAME SETTINGS
// ===============================

const gridSize = 20;

const tileCount = canvas.width / gridSize;

let snake;
let food;

let direction;
let nextDirection;

let score = 0;

let highScore = localStorage.getItem("snakeHighScore") || 0;

let gameRunning = false;

let gameLoop;


// ===============================
// START GAME
// ===============================

function startGame() {

    snake = [
        {
            x: 10,
            y: 10
        },

        {
            x: 9,
            y: 10
        },

        {
            x: 8,
            y: 10
        }
    ];

    direction = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };

    score = 0;

    scoreElement.textContent = score;

    highScoreElement.textContent = highScore;

    gameMessage.textContent = "Use Arrow Keys to Move";

    gameRunning = true;

    createFood();

    clearInterval(gameLoop);

    gameLoop = setInterval(updateGame, 100);

    drawGame();
}


// ===============================
// GAME UPDATE
// ===============================

function updateGame() {

    if (!gameRunning) {
        return;
    }

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };


    // ===============================
    // WALL COLLISION
    // ===============================

    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {

        gameOver();

        return;
    }


    // ===============================
    // BODY COLLISION
    // ===============================

    for (let i = 0; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            gameOver();

            return;
        }
    }


    // Add new head

    snake.unshift(head);


    // ===============================
    // FOOD CHECK
    // ===============================

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        scoreElement.textContent = score;


        // Update high score

        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "snakeHighScore",
                highScore
            );

            highScoreElement.textContent = highScore;
        }


        createFood();

    } else {

        // Remove tail

        snake.pop();
    }


    drawGame();
}


// ===============================
// DRAW GAME
// ===============================

function drawGame() {

    // Clear canvas

    ctx.fillStyle = "#0f172a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ===============================
    // DRAW GRID
    // ===============================

    ctx.strokeStyle = "#172033";

    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += gridSize) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, canvas.height);

        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(canvas.width, y);

        ctx.stroke();
    }


    // ===============================
    // DRAW FOOD
    // ===============================

    ctx.fillStyle = "#ef4444";

    ctx.beginPath();

    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // ===============================
    // DRAW SNAKE
    // ===============================

    snake.forEach((segment, index) => {

        if (index === 0) {

            // Snake head

            ctx.fillStyle = "#4ade80";

        } else {

            // Snake body

            ctx.fillStyle = "#22c55e";
        }


        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });


    // ===============================
    // SNAKE EYES
    // ===============================

    const head = snake[0];

    ctx.fillStyle = "white";


    // Eye 1

    ctx.fillRect(
        head.x * gridSize + 5,
        head.y * gridSize + 5,
        4,
        4
    );


    // Eye 2

    ctx.fillRect(
        head.x * gridSize + 12,
        head.y * gridSize + 5,
        4,
        4
    );
}


// ===============================
// CREATE FOOD
// ===============================

function createFood() {

    let newFood;

    do {

        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

    } while (
        snake.some(
            segment =>
                segment.x === newFood.x &&
                segment.y === newFood.y
        )
    );


    food = newFood;
}


// ===============================
// GAME OVER
// ===============================

function gameOver() {

    gameRunning = false;

    clearInterval(gameLoop);

    gameMessage.textContent =
        `Game Over! Your Score: ${score}`;

    drawGame();

    // Dark overlay

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Game over text

    ctx.fillStyle = "white";

    ctx.font = "bold 35px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Press Restart",
        canvas.width / 2,
        canvas.height / 2 + 40
    );
}


// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener("keydown", function(event) {

    const key = event.key;


    // UP

    if (
        key === "ArrowUp" &&
        direction.y !== 1
    ) {

        nextDirection = {
            x: 0,
            y: -1
        };
    }


    // DOWN

    else if (
        key === "ArrowDown" &&
        direction.y !== -1
    ) {

        nextDirection = {
            x: 0,
            y: 1
        };
    }


    // LEFT

    else if (
        key === "ArrowLeft" &&
        direction.x !== 1
    ) {

        nextDirection = {
            x: -1,
            y: 0
        };
    }


    // RIGHT

    else if (
        key === "ArrowRight" &&
        direction.x !== -1
    ) {

        nextDirection = {
            x: 1,
            y: 0
        };
    }


    // Prevent page scrolling

    if (
        [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight"
        ].includes(key)
    ) {

        event.preventDefault();
    }

});


// ===============================
// RESTART BUTTON
// ===============================

restartBtn.addEventListener(
    "click",
    startGame
);


// ===============================
// START
// ===============================

startGame();