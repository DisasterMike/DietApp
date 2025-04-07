import mysql from '../mysql/index.js'
import crypto from 'crypto'
import dayjs from "dayjs"

const getSessionToken = (req) => {
    let cookies = req.headers.cookie
    if (!cookies || !cookies.length) return ''

    cookies = cookies.split(';').map((c) => {
        const obj = {}
        const cookie = c.split('=')
        const key = cookie[0]
        const value = cookie[1]
        obj[key] = value
        return obj
    })
    // console.log(cookies)

    return cookies.find(c => c.session)
}

const setSessionToken = async (user, res) => {
    const sessionToken = crypto.randomBytes(64).toString('hex')
    const expireTime = dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    await mysql.query(`INSERT INTO diet.sessions (user_id, token, expires_at)
        VALUES (?, ?, ?)
    `, [user.user_id, sessionToken, expireTime])

    // Set cookie
    res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400`)
}

const removeSessionToken = async (req, res) => {
    // get current session token
    const sessionToken = await getSessionToken(req)

    // delete session from db
    await mysql.query(`DELETE FROM diet.sessions
         WHERE token = ?`, [sessionToken])
     
    // remove cookies
    res.setHeader('Set-Cookie', 'session=; HttpOnly; Max-Age=0; Path=/')
}

export default { getSessionToken, setSessionToken, removeSessionToken }