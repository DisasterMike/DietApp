import '../global.js'
import pool from './pool.js'

const query = async (sqlQuery, params) => {

    return new Promise((res, rej) => {
        pool.execute(sqlQuery, params, (err, results) => {
            if (err) {
                rej(err)
            } else {
                res(results)
                LOG(`mysql query: ${sqlQuery.trim()}, [${params}]`)
            }
        })
    })
}

const updateTable = async (tableName, indexes, queryData) => {

    const columns = Object.keys(queryData).map(i => `${i} = ?`)
    const primaryIndexes = Object.keys(indexes).map(i => `${i} = ?`)

    let sqlQuery = `
    UPDATE ${tableName}
    SET ${columns.join(', ')}
    WHERE ${primaryIndexes.join(' AND ')}`

    // LOG(sqlQuery, [...Object.values(queryData), ...Object.values(indexes)])
    await query(sqlQuery, [...Object.values(queryData), ...Object.values(indexes)])

    LOG(`Updated table ${tableName}, with columns: ${Object.keys(queryData).join(', ')}`)
}

export default { query, updateTable }