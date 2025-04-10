import fs from 'node:fs'
import path from 'path'
import dayjs from 'dayjs'

import './../global.js'

import { calculateTDEE, getActivityFigure } from '../utils/utils.js'
import cookies from '../utils/cookies-utils.js'
import mysql from '../mysql/index.js'

import homeController from './home-controller.js'
import dashboardController from './dashboard-controller.js'
import loginController from './login-controller.js'
import signupController from './sign-up-controller.js'
import usersController  from './users-controller.js'

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

const fetchUserData = async (req, res) => {

    // get user based on session cookie
    const sessionToken = await cookies.getSessionToken(req)
    const sessionRows = await mysql.query(`SELECT user_id FROM diet.sessions WHERE token = ?`, [sessionToken])
    
    // TODO return error.. session token was removed from db!!!

    const {user_id} = sessionRows[0]
    const user = await mysql.query(`SELECT * FROM diet.user WHERE user_id = ?`, [user_id])

    const {weight, height, dob, sex, activity_level} = user[0]
    // LOG(weight, height, dob, sex, activity_level)

    if (!weight || !height, !dob, !sex, !activity_level) {
        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify({error: 'Missing key data'}))
    }

    const age = dayjs().diff(dob, 'year') // get age from date of birth
    const activity = getActivityFigure(activity_level)

    const TDEE = calculateTDEE({ age, weight, height, sex, activity })

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(TDEE))
}

const getRawTDEE = async (req, res) => {
    let parts = []
    req.on('data', c => parts.push(c))
    req.on('end', () => {
        const {weight, height, age, sex, activity_level} = JSON.parse(Buffer.concat(parts))
        // LOG(weight, height, age, sex, activity_level)

        if (!weight || !height || !age || !sex || !activity_level) {   
            res.writeHead(401, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify({error: 'Please fill in all the fields'}))
        }

        const activity = getActivityFigure(activity_level)
        const TDEE = calculateTDEE({ weight, height, age, sex, activity })

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(TDEE))
    })
}

export default { staticFiles, serveFile, fetchUserData, getRawTDEE,
    homeController, dashboardController, loginController, signupController, usersController,
}