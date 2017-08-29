import React, {Component} from 'react';
import styled from 'styled-components';
import Rx from 'rxjs';
import Snake from './Snake';
import Food from './Food';
import {WIDTH, HEIGHT, TICKER_INTERVAL, KEYS, CELL_SIZE} from './Const';

export default class App extends Component {

  init() {
    const {context: _context} = this;
    this.snake = new Snake(0, 0);
    this.food = new Food(0, 0);
    const _rows = WIDTH / CELL_SIZE;
    const _cols = HEIGHT / CELL_SIZE;

    const FOOD = {
      x: 15, y: 15,
    };

    /**
     * Game loop
     */
    const ticker$ = Rx.Observable
      .interval(TICKER_INTERVAL, Rx.Scheduler.requestAnimationFrame);

    /**
     * Handle keyboard events
     */
    const input$ = Rx.Observable
      .fromEvent(document, 'keydown', event => {
        switch (event.keyCode) {
          case KEYS.UP:
            return {x: 0, y: -1};
          case KEYS.DOWN:
            return {x: 0, y: 1};
          case KEYS.LEFT:
            return {x: -1, y: 0};
          case KEYS.RIGHT:
            return {x: 1, y: 0};
        }
      })
      .distinctUntilChanged()
      .startWith({x: 1, y: 0});

    /**
     * Handle snake position and behaviors
     */
    const snake$ = ticker$
      .withLatestFrom(input$)
      .map(([tick, input]) => ({
        x: input.x, y: input.y
      }));

    /**
     * Handle food position
     */
    const food$ = new Rx.Subject();

    function genFood(frame) {
      const {snake, food} = frame;
      if (snake.x === food.x && snake.y === food.y) {
        const newFood = {
          x: Math.round(Math.random() * _cols) - 1,
          y: Math.round(Math.random() * _rows) - 1,
        };
        console.log(`Gen new food at {${newFood.x}, ${newFood.y}}`);
        food$.next(newFood);
      }
    }

    /**
     * Handle game state
     */
    const game$ = snake$
      .withLatestFrom(food$.startWith(FOOD), (s, f) => {
        genFood(this);
        return {snake: s, food: f};
      });

    /**
     * Draw game
     */
    game$.subscribe(({snake, food}) => {
      // clear screen
      this.clear();
      // draw food
      this.food.update(food.x, food.y);
      this.food.draw(_context);
      // draw snake
      this.snake.update(snake.x, snake.y);
      this.snake.draw(_context);
    });

  }

  componentDidMount() {
    const {canvas} = this;
    this.context = canvas.getContext('2d');
    this.init();
  }

  clear() {
    const {context: _context} = this;
    _context.beginPath();
    _context.fillStyle = '#000';
    _context.clearRect(0, 0, WIDTH, HEIGHT);
    _context.fillRect(0, 0, WIDTH, HEIGHT);
    _context.fill();
  }

  render() {
    const Div = styled.div`
      width: ${WIDTH}px;
      margin: 0 auto;
      border: 1px solid red;
    `;
    return (
      <Div>
        <canvas width="400" height="400" ref={canvas => this.canvas = canvas}/>
      </Div>
    );
  }

}
