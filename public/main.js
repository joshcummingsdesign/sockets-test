/*----------  Initialization  ----------*/
// Vars
const socket = io();
const canvas = document.getElementById('canvas');
const clearBtn = document.getElementById('clear');
const ctx = canvas.getContext('2d');

// Constants
const WIDTH = 900;
const HEIGHT = 600;
const LINE_WIDTH = 5;
const LINE_CAP = 'round';
const MY_STROKE_STYLE = 'dodgerblue';
const USER_STROKE_STYLE = 'hotpink';

// Canvas Style
canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.border = '1px solid black';

/*----------  State  ----------*/

let isDrawing = false;

/*----------  Methods  ----------*/
const handleDraw = ({ type, clientX, clientY }) => {
  const x = clientX - canvas.offsetLeft;
  const y = clientY - canvas.offsetTop;

  socket.emit('draw', { type, x, y, color: USER_STROKE_STYLE });

  draw({ type, x, y });
};

const draw = ({ type, x, y, color }) => {
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = LINE_CAP;
  ctx.strokeStyle = color || MY_STROKE_STYLE;

  if (type === 'mousedown') {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  if (type === 'mousemove') {
    if (isDrawing) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  if (type === 'mouseup' || type === 'mouseout') {
    if (isDrawing) {
      ctx.beginPath();
      isDrawing = false;
    }
  }
};

const handleClear = () => {
  socket.emit('clear');
  clear();
};

const clear = () => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
};

/*----------  Event Listeners ----------*/
canvas.addEventListener('mousedown', handleDraw);
canvas.addEventListener('mouseup', handleDraw);
canvas.addEventListener('mousemove', handleDraw);
canvas.addEventListener('mouseout', handleDraw);
clearBtn.addEventListener('click', handleClear);
socket.on('draw', draw);
socket.on('clear', clear);
