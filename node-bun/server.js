import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.sendFile('index.html', { root: import.meta.dirname }));

app.listen(port, '127.0.0.1', () => console.log(`Listening on http://127.0.0.1:${port}`));
