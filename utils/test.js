import dayjs from 'dayjs';


const dob = dayjs('1990-02-16')
const today = dayjs()
const age = today.diff(dob, 'year')

console.log(age)
