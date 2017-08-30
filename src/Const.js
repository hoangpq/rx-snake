export const WIDTH = 400;
export const HEIGHT = 400;
export const CELL_SIZE = 20;
export const TICKER_INTERVAL = 200;

const SNAKE_X = 3;
const SNAKE_Y = 3;

export const KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13,
};

export const SNAKE_INITIAL_OBJECT = {
  x: SNAKE_X,
  y: SNAKE_Y,
  dots: [
    {x: SNAKE_X, y: SNAKE_Y},
    {x: SNAKE_X - 1, y: SNAKE_Y},
    {x: SNAKE_X - 2, y: SNAKE_Y}
  ]
};
