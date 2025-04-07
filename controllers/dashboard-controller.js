import app from "./application-controller.js"
import cookies from '../utils/cookies-utils.js'

const dashboardPage = async (req, res) => {
    if (req.method==='GET') {
        const sessionToken = await cookies.getSessionToken(req)
        if (!sessionToken) {
            // redirect to login page
            return app.serveFile('pages/login.html', 'text/html', res)
        }
        return app.serveFile('pages/dashboard.html', 'text/html', res)
    }
}

//session=18667d3a4de8dc750f4ad61229436232c77ec6ca428973a17aa8dfc8f9980ac65379c002eec90e0a94cd6865e514341d2d7faab216456e17c04a1939b0948e6c

export { dashboardPage }