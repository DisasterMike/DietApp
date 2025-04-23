const calculateTDEE = ({weight, height, age, sex, activity}) => {

    // BMR=(10×weight in kg)+(6.25×height in cm)−(5×age in years)+5 // male
    // BMR=(10×weight in kg)+(6.25×height in cm)−(5×age in years)−161 // female
    // TDEE=BMR×activity multiplier

    const genderVariation = sex === 'male' ? 5 : -161
    const BMR = (10 * weight) + (6.25 * height) - (5 * age) + genderVariation
    const TDEE = Math.round(BMR * activity)
    return {TDEE}
}

const getActivityFigure = (activityLevel) => {
    const figureMap = {
        0: 1.2,
        1: 1.375,
        2: 1.55,
        3: 1.725,
        4: 1.9,
    }
    return figureMap[activityLevel]
}
// -- 0 - Sedentary	            1.2	Office worker, little/no exercise
// -- 1 - Lightly Active	        1.375	Light exercise (1-3 days/week)
// -- 2 - Moderately Active	    1.55	Moderate exercise (3-5 days/week)
// -- 3 - Very Active	            1.725	Hard exercise (6-7 days/week)
// -- 4 - Super Active	            1.9	Athletes, physical labor jobs

const convertWeightIntoKg = (weight, measurement) => {
    let result
    if (measurement==='pounds') {
        result = weight * 0.453592
        return Math.round(result)
    } else if (measurement==='stone') {
        result = weight * 6.35029
        return Math.round(result)
    } else {
        return weight // keep at kg
    }
}

const convertHeightIntoCm = (height, measurement) => {
    let result
    if (measurement==='inch') {
        result = height * 2.54
        return Math.round(result)
    } else if (measurement==='feet') {
        // return height * 30.48
        const numbers = height.toString().split('.')
        result = (parseInt(numbers[0], 10) * 30.48) + (parseInt(numbers[1], 10) * 2.54)
        return Math.round(result)
    } else {
        return height // keep at cm
    }
}

const capIgnore = ['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'at', 
    'by', 'for', 'in', 'of', 'off', 'on', 'out', 'to', 'up', 'with']
const capitalizeString = (string, skip = false) => {
    return string.split(' ').map((word, index) => {
        if (skip && index > 0 && capIgnore.includes(word)) {
            return word
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1)
        }
    }).join(' ')
}


const asyncPool = async (size, items, callback) => {
	const pool = []
	for (let i = 0; items.length > i; i++) {
		const promise = callback(i)
			.then(() => pool.splice(pool.indexOf(promise), 1))
		pool.push(promise)
		if (pool.length >= size) {
			await Promise.race(pool)
		}
	}
	return Promise.all(pool)
}

// const runStressTest = async () => {
// 	const promises = []

// 	const tasks = new Array(10)

// 	console.time('timer')
// 	await asyncPool(10, tasks, async i => {
// 		// await insertTest()
// 		await readTest()
// 	})
// 	console.timeEnd('timer')

// }
// runStressTest()

export { calculateTDEE, getActivityFigure, convertWeightIntoKg, convertHeightIntoCm, capitalizeString }