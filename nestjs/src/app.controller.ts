import { Controller, Get, Header } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const page = readFileSync(join(__dirname, '..', 'index.html'), 'utf8');

@Controller()
export class AppController {
    @Get()
    @Header('Content-Type', 'text/html; charset=utf-8')
    home(): string {
        return page;
    }
}
