import app from "./application-controller.js"
import cookies from '../utils/cookies-utils.js'

const dashboardPage = async (req, res) => {
    if (req.method==='GET') {
        const sessionToken = await cookies.getSessionToken(req)
        if (!sessionToken) {
            // redirect to login page
            return app.serveFile('pages/login.html', 'text/html', res)
            // TODO - make some sort of ui alert of something to show the redirect...
        }
        return app.serveFile('pages/dashboard.html', 'text/html', res)
    }
}

export default { dashboardPage }