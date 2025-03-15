import app from "./application-controller.js"

const loginPage = async (req, res) => {
    if (req.method==='GET') {
        app.serveFile('pages/login.html', 'text/html', res)
    }
    if (req.method==='POST') {
        // ...
        LOG('post time...')
        app.serveFile('pages/login.html', 'text/html', res)
    }
}

export { loginPage }