const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

const gameOverlay = document.getElementById("gameOverlay");
const closeGame = document.getElementById("closeGame");
const gameTitle = document.getElementById("gameTitle");
const gameCategory = document.getElementById("gameCategory");
const gameContent = document.getElementById("gameContent");
const gameScore = document.getElementById("gameScore");

const xpBar = document.getElementById("xpBar");
const xpText = document.getElementById("xpText");
const levelValue = document.getElementById("levelValue");

const profileXp = document.getElementById("profileXp");
const profileLevel = document.getElementById("profileLevel");
const gamesPlayed = document.getElementById("gamesPlayed");
const bestScore = document.getElementById("bestScore");

const startBtn = document.getElementById("startBtn");
const viewAllBtn = document.getElementById("viewAllBtn");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");

let playerData = {
    xp: 0,
    level: 1,
    games: 0,
    bestScore: 0
};

let currentGame = null;

function loadPlayer() {
    const saved = localStorage.getItem("gamezone-player");

    if (saved) {
        playerData = JSON.parse(saved);
    }

    updatePlayerUI();
}

function savePlayer() {
    localStorage.setItem(
        "gamezone-player",
        JSON.stringify(playerData)
    );
}

function updatePlayerUI() {
    const currentLevelXp = playerData.xp % 100;

    xpBar.style.width = `${currentLevelXp}%`;
    xpText.textContent = `${currentLevelXp} / 100`;

    levelValue.textContent =
        String(playerData.level).padStart(2, "0");

    profileXp.textContent = playerData.xp;
    profileLevel.textContent =
        String(playerData.level).padStart(2, "0");

    gamesPlayed.textContent = playerData.games;
    bestScore.textContent = playerData.bestScore;
}

function addXP(amount) {
    playerData.xp += amount;

    while (playerData.xp >= playerData.level * 100) {
        playerData.level++;
        showNotification(
            `LEVEL UP! You reached level ${playerData.level}`
        );
    }

    savePlayer();
    updatePlayerUI();
}

function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

function openPage(pageName) {
    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("active-page");
    }

    const button = document.querySelector(
        `[data-section="${pageName}"]`
    );

    if (button) {
        button.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        openPage(button.dataset.section);
    });
});

startBtn.addEventListener("click", () => {
    openPage("games");
});

viewAllBtn.addEventListener("click", () => {
    openPage("games");
});

document.querySelectorAll("[data-game]").forEach(element => {
    element.addEventListener("click", event => {

        if (
            event.target.classList.contains("play-card") ||
            element.classList.contains("library-item") ||
            element.classList.contains("game-card")
        ) {
            openGame(element.dataset.game);
        }
    });
});

function openGame(game) {
    currentGame = game;

    const games = {
        memory: {
            title: "Memory Challenge",
            category: "MEMORY / STRATEGY"
        },
        puzzle: {
            title: "Puzzle Lab",
            category: "LOGIC / PUZZLE"
        },
        quiz: {
            title: "Quiz Arena",
            category: "KNOWLEDGE / SPEED"
        },
        racing: {
            title: "Neon Rush",
            category: "RACING / REFLEX"
        },
        target: {
            title: "Target Zone",
            category: "AIM / PRECISION"
        }
    };

    const selected = games[game];

    gameTitle.textContent = selected.title;
    gameCategory.textContent = selected.category;
    gameScore.textContent = "0";

    gameContent.innerHTML = `
        <div style="
            min-height:430px;
            display:grid;
            place-items:center;
            text-align:center;
            border:1px solid #272b36;
            background:#08090d;
        ">
            <div>
                <div style="
                    font-size:70px;
                    color:#d9ff00;
                    margin-bottom:20px;
                ">${getGameSymbol(game)}</div>

                <h3 style="
                    font-size:42px;
                    text-transform:uppercase;
                    margin-bottom:10px;
                ">
                    ${selected.title}
                </h3>

                <p style="
                    color:#777d8d;
                    font-family:'Space Mono';
                    font-size:10px;
                    max-width:450px;
                    line-height:1.8;
                    margin:auto;
                ">
                    GAME ENGINE READY
                </p>

                <button
                    id="launchGame"
                    style="
                        margin-top:25px;
                        border:0;
                        background:#d9ff00;
                        color:#050607;
                        padding:15px 30px;
                        font-weight:800;
                        cursor:pointer;
                    "
                >
                    START GAME →
                </button>
            </div>
        </div>
    `;

    gameOverlay.classList.add("show");

    document
        .getElementById("launchGame")
        .addEventListener("click", () => {
            launchGame(game);
        });
}

