import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT ?? 4173);
const types = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8' };

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(
    new URL(request.url ?? '/', `http://${request.headers.host}`).pathname,
  );
  const relativePath = pathname === '/' ? '/preview.html' : pathname;
  const filePath = resolve(root, `.${relativePath}`);

  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'content-type': types[extname(filePath)] ?? 'application/octet-stream',
    });
    response.end(content);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Iris preview: http://localhost:${port}\n`);
});
