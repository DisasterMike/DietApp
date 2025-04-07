import app from "./application-controller.js"
import mysql from '../mysql/index.js'
import '../global.js'


const setupPage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/setup.html', 'text/html', res)
    }
    if (req.method==='POST') {
        // update db with new information from the form
        LOG('post request made...')
    }
}

export { setupPage }