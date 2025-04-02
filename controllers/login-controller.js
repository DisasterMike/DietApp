import app from "./application-controller.js"
import mysql from '../mysql/index.js'
import '../global.js'

const loginPage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/login.html', 'text/html', res)
    }
    if (req.method==='POST') {
        handlelogin(req, res)
    }
}

const handlelogin = (req, res) => {

    const checkUserCredentials = async (body) => {
        const {user: userEmailOrUsername, password} = JSON.parse(body)

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.*[a-zA-Z]{2,}$/
        const identifier = emailRegex.test(userEmailOrUsername) ? 'email' : 'username'

        // const checkforUserQuery = `SELECT * FROM diet.user
        // WHERE ${identifier} = ?`
        // const checkforUser = await mysql.query(checkforUserQuery, [userEmailOrUsername])
        // if (!checkforUser.length) {
        //     ERR(`No such ${identifier} found.`)
        //     res.writeHead(401, {'Content-Type': 'application/json'})
        //     // return res.end(JSON.stringify({error: `No such ${identifier} found.`, user: userEmailOrUsername}))
        //     return res.end(JSON.stringify({error: `No such ${identifier} found.`, field: 'user'}))
        // }
        
        const query = `SELECT * FROM diet.user
        WHERE ${identifier} = ? AND password = ?`
        const currentUser = await mysql.query(query, [userEmailOrUsername, password])
        // LOG(currentUser) // if has error, try to add them to the error below..?

        if (!currentUser.length) {
            ERR('Invalid user credentials')
            res.writeHead(401, {'Content-Type': 'application/json'})
            // return res.end(JSON.stringify({error: 'Username/email and password don\'t match', user: userEmailOrUsername}))
            // return res.end(JSON.stringify({error: 'Wrong password entered.', field: 'password'}))
            return res.end(JSON.stringify({error: 'Invalid username/email or password.'}))
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({success: true, redirect: '/dashboard'})) // TODO change to /dashboard
    }
    
    const parts = []
    req.on('data', c => parts.push(c))
    req.on('end', () => checkUserCredentials(Buffer.concat(parts)))
}

const signupPage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/sign-up.html', 'text/html', res)
    }
}

export { loginPage, signupPage }