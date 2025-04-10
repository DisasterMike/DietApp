import '../global.js'
import pool from './pool.js'

const query = async (sqlQuery, params, debug = false) => {

    return new Promise((res, rej) => {
        pool.execute(sqlQuery, params, (err, results) => {
            if (err) {
                rej(err)
            } else {
                res(results)
                if(debug) LOG(`mysql query: ${sqlQuery.trim()}, [${params}]`)
            }
        })
    })

    // pool.promise.execute()
}

// let query = `INSERT INTO ${tableName} (\`${keys.join('`,`')}\`) VALUES ? AS t ON DUPLICATE KEY UPDATE ${updates.join(', ')};`


const createUser = async (username, email, password) => {

    const sqlQuery = `INSERT INTO diet.user (username, email, password)
    VALUES (?, ?, ?)`

    // validations here?
        // email regex??

    let errors
    try {
        return await query(sqlQuery, [username, email, password])
    } catch (e) {
        return {error: e}
    }
}

const updateTable = async (tableName, indexes, queryData) => {

    const columns = Object.keys(queryData).map(i => `${i} = ?`)
    const primaryIndexes = Object.keys(indexes).map(i => `${i} = ?`)

    let sqlQuery = `
    UPDATE ${tableName}
    SET ${columns.join(', ')}
    WHERE ${primaryIndexes.join(' AND ')}`

    //TODO try catch...

    // LOG(sqlQuery, [...Object.values(queryData), ...Object.values(indexes)])
    const result = await query(sqlQuery, [...Object.values(queryData), ...Object.values(indexes)])

    LOG(`Updated table ${tableName}, with columns: ${Object.keys(queryData).join(', ')}`)

    return result
}

export default { query, updateTable, createUser }