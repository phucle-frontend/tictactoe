let gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let currentPlayer = "X";
let gameMode = "twoPlayer";
let gameActive = true;
let scores = { X: 0, O: 0 };
let scoreX, scoreO;
let currentPlayerDisplay;

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  handleUpdateUIGameStatus.loadScores();
  const cells = document.querySelectorAll(".cell");
  currentPlayerDisplay = document.getElementById("text-indication");
  const restartBtn = document.getElementById("footer-btn-restart");
  scoreX = document.getElementById("scoreX");
  scoreO = document.getElementById("scoreO");
  const humanMode = document.getElementById("humanMode");
  const aiMode = document.getElementById("aiMode");

  handleUpdateUIGameStatus.updateScoreDisplay(scores);

  restartBtn.addEventListener("click", () =>
    handleGameConfig.restartGame(cells, currentPlayerDisplay)
  );
  humanMode.addEventListener("click", () =>
    handleGameConfig.switchMode("humanMode", cells, currentPlayerDisplay)
  );
  aiMode.addEventListener("click", () =>
    handleGameConfig.switchMode("ai", cells, currentPlayerDisplay)
  );

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index, cells));
  });
  handleUpdateUIGameStatus.updateCurrentPlayerDisplay(currentPlayerDisplay);
}

function handleCellClick(index, cells) {
  if (!gameActive) return;

  const row = Math.floor(index / 3);
  const col = index % 3;

  if (gameBoard[row][col] !== "") return;

  makeMove(row, col, currentPlayer, cells);

  if (handleTrackingGameStatus.checkWin()) {
    handleUpdateUIGameStatus.handleWin(currentPlayerDisplay, cells);
  } else if (handleTrackingGameStatus.checkDraw()) {
    handleUpdateUIGameStatus.handleDraw(currentPlayerDisplay);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    handleUpdateUIGameStatus.updateCurrentPlayerDisplay(currentPlayerDisplay);

    if (gameMode === "ai" && currentPlayer === "O" && gameActive) {
        setTimeout(() => makeAIMove(cells), 500);
    }
  }
}

function makeMove(row, col, player, cells) {
  gameBoard[row][col] = player;
  const cellIndex = row * 3 + col;
  const cell = cells[cellIndex];

  cell.innerHTML = "";
  handleRender.renderPlayerMoveIcon(player, cell);
  cell.classList.add(player.toLowerCase());
  handleRender.renderActivePlayerTurn(player);
}

function makeAIMove(cells) {
  if (!gameActive) return;

  const emptyCells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (gameBoard[row][col] === "") {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    makeMove(row, col, "O", cells);

    if (handleTrackingGameStatus.checkWin()) {
      handleUpdateUIGameStatus.handleWin(currentPlayerDisplay, cells);
    } else if (handleTrackingGameStatus.checkDraw()) {
      handleUpdateUIGameStatus.handleDraw(currentPlayerDisplay);
    } else {
      currentPlayer = "X";
      handleUpdateUIGameStatus.updateCurrentPlayerDisplay(currentPlayerDisplay);
    }
  }
}

const handleTrackingGameStatus = {
  checkWin() {
    // check rows
    for (let row = 0; row < 3; row++) {
      if (
        gameBoard[row][0] &&
        gameBoard[row][0] === gameBoard[row][1] &&
        gameBoard[row][1] === gameBoard[row][2]
      ) {
        return { type: "row", index: row, player: gameBoard[row][0] };
      }
    }

    // check cols
    for (let col = 0; col < 3; col++) {
      if (
        gameBoard[0][col] &&
        gameBoard[0][col] === gameBoard[1][col] &&
        gameBoard[1][col] === gameBoard[2][col]
      ) {
        return { type: "col", index: col, player: gameBoard[0][col] };
      }
    }

    // check diagnals
    if (
      gameBoard[0][0] &&
      gameBoard[0][0] === gameBoard[1][1] &&
      gameBoard[1][1] === gameBoard[2][2]
    ) {
      return { type: "diagonal", index: 0, player: gameBoard[0][0] };
    }

    if (
      gameBoard[0][2] &&
      gameBoard[0][2] === gameBoard[1][1] &&
      gameBoard[1][1] === gameBoard[2][0]
    ) {
      return { type: "diagonal", index: 1, player: gameBoard[0][2] };
    }

    return null;
  },

  checkDraw() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameBoard[row][col] === "") {
          return false;
        }
      }
    }
    return true;
  },
};

