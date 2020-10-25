import { normalizeInput, init, lean, move } from './state/index.mjs';
import { startServer } from './web.mjs';
import { addInputListener } from './input.mjs';

await startServer();

let exit = () => {};

void async function main() {
  let state = init();

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

process.on('SIGINT', () => {
  exit();
});

//                       π/2
//                       90°
//
//
//
//             +      ┌───────┐
//             │    ╒═╡  fwd  ╞═╕
//            ┌┴┐  1 0│       │X 11
// π 180°      X    ╒═╡   13  ╞═╕          0° 0
//            └┬┘  3 2│  12   │8 9
//             │    ╒═╡       ╞═╕
//             -   5 4┕━━━━━━━┙6 7
//
//                 - ───[ Y ]─── +
//
//                       270°
//                       3π/2


// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 

function step(context) {
  context = normalizeInput(context);
  context = lean(context);
  context = move(context);
  return leaned;
}
