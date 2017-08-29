import React, {Component} from 'react';
import styled from 'styled-components';
import Rx from 'rxjs';
import Snake from './Snake';
import Food from './Food';
import {
  WIDTH, HEIGHT, TICKER_INTERVAL, KEYS, CELL_SIZE, FOOD,
} from './Const';

export default class App extends Component {

  /**
   * Init game
   */
  init() {

    const {context: _context} = this;
    this.snake = new Snake(3, 3);
    this.food = new Food(0, 0);
    const _rows = WIDTH / CELL_SIZE;
    const _cols = HEIGHT / CELL_SIZE;
    let isGameRunning = true;

    /**
     * Game loop
     */
    const ticker$ = Rx.Observable
      .interval(TICKER_INTERVAL, Rx.Scheduler.requestAnimationFrame);

    /**
     * Handle keyboard events
     */
    const input$ = Rx.Observable
      .fromEvent(document, 'keydown')
      .map(event => {
        return event.keyCode;
      })
      .scan((acc, curr) => {
        return Math.abs(acc - curr) === 2 ? acc : curr;
      })
      .map(keyCode => {
        switch (keyCode) {
          case KEYS.UP:
            return {x: 0, y: -1};
          case KEYS.DOWN:
            return {x: 0, y: 1};
          case KEYS.LEFT:
            return {x: -1, y: 0};
          case KEYS.RIGHT:
            return {x: 1, y: 0};
          case KEYS.ENTER:
            if (!isGameRunning) {
              this.snake = resetGame(this);
            }
            return {
              x: this.snake.dx,
              y: this.snake.dy,
            };
        }
      })
      .distinctUntilChanged()
      .startWith({x: 1, y: 0,});

    /**
     * Handle snake position and behaviors
     */
    const snake$ = ticker$
      .withLatestFrom(input$)
      .map(([tick, input]) => ({
        x: input.x, y: input.y
      }));


    /**
     * Check collision with the wall
     * @param: {Object} frame
     * @returns {boolean}
     */
    function checkCollision(snake) {
      return (
        snake.x >= _cols - 1 ||
        snake.x <= 0 ||
        snake.y >= _rows - 1 ||
        snake.y <= 0
      );
    }

    /**
     * Check collision with food
     * @param {Object} snake
     * @param {Object} food
     * @returns {boolean}
     */
    function checkCollisionWithFood(snake, food) {
      return snake.x === food.x && snake.y === food.y;
    }

    /**
     * Handle food position
     */
    const food$ = new Rx.Subject();

    function genFood(frame) {
      const {snake, food} = frame;
      if (checkCollisionWithFood(snake, food)) {
        const newFood = {
          x: Math.round(Math.random() * (_cols - 1)),
          y: Math.round(Math.random() * (_rows - 1)),
        };
        console.log(`Gen new food at {${newFood.x}, ${newFood.y}}`);
        food$.next(newFood);
        snake.addDot(food.x, food.y);
      }
    }

    function defer(fn, context, ...args) {
      if (fn && typeof fn === 'function') {
        setTimeout(() => {
          fn.apply(context, args);
        }, 0);
      }
    }

    function resetGame(frame) {
      // TODO: reset snake to initial state
      delete frame.snake;
      defer(running$.next, running$, true);
      return new Snake(3, 3);
    }

    function getScore(frame) {
      // TODO: get user's score
      return frame.snake.getScore();
    }

    /**
     * Handle game state
     */
    const running$ = new Rx.Subject();
    const game$ = snake$
      .withLatestFrom(food$.startWith(FOOD), (s, f) => {
        // gen new position for food
        genFood(this);
        if (checkCollision(this.snake)) {
          this.drawGameOver();
          running$.next(false);
        }

        return {snake: s, food: f, score: getScore(this)};
      })
      .combineLatest(running$.startWith(true), (game, isRunning) => {
        return (isGameRunning = isRunning) ? game : null;
      });

    /**
     * Draw game
     */
    game$.subscribe((gameObject) => {
      if (gameObject) {
        const {snake, food, score} = gameObject;
        // clear screen
        this.clear();
        // draw food
        this.food.update(food.x, food.y);
        this.food.draw(_context);
        // draw snake
        this.snake.update(snake.x, snake.y);
        this.snake.draw(_context);
        // draw score
        this.drawScore(score);
      }
    });

  }

  clear() {
    const {context: _context} = this;
    _context.beginPath();
    _context.fillStyle = '#000';
    _context.clearRect(0, 0, WIDTH, HEIGHT);
    _context.fillRect(0, 0, WIDTH, HEIGHT);
    _context.fill();
  }

  drawScore(score) {
    const {context: _context} = this;
    _context.save();
    _context.font = '16px Arial';
    _context.fillStyle = 'rgba(255, 255, 255, 0.6)';
    _context.fillText(`Score: ${score}`, CELL_SIZE / 2, CELL_SIZE);
    _context.restore();
  }

  drawGameOver() {
    this.clear();
    const {context: _context} = this;
    _context.save();
    _context.textAlign = 'center';
    _context.font = '16px Arial';
    _context.fillStyle = 'rgba(255, 255, 255, 0.6)';
    _context.fillText('Press Enter to restart', WIDTH / 2, HEIGHT / 2);
    _context.restore();
  }

  componentDidMount() {
    const {canvas} = this;
    this.context = canvas.getContext('2d');
    this.init();
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
