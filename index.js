import http from 'node:http'
import fs from 'node:fs'
import path from 'path'
// import { dirname } from 'node:path'

import mysql from './mysql/index.js'

import { URL } from 'url'

import './global.js'
import { calculateTDEE, getActivityFigure } from './utils/utils.js'
import dayjs from 'dayjs'

const host = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {

    let parsedUrl = new URL(req.url, `http://localhost:${port}`)
    const pathname = parsedUrl.pathname

    // server static files
    const fileExt = path.extname(pathname)
    if (fileExt) {
        staticFiles(req, res, fileExt)
        return
    }

    // serve other requests
    switch (pathname) {
        case '/':
            homePage(req, res)
            // if signed in, go to /dashboard
            break
        case '/login':
            loginPage(req, res)
            break
        case '/userdata':
            fetchUserData(req, res)
            break
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

const homePage = async (req, res) => {
    if (req.method==='GET') {
        serveFile('pages/index.html', 'text/html', res)
    }
}

const loginPage = async (req, res) => {
    if (req.method==='GET') {
        serveFile('pages/login.html', 'text/html', res)
    }
    if (req.method==='POST') {
        // ...
        LOG('post time...')
        serveFile('pages/login.html', 'text/html', res)
    }
}

const fetchUserData = async (req, res) => {
    // dashboard?

    const user = await mysql.query(`
        SELECT * FROM diet.user
        WHERE user_id = ?    
        `, [1]
    )
    const {weight, height, dob, sex, activity_level} = user[0]

    const age = dayjs().diff(dob, 'year') // get age from date of birth
    const activity = getActivityFigure(activity_level)

    const TDEE = calculateTDEE({
        age,
        weight,
        height,
        sex,
        activity,
    })

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(TDEE))
}

const staticFiles = (req, res, fileExt) => {
    const filePath = path.join('public', req.url)
    // LOG(filePath, fileExt)

    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
    }
    const contentType = mimeTypes[fileExt]

    // if (fileExt==='.ico') return
    // LOG('got past')

    serveFile(filePath, contentType, res)
}

const serveFile = (filePath, contentType, res) => {

    // LOG('filePath to serve: ', filePath)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end(500, {error: 'Not found'})
            // return [500, {error: 'Not found'}]
        } else {
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(data)
            // return data
        }
    })
}