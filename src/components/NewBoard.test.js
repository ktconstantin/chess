import NewBoard, { createBoard } from "./NewBoard";

describe('board initializes correctly', () => {
  it('is 8x8 2D array', () => {
    const board = createBoard();
    expect(board.length).toBe(8);
  });
});

