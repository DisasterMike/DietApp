import mysql from './index.js'
import '../global.js'

const updateUsername = (newUsername, user_id) => {

    // make sure it's not the same..

    let query = `
    UPDATE diet.user
    SET username = ?
    WHERE user_id = ?`

    mysql.query(query, [newUsername, user_id])
}
const updateEmail = (email, user_id) => {

    // make sure it's not the same..

    let query = `
    UPDATE diet.user
    SET email = ?
    WHERE user_id = ?`

    mysql.query(query, [email, user_id])
}
const updatePassword = (newPassword, user_id) => {

    // make sure it's not the same..

    let query = `
    UPDATE diet.user
    SET password = ?
    WHERE user_id = ?`

    mysql.query(query, [newPassword, user_id])
}

( async () => {
    const result = await mysql.updateTable(
        'diet.user', 
        {user_id: 1},  
        {   
            first_name: 'Michael', 
            last_name: 'Stump', 
            dob: '1990-02-16',
            sex: 'male',
            height: 172, 
            weight: 86, 
            activity_level: 1,
        }
    )

    LOG(result)
})()