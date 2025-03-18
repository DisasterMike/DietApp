import http from 'node:http'
import path from 'path'
import { URL } from 'url'
// import { dirname } from 'node:path'
import './global.js'

import app from './controllers/application-controller.js'
import { homePage } from './controllers/home-controller.js'
import { loginPage, signUpPage } from './controllers/login-controller.js'

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
    switch (pathname) {
        case '/':
            return homePage(req, res)
            // TODO go to home page or dashboard depending on if logged in or not
        case '/login':
            return loginPage(req, res)
        case '/sign-up':
            return signUpPage(req, res)
        case '/userdata':
            return app.fetchUserData(req, res)
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' })
		    res.end('404 not found')
            // TODO add 404 page
    }
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