import {CELL_SIZE} from "./Const";

export default class Snake {

  /**
   * Constructor
   * @param {Number} x - X position
   * @param {Number} y - Y position
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.data = [
      {x: x, y: y},
      {x: x - 1, y: y},
      {x: x - 2, y: y}
    ];
  }

  /**
   * Update snake position
   * @param {Number} dx - X speed
   * @param {Number} dy - Y speed
   */
  update(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.data.unshift({x: this.x, y: this.y});
    this.data.pop();
  }

  /**
   * Draw snake
   * @param {Object} _context - Canvas context
   */
  draw(_context) {
    _context.fillStyle = '#f00';
    for (let i = 0; i < this.data.length; i++) {
      _context.fillRect(
        this.data[i].x * CELL_SIZE,
        this.data[i].y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

}
