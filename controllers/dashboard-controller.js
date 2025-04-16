import app from "./application-controller.js"
import cookiesUtils from '../utils/cookies-utils.js'
import './../global.js'

const dashboardPage = async (req, res) => {
    if (req.method==='GET') {
        const sessionToken = await cookiesUtils.getSessionToken(req)
        if (!sessionToken) {
            res.writeHead(302, { Location: '/login' })
            return res.end()
        }

        const html = await app.serveFullPage('pages/dashboard.html')
        
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end(html)
    }
}

export default { dashboardPage }









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