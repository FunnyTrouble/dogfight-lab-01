import "./style.css";

import { createInput } from "./input.js";
import { createLoop } from "./loop.js";
import { wrapPosition } from "./sim/arena.js";
import { cloneShip, createShip, integrate } from "./sim/ship.js";
import { setupCanvas } from "./render/canvas.js";
import {
  drawBackground,
  drawHud,
  drawShip,
  interpolateShip,
} from "./render/draw.js";

const canvas = document.querySelector("#game");

const view = setupCanvas(canvas);
const input = createInput(window);

let current = createShip(view.width / 2, view.height / 2);
let previous = cloneShip(current);

const stats = {
  stepsPerSecond: 0,
  framesPerSecond: 0,
  frameTimeMs: 0,
};

function simulate(dt) {
  previous = cloneShip(current);

  integrate(current, input, dt);
  wrapPosition(current, view.width, view.height);

  input.endFrame();
}

function render(alpha) {
  const ship = interpolateShip(previous, current, alpha);

  drawBackground(ctx, view.width, view.height);
  drawShip(ctx, ship);
  drawHud(ctx, stats);

}

const { ctx } = view;

const loop = createLoop({
  step: 1 / 60,
  simulate,
  render,
  onStats: (nextStats) => {
    Object.assign(stats, nextStats);
  },
});

loop.start();
