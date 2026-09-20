import fs from 'node:fs';
import path from 'node:path';

const page = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'public', 'page.html'), 'utf8');

export default {
    index(ctx) {
        ctx.type = 'text/html';
        ctx.body = page;
    },
};
