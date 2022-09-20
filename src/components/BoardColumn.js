import React from 'react';
import Square from './Square';

export default function BoardColumn({ squares, showMoves }) {

  return (
    <div className="board-column">
      {[...squares].reverse().map((square, index) => (
        <Square 
          key={index}
          file={square.file}
          rank={square.rank}
          className={square.className}
          piece={square.piece}
          showMoves={showMoves}
        />
      ))}
    </div>
  )
}
