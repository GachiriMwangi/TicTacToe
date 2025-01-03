import React, { useState, useEffect } from 'react';

const HumanStart = () => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Your turn! Click any square.');

  // Check for winner
  const checkWinner = (squares, player) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] === player && squares[b] === player && squares[c] === player) {
        return true;
      }
    }
    return false;
  };

  // Get available moves
  const getAvailableMoves = (squares) => {
    return squares.reduce((moves, square, index) => {
      if (square === '') moves.push(index);
      return moves;
    }, []);
  };

  // Minimax algorithm with alpha-beta pruning
  const minimax = (squares, depth, isMaximizing, alpha, beta) => {
    // Terminal states
    if (checkWinner(squares, 'X')) return 1;
    if (checkWinner(squares, 'O')) return -1;
    if (getAvailableMoves(squares).length === 0) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let move of getAvailableMoves(squares)) {
        const newSquares = [...squares];
        newSquares[move] = 'X';
        const evaluation = minimax(newSquares, depth + 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of getAvailableMoves(squares)) {
        const newSquares = [...squares];
        newSquares[move] = 'O';
        const evaluation = minimax(newSquares, depth + 1, true, alpha, beta);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  // Get best move for AI
  const getBestMove = (squares) => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let move of getAvailableMoves(squares)) {
      const newSquares = [...squares];
      newSquares[move] = 'X';
      const score = minimax(newSquares, 0, false, -Infinity, Infinity);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  };

  // Handle player's move
  const handleClick = (index) => {
    if (board[index] !== '' || gameOver) return;

    // Player's move
    const newBoard = [...board];
    newBoard[index] = 'O';
    setBoard(newBoard);

    // Check if player won
    if (checkWinner(newBoard, 'O')) {
      setMessage('Congratulations! You won!');
      setGameOver(true);
      return;
    }

    // Check if it's a draw
    if (getAvailableMoves(newBoard).length === 0) {
      setMessage("It's a draw!");
      setGameOver(true);
      return;
    }

    // AI's turn
    setMessage('AI is thinking...');
    setTimeout(() => {
      const aiMove = getBestMove(newBoard);
      newBoard[aiMove] = 'X';
      setBoard(newBoard);

      if (checkWinner(newBoard, 'X')) {
        setMessage('AI wins!');
        setGameOver(true);
      } else if (getAvailableMoves(newBoard).length === 0) {
        setMessage("It's a draw!");
        setGameOver(true);
      } else {
        setMessage('Your turn! Click any square.');
      }
    }, 500);
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setGameOver(false);
    setMessage('Your turn! Click any square.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-4 text-xl font-bold text-gray-800">{message}</div>
      
      <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow-lg">
        {board.map((square, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-20 h-20 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-4xl font-bold focus:outline-none transition-colors duration-200"
            disabled={gameOver}
          >
            {square === 'X' ? (
              <span className="text-blue-600">X</span>
            ) : square === 'O' ? (
              <span className="text-red-600">O</span>
            ) : null}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-colors duration-200"
      >
        Reset Game
      </button>
    </div>
  );
};

export default HumanStart;