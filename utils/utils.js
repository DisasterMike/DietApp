const calculateTDEE = ({weight, height, age, gender, activity}) => {

    // BMR=(10×weight in kg)+(6.25×height in cm)−(5×age in years)+5
    // BMR=(10×weight in kg)+(6.25×height in cm)−(5×age in years)−161
    // TDEE=BMR×activity multiplier

    const genderVariation = gender === 'male' ? 5 : -161
    const BMR = (10 * weight) + (6.25 * height) - (5 * age) + genderVariation
    const FDEE = Math.round(BMR * activity)
    return {FDEE}
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

export { calculateTDEE, getActivityFigure }