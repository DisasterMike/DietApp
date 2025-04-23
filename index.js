import http from 'node:http'
import path from 'path'
import { URL } from 'url'
// import { dirname } from 'node:path'
import './global.js'
import app from './controllers/application-controller.js'
import cookiesUtils from './utils/cookies-utils.js'

import mysql from './mysql/index.js'

// import {capitalizeString} from './utils/utils.js'

const host = '127.0.0.1'
const port = 3000

const checkSessionTokens = async () => {
    const sessionExpireQuery = `
        DELETE FROM diet.sessions WHERE expires_at < NOW();
    `
    await mysql.query(sessionExpireQuery, [])

    await new Promise(r => setTimeout(r, 60_000))
    checkSessionTokens()
}
checkSessionTokens()

const main = async (req, res, parts) => {

    // parse data form request if there is any
    if (parts.length) req.$fields = JSON.parse(Buffer.concat(parts))
    parts.length = 0

    const protocool = req.headers['x-forwarded-proto'] || 'http'
    const fullUrl = `${protocool}://${req.headers.host}${req.url}`
    let parsedUrl = new URL(req.url, fullUrl)
    const pathname = parsedUrl.pathname

    // server static files
    const fileExt = path.extname(pathname)
    if (fileExt) {
        app.staticFiles(req, res, fileExt)
        return
    }
    // let browserCookies = req.headers.cookie
    // LOG('cookies', browserCookies)

    const sessionCheck = await cookiesUtils.deleteExpiredSessions(req, res, pathname)
    if (sessionCheck.expired) return

    await cookiesUtils.updateCurrentSessionToken(req, res)


    // TODO - MAYBE MOVE ALL THIS INTO A ROUTE SCRIPT....

    // serve other requests
    if (pathname === '/') {
        return app.homeController.homePage(req, res)
    } else if (pathname === '/dashboard') {
        return app.dashboardController.dashboardPage(req, res)
    } else if (pathname === '/api/add-food') {
        return app.dashboardController.addFoodEaten(req, res)
    } else if (pathname === '/api/total-calories') {
        return app.dashboardController.getCurrentEatenFood(req, res)
        
    } else if (pathname === '/login') {
        return app.loginController.loginPage(req, res)
    } else if (pathname === '/logout') {
        return app.loginController.logout(req, res)

    } else if (pathname === '/sign-up') {
        return app.signupController.signupPage(req, res)
    } else if (pathname.includes('/sign-up/validate')) {
        return app.signupController.validateUser(req, res, parsedUrl)

    } else if (pathname === '/setup') {
        return app.usersController.setupPage(req, res)
    } else if (pathname === '/api/userdata') {
        return app.fetchUserData(req, res) // change to users controller?
    } else if (pathname === '/newdata') {
        return app.getRawTDEE(req, res)
    } else {
        // show 404 page
        app.serveFile('pages/404.html', 'text/html', res)
    }

    // Handle API-specific requests with '/api/' prefix
}

const server = http.createServer( async (req, res) => {
    const parts = []
	req.on('data', c => parts.push(c))
    req.on('end', () => main(req, res, parts))
})

const onServerStart = () => {
    LOG(`Server is running on http://${host}:${port}`)

}
server.listen(port, host, onServerStart)

process
	.on('unhandledRejection', (reason, p) => {
		ERR('process.unhandledRejection', reason, p)
	})
	.on('uncaughtException', err => {
		ERR('process.uncaughtException', err)
	})








    // cool stuff from david's code
    // res.$html = (data, code = 200) => res.writeHead(code, {'Content-Type': 'text/html'}).end(data)
    // res.$text = (data, code = 200) => res.writeHead(code, {'Content-Type': 'text/plain'}).end(data)
    // res.$json = (obj, code = 200) => res.writeHead(code, {'Content-Type': 'application/json; charset=UTF-8'}).end(JSON.stringify(obj))
    // res.$file = (blob, {code = 200, download = false, headers = {}, filename = '', compression = 'none', last_modified}) => {

    //     if (download) {
    //         headers['Content-Disposition'] = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    //     }
    //     // console.log('http server index.js response res.$file compression', compression)
    //     if (compression==='brotli') {
    //         headers['Content-Encoding'] = 'br'
    //     }

    //     if (!headers['Content-Type']) {
    //         // LOG({filename})
    //         headers['Content-Type'] = mime.getType(extname(filename))
    //     }

    //     if (last_modified) {
    //         headers['Last-Modified'] = last_modified
    //     }

    //     return res.writeHead(code, headers).end(blob)
    // }
    // res.$error = (code, obj) => isNaN(code) ? res.writeHead(code).end() : res.$json(obj, code)






    // const routeMap = {
    //     '/': app.homeController.homePage,
    //     '/dashboard': app.dashboardController.dashboardPage,
    //     '/login': app.loginController.loginPage,
    //     '/logout': app.loginController.logout,
    //     '/sign-up': app.signupController.signupPage,
    //     '/userdata': app.usersController.fetchUserData,
    //     '/newdata': app.usersController.getRawTDEE,
    //     '/setup': app.usersController.setupPage,
    // }
    // const handler = routeMap[pathname]
    // if (handler) {
    //     return handler(req, res)
    // } else if (pathname.includes('/sign-up/validate')) {
    //     return app.signupController.validateUser(req, res, parsedUrl)
    // } else {
    //     return app.serveFile('pages/404.html', 'text/html', res)
    // }
    


//     const http = require('http')
// const url = require('url')

// const routes = {
//     'GET /movies': (req, res) => res.end('List movies'),
//     'GET /movies/:id': (req, res, id) => res.end(`Show movie ${id}`),
//     'POST /movies': (req, res) => res.end('Create movie'),
//     'PUT /movies/:id': (req, res, id) => res.end(`Update movie ${id}`),
//     'DELETE /movies/:id': (req, res, id) => res.end(`Delete movie ${id}`),
// }

// http.createServer((req, res) => {
//     const { pathname } = url.parse(req.url)
//     const method = req.method

//     for (const route in routes) {
//         const [routeMethod, routePath] = route.split(' ')
//         const regex = new RegExp('^' + routePath.replace(/:\w+/g, '(\\d+)') + '$')
//         const match = pathname.match(regex)

//         if (match && method === routeMethod) {
//             return routes[route](req, res, ...match.slice(1))
//         }
//     }

//     res.writeHead(404, { 'Content-Type': 'text/plain' })
//     res.end('404 Not Found')
// }).listen(3000, () => console.log('Server running on port 3000'))