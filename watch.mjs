import chokidar from 'chokidar';
import { exec } from 'child_process';

let appProcesses;

const cwd = process.cwd();
const commands = process.argv[2].split(',');

void async function startWatch() {
  const reload = reloadAll();

  chokidar
    .watch(cwd, {
      ignoreInitial: true,
      ignored: /\.test-cache|node_modules/
    })
    .on('all', reload)
    .on('ready', reload)
    .on('error', exit);
}();

function createAppProcesses() {
  const msg = appProcesses ? 'restarted' : 'started';

  appProcesses = commands.map(command => {
    const process = exec(`npm run ${ command }`, {
      stdio: "inherit",
      shell: true
    })
      .on('error', onAppProcessError(command))
      .on('exit', onAppProcessExit(command));

    console.log(`Robot ${ msg } (${ command })`);

    return process;
  });
}

function exit(err) {
  console.log(err);
  process.exit(1);
}

async function killAppProcesses() {
  if (appProcesses?.length) {
    return await Promise.all(
      appProcesses
        .map(process =>
          new Promise(resolve => {
            process.on('exit', resolve);
            process.kill();
          })
        )
    );
  }
}

function onAppProcessError(command) {
  return (error) => {
    console.error(error);
    console.log(`Robot encountered an error (npm run ${ command })`);
  };
}

function onAppProcessExit(command) {
  return () => {
    console.log(`Robot stopped (npm run ${ command })`);
  };
}

function reloadAll() {
  let reloading = false;
  let reloadAgain = false;

  const reload = async filepath => {
    if (filepath) {
      console.log(`Detected change (${ filepath })...`);
    } else {
      console.log('Initializing watch');
    }

    if (reloading) {
      reloadAgain = true;
    } else {
      reloading = true;
      reloadAgain = false;

      await killAppProcesses();
      createAppProcesses();

      reloading = false;

      if (reloadAgain) {
        await reload(filepath);
      }
    }
  };

  return reload;
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});
