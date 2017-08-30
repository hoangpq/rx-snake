import {CELL_SIZE} from './Const';

export function updateSnake(acc, curr) {
  const newPos = {x: acc.x + curr.x, y: acc.y + curr.y,};
  let dots = [...acc.dots];
  dots.unshift({x: newPos.x, y: newPos.y,});
  dots.pop();
  // set new position
  return {x: newPos.x, y: newPos.y, dots};
}

export function drawSnake(_context, dots) {
  _context.fillStyle = '#f00';
  _context.save();
  for (let i = 0; i < dots.length; i++) {
    _context.fillRect(
      dots[i].x * CELL_SIZE,
      dots[i].y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
  }
  _context.restore();
}
