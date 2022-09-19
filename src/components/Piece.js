import React from 'react';
import blackPawn from '../assets/black-pawn.png';
import whitePawn from '../assets/white-pawn.png';
import blackBishop from '../assets/black-bishop.png';
import whiteBishop from '../assets/white-bishop.png';
import blackKnight from '../assets/black-knight.png';
import whiteKnight from '../assets/white-knight.png';
import blackRook from '../assets/black-rook.png';
import whiteRook from '../assets/white-rook.png';
import blackQueen from '../assets/black-queen.png';
import whiteQueen from '../assets/white-queen.png';
import blackKing from '../assets/black-king.png';
import whiteKing from '../assets/white-king.png';

export default function Piece({ color, type }) {
  const name = `${color} ${type}`;
  let icon;

  switch (name) {
    case 'black pawn':
      icon = blackPawn;
      break;
    case 'white pawn':
      icon = whitePawn;
      break;
    case 'black bishop':
      icon = blackBishop;
      break;
    case 'white bishop':
      icon = whiteBishop;
      break;
    case 'black knight':
      icon = blackKnight;
      break;
    case 'white knight':
      icon = whiteKnight;
      break;
    case 'black rook':
      icon = blackRook;
      break;
    case 'white rook':
      icon = whiteRook;
      break;
    case 'black queen':
      icon = blackQueen;
      break;
    case 'white queen':
      icon = whiteQueen;
      break;
    case 'black king':
      icon = blackKing;
      break;
    case 'white king':
      icon = whiteKing;
      break;
  }

  return (
    
    <img 
      className="piece"
      src={icon} 
      alt={name}
    />    
    
  )
}
