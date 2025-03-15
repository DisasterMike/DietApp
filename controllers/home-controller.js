import app from "./application-controller.js"


const homePage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/index.html', 'text/html', res)
    }
}


export { homePage }