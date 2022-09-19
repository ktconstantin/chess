import React from 'react';
import BoardColumn from './BoardColumn';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];


function createBoard() {
  const board = [];

  FILES.forEach((file, index) => {
    const fileArray = [];

    for (let rankIndex = 0; rankIndex < RANKS.length; rankIndex++) {
      const square = {
        name: `${file}${RANKS[rankIndex]}`
      }

      fileArray.push(square);
    }

    board.push(fileArray);
  });

  return board;
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
