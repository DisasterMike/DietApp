import app from "./application-controller.js"
import cookiesUtils from '../utils/cookies-utils.js'

const homePage = async (req, res) => {
    if (req.method==='GET') {
        const sessionToken = await cookiesUtils.getSessionToken(req)
        if (sessionToken) {
            res.writeHead(302, { Location: '/dashboard' })
            return res.end()
            // TODO - should this logic be used???
        }

        app.serveFile('pages/index.html', 'text/html', res)
    }
}


export default { homePage }