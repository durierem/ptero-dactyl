'use strict'

const text = document.getElementById('ref-text-container').innerHTML
const inputContainer = document.getElementById('user-input')

inputContainer.addEventListener('input', () => {
  const root = document.documentElement
  if (inputContainer.value === text.slice(0, inputContainer.value.length)) {
    inputContainer.style.color = 'green'
  } else {
    inputContainer.style.color = 'red'
  }
})
