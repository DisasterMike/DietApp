import app from "./application-controller.js"
import mysql from '../mysql/index.js'
import '../global.js'

import { URL } from 'url'
import bcrypt from "bcrypt"

const signupPage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/sign-up.html', 'text/html', res)
    }
    if (req.method==='POST') {
        createAccount(req, res)
    }
}

const createAccount = async (req, res) => {
    let parts = []
    req.on('data', c => parts.push(c))
    req.on('end', async () => {
        const {username, email, password} = JSON.parse(Buffer.concat(parts))
        LOG(username, email, password)

        // create a hash password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const dbInsert = await mysql.createUser(username, email, hashedPassword)
        if (dbInsert.error) {
            ERR(dbInsert.error)
            res.writeHead(401, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(dbInsert.error))
        }

        res.writeHead(201, {'Content-Type': 'application/json'})
        // return res.end(JSON.stringify({result: 'Successfully created account'}))
        return res.end(JSON.stringify({success: true, redirect: '/dashboard'}))

        // const query = `INSERT INTO diet.user (username, email, password)
        // VALUES (?, ?, ?)`
        // await mysql.query(query, [username, email, hashedPassword])
    })
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

export { signupPage, validateUser }