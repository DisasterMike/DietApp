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
        const params = new URLSearchParams(body)
        const userEmailOrUsername = params.get('user')
        const password = params.get('password')

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.*[a-zA-Z]{2,}$/
        const identifier = emailRegex.test(userEmailOrUsername) ? 'email' : 'username'
        
        const query = `SELECT * FROM diet.user
        WHERE ${identifier} = ? AND password = ?`
        const currentUser = await mysql.query(query, [userEmailOrUsername, password])

        if (!currentUser.length) {
            ERR('No such user found')
            // res.writeHead(401, {'Content-Type': 'application/json'})
            // res.end(JSON.stringify({error: 'bad request'}))

            res.setHeader('Set-Cookie', `username=${userEmailOrUsername}; HttpOnly; Path=/;`);

            // res.writeHead(302, { Location: '/login?error=Invalid credentials' })
            res.writeHead(302, { Location: '/login' })
            res.end()
        } else {
            LOG(currentUser)
            res.writeHead(302, { Location: '/' }) // go to home
            res.end()
        }
    }

    const checkUserCredentialsFetchVer = async (body) => {
        const {user: userEmailOrUsername, password} = body

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.*[a-zA-Z]{2,}$/
        const identifier = emailRegex.test(userEmailOrUsername) ? 'email' : 'username'
        
        const query = `SELECT * FROM diet.user
        WHERE ${identifier} = ? AND password = ?`
        const currentUser = await mysql.query(query, [userEmailOrUsername, password])
        LOG(currentUser) // if has error, try to add them to the error below..?

        if (!currentUser.length) {
            ERR('No such user found')
            res.writeHead(401, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({error: 'Invalid credential', user: userEmailOrUsername}))
        } else {
            LOG(currentUser)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({success: true, redirect: '/'})) // TODO change to /dashboard
        }
    }
    
    const parts = []
    req.on('data', c => parts.push(c))
    req.on('end', () => {
        // checkUserCredentials(Buffer.concat(parts).toString())
        checkUserCredentialsFetchVer(JSON.parse(Buffer.concat(parts)))
    })
}

const signUpPage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/sign-up.html', 'text/html', res)
    }
}

export { loginPage, signUpPage }