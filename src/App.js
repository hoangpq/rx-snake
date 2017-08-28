import React, {Component} from 'react';
import styled from 'styled-components';
import {Observable} from 'rxjs/Observable';

const WIDTH = 400;
const HEIGHT = 400;
const CELL_SIZE = 30;

class Snake {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(_context) {
    _context.fillStyle = '#f00';
    _context.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
  }

}

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  init() {
    this.snake = new Snake(0, 0);
    // init observables
  }

  componentDidMount() {
    const {canvas} = this;
    this.context = canvas.getContext('2d');
    // init game
    this.init();
    // draw game
    this.draw();
  }

  draw() {
    const {context: _context, snake} = this;
    _context.beginPath();
    _context.fillStyle = '#000';
    _context.clearRect(0, 0, WIDTH, HEIGHT);
    _context.fillRect(0, 0, WIDTH, HEIGHT);
    _context.fill();
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
