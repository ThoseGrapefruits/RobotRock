// import { initRobot } from './state.mjs';
import { startServer } from './web.mjs';
import { addInputListener } from './input.mjs';

await startServer();

let exit = () => {};

void async function main() {
  let state = {}; // initRobot();

  addInputListener((input, timeSinceLastInput) => {
    console.log(timeSinceLastInput);
    state = step({
      input,
      timeSinceLastInput,
      state
    });
  });

  await new Promise(resolve => {
    exit = resolve;
  })
}()

//                       π/2
//                       90°
//
//
//
//               +    ┌───────┐
//               │  ╒═╡  fwd  ╞═╕
//              ┌┴┐  0│       │0
// π 180°        X  ╒═╡       ╞═╕          0° 0
//              └┬┘  1│       │1
//               │  ╒═╡       ╞═╕
//               -   2┕━━━━━━━┙2
//                 - ───[ Y ]─── +
//
//
//                       270°
//                       3π/2

function step({
  input,
  state: { legs, filter, pid, gyro, pwm }
}) {
  return {};
}
