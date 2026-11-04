export function drawBackground(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#05070b";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(120, 150, 190, 0.12)";
  ctx.lineWidth = 1;

  const grid = 50;
  for (let x = 0; x <= width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

export function drawShip(ctx, ship) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-12, -10);
  ctx.lineTo(-7, 0);
  ctx.lineTo(-12, 10);
  ctx.closePath();

  ctx.fillStyle = "#dbeafe";
  ctx.fill();

  ctx.strokeStyle = "#60a5fa";
  ctx.stroke();

  if (ship.thrust) {
    ctx.beginPath();
    ctx.moveTo(-8, -5);
    ctx.lineTo(-24, 0);
    ctx.lineTo(-8, 5);
    ctx.closePath();

    ctx.fillStyle = "#fbbf24";
    ctx.fill();
  }

  ctx.restore();
}

export function drawHud(ctx, stats) {
  ctx.fillStyle = "#dbeafe";
  ctx.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(`steps/s: ${stats.stepsPerSecond}`, 12, 20);
  ctx.fillText(`frames/s: ${stats.framesPerSecond}`, 12, 40);
  ctx.fillText(`frame: ${stats.frameTimeMs.toFixed(2)} ms`, 12, 60);
}

export function lerp(a, b, alpha) {
  return a + (b - a) * alpha;
}

export function lerpAngle(a, b, alpha) {
  const twoPi = Math.PI * 2;
  let delta = (b - a) % twoPi;

  if (delta > Math.PI) delta -= twoPi;
  if (delta < -Math.PI) delta += twoPi;

  return a + delta * alpha;
}

export function interpolateShip(previous, current, alpha) {
  return {
    x: lerp(previous.x, current.x, alpha),
    y: lerp(previous.y, current.y, alpha),
    vx: lerp(previous.vx, current.vx, alpha),
    vy: lerp(previous.vy, current.vy, alpha),
    angle: lerpAngle(previous.angle, current.angle, alpha),
    thrust: current.thrust,
  };
}
