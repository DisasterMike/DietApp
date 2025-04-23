import app from "./application-controller.js"
import mysql from '../mysql/index.js'
import '../global.js'

import bcrypt from "bcrypt"
import cookiesUtils from '../utils/cookies-utils.js'

const signupPage = async (req, res) => {
    if (req.method==='GET') {

        const sessionToken = await cookiesUtils.getSessionToken(req)
        if (sessionToken) {
            // already loggin in, so redirect to dashboard
            res.writeHead(302, { Location: '/dashboard' })
            return res.end()
        }

        // app.serveFile('pages/sign-up.html', 'text/html', res)
        const html = await app.serveFullPage('pages/sign-up.html')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end(html)
    }
    if (req.method==='POST') {
        createAccount(req, res)
    }
}

const createAccount = async (req, res) => {
    const {username, email, password} = req.$fields
    LOG(username, email, password)

    // create a hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const dbInsert = await mysql.createUser(username, email, hashedPassword)
    if (dbInsert.error) {
        // ERR(dbInsert.error)
        ERR('mysql error: ', dbInsert.error.sqlMessage)
        res.writeHead(401, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify(dbInsert.error))
    }

    const newUser = await mysql.query(`SELECT * FROM diet.user WHERE username = ?`, [username])
    await cookiesUtils.setSessionToken(newUser[0], res)

    res.writeHead(201, {'Content-Type': 'application/json'})
    // return res.end(JSON.stringify({result: 'Successfully created account'}))
    return res.end(JSON.stringify({success: true, redirect: '/setup'}))
}

const validateUsername = async (req, res, username) => {
    const query = `SELECT * FROM diet.user WHERE username = ?`
    const dbQuery = await mysql.query(query, [username])
    if (dbQuery.length) {
        LOG('found username: ', username)
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({error: 'That username is already taken'}))
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({response: 'OK'}))
    }
}

const validateEmail = async (req, res, email) => {

}

const validateUser = async (req, res, parsedUrl) => {
    for (const [key, value] of parsedUrl.searchParams) {
        if (key==='username') {
            validateUsername(req, res, value)
        } else {
            validateEmail(req, res, value)

        }
    }
}

export default { signupPage, validateUser }