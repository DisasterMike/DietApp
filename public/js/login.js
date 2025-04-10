const inputs = document.querySelectorAll('#login-form .l-input')
const form = document.getElementById('login-form')
const formError = document.getElementById('form-error-message')

// for removing erors when typing...
inputs.forEach(i => {
    i.addEventListener('input', () => {
        i.classList.remove('form-error')
        formError.style.display = 'none'
    })
})    

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    inputs.forEach(i => i.classList.add('form-wait'))
    // await new Promise(r => setTimeout(r, 500))

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const body = JSON.stringify(data)

    const req = await fetch('/login', {
        method: 'POST',
        body,
    })
        .then(r => r.json())
        .catch(e => console.log(e)) // add error on screen?

    inputs.forEach(i => i.classList.remove('form-wait'))

    if (req.success) {
        window.location.href = req.redirect
    } else {

        inputs.forEach(i => i.classList.add('form-error'))

        formError.style.display = 'block'
        formError.innerText = req.error
    }
})

// TODO adjust..
const eye = document.getElementById('eye')
eye.addEventListener('click', () => {
    const passwordBox = document.getElementById('password')
    passwordBox.type = passwordBox.type === 'password' ? 'text' : 'password'
    eye.innerText = passwordBox.type === 'password' ? '<@>' : '<->'
})