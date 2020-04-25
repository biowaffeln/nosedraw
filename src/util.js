export const lerp = (start, end, amount) => {
  return start * (1 - amount) + end * amount;
};

export const dist = (p1, p2) =>
  Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

export const clear = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const circle = (ctx, x, y, radius, color = "red") => {
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
};