function getGameSymbol(game) {
    const symbols = {
        memory: "◈",
        puzzle: "◇",
        quiz: "?",
        racing: "↯",
        target: "⊙"
    };

    return symbols[game];
}

function launchGame(game) {
    if (game === "memory") {
        startMemoryGame();
        return;
    }

    if (game === "puzzle") {
        startPuzzleGame();
        return;
    }

    if (game === "quiz") {
        startQuizGame();
        return;
    }

    if (game === "racing") {
        startRacingGame();
        return;
    }

    if (game === "target") {
        startTargetGame();
    }
}

function startMemoryGame() {
    const symbols = ["◆", "●", "▲", "■", "★", "✦"];

    const cards = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5);

    let first = null;
    let second = null;
    let lock = false;
    let matches = 0;
    let score = 0;

    gameContent.innerHTML = `
        <div style="
            display:flex;
            justify-content:space-between;
            margin-bottom:20px;
            font-family:'Space Mono';
            font-size:10px;
            color:#777d8d;
        ">
            <span>MATCH ALL PAIRS</span>
            <span id="memoryStatus">0 / 6</span>
        </div>

        <div id="memoryBoard" style="
            display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:10px;
            max-width:650px;
            margin:auto;
        ">
        </div>
    `;

    const board = document.getElementById("memoryBoard");

    cards.forEach((symbol, index) => {
        const card = document.createElement("button");

        card.dataset.symbol = symbol;

        card.style.cssText = `
            aspect-ratio:1;
            border:1px solid #272b36;
            background:#101219;
            color:#d9ff00;
            font-size:35px;
            cursor:pointer;
            transition:.2s;
        `;

        card.textContent = "?";

        card.addEventListener("click", () => {

            if (
                lock ||
                card.classList.contains("matched") ||
                card === first
            ) {
                return;
            }

            card.textContent = symbol;
            card.style.background = "#171b24";

            if (!first) {
                first = card;
                return;
            }

            second = card;
            lock = true;

            if (first.dataset.symbol === second.dataset.symbol) {

                first.classList.add("matched");
                second.classList.add("matched");

                first.style.background = "#d9ff00";
                first.style.color = "#050607";

                second.style.background = "#d9ff00";
                second.style.color = "#050607";

                matches++;
                score += 100;

                gameScore.textContent = score;

                document.getElementById(
                    "memoryStatus"
                ).textContent = `${matches} / 6`;

                first = null;
                second = null;
                lock = false;

                if (matches === 6) {
                    finishGame(score);
                }

            } else {

                setTimeout(() => {
                    first.textContent = "?";
                    second.textContent = "?";

                    first.style.background = "#101219";
                    second.style.background = "#101219";

                    first = null;
                    second = null;
                    lock = false;
                }, 650);
            }
        });

        board.appendChild(card);
    });
}

