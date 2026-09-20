import env from '#start/env';
import { defineConfig } from '@adonisjs/core/http';

export const appKey = env.get('APP_KEY');

export const http = defineConfig({
    generateRequestId: false,
    allowMethodSpoofing: false,
});
