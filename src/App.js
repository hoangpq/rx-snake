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
    const {snake, food} = this;

    // init observables
    const ticker$ = Rx.Observable
      .interval(TICKER_INTERVAL, Rx.Scheduler.requestAnimationFrame);

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

    const snake$ = ticker$
      .withLatestFrom(input$)
      .map(([tick, input]) => ({
        x: input.x * CELL_SIZE,
        y: input.y * CELL_SIZE,
      }));

    const food$ = Rx.Observable
      .of({
        x: Math.round(Math.random() * _rows),
        y: Math.round(Math.random() * _cols),
      })
      .map(({x, y}) => {
        return {
          x: x * CELL_SIZE,
          y: y * CELL_SIZE,
        }
      });

    const game$ = Rx.Observable
      .combineLatest(snake$, food$, (_snake, _food) => {

        console.log(_food);

        return {snake: _snake, food: _food};
      });

    game$.subscribe(({snake, food}) => {
      this.cls();
      this.snake.update(snake.x, snake.y);
      this.snake.draw(_context);
      this.food.update(food.x, food.y);
      this.food.draw(_context);
    });

  }

  componentDidMount() {
    const {canvas} = this;
    this.context = canvas.getContext('2d');
    // init game
    this.init();
    // draw game
    this.draw();
  }

  cls() {
    const {context: _context} = this;
    _context.beginPath();
    _context.fillStyle = '#000';
    _context.clearRect(0, 0, WIDTH, HEIGHT);
    _context.fillRect(0, 0, WIDTH, HEIGHT);
    _context.fill();
  }

  draw() {
    const {context: _context, snake} = this;
    this.cls();
    // draw snake
    snake.draw(_context);
  }

  render() {
    const Div = styled.div`
      width: ${WIDTH}px;
      margin: 0 auto;
      border: 1px solid grey;
    `;
    return (
      <Div>
        <canvas width="400" height="400" ref={canvas => this.canvas = canvas}/>
      </Div>
    );
  }

}