function startPuzzleGame() {
    let tiles = [1, 2, 3, 4, 5, 6, 7, 8, ""];

    function shuffle() {
        tiles.sort(() => Math.random() - 0.5);

        if (isSolved()) {
            shuffle();
        }
    }

    function isSolved() {
        return tiles.join(",") === "1,2,3,4,5,6,7,8,";
    }

    function render() {
        gameContent.innerHTML = `
            <div class="puzzle-game">
                <div class="puzzle-info">
                    <span>ARRANGE THE TILES</span>
                    <strong id="moves">MOVES: 0</strong>
                </div>

                <div class="puzzle-board" id="puzzleBoard"></div>

                <button class="game-action" id="shufflePuzzle">
                    SHUFFLE
                </button>
            </div>
        `;

        const board = document.getElementById("puzzleBoard");
        const movesElement = document.getElementById("moves");

        let moves = 0;

        function draw() {
            board.innerHTML = "";

            tiles.forEach((tile, index) => {
                const button = document.createElement("button");

                button.className = "puzzle-tile";

                if (tile === "") {
                    button.classList.add("empty");
                } else {
                    button.textContent = tile;
                }

                button.addEventListener("click", () => {
                    const emptyIndex = tiles.indexOf("");

                    const row = Math.floor(index / 3);
                    const column = index % 3;

                    const emptyRow = Math.floor(emptyIndex / 3);
                    const emptyColumn = emptyIndex % 3;

                    const distance =
                        Math.abs(row - emptyRow) +
                        Math.abs(column - emptyColumn);

                    if (distance !== 1) {
                        return;
                    }

                    [tiles[index], tiles[emptyIndex]] =
                        [tiles[emptyIndex], tiles[index]];

                    moves++;

                    movesElement.textContent = `MOVES: ${moves}`;

                    draw();

                    if (isSolved()) {
                        const score = Math.max(
                            1000 - moves * 15,
                            100
                        );

                        finishGame(score);
                    }
                });

                board.appendChild(button);
            });
        }

        document
            .getElementById("shufflePuzzle")
            .addEventListener("click", () => {
                shuffle();
                moves = 0;
                draw();
            });

        draw();
    }

    shuffle();
    render();
}
function startQuizGame() {
    const questions = [
        {
            question: "Which planet is known as the Red Planet?",
            answers: ["Earth", "Mars", "Venus", "Jupiter"],
            correct: 1
        },
        {
            question: "What is 12 × 8?",
            answers: ["86", "96", "108", "88"],
            correct: 1
        },
        {
            question: "Which language runs directly in a browser?",
            answers: ["Python", "C++", "JavaScript", "Java"],
            correct: 2
        },
        {
            question: "How many sides does a hexagon have?",
            answers: ["5", "6", "7", "8"],
            correct: 1
        },
        {
            question: "What is the largest ocean?",
            answers: ["Atlantic", "Indian", "Pacific", "Arctic"],
            correct: 2
        },
        {
            question: "Which one is a programming language?",
            answers: ["HTML", "JavaScript", "CSS", "Photoshop"],
            correct: 1
        },
        {
            question: "What is 15 + 27?",
            answers: ["32", "40", "42", "45"],
            correct: 2
        },
        {
            question: "Which animal is known as the fastest land animal?",
            answers: ["Lion", "Horse", "Cheetah", "Tiger"],
            correct: 2
        },
        {
            question: "How many continents are there?",
            answers: ["5", "6", "7", "8"],
            correct: 2
        },
        {
            question: "What does CSS control?",
            answers: [
                "Website design",
                "Database",
                "Server",
                "Computer hardware"
            ],
            correct: 0
        }
    ];

    let current = 0;
    let score = 0;
    let combo = 0;
    let time = 15;
    let timer;

    function renderQuestion() {
        clearInterval(timer);

        const item = questions[current];

        time = 15;

        gameContent.innerHTML = `
            <div class="quiz-game">

                <div class="quiz-top">
                    <span>
                        QUESTION ${current + 1} / ${questions.length}
                    </span>

                    <strong id="quizTimer">
                        00:15
                    </strong>
                </div>

                <div class="quiz-progress">
                    <div style="width:${(current / questions.length) * 100}%"></div>
                </div>

                <h3 class="quiz-question">
                    ${item.question}
                </h3>

                <div class="quiz-answers" id="quizAnswers"></div>

                <div class="combo">
                    COMBO × ${combo}
                </div>
            </div>
        `;

        const answersBox =
            document.getElementById("quizAnswers");

        item.answers.forEach((answer, index) => {
            const button = document.createElement("button");

            button.className = "quiz-answer";
            button.innerHTML = `
                <span>${String.fromCharCode(65 + index)}</span>
                ${answer}
            `;

            button.addEventListener("click", () => {
                answerQuestion(index);
            });

            answersBox.appendChild(button);
        });

        timer = setInterval(() => {
            time--;

            const timerElement =
                document.getElementById("quizTimer");

            if (timerElement) {
                timerElement.textContent =
                    `00:${String(time).padStart(2, "0")}`;
            }

            if (time <= 0) {
                clearInterval(timer);
                combo = 0;
                nextQuestion();
            }
        }, 1000);
    }

    function answerQuestion(index) {
        clearInterval(timer);

        const correct = questions[current].correct;
        const buttons =
            document.querySelectorAll(".quiz-answer");

        buttons.forEach(button => {
            button.disabled = true;
        });

        if (index === correct) {
            combo++;

            const gained =
                100 + combo * 25 + time * 5;

            score += gained;

            buttons[index].classList.add("correct");

            gameScore.textContent = score;
        } else {
            combo = 0;

            buttons[index].classList.add("wrong");
            buttons[correct].classList.add("correct");
        }

        setTimeout(nextQuestion, 700);
    }

    function nextQuestion() {
        current++;

        if (current >= questions.length) {
            finishGame(score);
            return;
        }

        renderQuestion();
    }

    renderQuestion();
}
function startRacingGame() {
    gameContent.innerHTML = `
        <div class="racing-game">
            <div class="race-hud">
                <span>NEON RUSH</span>
                <strong id="raceScore">0</strong>
            </div>

            <div class="race-track" id="raceTrack">
                <div class="road-line line-one"></div>
                <div class="road-line line-two"></div>

                <div class="player-car" id="playerCar">
                    ▰
                </div>
            </div>

            <div class="race-controls">
                <button id="leftBtn">←</button>
                <span>USE ARROW KEYS</span>
                <button id="rightBtn">→</button>
            </div>
        </div>
    `;

    const track = document.getElementById("raceTrack");
    const car = document.getElementById("playerCar");
    const scoreElement = document.getElementById("raceScore");

    let position = 50;
    let score = 0;
    let gameOver = false;
    let speed = 4;

    const obstacles = [];

    function moveCar(direction) {
        if (gameOver) {
            return;
        }

        position += direction * 8;

        position = Math.max(10, Math.min(90, position));

        car.style.left = `${position}%`;
    }

    document.addEventListener("keydown", raceKeyHandler);

    function raceKeyHandler(event) {
        if (event.key === "ArrowLeft") {
            moveCar(-1);
        }

        if (event.key === "ArrowRight") {
            moveCar(1);
        }
    }

    document
        .getElementById("leftBtn")
        .addEventListener("click", () => moveCar(-1));

    document
        .getElementById("rightBtn")
        .addEventListener("click", () => moveCar(1));

    const spawnTimer = setInterval(() => {

        if (gameOver) {
            clearInterval(spawnTimer);
            return;
        }

        const obstacle = document.createElement("div");

        obstacle.className = "race-obstacle";

        const lane = Math.floor(Math.random() * 5);

        obstacle.style.left = `${10 + lane * 20}%`;
        obstacle.style.top = "-60px";

        track.appendChild(obstacle);
        obstacles.push(obstacle);

    }, 800);

    const gameLoop = setInterval(() => {

        if (gameOver) {
            clearInterval(gameLoop);
            return;
        }

        score++;

        scoreElement.textContent = score;

        obstacles.forEach((obstacle, index) => {

            const top =
                parseFloat(obstacle.style.top || "-60");

            obstacle.style.top = `${top + speed}px`;

            if (top > 500) {
                obstacle.remove();
                obstacles.splice(index, 1);
            }

            const obstacleLeft =
                parseFloat(obstacle.style.left);

            const carLeft = position;

            const closeX =
                Math.abs(obstacleLeft - carLeft) < 9;

            const closeY =
                top > 350 && top < 450;

            if (closeX && closeY) {
                gameOver = true;

                clearInterval(gameLoop);
                clearInterval(spawnTimer);

                document.removeEventListener(
                    "keydown",
                    raceKeyHandler
                );

                finishGame(score);
            }
        });

        if (score % 500 === 0) {
            speed += 1;
        }

    }, 50);
}

