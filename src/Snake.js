import {CELL_SIZE} from "./Const";

export default class Snake {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.data = [
      {x: x, y: y},
      {x: x - 1, y: y},
      {x: x - 2, y: y}
    ];
  }

  update(dx, dy) {
    let x = this.data[0].x;
    let y = this.data[0].y;
    this.x += dx;
    this.y += dy;
    this.data.unshift({x: this.x, y: this.y});
    this.data.pop();
    this
  }

  draw(_context) {
    _context.fillStyle = '#f00';
    for (let i = 0; i < this.data.length; i++) {
      _context.fillRect(
        this.data[i].x,
        this.data[i].y,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

}
