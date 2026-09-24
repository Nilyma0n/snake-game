// ============================================
// SNAKE GAME
// GOLD COINS + FRUITS + SPEED SYSTEM
// PROFESSIONAL GAME OVER
// ============================================


// ============================================
// HTML ELEMENTS
// ============================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const startScreen =
    document.getElementById("startScreen");

const gameScreen =
    document.getElementById("gameScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");


const startBtn =
    document.getElementById("startBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const menuBtn =
    document.getElementById("menuBtn");


const pauseBtn =
    document.getElementById("pauseBtn");

const resumeBtn =
    document.getElementById("resumeBtn");

const pauseOverlay =
    document.getElementById("pauseOverlay");


const scoreElement =
    document.getElementById("score");

const highScoreElement =
    document.getElementById("highScore");

const coinsElement =
    document.getElementById("coins");


const menuHighScore =
    document.getElementById("menuHighScore");

const menuCoins =
    document.getElementById("menuCoins");


const finalScore =
    document.getElementById("finalScore");

const finalHighScore =
    document.getElementById("finalHighScore");

const finalCoins =
    document.getElementById("finalCoins");


const gameMessage =
    document.getElementById("gameMessage");


// ============================================
// GAME OVER REASON
// ============================================

const gameOverReason =
    document.getElementById(
        "gameOverReason"
    );


// ============================================
// GAME SETTINGS
// ============================================

const GRID_SIZE = 20;

const TILE_COUNT =
    canvas.width / GRID_SIZE;


// ============================================
// SPEED SETTINGS
// ============================================

const START_SPEED = 400;

const MIN_SPEED = 100;

const SPEED_INCREASE = 10;


// ============================================
// GAME VARIABLES
// ============================================

let snake = [];

let foods = [];

let coin = null;


let direction = {
    x: 1,
    y: 0
};


let nextDirection = {
    x: 1,
    y: 0
};


let score = 0;


// ============================================
// SAVED DATA
// ============================================

let highScore =
    Number(
        localStorage.getItem(
            "snakeHighScore"
        )
    ) || 0;


let coins =
    Number(
        localStorage.getItem(
            "snakeCoins"
        )
    ) || 0;


let gameLoop = null;

let gameRunning = false;

let paused = false;

let currentSpeed =
    START_SPEED;


// ============================================
// FOOD TYPES
// ============================================

const foodTypes = [

    {
        emoji: "🍎",
        points: 1
    },

    {
        emoji: "🍊",
        points: 2
    },

    {
        emoji: "🍇",
        points: 3
    },

    {
        emoji: "🍒",
        points: 2
    },

    {
        emoji: "🍓",
        points: 2
    }

];


// ============================================
// INITIAL UI
// ============================================

menuHighScore.textContent =
    highScore;


menuCoins.textContent =
    coins;


highScoreElement.textContent =
    highScore;


coinsElement.textContent =
    coins;


// ============================================
// START GAME
// ============================================

function startGame() {


    // ========================================
    // STOP PREVIOUS LOOP
    // ========================================

    if (
        gameLoop !== null
    ) {

        clearInterval(
            gameLoop
        );

        gameLoop = null;
    }


    // ========================================
    // CREATE SNAKE
    // ========================================

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


    // ========================================
    // RESET DIRECTION
    // ========================================

    direction = {
        x: 1,
        y: 0
    };


    nextDirection = {
        x: 1,
        y: 0
    };


    // ========================================
    // RESET SCORE
    // ========================================

    score = 0;


    // ========================================
    // RESET SPEED
    // ========================================

    currentSpeed =
        START_SPEED;


    // ========================================
    // RESET GAME STATE
    // ========================================

    gameRunning = true;

    paused = false;


    // ========================================
    // UPDATE UI
    // ========================================

    scoreElement.textContent =
        score;


    highScoreElement.textContent =
        highScore;


    coinsElement.textContent =
        coins;


    gameMessage.textContent =
        "Eat the fruit and collect coins!";


    // ========================================
    // CREATE FOOD
    // ========================================

    foods = [];

    createFood();


    // ========================================
    // CREATE GOLD COIN
    // ========================================

    coin = null;

    createCoin();


    // ========================================
    // RESET GAME OVER REASON
    // ========================================

    if (
        gameOverReason
    ) {

        gameOverReason.textContent =
            "Your snake has stopped!";
    }


    // ========================================
    // SHOW GAME SCREEN
    // ========================================

    startScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.remove(
        "hidden"
    );


    pauseOverlay.classList.add(
        "hidden"
    );


    pauseBtn.textContent =
        "⏸";


    // ========================================
    // DRAW GAME
    // ========================================

    drawGame();


    // ========================================
    // START LOOP
    // ========================================

    startGameLoop();
}


// ============================================
// START GAME LOOP
// ============================================

function startGameLoop() {


    if (
        gameLoop !== null
    ) {

        clearInterval(
            gameLoop
        );
    }


    gameLoop =
        setInterval(
            updateGame,
            currentSpeed
        );
}


// ============================================
// UPDATE GAME
// ============================================

function updateGame() {


    // Don't update while paused

    if (
        !gameRunning ||
        paused
    ) {

        return;
    }


    // ========================================
    // APPLY NEXT DIRECTION
    // ========================================

    direction = {
        x: nextDirection.x,
        y: nextDirection.y
    };


    // ========================================
    // CREATE NEW HEAD
    // ========================================

    const newHead = {

        x:
            snake[0].x +
            direction.x,

        y:
            snake[0].y +
            direction.y

    };


    // ========================================
    // WALL COLLISION
    // ========================================

    if (

        newHead.x < 0 ||

        newHead.x >= TILE_COUNT ||

        newHead.y < 0 ||

        newHead.y >= TILE_COUNT

    ) {

        gameOver(
            "🧱 You hit the wall!"
        );

        return;
    }


    // ========================================
    // CHECK FOOD
    // ========================================

    let eatenFood = null;

    let eatenFoodIndex = -1;


    for (
        let i = 0;
        i < foods.length;
        i++
    ) {


        if (

            foods[i].x === newHead.x &&

            foods[i].y === newHead.y

        ) {

            eatenFood =
                foods[i];

            eatenFoodIndex =
                i;

            break;
        }

    }


    // ========================================
    // CHECK COIN
    // ========================================

    let collectedCoin =
        false;


    if (

        coin !== null &&

        coin.x === newHead.x &&

        coin.y === newHead.y

    ) {

        collectedCoin =
            true;
    }


    // ========================================
    // BODY COLLISION
    // ========================================

    for (
        let i = 0;
        i < snake.length;
        i++
    ) {

        const segment =
            snake[i];


        if (

            segment.x === newHead.x &&

            segment.y === newHead.y

        ) {

            gameOver(
                "🐍 You hit your own body!"
            );

            return;
        }

    }


    // ========================================
    // ADD NEW HEAD
    // ========================================

    snake.unshift(
        newHead
    );


    // ========================================
    // FOOD EATEN
    // ========================================

    if (
        eatenFood !== null
    ) {


        // Remove eaten food

        foods.splice(
            eatenFoodIndex,
            1
        );


        // ====================================
        // ADD SCORE
        // ====================================

        score =
            score +
            eatenFood.points;


        scoreElement.textContent =
            score;


        // ====================================
        // UPDATE HIGH SCORE
        // ====================================

        if (
            score > highScore
        ) {

            highScore =
                score;


            localStorage.setItem(
                "snakeHighScore",
                highScore
            );


            highScoreElement.textContent =
                highScore;


            menuHighScore.textContent =
                highScore;
        }


        // ====================================
        // SPEED UP
        // ====================================

        currentSpeed =
            Math.max(

                MIN_SPEED,

                START_SPEED -
                (
                    score *
                    SPEED_INCREASE
                )

            );


        // ====================================
        // CREATE MORE FOOD
        // ====================================

        updateFoodCount();


        // ====================================
        // MESSAGE
        // ====================================

        gameMessage.textContent =
            eatenFood.emoji +
            " +" +
            eatenFood.points +
            " points!";


        // ====================================
        // RESTART LOOP
        // ====================================

        startGameLoop();

    }

    else {

        // ====================================
        // NO FOOD EATEN
        // REMOVE TAIL
        // ====================================

        snake.pop();
    }


    // ========================================
    // COIN COLLECTED
    // ========================================

    if (
        collectedCoin
    ) {


        // ====================================
        // ADD 10 COINS
        // ====================================

        coins =
            coins + 10;


        // ====================================
        // SAVE COINS
        // ====================================

        localStorage.setItem(
            "snakeCoins",
            coins
        );


        // ====================================
        // UPDATE COIN UI
        // ====================================

        coinsElement.textContent =
            coins;


        menuCoins.textContent =
            coins;


        // ====================================
        // REMOVE OLD COIN
        // ====================================

        coin = null;


        // ====================================
        // CREATE NEW COIN
        // ====================================

        createCoin();


        // ====================================
        // SHOW MESSAGE
        // ====================================

        gameMessage.textContent =
            "🪙 +10 COINS!";
    }


    // ========================================
    // DRAW
    // ========================================

    drawGame();
}


// ============================================
// FOOD COUNT
// ============================================

function updateFoodCount() {


    let wantedFood = 1;


    // Score 5+

    if (
        score >= 5
    ) {

        wantedFood = 2;
    }


    // Score 10+

    if (
        score >= 10
    ) {

        wantedFood = 3;
    }


    // Create missing food

    while (
        foods.length <
        wantedFood
    ) {

        createFood();
    }
}


// ============================================
// CREATE FOOD
// ============================================

function createFood() {


    let validPosition =
        false;


    while (
        !validPosition
    ) {


        const x =
            Math.floor(
                Math.random() *
                TILE_COUNT
            );


        const y =
            Math.floor(
                Math.random() *
                TILE_COUNT
            );


        // ====================================
        // CHECK SNAKE
        // ====================================

        const onSnake =
            snake.some(

                segment =>

                    segment.x === x &&
                    segment.y === y

            );


        // ====================================
        // CHECK FOOD
        // ====================================

        const onFood =
            foods.some(

                food =>

                    food.x === x &&
                    food.y === y

            );


        // ====================================
        // CHECK COIN
        // ====================================

        const onCoin =

            coin !== null &&

            coin.x === x &&

            coin.y === y;


        // ====================================
        // VALID POSITION
        // ====================================

        if (

            !onSnake &&

            !onFood &&

            !onCoin

        ) {


            const randomIndex =
                Math.floor(

                    Math.random() *
                    foodTypes.length

                );


            const selectedFood =
                foodTypes[
                    randomIndex
                ];


            foods.push({

                x: x,

                y: y,

                emoji:
                    selectedFood.emoji,

                points:
                    selectedFood.points

            });


            validPosition =
                true;
        }

    }
}


// ============================================
// CREATE GOLD COIN
// ============================================

function createCoin() {


    let validPosition =
        false;


    while (
        !validPosition
    ) {


        const x =
            Math.floor(
                Math.random() *
                TILE_COUNT
            );


        const y =
            Math.floor(
                Math.random() *
                TILE_COUNT
            );


        // ====================================
        // CHECK SNAKE
        // ====================================

        const onSnake =
            snake.some(

                segment =>

                    segment.x === x &&
                    segment.y === y

            );


        // ====================================
        // CHECK FOOD
        // ====================================

        const onFood =
            foods.some(

                food =>

                    food.x === x &&
                    food.y === y

            );


        // ====================================
        // VALID POSITION
        // ====================================

        if (

            !onSnake &&

            !onFood

        ) {


            coin = {

                x: x,

                y: y

            };


            validPosition =
                true;
        }

    }
}


// ============================================
// DRAW GAME
// ============================================

function drawGame() {


    // ========================================
    // BACKGROUND
    // ========================================

    ctx.fillStyle =
        "#07111f";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    // ========================================
    // GRID
    // ========================================

    ctx.strokeStyle =
        "#142033";


    ctx.lineWidth =
        1;


    // Vertical lines

    for (

        let x = 0;

        x <= canvas.width;

        x += GRID_SIZE

    ) {

        ctx.beginPath();


        ctx.moveTo(
            x,
            0
        );


        ctx.lineTo(
            x,
            canvas.height
        );


        ctx.stroke();

    }


    // Horizontal lines

    for (

        let y = 0;

        y <= canvas.height;

        y += GRID_SIZE

    ) {

        ctx.beginPath();


        ctx.moveTo(
            0,
            y
        );


        ctx.lineTo(
            canvas.width,
            y
        );


        ctx.stroke();

    }


    // ========================================
    // DRAW FOODS
    // ========================================

    foods.forEach(
        food => {


            const x =
                food.x *
                GRID_SIZE;


            const y =
                food.y *
                GRID_SIZE;


            ctx.font =
                "18px Arial";


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "middle";


            ctx.fillText(

                food.emoji,

                x +
                GRID_SIZE / 2,

                y +
                GRID_SIZE / 2 +
                1

            );

        }
    );


    // ========================================
    // DRAW GOLD COIN
    // ========================================

    if (
        coin !== null
    ) {


        const centerX =
            coin.x *
            GRID_SIZE +
            GRID_SIZE / 2;


        const centerY =
            coin.y *
            GRID_SIZE +
            GRID_SIZE / 2;


        const radius =
            7;


        ctx.save();


        // ====================================
        // GOLD GLOW
        // ====================================

        ctx.shadowColor =
            "#ffd700";


        ctx.shadowBlur =
            12;


        // ====================================
        // OUTER COIN
        // ====================================

        ctx.beginPath();


        ctx.arc(

            centerX,

            centerY,

            radius,

            0,

            Math.PI * 2

        );


        ctx.fillStyle =
            "#f5b800";


        ctx.fill();


        // ====================================
        // COIN BORDER
        // ====================================

        ctx.shadowBlur =
            0;


        ctx.lineWidth =
            2;


        ctx.strokeStyle =
            "#ffe066";


        ctx.stroke();


        // ====================================
        // INNER COIN
        // ====================================

        ctx.beginPath();


        ctx.arc(

            centerX,

            centerY,

            radius - 2,

            0,

            Math.PI * 2

        );


        ctx.fillStyle =
            "#ffd43b";


        ctx.fill();


        // ====================================
        // COIN SYMBOL
        // ====================================

        ctx.fillStyle =
            "#9a6700";


        ctx.font =
            "bold 9px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            "$",

            centerX,

            centerY + 0.5

        );


        ctx.restore();

    }


    // ========================================
    // DRAW SNAKE
    // ========================================

    snake.forEach(

        (segment, index) => {


            const x =
                segment.x *
                GRID_SIZE;


            const y =
                segment.y *
                GRID_SIZE;


            // Snake head

            if (
                index === 0
            ) {

                ctx.fillStyle =
                    "#4ade80";

            }

            // Snake body

            else {

                ctx.fillStyle =
                    "#22c55e";
            }


            ctx.beginPath();


            ctx.roundRect(

                x + 1,

                y + 1,

                GRID_SIZE - 2,

                GRID_SIZE - 2,

                5

            );


            ctx.fill();

        }

    );


    // ========================================
    // DRAW EYES
    // ========================================

    drawSnakeEyes();
}


