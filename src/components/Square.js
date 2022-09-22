import React from 'react';
import Piece from './Piece';

export default function Square({ 
  id, 
  fileIndex, 
  rankIndex, 
  className, 
  piece, 
  displayValidMovesFrom, 
  handleSquareClick, 
}) {
  const [ color, type ] = [ piece.color, piece.type ];

  return (
    <div 
      className={className}
      onClick={() => handleSquareClick(fileIndex, rankIndex)}
    >
      {id}
      <Piece 
        color={piece.color}
        type={piece.type}
        hasMoved={piece.hasMoved}
        fileIndex={fileIndex}
        rankIndex={rankIndex}
        displayValidMovesFrom={displayValidMovesFrom}
      />
      
    </div>
  )
}
