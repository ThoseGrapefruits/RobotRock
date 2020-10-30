import { normalizeInput, init, lean, move } from './state/index.mjs';
import { startServer } from './web.mjs';
import { addInputListener } from './input.mjs';
import settleServos from './state/settle-servos.mjs';

await startServer();

const TICK_INTERVAL = 16;

let exit = () => {};

// There are 2 callback/timer things running over each other here.
//
//   1. A client-side "game loop" that is capturing input and sending it along
//      whenever the values change. This is where most of the state changes
//      happen, but not necessarily the actual movement.
//   2. A server-side "tick" interval that is trying to settle the servos into
//      their desired positions, smoothed out by a PID controller.
//
// They can and will run in any order, flip-flopping betwween the two, but
// because all JavaScript engines are single-threaded, only one of them will
// truly be running at any one time.

void async function main() {
  let state = init();

  addInputListener((input, timeSinceLastInput) => {
    state = step({
      input,
      state,
      timeSinceLastInput,
    });
  });

  let lastTickTime;
  const interval = setInterval(() => {
    const now = process.hrtime.bigint();
    const timeSinceLastTick = now - (lastTickTime ?? now);
    state = tick({
      state,
      timeSinceLastTick,
    });
  }, TICK_INTERVAL);

  await new Promise(resolve => {
    exit = () => {
      clearInterval(interval);
      resolve();
    };
  })
}()

// Ctrl+C received on the server command line, or shutdown, or something.
process.on('SIGINT', () => {
  exit();
});

//                       π/2
//                       90°
//
//
//
//             -      ┌───────┐
//             │    ╒═╡  fwd  ╞═╕
//            ┌┴┐  1 0│       │X 11
// π 180°      Y    ╒═╡   13  ╞═╕          0° 0
//            └┬┘  3 2│  12   │8 9
//             │    ╒═╡       ╞═╕
//             +   5 4┕━━━━━━━┙6 7
//
//                 - ───[ X ]─── +
//
//                       270°
//                       3π/2


//      ╭────────╮                 ╭────────╮
//     ╭╯  ╭───╮ ╰─────────────────╯        ╰╮
//     │ ╭─╯ c ╰─╮  ╭───╮   ╭───╮     ╭─╮    │
//     │ │e     f│    8       9    ╭─╮ 3 ╭─╮ │
//     │ ╰─╮ d ╭─╯                  2 ╭─╮ 1  │
//     ╰╮  ╰───╯   ╭───╮     ╭───╮     0    ╭╯
//      │        ╮ │ a │ ╭─╮ │ b │ ╭        │
//     ╭╯      ╭─│ ╰───╯ │ │ ╰───╯ │─╮      ╰╮
//     │      ╭╯ ╰───────╯ ╰───────╯ ╰╮      │
//     │      │     ⇄ ⇅       ⇄ ⇅     │      │
//     │     ╭╯     0 1       2 3     ╰╮     │
//     │     │                         │     │ 
//     ╰─────╯                         ╰─────╯
//                                            
//                 ╭───╮     ╭───╮            
//                 └┐ ┌┘     └┐ ┌┘
//         ╭─═════──┴─┴───────┴─┴──═════─╮
//       ╭─╯   5                     4   ╰─╮
//      ╭╯  ╮                           ╭  ╰╮
//     ╭╯   ╰╮  7  ╭─────────────╮  6  ╭╯   ╰╮
//     ╰╮    ╰─────╯             ╰─────╯    ╭╯
//      ╰────╯                         ╰────╯

function step(context) {
  context = normalizeInput(context);
  context = lean(context);
  context = move(context);
  return context.state;
}

function tick(context) {
  context = settleServos(context);
  return context.state;
}
