import app from "./application-controller.js"
import cookiesUtils from '../utils/cookies-utils.js'
import './../global.js'

const dashboardPage = async (req, res) => {
    if (req.method==='GET') {
        const sessionToken = await cookiesUtils.getSessionToken(req)

        if (!sessionToken) {
            // redirect to login page
            // return app.serveFile('pages/login.html', 'text/html', res)
            // TODO - make some sort of ui alert of something to show the redirect...

            res.writeHead(302, { Location: '/login' })
            return res.end()
        }
        return app.serveFile('pages/dashboard.html', 'text/html', res)
    }
}

export default { dashboardPage }