// import { initRobot } from './state.mjs';
import { startServer } from './web.mjs';
import { getLatestInput } from './input.mjs';

await startServer();

let state = {}; // initRobot();

let exit = () => {};

setInterval(() => {
  const input = getLatestInput();
  state = step({ input, state });
}, 1);

void async function main() {
  await new Promise(resolve => {
    exit = resolve;
  })
}()

//                       π/2
//                       90°
//
//
//
//               ⊕    ┌───────┐
//               │  ╒═╡   ◎   ╞═╕
//              ┌┴┐  0│       │0
// π 180°        X  ╒═╡       ╞═╕          0° 0
//              └┬┘  1│       │1
//               │  ╒═╡       ╞═╕
//               ⊖   2┕━━━━━━━┙2
//                 ⊖────[ Y ]────⊕
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