// ============================================
// DRAW SNAKE EYES
// ============================================

function drawSnakeEyes() {


    if (
        snake.length === 0
    ) {

        return;
    }


    const head =
        snake[0];


    ctx.fillStyle =
        "white";


    let eye1;

    let eye2;


    // ========================================
    // RIGHT
    // ========================================

    if (
        direction.x === 1
    ) {

        eye1 = {

            x:
                head.x *
                GRID_SIZE +
                13,

            y:
                head.y *
                GRID_SIZE +
                4

        };


        eye2 = {

            x:
                head.x *
                GRID_SIZE +
                13,

            y:
                head.y *
                GRID_SIZE +
                12

        };

    }


    // ========================================
    // LEFT
    // ========================================

    else if (
        direction.x === -1
    ) {

        eye1 = {

            x:
                head.x *
                GRID_SIZE +
                4,

            y:
                head.y *
                GRID_SIZE +
                4

        };


        eye2 = {

            x:
                head.x *
                GRID_SIZE +
                4,

            y:
                head.y *
                GRID_SIZE +
                12

        };

    }


    // ========================================
    // UP
    // ========================================

    else if (
        direction.y === -1
    ) {

        eye1 = {

            x:
                head.x *
                GRID_SIZE +
                4,

            y:
                head.y *
                GRID_SIZE +
                4

        };


        eye2 = {

            x:
                head.x *
                GRID_SIZE +
                12,

            y:
                head.y *
                GRID_SIZE +
                4

        };

    }


    // ========================================
    // DOWN
    // ========================================

    else {

        eye1 = {

            x:
                head.x *
                GRID_SIZE +
                4,

            y:
                head.y *
                GRID_SIZE +
                13

        };


        eye2 = {

            x:
                head.x *
                GRID_SIZE +
                12,

            y:
                head.y *
                GRID_SIZE +
                13

        };

    }


    // ========================================
    // DRAW EYES
    // ========================================

    ctx.fillRect(

        eye1.x,

        eye1.y,

        3,

        3

    );


    ctx.fillRect(

        eye2.x,

        eye2.y,

        3,

        3

    );
}


