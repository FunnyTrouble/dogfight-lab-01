# Dogfight — Lab 01

## What this lab demonstrates

This project implements the first lab requirements:

- JavaScript event loop concepts;
- ES modules with named exports;
- `let` / `const`, block scope and closures;
- `requestAnimationFrame`;
- fixed-timestep simulation at 60 Hz;
- accumulator with a 250 ms clamp;
- interpolated rendering;
- keyboard input implemented as a closure;
- pure ship physics without DOM/canvas dependencies;
- canvas rendering with device-pixel-ratio support;
- resize handling;
- edge wrap-around;
- HUD with steps/s, frames/s and frame time.

## Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

Controls:

- `W` / `ArrowUp` / `Space` — thrust
- `A` / `ArrowLeft` — rotate left
- `D` / `ArrowRight` — rotate right

## Project structure

```text
src/
  main.js
  loop.js
  input.js
  sim/
    ship.js
    arena.js
  render/
    canvas.js
    draw.js
```

The simulation (`src/sim/`) has no DOM or Canvas dependency.

## Verification

### M1 — Fixed game loop

Expected result:

- `steps/s` stays around 60;
- `frames/s` follows the monitor refresh rate;
- frame time is normally a few milliseconds or less.

The simulation uses:

```js
const STEP = 1 / 60;
```

and an accumulator:

```js
accumulator += Math.min(elapsed, 0.25);

while (accumulator >= STEP) {
  simulate(STEP);
  accumulator -= STEP;
}
```

The renderer uses:

```js
const alpha = accumulator / STEP;
```

to interpolate between the previous and current ship states.

### M2 — Closure input

`createInput()` keeps the `Set` objects private. Outside code can only use:

```js
input.isDown("KeyW");
input.justPressed("...");
input.endFrame();
```

This is a closure: the returned functions retain access to variables created inside `createInput()`.

### M3 — Interpolation and DPR

The renderer interpolates position and angle between the previous and current simulation states. Canvas resolution is multiplied by `devicePixelRatio` and the context is scaled back to CSS pixels.

### M4 — Three experiments

#### Experiment 1 — Blocking the frame

Temporarily add this inside `render()`:

```js
if (Math.floor(performance.now() / 1000) % 5 === 0) {
  const end = performance.now() + 100;
  while (performance.now() < end) {}
}
```

Observe:

- visible stutter;
- frame time jumps to about 100 ms;
- frames/s drops;
- JavaScript cannot render or process other JS work during the synchronous block.

Remove the code after the experiment.

**Actual result:** fill in your measured frame-time/FPS values and attach a screenshot.

#### Experiment 2 — `setInterval` instead of rAF

Temporarily replace the rAF scheduling in `loop.js` with a timer-based loop using approximately:

```js
setInterval(frame, 16);
```

Run for 10 seconds and record:

- average frames/s;
- visible frame-time jitter;
- behavior after switching to a background tab for 5 seconds.

Then restore `requestAnimationFrame`.

**Actual result:** fill in your measured values and attach a screenshot.

#### Experiment 3 — Variable timestep

Temporarily remove the accumulator and call:

```js
simulate((now - last) / 1000);
```

once per frame.

Run the ship with thrust for 5 seconds:

1. normal CPU;
2. CPU throttled 6× in DevTools.

Record the final position in both cases.

Then restore the fixed-step accumulator and repeat.

**Expected conclusion:** variable-step physics depends directly on frame timing; fixed-step physics produces the same simulation-step sequence for the same input.

**Actual result:** fill in the two pairs of positions.

## Reflection — short answers

### 1. Call stack, queues and rendering

JavaScript executes one stack of JavaScript at a time. Tasks such as timers and DOM events are queued. Promise callbacks are microtasks. After a task, microtasks are drained before the browser proceeds to rendering. `requestAnimationFrame` callbacks run as part of the rendering opportunity before paint.

### 2. Why does a 100 ms synchronous loop freeze the page?

JavaScript on the main thread runs to completion. While the synchronous loop is executing, the event loop cannot start another JavaScript callback or let the browser complete normal main-thread work. Therefore input, scrolling and rendering can visibly stall.

### 3. Tasks vs microtasks

Tasks include timers and many events. Microtasks include Promise reactions and `queueMicrotask`. After a task, the browser drains the microtask queue completely. A microtask can enqueue another microtask, so an endless chain can starve rendering.

### 4. Why rAF instead of setInterval?

`requestAnimationFrame`:

1. is synchronized with the browser's rendering;
2. receives a high-resolution timestamp;
3. is normally paused/throttled when the document is hidden.

A fixed `setInterval(..., 16)` is not equivalent to a 60 Hz display interval because 60 Hz is approximately 16.667 ms, and timer scheduling can drift.

### 5. Accumulator and alpha

The accumulator stores elapsed real time. The simulation consumes it in exact `1/60` second chunks. The delta is clamped to avoid trying to simulate an enormous backlog after a hitch. `alpha` is the fraction between the previous and current simulation states; rendering uses it for smooth interpolation.

### 6. Why deterministic simulation?

The same input sequence should produce the same simulation result. This is important for multiplayer because different clients need compatible simulation state instead of physics depending on their individual frame rates.

### 7. Closures and `var` / `let`

A closure retains access to variables from the scope where the function was created. `var` is function-scoped, while `let` is block-scoped. In a loop with callbacks, `let` creates a separate binding for each iteration, while `var` shares one function-scoped binding.

### 8. What does `type="module"` change?

Modules:

1. have their own scope;
2. use `import` / `export`;
3. run in strict mode;
4. are deferred by default;
5. can use top-level `await`.

## Before submission

- [ ] `npm install` works
- [ ] `npm run dev` works
- [ ] `npm run build` succeeds
- [ ] `npm run lint` succeeds
- [ ] `npm run format:check` succeeds
- [ ] HUD shows steps/s, frames/s and frame time
- [ ] ship moves with keyboard
- [ ] interpolation works
- [ ] canvas is DPR-aware
- [ ] experiments 1–3 have actual measurements/screenshots
- [ ] README contains actual measured results
- [ ] Git repository is tagged `lab-01`
