import mysql from 'mysql2'
import '../global.js'


const connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
})

connection.connect((err) => {
    if (err) {
        ERR('Error connecting to mysql: ', err)
    }
    LOG('Connected to mysql')
})

export { connection }


// const queryDatabase = (query) => {
//     connection.query(query)
// }

// // EX
// queryDatabase(`
//     SELECT * FROM ????
// `)