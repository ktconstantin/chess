import React from 'react';
import BoardColumn from './BoardColumn';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

function createBoard() {
  const board = [];

  FILES.forEach((file, index) => {
    const fileIndex = index;
    const fileArray = [];

    for (let rankIndex = 0; rankIndex < RANKS.length; rankIndex++) {
      const rank = RANKS[rankIndex];
      const className = getClassName(fileIndex, rankIndex);
      const square = createSquare(file, rank, className);

      fileArray.push(square);
    }

    board.push(fileArray);
  });

  initializePieces(board);

  return board;
}

function createSquare(file, rank, className, piece = '') {
  return {
    file,
    rank,
    className,
    piece,
  }
}

function getClassName(fileIndex, rankIndex) {
  let backgroundColor;

  if (rankIndex % 2 === 0) {
    backgroundColor = fileIndex % 2 === 0 ? 'light' : 'dark';
  } else {
    backgroundColor = fileIndex % 2 === 0 ? 'dark' : 'light';
  }

  return `square-${backgroundColor}`;
}

function createPiece(color, type) {
  return {
    color,
    type,
    hasMoved: false,
  }
}

function initializePieces(board) {
  // pawns
  board.forEach(file => {
    file[6].piece = createPiece('black', 'pawn');
    file[1].piece = createPiece('white', 'pawn');
  });

  // rooks
  board[0][7].piece = board[7][7].piece = createPiece('black', 'rook');
  board[0][0].piece = board[7][0].piece = createPiece('white', 'rook');

  // knights
  board[1][7].piece = board[6][7].piece = createPiece('black', 'knight');
  board[1][0].piece = board[6][0].piece = createPiece('white', 'knight');

  // bishops
  board[2][7].piece = board[5][7].piece = createPiece('black', 'bishop');
  board[2][0].piece = board[5][0].piece = createPiece('white', 'bishop');

  // queens
  board[3][7].piece = createPiece('black', 'queen');
  board[3][0].piece = createPiece('white', 'queen');

  // kings
  board[4][7].piece = createPiece('black', 'king');
  board[4][0].piece = createPiece('white', 'king');
}

const board = createBoard();
console.log(board);

export default function Board() {
  return (
    <div className="board">
      {board.map((file, index) => (
        <BoardColumn 
          key={index}
          squares={file} 
        />
      ))}
    </div>
  )
}
