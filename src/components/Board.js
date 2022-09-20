import React, { useState } from 'react';
import BoardColumn from './BoardColumn';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];



function createSquare(file, rank, className, piece = '') {
  return {
    file,
    rank,
    className,
    piece,

    isEmpty() {
      return this.piece === '';
    },

    hasEnemyPiece(myColor) {
      if (myColor !== 'black' && myColor !== 'white') {
        throw new Error('invalid color');
      }

      if (this.isEmpty()) {
        return false;
      } else {
        return !(this.piece.color === myColor);
      }
    },

    isValid(myColor) {
      return this.isEmpty() || this.hasEnemyPiece(myColor);
    },

    setClassNameTo(newClassName) {
      this.className = newClassName;
    },
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



export default function Board() {
  const [ board, setBoard ] = useState(createBoard());

  // creates a 2D array as an array of files,
  // then each file an array of squares by rank,
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

    //return board;

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

      // return array of all valid moves from a given square
      // valid means the square exists on the board,
      // and either is empty or is a capture,
      // calling this method from an empty square throws an error
      getAllDirections(file, rank) {
        const fromSquare = this.squareAt(file, rank);
        if (fromSquare.piece === '') throw new Error('no piece here');

        const myColor = fromSquare.piece.color;
        
        let moves = [];

        moves.push(this.squareNorthOf(file, rank));
        moves.push(this.squareNorthEastOf(file, rank));
        moves.push(this.squareEastOf(file, rank));
        moves.push(this.squareSouthEastOf(file, rank));
        moves.push(this.squareSouthOf(file, rank));
        moves.push(this.squareSouthWestOf(file, rank));
        moves.push(this.squareWestOf(file, rank));
        moves.push(this.squareNorthWestOf(file, rank));

        // remove squares that have your own piece
        moves = this.removeInvalidSquares(moves, myColor);

        return moves;
      },

      removeNulls(squares) {
        const newArray = squares.filter(square => square !== null);

        return newArray;
      },

      // removes squares that are null or have your own piece
      removeInvalidSquares(squares, myColor) {
        let newArray = this.removeNulls(squares);

        newArray = newArray.filter(square => {
          return square.isEmpty() || square.hasEnemyPiece(myColor);
        });

        return newArray;
      },

      squareIsValid(file, rank, myColor) {
        const square = this.squareAt(file, rank);

        return square.isEmpty() || square.hasEnemyPiece(myColor);
      },

      getKingMovesFrom(file, rank) {
        return this.getAllDirections(file, rank);
      },

      getPawnMovesFrom(file, rank) {
        const fromSquare = this.squareAt(file, rank);
        const piece = fromSquare.piece;
        if (piece === '') throw new Error('no piece here');
        if (piece.type !== 'pawn') throw new Error('not a pawn');

        const moves = [];

        if (piece.color === 'black') {
          // check for moving straight ahead
          const oneAhead = this.squareSouthOf(file, rank);
          if (oneAhead === null) throw new Error('end of board');
          const twoAhead = this.squareSouthOf(oneAhead.file, oneAhead.rank);

          if (!piece.hasMoved && oneAhead.isEmpty() && twoAhead.isEmpty()) {
            // can move two squares ahead
            moves.push(twoAhead);
          }
          if (oneAhead.isEmpty()) {
            moves.push(oneAhead);
          }

          // check for capturing diagonally
          const southEast = this.squareSouthEastOf(file, rank);
          if (southEast !== null && southEast.hasEnemyPiece('black')) {
            moves.push(southEast);
          }

          const southWest = this.squareSouthWestOf(file, rank);
          if (southWest !== null && southWest.hasEnemyPiece('black')) {
            moves.push(southWest);
          }
        }

        if (piece.color === 'white') {
          const oneAhead = this.squareNorthOf(fromSquare);
          if (oneAhead === null) throw new Error('end of board');
          const twoAhead = this.squareNorthOf(oneAhead);

          if (!piece.hasMoved && oneAhead.isEmpty() && twoAhead.isEmpty()) {
            // can move two squares ahead
            moves.push(twoAhead);
          }
          if (oneAhead.isEmpty()) {
            moves.push(oneAhead);
          }

          // check for capturing diagonally
          const northEast = this.squareNorthEastOf(file, rank);
          if (northEast.hasEnemyPiece('white')) {
            moves.push(northEast);
          }

          const northWest = this.squareNorthWestOf(file, rank);
          if (northWest.hasEnemyPiece('white')) {
            moves.push(northWest);
          }
        }

        return moves;
      },

      getRookMovesFrom(file, rank) {
        const fromSquare = this.squareAt(file, rank);
        const piece = fromSquare.piece;
        const myColor = piece.color;

        if (piece === '') throw new Error('no piece here');
        if (piece.type !== 'rook') throw new Error('not a rook');

        const moves = [];

        // north
        let north = this.squareNorthOf(file, rank);
        while (north !== null && north.isValid(myColor)) {
          moves.push(north);
          if (north.hasEnemyPiece(myColor)) break;
          north = this.squareNorthOf(north.file, north.rank);
        }

        // east
        let east = this.squareEastOf(file, rank);
        while (east !== null && east.isValid(myColor)) {
          moves.push(east);
          if (east.hasEnemyPiece(myColor)) break;
          east = this.squareEastOf(east.file, east.rank);
        }

        // south
        let south = this.squareSouthOf(file, rank);
        while (south !== null && south.isValid(myColor)) {
          moves.push(south);
          if (south.hasEnemyPiece(myColor)) break;
          south = this.squareSouthOf(south.file, south.rank);
        }

        // west
        let west = this.squareWestOf(file, rank);
        while (west !== null && west.isValid(myColor)) {
          moves.push(west);
          if (west.hasEnemyPiece(myColor)) break;
          west = this.squareWestOf(west.file, west.rank);
        }

        return moves;
      },

      displaySquareAsValidMove(file, rank) {
        let square = this.squareAt(file, rank);
        square.className = square.className + '--valid-move';
      },

      resetSquareDisplay(file, rank) {
        let square = this.squareAt(file, rank);
        
        if (square.className === 'square-dark--valid-move') {
          square.className = 'square-dark';
        }
        if (square.className === 'square-light--valid-move') {
          square.className = 'square-light';
        }
      },
    }
  }

  function displaySquaresAsValidMoves(moves) {
    const newBoard = board.squares.slice();

    moves.forEach(square => {
      console.log(square);
    });

    setBoard(newBoard);
  }

  function showMovesOnClick(file, rank) {
    console.log(`${file}${rank}`);
    const moves = board.getPawnMovesFrom(file, rank);

    displaySquaresAsValidMoves(moves);
  }

  return (
    <div className="board">
      {board.squares.map((file, index) => (
        <BoardColumn 
          key={index}
          squares={file}
          showMoves={showMovesOnClick}
        />
      ))}
    </div>
  )
}
