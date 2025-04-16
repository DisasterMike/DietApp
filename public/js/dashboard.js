const showCalorieCount = async () => {
    const response = await fetch('/userdata')
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

    let totalCalories = 0

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

    document.querySelector('.add').addEventListener('click', () => {
      totalCalories += 250
      updateKcal()
    })

  }
  showCalorieCount()