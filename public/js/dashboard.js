const test = async () => {
    const req = await fetch('/userdata')
    .then(r => r.json())
    
    // console.log(req)

    // const totalCalories = 1800
    let totalCalories = 0

    const updateKcal = () => {
      kcalResult = totalCalories - req.TDEE
      if (kcalResult < 0) {
        kcalResult *= -1 // turn -num into +
        document.querySelector('.kcal-result').innerText = "-" + kcalResult
        document.querySelector('.kcal-result').style.color = 'green'
      } else {
        document.querySelector('.kcal-result').innerText = "+" + kcalResult
        document.querySelector('.kcal-result').style.color = 'red'
      }
      document.querySelector('.kcal').innerHTML = `${totalCalories} / ${req.TDEE} kcal`
    }

    updateKcal()

    document.querySelector('.add').addEventListener('click', () => {
      totalCalories += 250
      updateKcal()
    })

  }
  test()