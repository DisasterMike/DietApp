import app from "./application-controller.js"
import mysql from '../mysql/index.js'
import '../global.js'

import bcrypt from "bcrypt"
import crypto from 'crypto'
import dayjs from "dayjs"

import cookiesUtils from '../utils/cookies-utils.js'

const loginPage = async (req, res) => {
    if (req.method==='GET') {

        const sessionToken = await cookiesUtils.getSessionToken(req)
        if (sessionToken) {
            // already loggin in, so redirect to dashboard
            res.writeHead(302, { Location: '/dashboard' })
            return res.end()
        }

        app.serveFile('pages/login.html', 'text/html', res)
    }
    if (req.method==='POST') {
        handlelogin(req, res)
    }
}

const logout = async (req, res) => {
    // remove session token
    await cookiesUtils.removeSessionToken(req, res)

    // redirect to home page
    app.serveFile('pages/index.html', 'text/html', res)
}

const handlelogin = async (req, res) => {
    const {user: userEmailOrUsername, password} = req.$fields

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

    await cookiesUtils.setSessionToken(currentUser[0], res)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({success: true, redirect: '/dashboard'}))
}

export default { loginPage, logout }