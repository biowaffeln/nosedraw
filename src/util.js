export const lerp = (start, end, amount) => {
  return start * (1 - amount) + end * amount;
};

export const clear = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const circle = (ctx, x, y, radius, color) => {
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
};

export const line = (ctx, x1, y1, x2, y2, lineWidth, strokeColor) => {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};
