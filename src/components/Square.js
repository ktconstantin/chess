import React from 'react';
import Piece from './Piece';

export default function Square({ name, className, piece }) {

  return (
    <div className={className}>
      <div>{name}</div>
      
      <Piece 
        color={piece.color}
        type={piece.type}
      />
      
    </div>
  )
}
