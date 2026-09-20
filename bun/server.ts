const port = Number(process.env.PORT ?? 3000);
const page = await Bun.file(new URL('./index.html', import.meta.url)).text();

Bun.serve({
    port,
    hostname: '127.0.0.1',
    fetch: () => new Response(page, { headers: { 'content-type': 'text/html; charset=utf-8' } }),
});

console.log(`Listening on http://127.0.0.1:${port}`);
