import React from 'react';
import BoardColumn from './BoardColumn';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

// creates a 2D array as an array of files,
// then each file an array of ranks
// due to the square naming convention of file+rank
function createBoard() {
  const board = [];

  // populates the board array with squares
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

  return {
    squares: board,

    // returns the square located at the file, rank arguments
    // throws error if file or rank are not valid, 
    // i.e. must pass arguments as single char strings
    
    squareAt(file, rank) {
      if (!FILES.includes(file)) throw new Error('invalid file');
      if (!RANKS.includes(rank)) throw new Error('invalid rank');

      const fileIndex = FILES.findIndex(letter => letter === file);
      const rankIndex = RANKS.findIndex(number => number === rank);

      return this.squares[fileIndex][rankIndex];
    },

    // next 4 methods return a string that represents the file or rank
    // that is located in the direction specified by method name
    // to be used by squareAt(file, rank) elsewhere

    getRankNorthOf(rank) {
      if (Number(rank) < 1 || Number(rank) >= 8) {
        return null;
      } else {
        return String(Number(rank) + 1);
      }
    },

    getRankSouthOf(rank) {
      if (Number(rank) <= 1 || Number(rank) > 8) {
        return null;
      } else {
        return String(Number(rank) - 1);
      }
    },

    getFileEastOf(file) {
      if (!FILES.includes(file)) throw new Error('invalid file');
      if (file === 'h') {
        return null;
      } else {
        const fileIndex = FILES.findIndex(letter => letter === file);

        return FILES[fileIndex + 1];
      }
    },

    getFileWestOf(file) {
      if (!FILES.includes(file)) throw new Error('invalid file');
      if (file === 'a') {
        return null;
      } else {
        const fileIndex = FILES.findIndex(letter => letter === file);

        return FILES[fileIndex - 1];
      }
    },

    // next 8 methods return a square that is located in the named direction
    // null is returned if requested square is off the board, 
    // e.g. the square to the W of a8

    squareNorthOf(file, rank) {
      if (rank === '8') {
        return null;
      } else {
        return this.squareAt(file, this.getRankNorthOf(rank));
      }
    },

    squareNorthEastOf(file, rank) {
      if (rank === '8' || file === 'h') {
        return null;
      } else {
        return this.squareAt(this.getFileEastOf(file), this.getRankNorthOf(rank));
      }
    },

    squareEastOf(file, rank) {
      if (file === 'h') {
        return null;
      } else {
        return this.squareAt(this.getFileEastOf(file), rank);
      }
    },

    squareSouthEastOf(file, rank) {
      if (rank === '1' || file === 'h') {
        return null;
      } else {
        return this.squareAt(this.getFileEastOf(file), this.getRankSouthOf(rank));
      }
    },

    squareSouthOf(file, rank) {
      if (rank === '1') {
        return null;
      } else {
        return this.squareAt(file, this.getRankSouthOf(rank));
      }
    },

    squareSouthWestOf(file, rank) {
      if (rank === '1' || file === 'a') {
        return null;
      } else {
        return this.squareAt(this.getFileWestOf(file), this.getRankSouthOf(rank));
      }
    },

    squareWestOf(file, rank) {
      if (file === 'a') {
        return null;
      } else {
        return this.squareAt(this.getFileWestOf(file), rank);
      }
    },

    squareNorthWestOf(file, rank) {
      if (file === 'a' || rank === '8') {
        return null;
      } else {
        return this.squareAt(this.getFileWestOf(file), this.getRankNorthOf(rank));
      }
    },
  }
}

function createSquare(file, rank, className, piece = '') {
  return {
    file,
    rank,
    className,
    piece,

    isEmpty() {
      return this.piece === '';
    }
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
console.log(board.squareAt('a', 7));


export default function Board() {
  return (
    <div className="board">
      {board.squares.map((file, index) => (
        <BoardColumn 
          key={index}
          squares={file} 
        />
      ))}
    </div>
  )
}
