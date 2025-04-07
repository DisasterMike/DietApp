import app from "./application-controller.js"
import mysql from '../mysql/index.js'
import '../global.js'

import bcrypt from "bcrypt"
import crypto from 'crypto'
import dayjs from "dayjs"

import cookies from '../utils/cookies-utils.js'

const loginPage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/login.html', 'text/html', res)
    }
    if (req.method==='POST') {
        handlelogin(req, res)
    }
}

const logout = async (req, res) => {
    // remove session token
    await cookies.removeSessionToken(req, res)

    // redirect to home page
    app.serveFile('pages/index.html', 'text/html', res)
}

const handlelogin = (req, res) => {

    const checkUserCredentials = async (body) => {
        const {user: userEmailOrUsername, password} = JSON.parse(body)

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.*[a-zA-Z]{2,}$/
        const identifier = emailRegex.test(userEmailOrUsername) ? 'email' : 'username'

        const userQuery = `SELECT * FROM diet.user
        WHERE ${identifier} = ?`
        const currentUser = await mysql.query(userQuery, [userEmailOrUsername])

        // return error if no such user found
        if (!currentUser.length) {
            ERR('Invalid username or email')
            res.writeHead(401, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify({error: 'Invalid username/email.'}))
        }

        const isMatch = await bcrypt.compare(password, currentUser[0].password)

        // return error if password was wrong
        if (!isMatch) {
            ERR('Invalid password')
            res.writeHead(401, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify({error: 'Invalid password.'}))
        }

        await cookies.setSessionToken(currentUser[0], res)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({success: true, redirect: '/dashboard'}))
    }
    
    const parts = []
    req.on('data', c => parts.push(c))
    req.on('end', () => checkUserCredentials(Buffer.concat(parts)))
}

export { loginPage, logout }