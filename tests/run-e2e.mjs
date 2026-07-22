import { spawn } from 'node:child_process';
import { once } from 'node:events';

const server = spawn(process.execPath, ['tests/serve-dist.mjs'], { stdio: 'inherit' });

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4321/');
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error('The test server did not become ready.');
}

let exitCode = 1;
try {
  await waitForServer();
  const tests = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test'], { stdio: 'inherit', env: { ...process.env, PPL_E2E_EXTERNAL: '1' } });
  const [code] = await once(tests, 'exit');
  exitCode = typeof code === 'number' ? code : 1;
} finally {
  server.kill();
  await Promise.race([once(server, 'exit'), new Promise((resolve) => setTimeout(resolve, 1000))]);
}

process.exitCode = exitCode;
