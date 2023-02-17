const { normalizeInput, init, lean, move, stand } = require('./state/index.js');
const { startServer } = require('./web.js');
const { addInputListener, handleRawInput } = require('./input.js');
const settleServos = require('./state/settle-servos.js');

const NANO = 1e9;
const TICK_INTERVAL = 10; // 100Hz

let exit = () => {
  process.exit(0); // in case we get killed during init
};

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

  setStartupSettlerFilter(state);

  addInputListener((input, timeSinceLastInput) => {
    state = step({
      input,
      state,
      timeSinceLastInput,
    });
  });

  let lastTickTime = process.hrtime();
  const tickInterval = setInterval(() => {
    const [ seconds, nanoseconds ] = process.hrtime(lastTickTime)
    lastTickTime = process.hrtime();
    state = tick({
      state,
      timeSinceLastTick: seconds * NANO + nanoseconds,
    });
  }, TICK_INTERVAL);

  const server = await startServer({
    handleRawInput
  });

  await new Promise(resolve => {
    console.log('Robot running!');
    exit = async () => {
      clearInterval(tickInterval);

      // This should be the right thing to do but it seems to kill the PWM
      // if (state) state.pwm.stop()

      await server.close();
      resolve();
      process.exit(0);
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
//                        ^
//             -      ┌───────┐
//             │  0 ╒═╡ front ╞═╕ 3
//            ┌┴┐  1 0│       │X 11
// π 180°      Y  1 ╒═╡   13  ╞═╕ 4        0° 0
//            └┬┘  3 2│  12   │8 9
//             │  2 ╒═╡       ╞═╕ 5
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
//         ╭─══════─┴─┴───────┴─┴─══════─╮
//       ╭─╯   5                     4   ╰─╮
//      ╭╯  ╮                           ╭  ╰╮
//     ╭╯   ╰╮  7  ╭─────────────╮  6  ╭╯   ╰╮
//     ╰╮    ╰─────╯             ╰─────╯    ╭╯
//      ╰────╯                         ╰────╯

// Settle servos individually until we know they're starting from a reasonable
// position. Settling them all to neutral on startup can cause the control board
// to draw too much power and crash the pi. This should never be awaited.
async function setStartupSettlerFilter(state) {
  let maxSettleIndex = 0;
  state.settleServoFilter = ({ index }) => index <= maxSettleIndex;

  for (let _ of state.servos.all()) {
    await new Promise(resolve => setTimeout(resolve, 50));
    maxSettleIndex++;
  }

  delete state.settleServoFilter;
}

function step(context) {
  context = assert(normalizeInput(context));
  context = assert(lean(context));
  context = assert(move(context));
  context = assert(stand(context));
  return context.state;
}

function tick(context) {
  context = assert(settleServos(context));
  return context.state;
}

function assert(x) {
  if (x == null) {
    throw new Error();
  }

  return x;
}