function startTargetGame() {
    let score = 0;
    let hits = 0;
    let misses = 0;
    let timeLeft = 30;
    let targetSize = 70;
    let gameOver = false;

    gameContent.innerHTML = `
        <div class="target-game">

            <div class="target-hud">
                <div>
                    <span>SCORE</span>
                    <strong id="targetScore">0</strong>
                </div>

                <div>
                    <span>HITS</span>
                    <strong id="targetHits">0</strong>
                </div>

                <div>
                    <span>TIME</span>
                    <strong id="targetTime">30</strong>
                </div>
            </div>

            <div class="target-arena" id="targetArena">
            </div>

        </div>
    `;

    const arena =
        document.getElementById("targetArena");

    const scoreElement =
        document.getElementById("targetScore");

    const hitsElement =
        document.getElementById("targetHits");

    const timeElement =
        document.getElementById("targetTime");

    function spawnTarget() {
        if (gameOver) {
            return;
        }

        const target =
            document.createElement("button");

        target.className = "target";

        const x =
            Math.random() * 80 + 5;

        const y =
            Math.random() * 70 + 5;

        target.style.left = `${x}%`;
        target.style.top = `${y}%`;

        target.style.width = `${targetSize}px`;
        target.style.height = `${targetSize}px`;

        target.innerHTML = `
            <span></span>
        `;

        target.addEventListener("click", () => {

            hits++;

            const bonus =
                Math.max(50, 150 - hits * 3);

            score += bonus;

            scoreElement.textContent = score;
            hitsElement.textContent = hits;

            target.remove();

            targetSize = Math.max(
                38,
                targetSize - 2
            );

            spawnTarget();
        });

        arena.appendChild(target);

        setTimeout(() => {

            if (!target.isConnected) {
                return;
            }

            target.remove();
            misses++;

            spawnTarget();

        }, Math.max(450, 1100 - hits * 15));
    }

    const timer = setInterval(() => {

        timeLeft--;

        timeElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver = true;

            finishGame(score);
        }

    }, 1000);

    spawnTarget();
}

