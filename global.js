import dayjs from "dayjs";

const getDatetime = () => dayjs().format('YYYY-MM-DD HH:mm:ss')
// const getDate = () => dayjs().format('YYYY-MM-DD')

global.LOG = (...args) => {
    const stack = new Error().stack;
    const coreParts = stack.split('\n')[2].split(' ').filter(Boolean).splice(1) // [func, (path/to/file:15:5)]

    let func
    let file
    if (coreParts.length > 1) { // called inside a function
        const title = coreParts[0].split('.')
        func = title.length > 1 ? title[1] : title[0]
        file = coreParts[1].replace(/[\(\)]/g, '').split('DietApp/')[1]
    } else {
        func = 'anonymous'
        file = coreParts[0].replace(/[\(\)]/g, '').split('DietApp/')[1]
    }

    console.log('LOG', getDatetime(), file, func, '\n---> ', ...args)
}

global.ERR = (...args) => {
    const stack = new Error().stack;
    const coreParts = stack.split('\n')[2].split(' ').filter(Boolean).splice(1) // [func, (path/to/file:15:5)]

    let func
    let file
    if (coreParts.length > 1) { // called inside a function
        const title = coreParts[0].split('.')
        func = title.length > 1 ? title[1] : title[0]
        file = coreParts[1].replace(/[\(\)]/g, '').split('DietApp/')[1]
    } else {
        func = 'anonymous'
        file = coreParts[0].replace(/[\(\)]/g, '').split('DietApp/')[1]
    }

    console.log('ERR', getDatetime(), file, func, '\n---> ', ...args)
}

