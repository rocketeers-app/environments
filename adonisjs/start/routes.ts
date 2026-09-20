import router from '@adonisjs/core/services/router';
import { readFile } from 'node:fs/promises';

const page = await readFile(new URL('../resources/index.html', import.meta.url), 'utf8');

router.get('/', async ({ response }) => response.type('text/html').send(page));