function finishGame(score) {
    playerData.games++;

    if (score > playerData.bestScore) {
        playerData.bestScore = score;
    }

    addXP(Math.floor(score / 10));

    setTimeout(() => {
        gameContent.innerHTML = `
            <div style="
                min-height:420px;
                display:grid;
                place-items:center;
                text-align:center;
            ">
                <div>
                    <span style="
                        font-family:'Space Mono';
                        color:#d9ff00;
                        font-size:9px;
                    ">
                        CHALLENGE COMPLETE
                    </span>

                    <h3 style="
                        font-size:80px;
                        line-height:.9;
                        margin:15px 0;
                    ">
                        ${score}
                    </h3>

                    <p style="
                        color:#777d8d;
                        font-family:'Space Mono';
                        font-size:10px;
                    ">
                        +${Math.floor(score / 10)} XP
                    </p>

                    <button
                        onclick="openPage('games'); closeCurrentGame()"
                        style="
                            margin-top:25px;
                            border:0;
                            background:#d9ff00;
                            padding:14px 25px;
                            font-weight:800;
                            cursor:pointer;
                        "
                    >
                        BACK TO GAMES
                    </button>
                </div>
            </div>
        `;
    }, 400);
}

function closeCurrentGame() {
    gameOverlay.classList.remove("show");
}

closeGame.addEventListener("click", closeCurrentGame);

gameOverlay.addEventListener("click", event => {
    if (event.target === gameOverlay) {
        closeCurrentGame();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCurrentGame();
    }
});

loadPlayer();