const handleRender = {
  renderActivePlayerTurn: (player) => {
    document
      .querySelectorAll(".calendar-body-date-item-active")
      .forEach((div) => div.classList.remove("calendar-body-date-item-active"));

    if (player === "X") {
      document
        .querySelector(".player-info-card-x")
        .classList.add("player-info-card-active");
      document
        .querySelector(".player-info-card-y")
        .classList.remove("player-info-card-active");
    } else {
      document
        .querySelector(".player-info-card-x")
        .classList.remove("player-info-card-active");
      document
        .querySelector(".player-info-card-y")
        .classList.add("player-info-card-active");
    }
  },

  renderPlayerMoveIcon: (player, cell) => {
    if (player === "X") {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "80");
      svg.setAttribute("height", "80");
      svg.setAttribute("viewBox", "0 0 128 128");

      const path1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path1.setAttribute("d", "M16,16L112,112");
      path1.setAttribute("style", "stroke: red; stroke-width: 8");

      const path2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path2.setAttribute("d", "M112,16L16,112");
      path2.setAttribute("style", "stroke: red; stroke-width: 8");

      svg.appendChild(path1);
      svg.appendChild(path2);
      cell.appendChild(svg);
    } else if (player === "O") {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "80");
      svg.setAttribute("height", "80");
      svg.setAttribute("viewBox", "0 0 128 128");

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", "64");
      circle.setAttribute("cy", "64");
      circle.setAttribute("r", "48");
      circle.setAttribute("style", "stroke: blue; stroke-width: 8; fill: none");

      svg.appendChild(circle);
      cell.appendChild(svg);
    }
  },
};

const handleUpdateUIGameStatus = {
  handleWin(currentPlayerDisplay, cells) {
    const winResult = handleTrackingGameStatus.checkWin();
    if (!winResult) return;

    gameActive = false;

    const playerName = winResult.player === "X" ? "Player X" : "Player O";
    currentPlayerDisplay.textContent = `${playerName} Wins!`;
    currentPlayerDisplay.classList.add("text-indication-winning");

    // update score
    scores[winResult.player]++;
    handleUpdateUIGameStatus.saveScores();
    handleUpdateUIGameStatus.updateScoreDisplay(scores);

    handleUpdateUIGameStatus.dimOtherCells(winResult, cells);
  },

  handleDraw(currentPlayerDisplay) {
    gameActive = false;
    currentPlayerDisplay.textContent = "It's a Draw!";
  },
  loadScores() {
    const savedScores = localStorage.getItem("ticTacToeScores");
    if (savedScores) {
      scores = JSON.parse(savedScores);
    }
  },

  saveScores() {
    localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
  },

  resetBoard(cells, currentPlayerDisplay) {
    gameBoard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.className = "cell";
    });
    gameActive = true;
    handleUpdateUIGameStatus.updateCurrentPlayerDisplay(currentPlayerDisplay);
  },

  updateScoreDisplay(scores) {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
  },

  dimOtherCells(winResult, cells) {
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      let shouldDim = true;

      if (winResult.type === "row" && row === winResult.index) {
        shouldDim = false;
      } else if (winResult.type === "col" && col === winResult.index) {
        shouldDim = false;
      } else if (winResult.type === "diagonal") {
        if (winResult.index === 0 && row === col) {
          shouldDim = false;
        } else if (winResult.index === 1 && row + col === 2) {
          shouldDim = false;
        }
      }
      if (!shouldDim) {
        cell.classList.add("cell-highlighted");
        return;
      }

      if (shouldDim) {
        cell.classList.add("cell-dimmed");
      }
    });
  },
  updateCurrentPlayerDisplay(currentPlayerDisplay) {
    const playerName = currentPlayer === "X" ? "Player X" : "Player O";
    currentPlayerDisplay.textContent = `${playerName}'s turn`;
    handleRender.renderActivePlayerTurn(currentPlayer);
  },
};

const handleGameConfig = {
  switchMode(mode, cells, currentPlayerDisplay) {
    gameMode = mode;
    document
      .getElementById("humanMode")
      .classList.toggle("btn-mode-active", mode === "humanMode");
    document
      .getElementById("aiMode")
      .classList.toggle("btn-mode-active", mode === "ai");
    handleGameConfig.restartGame(cells, currentPlayerDisplay);
  },
  restartGame(cells, currentPlayerDisplay) {
    handleUpdateUIGameStatus.resetBoard(cells, currentPlayerDisplay);
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    handleUpdateUIGameStatus.updateCurrentPlayerDisplay(currentPlayerDisplay);
    if (gameMode === "ai" && currentPlayer === "O") {
     setTimeout(() => makeAIMove(cells), 500);
    }
  },
};