// ============================================
// GAME OVER
// ============================================

function gameOver(
    reason = "Game Over!"
) {


    // ========================================
    // STOP GAME
    // ========================================

    gameRunning = false;

    paused = false;


    // ========================================
    // STOP LOOP
    // ========================================

    if (
        gameLoop !== null
    ) {

        clearInterval(
            gameLoop
        );

        gameLoop = null;
    }


    // ========================================
    // FINAL RESULTS
    // ========================================

    finalScore.textContent =
        score;


    finalHighScore.textContent =
        highScore;


    finalCoins.textContent =
        coins;


    // ========================================
    // SHOW GAME OVER REASON
    // ========================================

    if (
        gameOverReason
    ) {

        gameOverReason.textContent =
            reason;
    }


    // ========================================
    // SHOW GAME OVER SCREEN
    // ========================================

    gameScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.remove(
        "hidden"
    );


    // ========================================
    // HIDE PAUSE
    // ========================================

    pauseOverlay.classList.add(
        "hidden"
    );
}


// ============================================
// PAUSE GAME
// ============================================

function pauseGame() {


    if (
        !gameRunning
    ) {

        return;
    }


    paused = true;


    pauseOverlay.classList.remove(
        "hidden"
    );


    pauseBtn.textContent =
        "▶";
}


