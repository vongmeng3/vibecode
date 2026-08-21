"use client";

import { useMemo, useState } from "react";

const EMPTY_BOARD = Array(9).fill(null);

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const PLAYERS = {
  X: {
    name: "Player X",
    color: "#0E8F74",
    soft: "#DDF5EE",
  },
  O: {
    name: "Player O",
    color: "#E15554",
    soft: "#FFE7E5",
  },
};

function createBoard() {
  return [...EMPTY_BOARD];
}

function findWinner(board) {
  for (const line of WINNING_COMBINATIONS) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }

  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const statusText = useMemo(() => {
    if (winner) return `${PLAYERS[winner].name} wins`;
    if (isDraw) return "Round draw";
    return `${PLAYERS[currentPlayer].name} to move`;
  }, [currentPlayer, isDraw, winner]);

  const movesPlayed = board.filter(Boolean).length;

  function handleCellClick(index) {
    if (board[index] || winner || isDraw) return;

    const nextBoard = board.map((cell, cellIndex) =>
      cellIndex === index ? currentPlayer : cell
    );
    const result = findWinner(nextBoard);

    setBoard(nextBoard);
    setHoveredCell(null);

    if (result) {
      setWinner(result.player);
      setWinningLine(result.line);
      setScores((currentScores) => ({
        ...currentScores,
        [result.player]: currentScores[result.player] + 1,
      }));
      return;
    }

    if (nextBoard.every(Boolean)) {
      setIsDraw(true);
      setScores((currentScores) => ({
        ...currentScores,
        draws: currentScores.draws + 1,
      }));
      return;
    }

    setCurrentPlayer((player) => (player === "X" ? "O" : "X"));
  }

  function startNewRound() {
    setBoard(createBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setHoveredCell(null);
    setRound((currentRound) => currentRound + 1);
  }

  function resetMatch() {
    setBoard(createBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setHoveredCell(null);
    setRound(1);
    setScores({ X: 0, O: 0, draws: 0 });
  }

  function getCellStyle(cell, index) {
    const isWinningCell = winningLine.includes(index);
    const isPreview = hoveredCell === index && !cell && !winner && !isDraw;
    const activeMark = cell || (isPreview ? currentPlayer : null);

    return {
      ...styles.cell,
      backgroundColor: isWinningCell
        ? PLAYERS[cell].soft
        : isPreview
          ? PLAYERS[currentPlayer].soft
          : cell
            ? "#FFFFFF"
            : "#EEF3F6",
      borderColor: isWinningCell
        ? PLAYERS[cell].color
        : isPreview
          ? PLAYERS[currentPlayer].color
          : "#D7E0E7",
      boxShadow: isWinningCell
        ? "0 14px 28px rgba(15, 23, 42, 0.16)"
        : isPreview
          ? "0 12px 22px rgba(15, 23, 42, 0.12)"
          : "0 6px 14px rgba(15, 23, 42, 0.08)",
      color: activeMark ? PLAYERS[activeMark].color : "#9AA7B3",
      transform: isPreview ? "translateY(-2px)" : "translateY(0)",
    };
  }

  return (
    <section style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.infoPanel}>
          <p style={styles.kicker}>Round {round}</p>
          <h1 style={styles.title}>Tic-Tac-Toe</h1>

          <div style={styles.statusRow} aria-live="polite">
            <span
              style={{
                ...styles.turnDot,
                backgroundColor: winner
                  ? PLAYERS[winner].color
                  : isDraw
                    ? "#F4A261"
                    : PLAYERS[currentPlayer].color,
              }}
            />
            <span>{statusText}</span>
          </div>

          <div style={styles.scoreGrid}>
            <div style={styles.scoreTile}>
              <span style={styles.scoreLabel}>X wins</span>
              <strong style={{ ...styles.scoreValue, color: PLAYERS.X.color }}>
                {scores.X}
              </strong>
            </div>
            <div style={styles.scoreTile}>
              <span style={styles.scoreLabel}>Draws</span>
              <strong style={{ ...styles.scoreValue, color: "#D48B26" }}>
                {scores.draws}
              </strong>
            </div>
            <div style={styles.scoreTile}>
              <span style={styles.scoreLabel}>O wins</span>
              <strong style={{ ...styles.scoreValue, color: PLAYERS.O.color }}>
                {scores.O}
              </strong>
            </div>
          </div>

          <div style={styles.metaRow}>
            <span style={styles.metaPill}>Moves {movesPlayed}/9</span>
            <span style={styles.metaPill}>Turn {currentPlayer}</span>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={startNewRound}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              New round
            </button>
            <button
              type="button"
              onClick={resetMatch}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              Reset scores
            </button>
          </div>
        </div>

        <div style={styles.boardPanel}>
          <div style={styles.board} aria-label="Tic-tac-toe board">
            {board.map((cell, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ""}`}
                disabled={Boolean(cell) || Boolean(winner) || isDraw}
                onClick={() => handleCellClick(index)}
                onMouseEnter={() => setHoveredCell(index)}
                onMouseLeave={() => setHoveredCell(null)}
                style={getCellStyle(cell, index)}
              >
                {cell ||
                  (hoveredCell === index && !winner && !isDraw
                    ? currentPlayer
                    : "")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    boxSizing: "border-box",
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #F7FAFC 0%, #EDF8F5 45%, #FFF7EA 100%)",
    color: "#17202A",
  },
  shell: {
    width: "min(100%, 980px)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: 28,
    alignItems: "center",
  },
  infoPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  kicker: {
    margin: 0,
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: 8,
    backgroundColor: "#17202A",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0,
  },
  title: {
    margin: 0,
    fontSize: 40,
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: 0,
    color: "#111827",
  },
  statusRow: {
    minHeight: 50,
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDE7EE",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)",
    fontSize: 17,
    fontWeight: 800,
    boxSizing: "border-box",
  },
  turnDot: {
    width: 12,
    height: 12,
    borderRadius: 99,
    flex: "0 0 auto",
  },
  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(88px, 1fr))",
    gap: 10,
  },
  scoreTile: {
    minHeight: 86,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    border: "1px solid #DDE7EE",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.07)",
    boxSizing: "border-box",
  },
  scoreLabel: {
    display: "block",
    color: "#617080",
    fontSize: 13,
    fontWeight: 700,
  },
  scoreValue: {
    display: "block",
    marginTop: 8,
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  metaPill: {
    padding: "8px 12px",
    borderRadius: 8,
    backgroundColor: "rgba(23, 32, 42, 0.08)",
    color: "#334155",
    fontSize: 13,
    fontWeight: 800,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    minHeight: 44,
    padding: "0 18px",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    transition: "transform 160ms ease, box-shadow 160ms ease",
  },
  primaryButton: {
    color: "#FFFFFF",
    backgroundColor: "#17202A",
    border: "1px solid #17202A",
    boxShadow: "0 12px 22px rgba(23, 32, 42, 0.18)",
  },
  secondaryButton: {
    color: "#17202A",
    backgroundColor: "#FFFFFF",
    border: "1px solid #CBD5E1",
  },
  boardPanel: {
    justifySelf: "center",
    width: "min(82vw, 390px)",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#17202A",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    boxShadow: "0 28px 60px rgba(15, 23, 42, 0.28)",
    boxSizing: "border-box",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  cell: {
    aspectRatio: "1 / 1",
    width: "100%",
    display: "grid",
    placeItems: "center",
    border: "2px solid #D7E0E7",
    borderRadius: 8,
    fontSize: 52,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cursor: "pointer",
    transition:
      "background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
    userSelect: "none",
  },
};
