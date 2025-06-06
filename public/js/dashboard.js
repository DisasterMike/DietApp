let TDEE
let totalCalories

const updateKcal = () => {
  let kcalDifference = totalCalories - TDEE
  if (kcalDifference < 0) {
    kcalDifference *= -1 // turn -num into + for when in surplus (i.e. -2000 = 2000)
    document.querySelector('.kcal-result').innerText = "-" + kcalDifference
    document.querySelector('.kcal-result').style.color = 'green' // TODO change to class...
  } else {
    document.querySelector('.kcal-result').innerText = "+" + kcalDifference
    document.querySelector('.kcal-result').style.color = 'red'
  }
  document.querySelector('.kcal').innerHTML = `${totalCalories} / ${TDEE} kcal`
}

const createFoodEatenIcons = (data) => {
  const cardsContainer = document.querySelector('.food-eaten-icons')
  cardsContainer.innerHTML = ''
  data.foodList.forEach(c => { // if change MAKE SURE TO KEEP ID DATASET FOR DELETING...
    cardsContainer.insertAdjacentHTML('beforeend', `
      <li style="padding: 6px; margin: 0 8px;" data-id=${c.id}>
        <p style="display: inline-block; padding: 0 10px; margin: 0; font-size: 0.9rem;">${c.name}: 
          <span style="color: var(--white); font-size: 1.3em;"><i>${c.calories}</i></span></p>
        <button style="padding: 0px 4px;
        background: red;
        border: none;
        color: white;
        cursor: pointer;" 
        onclick="deleteFood(this)">x</button>
      </li>
    `)
  })
}

const deleteFood = async button => {
  const parent = button.closest('li')
  const id = parent.dataset.id
  const body = JSON.stringify({id})

  // need to collect id from dataset and send that across..
  const response = await fetch('/api/delete-eaten', {
    method: 'POST',
    body,
  })
    .then(r => r.json())

  console.log(response)

  if (!response.error) {
    parent.remove()
    totalCalories = response.totalCalories
    updateKcal()
  }
}

const addFoodFromCard = async button => {
  const outerDiv = button.closest('div')
  const food_id = outerDiv.dataset.food_id
  console.log(food_id)

  const response = await fetch('/api/eat-again', {
    method: 'POST',
    body: JSON.stringify({food_id}),
  })
    .then(r => r.json())

  totalCalories = response.totalCalories
  updateKcal()

  createFoodEatenIcons(response)
}


document.addEventListener('DOMContentLoaded', () => {

  const homeLink = document.querySelector('.home-link')
  homeLink.classList.add('curr-page-link')
  const foodForm = document.querySelector('.food-input')

  const init = async () => {
    const dataFetch = await fetch('/api/userdata')
      .then(r => r.json())
      // TODO catch...
    
    if (!dataFetch) {
      console.error('error with fetch')
      return
    }
    if (dataFetch.error) {
      console.error(dataFetch.error)
      const detailsContainer = document.querySelector('.calorie-details')
      // TODO update...
      detailsContainer.innerHTML = `<a class="simple-link light" href="/setup">Setup account</a>`
      return
    }

    TDEE = dataFetch.TDEE // set TDEE from fetch

    const calorieFetch = await fetch('/api/total-calories')
      .then(r => r.json())

    totalCalories = calorieFetch.totalCalories
    updateKcal()

    createFoodEatenIcons(calorieFetch)
  }
  init()

  // reset input whenever clicking..
  const customFoodInputName = document.getElementById('food_name')
  const customFoodInputCalories = document.getElementById('food_calories')
  customFoodInputName.addEventListener('focus', () => {
    customFoodInputName.value = ''
  })

  let inputFoodCalories = {}
  const pastEatenDataList = Array.from(document.getElementById('past-eaten-foods').options)
  pastEatenDataList.forEach(option => inputFoodCalories[option.value] = option.dataset.calories)
  customFoodInputName.addEventListener('input', () => {
    const food = customFoodInputName.value
    if (inputFoodCalories[food] !== undefined) {
      customFoodInputCalories.value = inputFoodCalories[food]
    }
  })


  foodForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // const inputs = e.target.querySelectorAll('input')
    // for (let i = 0; i < inputs.length; i++) {
    //   const input = inputs[i]
    //   if (input.value.trim() === '') {
    //     alert(`${input.name} cannot be empty`)
    //     // add some styling to say it's empty????
    //     return
    //   }
    // }

    const formData = new FormData(foodForm)
    const data = Object.fromEntries(formData.entries())
    const body = JSON.stringify(data)

    const dataFetch = await fetch('/api/add-custom-food', {
      method: 'POST',
      body,
    })
      .then(r => r.json())
      // TODO catch

    totalCalories = dataFetch.totalCalories
    updateKcal()

    createFoodEatenIcons(dataFetch)
  })
})