// ============================================
// RESUME GAME
// ============================================

function resumeGame() {


    if (
        !gameRunning
    ) {

        return;
    }


    paused = false;


    pauseOverlay.classList.add(
        "hidden"
    );


    pauseBtn.textContent =
        "⏸";
}


// ============================================
// KEYBOARD CONTROLS
// ============================================

document.addEventListener(
    "keydown",
    function(event) {


        // ====================================
        // UP
        // ====================================

        if (
            event.key ===
            "ArrowUp"
        ) {

            event.preventDefault();


            if (
                direction.y !== 1
            ) {

                nextDirection = {

                    x: 0,

                    y: -1

                };

            }

        }


        // ====================================
        // DOWN
        // ====================================

        else if (
            event.key ===
            "ArrowDown"
        ) {

            event.preventDefault();


            if (
                direction.y !== -1
            ) {

                nextDirection = {

                    x: 0,

                    y: 1

                };

            }

        }


        // ====================================
        // LEFT
        // ====================================

        else if (
            event.key ===
            "ArrowLeft"
        ) {

            event.preventDefault();


            if (
                direction.x !== 1
            ) {

                nextDirection = {

                    x: -1,

                    y: 0

                };

            }

        }


        // ====================================
        // RIGHT
        // ====================================

        else if (
            event.key ===
            "ArrowRight"
        ) {

            event.preventDefault();


            if (
                direction.x !== -1
            ) {

                nextDirection = {

                    x: 1,

                    y: 0

                };

            }

        }


        // ====================================
        // SPACE = PAUSE
        // ====================================

        else if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();


            if (
                !gameRunning
            ) {

                return;
            }


            if (
                paused
            ) {

                resumeGame();

            }

            else {

                pauseGame();

            }

        }

    }
);


