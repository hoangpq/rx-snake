import React, {Component} from 'react';
import styled from 'styled-components';
import Rx from 'rxjs';
import {updateSnake, drawSnake} from './Snake';
import {drawFood} from './Food';
import {clearScreen} from './CanvasUtils';
import {randomPosition, checkCollisionWithFood, checkCollisionWithWall} from './FunctionUtils';
import {
  WIDTH, TICKER_INTERVAL, KEYS, SNAKE_INITIAL_OBJECT, KEYDOWN
} from './Const';

export default class App extends Component {

  init() {

    /**
     * Game loop
     */
    const ticker$ = Rx.Observable
      .interval(TICKER_INTERVAL, Rx.Scheduler.requestAnimationFrame);

    /**
     * Handle keyboard events
     */
    const input$ = Rx.Observable
      .fromEvent(document, KEYDOWN)
      .pluck('keyCode')
      .scan((prevCode, newCode) => {
        return Math.abs(prevCode - newCode) === 2 ? prevCode : newCode;
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
        }
      })
      .distinctUntilChanged()
      .startWith({x: 1, y: 0,});

    /**
     * Handle food position
     */
    const food$ = new Rx.Subject();

    /**
     * Handle snake position and behaviors
     */
    const snake$ = ticker$
      .withLatestFrom(input$)
      .map(([tick, input]) => ({
        x: input.x, y: input.y
      }))
      .scan(updateSnake, SNAKE_INITIAL_OBJECT)
      .takeWhile(checkCollisionWithWall)
      .withLatestFrom(
        food$.startWith(randomPosition()),
        (snake, food) => {
          const dots = [...snake.dots];
          if (checkCollisionWithFood(snake, food)) {
            dots.unshift({x: food.x, y: food.y});
            food$.next(randomPosition());
          }
          Object.assign(snake, {dots,});
          return {
            snake: snake,
            food: food,
          };
        });

    snake$.subscribe((gameObj) => {
      clearScreen(this.context);
      drawFood(this.context, gameObj.food);
      drawSnake(this.context, gameObj.snake.dots);
    });

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
