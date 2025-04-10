import http from 'node:http'
import path from 'path'
import { URL } from 'url'
// import { dirname } from 'node:path'
import './global.js'
import app from './controllers/application-controller.js'
import cookiesUtils from './utils/cookies-utils.js'

import mysql from './mysql/index.js'

const host = '127.0.0.1'
const port = 3000

const checkSessionTokens = async () => {
    await new Promise(r => setTimeout(r, 3000))
    const sessionExpireQuery = `
        DELETE FROM diet.sessions WHERE expires_at < NOW();
    `
    await mysql.query(sessionExpireQuery, [])
    checkSessionTokens()
}
checkSessionTokens()

const server = http.createServer( async (req, res) => {

    const protocool = req.headers['x-forwarded-proto'] || 'http'
    const fullUrl = `${protocool}://${req.headers.host}${req.url}`
    let parsedUrl = new URL(req.url, fullUrl)
    // let parsedUrl = new URL(req.url, `http://localhost:${port}`)
    const pathname = parsedUrl.pathname

    // server static files
    const fileExt = path.extname(pathname)
    if (fileExt) {
        app.staticFiles(req, res, fileExt)
        return
    }
    // let browserCookies = req.headers.cookie
    // LOG('cookies', browserCookies)

    LOG(pathname)

    const sessionCheck = await cookiesUtils.deleteExpiredSessions(req, res, pathname)
    if (sessionCheck.expired) return

    await cookiesUtils.updateCurrentSessionToken(req, res)


    // TODO - MAYBE MOVE ALL THIS INTO A ROUTE SCRIPT....

    // serve other requests
    if (pathname === '/') {
        return app.homeController.homePage(req, res)
    } else if (pathname === '/dashboard') {
        return app.dashboardController.dashboardPage(req, res)

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
    } else if (pathname === '/userdata') {
        return app.fetchUserData(req, res) // change to users controller?
    } else if (pathname === '/newdata') {
        return app.getRawTDEE(req, res)
    } else {
        // show 404 page
        app.serveFile('pages/404.html', 'text/html', res)
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