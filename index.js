import http from 'node:http';
import fs from 'node:fs';

const host = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello');

    if (req.url==='/') {
        
    }
})

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})