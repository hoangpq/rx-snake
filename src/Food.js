import {CELL_SIZE} from './Const';

export default class Food {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update(dx, dy) {
    this.x = dx;
    this.y = dy;
  }

  draw(_context) {
    _context.fillStyle = '#0ff';
    _context.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

}
