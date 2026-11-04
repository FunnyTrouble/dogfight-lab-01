const ROTATION_SPEED = 3.5;
const THRUST_POWER = 180;
const DRAG = 0.35;
const MAX_SPEED = 420;

export function createShip(x, y) {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    thrust: false,
  };
}

export function cloneShip(ship) {
  return { ...ship };
}

export function integrate(ship, input, dt) {
  const left = input.isDown("KeyA") || input.isDown("ArrowLeft");
  const right = input.isDown("KeyD") || input.isDown("ArrowRight");
  const thrusting =
    input.isDown("KeyW") ||
    input.isDown("ArrowUp") ||
    input.isDown("Space");

  if (left) {
    ship.angle -= ROTATION_SPEED * dt;
  }

  if (right) {
    ship.angle += ROTATION_SPEED * dt;
  }

  if (thrusting) {
    ship.vx += Math.cos(ship.angle) * THRUST_POWER * dt;
    ship.vy += Math.sin(ship.angle) * THRUST_POWER * dt;
  }

  const dragFactor = Math.max(0, 1 - DRAG * dt);
  ship.vx *= dragFactor;
  ship.vy *= dragFactor;

  const speed = Math.hypot(ship.vx, ship.vy);
  if (speed > MAX_SPEED) {
    const scale = MAX_SPEED / speed;
    ship.vx *= scale;
    ship.vy *= scale;
  }

  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;
  ship.thrust = thrusting;
}
