const showCalorieCount = async () => {

    const response = await fetch('/api/userdata')
      .then(r => r.json())
      // TODO catch...
    
    if (!response) {
      console.error('error with fetch')
      return
    }
    if (response.error) {
      // update ui with link to set up account
      console.error(response.error)
      // TODO change html to have only the link to go to setup page...

      const detailsContainer = document.querySelector('.calorie-details')
      detailsContainer.innerHTML = `
      <a class="simple-link" href="/setup">Setup account</a>
      `
      return
    }

    // TODO perhaps inset html depending on this condition

    const calResponse = await fetch('/api/total-calories')
      .then(r => r.json())

    let totalCalories = calResponse.totalCalories

    const updateKcal = () => {
      kcalResult = totalCalories - response.TDEE
      if (kcalResult < 0) {
        kcalResult *= -1 // turn -num into +
        document.querySelector('.kcal-result').innerText = "-" + kcalResult
        document.querySelector('.kcal-result').style.color = 'green'
      } else {
        document.querySelector('.kcal-result').innerText = "+" + kcalResult
        document.querySelector('.kcal-result').style.color = 'red'
      }
      document.querySelector('.kcal').innerHTML = `${totalCalories} / ${response.TDEE} kcal`
    }

    updateKcal()

    // const addUpFoodEaten = async (list) => {
    //   let total = 0
    //   for (let i = 0; i < list.length; i++) {
    //     const {calories} = list[i]
    //     console.log(calories)
    //     total += calories
    //   }
    //   console.log('total calories from list ', total)
    // }

    const foodForm = document.querySelector('.food-input')
    
    foodForm.addEventListener('submit', async (e) => {
      // TODO add food logic here...
      // totalCalories += 250
      // updateKcal()

      e.preventDefault()

      const formData = new FormData(foodForm)
      const data = Object.fromEntries(formData.entries())
      console.log(data)
      const body = JSON.stringify(data)

      const response = await fetch('/api/add-food', {
        method: 'POST',
        body,
      })
        .then(r => r.json())

      const calorieText = document.getElementById('food_calories')
      calorieText.innerText = response.totalCalories
    })

  }
  showCalorieCount()


  // TODO (add food button)
    // enter name and calories
    // does a fetch to server
    // checks if that food is in food table, if not add it
    // add an entry to food eaten table
    // get response and add to calorie count on page

    // when loading dashboard...
      // grab all the food eaten entries from today, and get total.
      // display on screen
      // add cards based popular foods

    // !!!
    // need to display food eaten in a card or something
    // button to delete the food and remove that entry / minus from total