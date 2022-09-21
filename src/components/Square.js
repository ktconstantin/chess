import React from 'react';
import Piece from './Piece';

export default function Square({ id, fileIndex, rankIndex, className, piece, displayValidMovesFrom }) {

  return (
    <div 
      className={className}
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
