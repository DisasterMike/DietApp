import app from "./application-controller.js"
import cookiesUtils from '../utils/cookies-utils.js'
import './../global.js'

import mysql from "../mysql/index.js"

import dayjs from "dayjs"

import { capitalizeString } from "../utils/utils.js"

const dashboardPage = async (req, res) => {
    if (req.method==='GET') {
        const sessionToken = await cookiesUtils.getSessionToken(req)
        if (!sessionToken) {
            res.writeHead(302, { Location: '/login' })
            return res.end()
        }

        const html = await app.serveFullPage(req, res, 'pages/dashboard.html')

        // check...
        
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end(html)
    }
}

const getFoodListForToday = async (req, res) => {
    const user_id = await cookiesUtils.getCurrentUserId(req)
    const sqlQuery = `
        SELECT food.name, food.calories, food_eaten.eaten_at FROM diet.food_eaten
        INNER JOIN diet.food ON
        food_eaten.food_id = food.food_id
        WHERE user_id = ? AND eaten_at = ?;
    `
    const foodData = await mysql.query(sqlQuery, [user_id, dayjs().format('YYYY-MM-DD 00:00:00')])
    return foodData
}

const getCurrentEatenFood = async (req, res) => {
    const foodList = await getFoodListForToday(req, res)

    let totalCalories = 0
    for (let i = 0; i < foodList.length; i++) {
        const {calories} = foodList[i]
        totalCalories += calories
    }

    const data = {
        totalCalories,
        foodList,
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
}

const addFoodEaten = async (req, res) => {

    let {food_name: name, food_calories: calories} = req.$fields

    name = capitalizeString(name)

    let food_id
    const [foodItem] = await mysql.query(`
        SELECT * FROM diet.food WHERE name = ?
    `, [name])
    if (!foodItem) {
        try {
            const result = await mysql.insertInto('diet.food', [{name, calories}])
            food_id = result.insertId
        } catch (e) {
            ERR(e)
        }
    } else {
        food_id = foodItem.food_id
    }

    const user_id = await cookiesUtils.getCurrentUserId(req)
    const foodEatenEntry = {user_id, food_id, eaten_at: dayjs().format('YYYY-MM-DD')}
    await mysql.insertInto('diet.food_eaten', [foodEatenEntry])

    const foodList = await getFoodListForToday(req, res)
    // LOG(foodList)

    let totalCalories = 0
    for (let i = 0; i < foodList.length; i++) {
        const {calories} = foodList[i]
        totalCalories += calories
    }

    const data = {
        totalCalories,
        foodList,
    }

    res.writeHead(201, { 'Content-Type': 'application/json' })
    // res.end(JSON.stringify({success: true}))
    res.end(JSON.stringify(data))
}

export default { dashboardPage, addFoodEaten, getFoodListForToday, getCurrentEatenFood }









// const navbar = await app.readHTML('pages/components/navbar.html')
// const footer = await app.readHTML('pages/components/footer.html')
// let html = await app.readHTML('pages/dashboard.html')

// // const testArr = ['apple','banana','mango','strawberry']
// // const mappedString = testArr.map(i => `<p>${i} card</p>`).join('')

// // const script = `<script>
// //     const test = document.querySelector('h1')
// //     test.innerText = 'hello'
// // </script>
// // `

// // TODO check user data (app.fetchuserdata), 
//     // if there, render normal 
//         // or render to say you need to update data?

// html = html.replace('{{navbar}}', navbar)
// // html = html.replace('{{dashboard_contents}}', `<h2>This is a test</h2>`)
// // html = html.replace('{{dashboard_contents}}', mappedString)
// html = html.replace('{{footer}}', footer)