import {CELL_SIZE, WIDTH, HEIGHT} from './Const';

const _rows = WIDTH / CELL_SIZE;
const _cols = HEIGHT / CELL_SIZE;

export function randomPosition() {
  return {
    x: Math.round(Math.random() * (_cols - 1)),
    y: Math.round(Math.random() * (_rows - 1)),
  };
}

export function checkCollisionWithWall(snake) {
  return snake.x >= 0 && snake.x < _cols && snake.y >= 0 && snake.y < _rows;
}

export function checkCollisionWithFood(snake, food) {
  return snake.x === food.x && snake.y === food.y;
}
