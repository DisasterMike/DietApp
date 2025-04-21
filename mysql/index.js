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

const insertInto = async (table, entries) => { // diet.food, {name: banana, calories: 200}

    let results = []
    for (let i = 0; i < entries.length; i++) {

        const entry = entries[i]
        const columns = Object.keys(entry).join(', ') // name, calories
        const values = Object.values(entry)

        let sqlQuery = `
            INSERT INTO ${table} (${columns})
            VALUES (${values.map(i => '?').join(', ')})
        `
        try {
            const result = await query(sqlQuery, values)
            results.push(result)
        } catch (e) {
            ERR(e)
            // results.push(e)
        }
    }
    return results.length > 1 ? results : results[0]
}

const updateTable = async (tableName, indexes, queryData) => { // 'name', {index: , }, {data}

    const columns = Object.keys(queryData).map(i => `${i} = ?`)
    const primaryIndexes = Object.keys(indexes).map(i => `${i} = ?`)

    let sqlQuery = `
        UPDATE ${tableName}
        SET ${columns.join(', ')}
        WHERE ${primaryIndexes.join(' AND ')}
    `

    //TODO try catch...
    const result = await query(sqlQuery, [...Object.values(queryData), ...Object.values(indexes)])

    LOG(`Updated table ${tableName}, with columns: ${Object.keys(queryData).join(', ')}`)

    return result
}

export default { query, insertInto, updateTable, createUser }