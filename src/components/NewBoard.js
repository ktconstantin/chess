import React, { useState } from 'react';
import Square from './Square';

export default function NewBoard() {
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

  function createBoard() {
    const squares = [];

    for (let fileIndex = 0; fileIndex < FILES.length; fileIndex++) {
      const fileArray = [];
      const file = FILES[fileIndex];

      for (let rankIndex = 0; rankIndex < RANKS.length; rankIndex++) {
        const rank = RANKS[rankIndex];

        const id = `${file}${rank}`;
        const square = createSquare(id, fileIndex, rankIndex, getSquareColorClassName(fileIndex, rankIndex));
        
        fileArray.push(square);
      }

      squares.push(fileArray);
    }

    initializePieces(squares);

    return squares;
  }

  function createSquare(id, fileIndex, rankIndex, className, piece = '') {
    return {
      id,
      fileIndex,
      rankIndex,
      className,
      piece,

      setPieceTo(piece) {
        this.piece = piece;
      },

      setClassNameTo(className) {
        this.className = className;
      },

      isEmpty() {
        return this.piece === '';
      },
    }
  }

  function createPiece(color, type, hasMoved = false) {
    return {
      color,
      type,
      hasMoved,

      changeHasMovedStatus() {
        this.hasMoved = true;
      }
    }
  }

  function getSquareColorClassName(fileIndex, rankIndex) {
    let backgroundColor;

    if (rankIndex % 2 === 0) {
      backgroundColor = fileIndex % 2 === 0 ? 'light' : 'dark';
    } else {
      backgroundColor = fileIndex % 2 === 0 ? 'dark' : 'light';
    }

    return `square-${backgroundColor}`;
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

  const [ board, setBoard ] = useState(createBoard());
  const [ sideToMove, setSideToMove ] = useState('white');
  const [ halfmoveClock, setHalfmoveClock ] = useState(0);
  const [ fullmoveCounter, setFullmoveCounter ] = useState(0);

  function getPawnMovesFrom(file, rank, color, hasMoved) {
    const moves = [];

    if (color === 'black') {
      // check for forward moves to empty squares
      const oneForward = board[file][rank - 1];
      if (oneForward.isEmpty()) {
        moves.push(oneForward);

        if (rank === 1) console.log('can promote');
      }

      if (oneForward.isEmpty() && !hasMoved) {
        const twoForward = board[file][rank - 2];
        if (twoForward.isEmpty()) moves.push(twoForward);
      }

      // check for captures
      const [se, sw] = [board[file + 1][rank - 1] , board[file - 1][rank - 1]]
      const diagonals = [se, sw];
      
      diagonals.forEach(square => {
        // check if square is on the board and has a piece on it
        if (square !== undefined && !square.isEmpty()) {
          // check if it can be captured
          if (square.piece.color === 'white') moves.push(square);
        }
      });
    }

    if (color === 'white') {
      // check for forward moves to empty squares
      const oneForward = board[file][rank + 1];
      if (oneForward.isEmpty()) {
        moves.push(oneForward);

        if (rank === 6) console.log('can promote');
      }

      if (oneForward.isEmpty() && !hasMoved) {
        const twoForward = board[file][rank + 2];
        if (twoForward.isEmpty()) moves.push(twoForward);
      }

      // check for captures
      const [nw, ne] = [board[file - 1][rank + 1] , board[file + 1][rank + 1]]
      const diagonals = [ne, nw];
      
      diagonals.forEach(square => {
        // check if square is on the board and has a piece on it
        if (square !== undefined && !square.isEmpty()) {
          // check if it can be captured
          if (square.piece.color === 'black') moves.push(square);
        }
      });
    }

    return moves;
  }

  function getKingMovesFrom(file, rank, color, hasMoved) {
    const moves = [];

    const [n, ne, e, se, s, sw, w, nw] = [
      board[file][rank + 1],
      board[file + 1][rank + 1],
      board[file + 1][rank],
      board[file + 1][rank - 1],
      board[file][rank - 1],
      board[file - 1][rank - 1],
      board[file - 1][rank],
      board[file - 1][rank + 1],
    ];

    const allDirections = [n, ne, e, se, s, sw, w, nw];

    allDirections.forEach(square => {
      if (square !== undefined && (square.isEmpty() || square.piece.color !== color)) {
        moves.push(square);
      }
    });

    return moves;
  }

  function getNEMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    let currentRankIndex = rank;
    const moves = [];
    let northEast = board[currentFileIndex + 1][currentRankIndex + 1];

    while (northEast !== undefined) {
      if (northEast.isEmpty()) { // move
        moves.push(northEast);
      } else if (northEast.piece.color !== color) { // capture
        moves.push(northEast);
        break;
      } else if (northEast.piece.color === color) { // has your piece
        break;
      }

      currentFileIndex = northEast.fileIndex;
      currentRankIndex = northEast.rankIndex;

      if (currentFileIndex === 7 || currentRankIndex === 7) {
        northEast = undefined;
      } else {
        northEast = board[currentFileIndex + 1][currentRankIndex + 1];
      }
    }

    return moves;
  }

  function getSEMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    let currentRankIndex = rank;
    const moves = [];
    let southEast = board[currentFileIndex + 1][currentRankIndex - 1];

    while (southEast !== undefined) {
      if (southEast.isEmpty()) { // move
        moves.push(southEast);
      } else if (southEast.piece.color !== color) { // capture
        moves.push(southEast);
        break;
      } else if (southEast.piece.color === color) { // has your piece
        break;
      }

      currentFileIndex = southEast.fileIndex;
      currentRankIndex = southEast.rankIndex;

      if (currentFileIndex === 7 || currentRankIndex === 0) {
        southEast = undefined;
      } else {
        southEast = board[currentFileIndex + 1][currentRankIndex - 1];
      }
    }

    return moves;
  }

  function getSWMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    let currentRankIndex = rank;
    const moves = [];
    let southWest = board[currentFileIndex - 1][currentRankIndex - 1];

    while (southWest !== undefined) {
      if (southWest.isEmpty()) { // move
        moves.push(southWest);
      } else if (southWest.piece.color !== color) { // capture
        moves.push(southWest);
        break;
      } else if (southWest.piece.color === color) { // has your piece
        break;
      }

      currentFileIndex = southWest.fileIndex;
      currentRankIndex = southWest.rankIndex;

      if (currentFileIndex === 0 || currentRankIndex === 0) {
        southWest = undefined;
      } else {
        southWest = board[currentFileIndex - 1][currentRankIndex - 1];
      }
    }

    return moves;
  }

  function getNWMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    let currentRankIndex = rank;
    const moves = [];
    let northWest = board[currentFileIndex - 1][currentRankIndex + 1];

    while (northWest !== undefined) {
      if (northWest.isEmpty()) { // move
        moves.push(northWest);
      } else if (northWest.piece.color !== color) { // capture
        moves.push(northWest);
        break;
      } else if (northWest.piece.color === color) { // has your piece
        break;
      }

      currentFileIndex = northWest.fileIndex;
      currentRankIndex = northWest.rankIndex;

      if (currentFileIndex === 0 || currentRankIndex === 7) {
        northWest = undefined;
      } else {
        northWest = board[currentFileIndex - 1][currentRankIndex + 1];
      }
    }

    return moves;
  }

  getNWMovesFrom(7, 2, 'black', true);
  console.log(board);

  return (
    <div className="board">
      {board.map((file, index) => (

        <div className="board-column" key={index} >
          {file.map((square, index) => (

            <Square 
              key={index}
              id={square.id}
              fileIndex={square.fileIndex}
              rankIndex={square.rankIndex}
              className={square.className}
              piece={square.piece}
            />

          ))}
        </div>

      ))}
    </div>
  )
}
