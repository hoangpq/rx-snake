import {CELL_SIZE} from './Const';

export function drawFood(_context, {x, y}) {
  _context.fillStyle = '#0ff';
  _context.save();
  _context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  _context.restore();
}
