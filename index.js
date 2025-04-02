import http from 'node:http'
import path from 'path'
import { URL } from 'url'
// import { dirname } from 'node:path'
import './global.js'
import app from './controllers/application-controller.js'

const host = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {

    let parsedUrl = new URL(req.url, `http://localhost:${port}`)
    const pathname = parsedUrl.pathname

    // server static files
    const fileExt = path.extname(pathname)
    if (fileExt) {
        app.staticFiles(req, res, fileExt)
        return
    }

    // serve other requests
    if (pathname === '/') {
        // TODO: Redirect to home or dashboard depending on login status
        return app.home(req, res);
    } else if (pathname === '/dashboard') {
        return app.dashboard(req, res);
    } else if (pathname === '/login') {
        return app.login(req, res);
    } else if (pathname === '/sign-up') {
        return app.signup(req, res);
    } else if (pathname.includes('/sign-up/validate')) {
        // check db for if that username exists or not
    } else if (pathname === '/userdata') {
        return app.fetchUserData(req, res);
    } else if (pathname === '/newdata') {
        return app.getRawTDEE(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 not found');
        // TODO: Add 404 page
    }
    // switch (pathname) {
    //     case '/':
    //         return app.home(req, res)
    //         // TODO go to home  or dashboard depending on if logged in or not
    //     case '/dashboard':
    //         return app.dashboard(req, res)
    //     case '/login':
    //         return app.login(req, res)
    //     case '/sign-up':
    //         return app.signup(req, res)
    //     case '/userdata':
    //         return app.fetchUserData(req, res)
    //     case '/newdata':
    //         return app.getRawTDEE(req,res)
    //     // case pathname.includes('/sign-up/username-validate'):
    //     case '/sign-up/username-validate':
    //         LOG('yeaa boiiii')
    //         break
    //     default:
    //         res.writeHead(404, { 'Content-Type': 'text/plain' })
	// 	    res.end('404 not found')
    //         // TODO add 404 page
    // }
})

server.listen(port, host, () => {
    LOG(`Server is running on http://${host}:${port}`)
})

process
	.on('unhandledRejection', (reason, p) => {
		ERR('process.unhandledRejection', reason, p)
	})
	.on('uncaughtException', err => {
		ERR('process.uncaughtException', err)
	})








//     const http = require('http');
// const url = require('url');

// const routes = {
//     'GET /movies': (req, res) => res.end('List movies'),
//     'GET /movies/:id': (req, res, id) => res.end(`Show movie ${id}`),
//     'POST /movies': (req, res) => res.end('Create movie'),
//     'PUT /movies/:id': (req, res, id) => res.end(`Update movie ${id}`),
//     'DELETE /movies/:id': (req, res, id) => res.end(`Delete movie ${id}`),
// };

// http.createServer((req, res) => {
//     const { pathname } = url.parse(req.url);
//     const method = req.method;

//     for (const route in routes) {
//         const [routeMethod, routePath] = route.split(' ');
//         const regex = new RegExp('^' + routePath.replace(/:\w+/g, '(\\d+)') + '$');
//         const match = pathname.match(regex);

//         if (match && method === routeMethod) {
//             return routes[route](req, res, ...match.slice(1));
//         }
//     }

//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('404 Not Found');
// }).listen(3000, () => console.log('Server running on port 3000'));