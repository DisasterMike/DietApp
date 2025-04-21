import mysql from '../mysql/index.js'
import crypto from 'crypto'
import dayjs from "dayjs"
import './../global.js'

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
    return cookies.find(c => c.session).session
}

const getCurrentUser = async (req) => {
    const sessionToken = await getSessionToken(req)
    if (!sessionToken) return null
    const [{user_id}] = await mysql.query(`SELECT user_id FROM diet.sessions WHERE token = ?`, [sessionToken])
    if (!user_id) return null
    const [user] = await mysql.query(`SELECT * FROM diet.user WHERE user_id = ?`, [user_id])
    return user
}
const getCurrentUserId = async (req) => {
    const sessionToken = await getSessionToken(req)
    if (!sessionToken) return null
    const [{user_id}] = await mysql.query(`SELECT user_id FROM diet.sessions WHERE token = ?`, [sessionToken])
    // if (!user_id) return null
    return user_id
}

const setSessionToken = async (user, res) => {
    const sessionToken = crypto.randomBytes(64).toString('hex')
    const expireTime = dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
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

const deleteExpiredSessions = async (req, res, pathname) => {
    const sessionToken = await getSessionToken(req)
    if (!sessionToken) return {expired: false}

    const [tokenInDatabase] = await mysql.query(`SELECT * FROM diet.sessions WHERE token = ?`, [sessionToken])
    // const [expiredToken] = await mysql.query(`SELECT * FROM diet.sessions WHERE token = ? AND expires_at < NOW()`, [sessionToken])
    // if exits, run logic below and delete it
    // if (expiredToken) {
    if (!tokenInDatabase) {
        // await mysql.query(`DELETE FROM diet.sessions WHERE token = ? AND expires_at < NOW();`, [expiredToken])   
        res.setHeader('Set-Cookie', 'session=; HttpOnly; Max-Age=0; Path=/')
        res.writeHead(302, { Location: pathname })
        res.end()
        LOG('Session token expired')
        return {expired: true}
        // TODO maybe always redirect to login page??
    }
    return {expired: false}
}

const updateCurrentSessionToken = async (req, res) => {
    const sessionToken = await getSessionToken(req)
    if (!sessionToken) return

    const newExpireDate = dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
    await mysql.query(`UPDATE diet.sessions SET expires_at = ? 
    WHERE token = ?`, [newExpireDate, sessionToken])
}

export default { getSessionToken, setSessionToken, removeSessionToken, deleteExpiredSessions, updateCurrentSessionToken, 
    getCurrentUser, getCurrentUserId }