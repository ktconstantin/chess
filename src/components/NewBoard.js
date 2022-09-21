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
  const [ capturedPieces, setCapturedPieces ] = useState([]);

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
      let [se, sw] = Array(2).fill(undefined);
      if (file <= 6 && rank >= 1) {
        se = board[file + 1][rank - 1];
      }
      if (file >= 1 && rank >= 1) {
        sw = board[file - 1][rank - 1];
      }
      
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
      let [nw, ne] = Array(2).fill(undefined);

      if (file >= 1 && rank <= 6) {
        nw = board[file - 1][rank + 1];
      }
      if (file <= 6 && rank <= 6) {
        ne = board[file + 1][rank + 1];
      }
      
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
    let moves = [];
    let north, northEast, east, southEast, south, southWest, west, northWest;

    if (rank < 7) {
      north = board[file][rank + 1];
      moves.push(north);
    }

    if (file < 7 && rank < 7) {
      northEast = board[file + 1][rank + 1];
      moves.push(northEast);
    }

    if (file < 7) {
      east = board[file + 1][rank];
      moves.push(east);
    }

    if (file < 7 && rank > 0) {
      southEast = board[file + 1][rank - 1];
      moves.push(southEast);
    }

    if (rank > 0) {
      south = board[file][rank - 1];
      moves.push(south);
    }

    if (file > 0 && rank > 0) {
      southWest = board[file - 1][rank - 1];
      moves.push(southWest);
    }

    if (file > 0) {
      west = board[file - 1][rank];
      moves.push(west);
    }

    if (file > 0 && rank < 7) {
      northWest = board[file - 1][rank + 1];
      moves.push(northWest);
    }

    moves = moves.filter(square => square !== undefined);
    moves = moves.filter(square => square.isEmpty() || square.piece.color !== color);

    return moves;
  }

  function getNorthMovesFrom(file, rank, color) {
    let currentRankIndex = rank;
    const moves = [];

    let north;

    if (currentRankIndex < 7) {
      north = board[file][currentRankIndex + 1];
    }

    while (north !== undefined) {
      if (north.isEmpty()) { // move
        moves.push(north);
      } else if (north.piece.color !== color) { // capture
        moves.push(north);
        break;
      } else if (north.piece.color === color) { // has your piece
        break;
      }

      currentRankIndex = north.rankIndex;

      if (currentRankIndex === 7) {
        north = undefined;
      } else {
        north = board[file][currentRankIndex + 1];
      }
    }

    return moves;
  }

  function getSouthMovesFrom(file, rank, color) {
    let currentRankIndex = rank;
    const moves = [];

    let south;
    
    if (currentRankIndex > 0) {
      south = board[file][currentRankIndex - 1];
    }

    while (south !== undefined) {
      if (south.isEmpty()) { // move
        moves.push(south);
      } else if (south.piece.color !== color) { // capture
        moves.push(south);
        break;
      } else if (south.piece.color === color) { // has your piece
        break;
      }

      currentRankIndex = south.rankIndex;

      if (currentRankIndex === 0) {
        south = undefined;
      } else {
        south = board[file][currentRankIndex - 1];
      }
    }

    return moves;
  }

  function getEastMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    const moves = [];

    let east;

    if (currentFileIndex < 7) {
      east = board[currentFileIndex + 1][rank];
    }

    while (east !== undefined) {
      if (east.isEmpty()) { // move
        moves.push(east);
      } else if (east.piece.color !== color) { // capture
        moves.push(east);
        break;
      } else if (east.piece.color === color) { // has your piece
        break;
      }

      currentFileIndex = east.fileIndex;

      if (currentFileIndex === 7) {
        east = undefined;
      } else {
        east = board[currentFileIndex + 1][rank];
      }
    }

    return moves;
  }

  function getWestMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    const moves = [];

    let west;
    
    if (currentFileIndex > 0) {
      west = board[currentFileIndex - 1][rank];
    }

    while (west !== undefined) {
      if (west.isEmpty()) { // move
        moves.push(west);
      } else if (west.piece.color !== color) { // capture
        moves.push(west);
        break;
      } else if (west.piece.color === color) { // has your piece
        break;
      }

      currentFileIndex = west.fileIndex;

      if (currentFileIndex === 0) {
        west = undefined;
      } else {
        west = board[currentFileIndex - 1][rank];
      }
    }

    return moves;
  }

  function getNorthEastMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    let currentRankIndex = rank;
    const moves = [];

    let northEast;

    if (currentFileIndex < 7 && currentRankIndex < 7) {
      northEast = board[currentFileIndex + 1][currentRankIndex + 1];
    }

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

  function getSouthEastMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    let currentRankIndex = rank;
    const moves = [];

    let southEast;

    if (currentFileIndex < 7 && currentRankIndex > 0) {
      southEast = board[currentFileIndex + 1][currentRankIndex - 1];
    }

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

  function getSouthWestMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    let currentRankIndex = rank;
    const moves = [];

    let southWest;
    if (currentFileIndex > 0 && currentRankIndex > 0) {
      southWest = board[currentFileIndex - 1][currentRankIndex - 1];
    }

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

  function getNorthWestMovesFrom(file, rank, color) {
    let currentFileIndex = file;
    let currentRankIndex = rank;
    const moves = [];

    let northWest;

    if (currentFileIndex > 0 && currentRankIndex < 7) {
      northWest = board[currentFileIndex - 1][currentRankIndex + 1];
    }

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

  function getBishopMovesFrom(file, rank, color) {
    let moves = getNorthEastMovesFrom(file, rank, color);
    moves = moves.concat(getSouthEastMovesFrom(file, rank, color));
    moves = moves.concat(getSouthWestMovesFrom(file, rank, color));
    moves = moves.concat(getNorthWestMovesFrom(file, rank, color));
    
    return moves;
  }

  function getRookMovesFrom(file, rank, color, hasMoved) {
    let moves = getNorthMovesFrom(file, rank, color);
    moves = moves.concat(getEastMovesFrom(file, rank, color));
    moves = moves.concat(getSouthMovesFrom(file, rank, color));
    moves = moves.concat(getWestMovesFrom(file, rank, color));

    return moves;
  }

  function getKnightMovesFrom(file, rank, color) {
    let moves = [];
    let [top, bottom, left, right] = Array(4).fill([]);

    if (rank <= 5) {
      top = board.map(file => file[rank + 2]).filter(square => {
        return Math.abs(square.fileIndex - file) === 1;
      });
    }
    
    if (rank >= 2) {
      bottom = board.map(file => file[rank - 2]).filter(square => {
        return Math.abs(square.fileIndex - file) === 1; 
      });
    }

    if (file >= 2) {
      left = board[file - 2].filter(square => {
        return Math.abs(square.rankIndex - rank) === 1;
      });
    }

    if (file <= 5) {
      right = board[file + 2].filter(square => {
        return Math.abs(square.rankIndex - rank) === 1;
      });
    }

    moves = moves.concat(top);
    moves = moves.concat(bottom);
    moves = moves.concat(left);
    moves = moves.concat(right);

    // filter to valid squares
    moves = moves.filter(square => {
      return (square.isEmpty()) || (square.piece.color !== color);
    });

    return moves;
  }
  
  function getQueenMovesFrom(file, rank, color) {
    return getRookMovesFrom(file, rank, color).concat(getBishopMovesFrom(file, rank, color));
  }

  function displayValidMovesFrom(file, rank, color, type, hasMoved) {
    //const [color, type, hasMoved] = [piece.color, piece.type, piece.hasMoved];

    let moves;

    switch (type) {
      case 'pawn':
        moves = getPawnMovesFrom(file, rank, color, hasMoved);
        break;
      case 'bishop':
        moves = getBishopMovesFrom(file, rank, color);
        break;
      case 'knight':
        moves = getKnightMovesFrom(file, rank, color);
        break;
      case 'rook':
        moves = getRookMovesFrom(file, rank, color, hasMoved);
        break;
      case 'queen':
        moves = getQueenMovesFrom(file, rank, color);
        break;
      case 'king':
        moves = getKingMovesFrom(file, rank, color, hasMoved);
    }

    console.log(moves);

    const newBoard = board.slice();

    moves.forEach(square => {
      const [fileIndex, rankIndex] = [square.fileIndex, square.rankIndex];
      const newSquare = newBoard[fileIndex][rankIndex];

      if (newSquare.className === 'square-dark') {
        newSquare.setClassNameTo('square-dark valid-move');
      } else if (newSquare.className === 'square-light') {
        newSquare.setClassNameTo('square-light valid-move');
      } else if (newSquare.className === 'square-dark valid-move') {
        newSquare.setClassNameTo('square-dark');
      } else if (newSquare.className === 'square-light valid-move') {
        newSquare.setClassNameTo('square-light');
      }
    });

    setBoard(newBoard);
  }

  function changeSideToMove() {
    if (sideToMove === 'black') {
      incrementFullmoveCounter(); // increment every black turn
      setSideToMove('white');
    } else {
      setSideToMove('black');
    }
  }

  function incrementHalfmoveClock() {
    setHalfmoveClock(halfmoveClock + 1);
  }

  function resetHalfmoveClock() {
    setHalfmoveClock(0);
  }

  function incrementFullmoveCounter() {
    setFullmoveCounter(fullmoveCounter + 1);
  }
  
  console.log(board);

  return (
    <>
      
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
                displayValidMovesFrom={displayValidMovesFrom}
              />

            ))}
          </div>

        ))}
      </div>
    </>
    
  )
}
