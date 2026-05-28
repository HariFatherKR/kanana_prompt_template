import { mkdirSync, statSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const port = Number(process.env.PORT || 5173);
const url = `http://127.0.0.1:${port}/`;
const chrome = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const screenshot = process.env.SCREENSHOT_PATH || 'artifacts/screenshots/kanana-prompt-template-smoke.png';

async function waitForHttp() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
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
  await waitForHttp();
  const dump = spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--password-store=basic',
    '--use-mock-keychain',
    '--virtual-time-budget=3000',
    '--dump-dom',
    url,
  ], { encoding: 'utf8', timeout: 30_000 });
  if (dump.status !== 0) {
    throw new Error(`Chrome DOM smoke failed: ${dump.stderr || dump.stdout}`);
  }
  for (const expected of ['GPT-5.5-style image-to-video meta-prompting MVP', 'Generate English 5-second video prompt', 'Local preview only']) {
    if (!dump.stdout.includes(expected)) {
      throw new Error(`Rendered DOM missing ${expected}`);
    }
  }
  mkdirSync('artifacts/screenshots', { recursive: true });
  const shot = spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--password-store=basic',
    '--use-mock-keychain',
    '--window-size=1440,1200',
    `--screenshot=${screenshot}`,
    url,
  ], { encoding: 'utf8', timeout: 30_000 });
  if (shot.status !== 0) {
    throw new Error(`Chrome screenshot failed: ${shot.stderr || shot.stdout}`);
  }
  const size = statSync(screenshot).size;
  if (size < 5000) throw new Error(`screenshot too small: ${size}`);
  console.log(`browser smoke ok: ${url}; screenshot=${screenshot}; bytes=${size}`);
} finally {
  server.kill('SIGTERM');
  await delay(300);
  if (!server.killed) server.kill('SIGKILL');
  if (process.env.DEBUG_SMOKE) console.error(logs);
}

