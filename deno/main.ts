const port = Number(Deno.env.get('PORT') ?? 3000);
const page = await Deno.readTextFile(new URL('./index.html', import.meta.url));

Deno.serve(
    { port, hostname: '127.0.0.1' },
    () => new Response(page, { headers: { 'content-type': 'text/html; charset=utf-8' } }),
);