// ============================================
// MOBILE CONTROLS
// ============================================

const mobileButtons =
    document.querySelectorAll(
        ".mobile-controls button"
    );


mobileButtons.forEach(
    button => {


        button.addEventListener(
            "click",
            function() {


                if (
                    !gameRunning ||
                    paused
                ) {

                    return;
                }


                const selected =
                    button.dataset.direction;


                // =================================
                // UP
                // =================================

                if (

                    selected === "up" &&

                    direction.y !== 1

                ) {

                    nextDirection = {

                        x: 0,

                        y: -1

                    };

                }


                // =================================
                // DOWN
                // =================================

                else if (

                    selected === "down" &&

                    direction.y !== -1

                ) {

                    nextDirection = {

                        x: 0,

                        y: 1

                    };

                }


                // =================================
                // LEFT
                // =================================

                else if (

                    selected === "left" &&

                    direction.x !== 1

                ) {

                    nextDirection = {

                        x: -1,

                        y: 0

                    };

                }


                // =================================
                // RIGHT
                // =================================

                else if (

                    selected === "right" &&

                    direction.x !== -1

                ) {

                    nextDirection = {

                        x: 1,

                        y: 0

                    };

                }

            }
        );

    }
);


// ============================================
// BUTTON EVENTS
// ============================================


// START GAME

startBtn.addEventListener(
    "click",
    startGame
);


// PLAY AGAIN

playAgainBtn.addEventListener(
    "click",
    startGame
);


// PAUSE

pauseBtn.addEventListener(
    "click",
    function() {


        if (
            paused
        ) {

            resumeGame();

        }

        else {

            pauseGame();

        }

    }
);


// RESUME

resumeBtn.addEventListener(
    "click",
    resumeGame
);


// ============================================
// MAIN MENU
// ============================================

menuBtn.addEventListener(
    "click",
    function() {


        // Stop game

        gameRunning = false;

        paused = false;


        if (
            gameLoop !== null
        ) {

            clearInterval(
                gameLoop
            );

            gameLoop = null;
        }


        // Update menu

        menuHighScore.textContent =
            highScore;


        menuCoins.textContent =
            coins;


        // ====================================
        // CHANGE SCREEN
        // ====================================

        gameOverScreen.classList.add(
            "hidden"
        );


        gameScreen.classList.add(
            "hidden"
        );


        startScreen.classList.remove(
            "hidden"
        );

    }
);