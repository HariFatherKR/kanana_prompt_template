import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const port = Number(process.env.PORT || 5173);
const url = process.env.SMOKE_URL || `http://127.0.0.1:${port}/`;

async function waitForHttp() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // wait
    }
    await delay(250);
  }
  throw new Error(`server not ready: ${url}`);
}

const server = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, BROWSER: 'none' },
});
let logs = '';
server.stdout.on('data', (chunk) => { logs += chunk.toString(); });
server.stderr.on('data', (chunk) => { logs += chunk.toString(); });

try {
  const response = await waitForHttp();
  const html = await response.text();
  for (const expected of ['Kanana Prompt Template', '/src/main.tsx']) {
    if (!html.includes(expected)) {
      throw new Error(`HTTP smoke missing ${expected}`);
    }
  }
  console.log(`http smoke ok: ${response.status} ${url}`);
} finally {
  server.kill('SIGTERM');
  await delay(300);
  if (!server.killed) server.kill('SIGKILL');
  if (process.env.DEBUG_SMOKE) console.error(logs);
}
