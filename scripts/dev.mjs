import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const viteCliPath = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const nodeExecutable = process.execPath;
const childProcesses = [];

function startProcess(command, args, env = process.env) {
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    env,
  });

  childProcesses.push(child);
  return child;
}

let shuttingDown = false;

function shutdown() {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  childProcesses.forEach((child) => {
    if (!child.killed) {
      child.kill();
    }
  });
}

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  shutdown();
  process.exit(0);
});

const apiServer = startProcess(nodeExecutable, [path.join(rootDir, 'server', 'server.mjs'), '--dev'], {
  ...process.env,
  PORT: process.env.PORT || '3001',
  NODE_ENV: 'development',
});

const viteServer = startProcess(nodeExecutable, [viteCliPath]);

[apiServer, viteServer].forEach((child) => {
  child.on('exit', (code) => {
    shutdown();

    if (typeof code === 'number' && code !== 0) {
      process.exit(code);
    }
  });
});
