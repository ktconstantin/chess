import React from 'react';

import { 
  GiChessPawn, 
  GiChessRook, 
  GiChessKnight, 
  GiChessBishop, 
  GiChessQueen, 
  GiChessKing 
} from "react-icons/gi";

export default function Piece({ color, type, hasMoved, fileIndex, rankIndex}) {
  
  let className;
  if (color === 'black') className = 'piece--black';
  if (color === 'white') className = 'piece--white';
  
  let icon;
  switch (type) {
    case 'pawn':
      icon = <GiChessPawn className={className} />
      break;
    case 'rook':
      icon = <GiChessRook className={className} />
      break;
    case 'bishop':
      icon = <GiChessBishop className={className} />
      break;
    case 'knight':
      icon = <GiChessKnight className={className} />
      break;
    case 'queen':
      icon = <GiChessQueen className={className} />
      break;
    case 'king':
      icon = <GiChessKing className={className} />
      break;
  }

  return (
    <div
      className="piece"
    >
      {icon}
    </div>
  )
}
