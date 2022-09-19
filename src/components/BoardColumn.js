import React from 'react';
import Square from './Square';

export default function BoardColumn({ squares }) {
  return (
    <div className="board-column">
      {[...squares].reverse().map((square, index) => (
        <Square 
          key={index}
          name={square.name}
        />
      ))}
    </div>
  )
}
