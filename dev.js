const { spawn } = require('child_process');
const path = require('path');

const root = __dirname;
const commands = [
  { name: 'backend', command: 'node', args: ['server.js'], cwd: path.join(root, 'backend') },
  { name: 'frontend', command: 'node', args: ['server.js'], cwd: path.join(root, 'frontend') },
];

const children = commands.map(({ name, command, args, cwd }) => {
  const child = spawn(command, args, { cwd, stdio: ['inherit', 'pipe', 'pipe'] });
  child.stdout.on('data', (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${name}] ${data}`));
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) console.error(`[${name}] exited with code ${code}`);
  });
  return child;
});

const shutdown = () => {
  children.forEach((child) => {
    if (!child.killed) child.kill();
  });
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);