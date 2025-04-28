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
        let html = await app.serveFullPage(req, res, 'pages/dashboard.html')

        const topEatenFoods = await getMostCommonEatenFood(req, res)
        let cards = ''
        for (let i = 0; i < topEatenFoods.length; i++) {
            const food = topEatenFoods[i]
            const replacedHtml = await app.replaceHTML(food, 'pages/components/food-card.html')
            cards += replacedHtml
        }

        html = html.replace('{{topEatenFoods}}', cards)
        
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end(html)
    }
}

const getFoodListForToday = async (req, res) => {
    const user_id = await cookiesUtils.getCurrentUserId(req)
    const sqlQuery = `
        SELECT * FROM diet.food_eaten
        INNER JOIN diet.food ON
        food_eaten.food_id = food.food_id
        WHERE user_id = ? AND eaten_at = ?;
    `
    const foodData = await mysql.query(sqlQuery, [user_id, dayjs().format('YYYY-MM-DD 00:00:00')])
    return foodData
}

const foodListAndCalories = async (req, res) => {
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
    return data
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
    // TODO do a try catch and return if error???

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

const deleteFromFoodEaten = async (req, res) => {
    const {id} = req.$fields
    res.writeHead(201, { 'Content-Type': 'application/json' })
    try {
        await mysql.query(`DELETE FROM diet.food_eaten WHERE id = ?`, [id])
    } catch (e) {
        ERR(e)
        res.end(JSON.stringify({error: e}))
    }
    const {totalCalories} = await foodListAndCalories(req, res)
    res.end(JSON.stringify({totalCalories})) // return total calories instead...
}

const getMostCommonEatenFood = async (req, res) => {
    const user_id = await cookiesUtils.getCurrentUserId(req)

    const sqlQuery = `
        SELECT MAX(diet.food.food_id) AS food_id, name, calories, image_url, COUNT(*) AS times_eaten, MAX(diet.food_eaten.eaten_at) AS last_eaten_at
        FROM diet.food_eaten
        INNER JOIN diet.food ON diet.food_eaten.food_id = diet.food.food_id
        WHERE user_id = ?
        GROUP BY diet.food.food_id, diet.food.name, diet.food.calories
        ORDER BY times_eaten DESC
        LIMIT 5;
    `
    const orderedEatenList = await mysql.query(sqlQuery, [user_id])
    // LOG(orderedEatenList)

    orderedEatenList.forEach(item => {
        const lastEaten = item.last_eaten_at
        // const lastEaten = dayjs('2025-04-10').format('YYYY-MM-DD') // for testing

        let lastEatenText
        const diff = dayjs().diff(dayjs(lastEaten), 'day')
        if (diff >= 30) {
            lastEatenText = 'a month or so ago'
        } else if (diff >= 7) {
            const weeks = Math.round(diff / 7)
            const plural = weeks === 1 ? '' : 's'
            lastEatenText = `${weeks} week${plural} ago`
        } else {
            if (diff===0) {
                lastEatenText = 'today'
            } else if (diff===1) {
                lastEatenText = 'yesterday'
            } else {
                lastEatenText = `${diff} days ago`
            }
        }

        item.alt = `image of ${item.name}`

        // if image_url is NULL, add default
        if (!item.image_url) item.image_url = 'images/defaultRecipeImage.png'

        // item.last_eaten_at = dayjs(lastEaten).format('YYYY-MM-DD')
        item.last_eaten_at = lastEatenText
    })
    return orderedEatenList
    // res.writeHead(200, { 'Content-Type': 'application/json' })
    // res.end(JSON.stringify(topFiveFoods))
}

const eatAgain = async (req, res) => {
    const {food_id} = req.$fields
    const user_id = await cookiesUtils.getCurrentUserId(req)
    const foodEatenEntry = {user_id, food_id, eaten_at: dayjs().format('YYYY-MM-DD')}
    await mysql.insertInto('diet.food_eaten', [foodEatenEntry])
    // TODO do a try catch and return if error???

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
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
}

// TODO - use this for foods you click to favourite??????
const getFavouriteFood = async (req, res) => {
}

export default { dashboardPage, addFoodEaten, getFoodListForToday, getCurrentEatenFood, deleteFromFoodEaten,
    getMostCommonEatenFood, eatAgain
}


// const sqlQuery = `
//         SELECT name, calories, COUNT(*) AS times_eaten
//         FROM diet.food_eaten
//         INNER JOIN diet.food ON diet.food_eaten.food_id = diet.food.food_id
//         WHERE user_id = ?
//         GROUP BY name
//         ORDER BY times_eaten DESC;
//     `




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