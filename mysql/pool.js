import mysql from 'mysql2'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'OnePaulrus2Many',
    database: 'diet',
})

export default pool