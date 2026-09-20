import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
    admin: { user: 'users' },
    collections: [
        {
            slug: 'users',
            auth: true,
            fields: [],
        },
    ],
    db: sqliteAdapter({ client: { url: `file:${path.resolve(dirname, 'media/payload.db')}` } }),
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
    upload: { staticDir: path.resolve(dirname, 'media') },
});
