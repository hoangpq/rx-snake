import {CELL_SIZE, WIDTH, HEIGHT,} from './Const';

export function clearScreen(_context) {
  _context.beginPath();
  _context.fillStyle = '#000';
  _context.clearRect(0, 0, WIDTH, HEIGHT);
  _context.fillRect(0, 0, WIDTH, HEIGHT);
  _context.fill();
}

export function drawScore(_context, score) {
  _context.save();
  _context.font = '16px Arial';
  _context.fillStyle = 'rgba(255, 255, 255, 0.6)';
  _context.fillText(`Score: ${score}`, CELL_SIZE / 2, CELL_SIZE);
  _context.restore();
}

export function drawGameOver(_context) {
  clearScreen(_context);
  _context.save();
  _context.textAlign = 'center';
  _context.font = '16px Arial';
  _context.fillStyle = 'rgba(255, 255, 255, 0.6)';
  _context.fillText('Press Enter to restart', WIDTH / 2, HEIGHT / 2);
  _context.restore();
}
