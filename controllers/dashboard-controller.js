import app from "./application-controller.js"


const dashboardPage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/dashboard.html', 'text/html', res)
    }
}


export { dashboardPage }