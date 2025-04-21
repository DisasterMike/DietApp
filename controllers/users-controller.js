import app from "./application-controller.js"
import mysql from '../mysql/index.js'
import '../global.js'

import cookiesUtils from '../utils/cookies-utils.js'
import { convertWeightIntoKg, convertHeightIntoCm } from '../utils/utils.js'

const setupPage = async (req, res) => {
    if (req.method==='GET') {

        const sessionToken = await cookiesUtils.getSessionToken(req)
        if (!sessionToken) {
            // already loggin in, so redirect to dashboard
            res.writeHead(302, { Location: '/login' })
            return res.end()
        }

        app.serveFile('pages/setup.html', 'text/html', res)
    }
    if (req.method==='POST') {

        let {first_name, last_name, date_of_birth: dob, height, 
            weight, height_measurement, weight_measurement, sex, activity_level} = req.$fields

        LOG(height, height_measurement)
        LOG(weight, weight_measurement)

        weight = await convertWeightIntoKg(weight, weight_measurement)
        height = await convertHeightIntoCm(height, height_measurement)


        const data = {first_name, last_name, dob, height, 
            weight, sex, activity_level}

        LOG(height, weight)

        // return

        const sessionToken = await cookiesUtils.getSessionToken(req)
        const [{user_id}] = await mysql.query(`
            SELECT user_id FROM diet.sessions WHERE token = ?
        `, [sessionToken])

        await mysql.updateTable('diet.user', {user_id}, data)

        res.writeHead(201, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({success: true}))
        // TODO what if token had expired?????
        // TODO what if information in the form was missing
    }
}

export default { setupPage }