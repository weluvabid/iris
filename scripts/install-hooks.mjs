import { spawnSync } from 'node:child_process';

const result = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' });

if (result.status !== 0) {
  process.exit(0);
}

// Respect an existing hooksPath: developers may intentionally disable hooks
// locally (for example, by setting it to /dev/null) while iterating.
const existing = spawnSync('git', ['config', '--get', 'core.hooksPath'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
});

if (existing.status === 0 && existing.stdout.trim() !== '') {
  process.exit(0);
}

const configured = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], {
  stdio: 'inherit',
});

if (configured.status !== 0) {
  process.exit(configured.status ?? 1);
}
