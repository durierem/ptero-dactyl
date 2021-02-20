'use strict'

const text = 'La philosophie est une démarche de réflexion critique et de questionnement sur le monde, la connaissance et l\'existence humaine. Elle existe depuis l\'Antiquité en Occident et en Orient, à travers la figure du philosophe, non seulement en tant qu\'activité rationnelle mais aussi comme mode de vie. L\'histoire de la philosophie permet d\'appréhender son évolution.'

const hiddenInput = document.getElementById('hidden-input')
const userContainer = document.getElementById('user-input')
let cursor = 0

// Initial text treatment, convert it into span and add spans to userContainer
for (let i = 0; i < text.length; ++i) {
  const c = text.charAt(i)
  const sp = document.createElement('span')
  switch (c) {
    case ' ':
      sp.innerHTML = ' '
      break
    case '\n':
      sp.innerHTML = '↲'
      break
    default:
      sp.innerHTML = c
  }
  userContainer.appendChild(sp)
  if (c === '\n') {
    const sp = document.createElement('br')
    userContainer.appendChild(sp)
    continue
  }
}

// index === 0 -> intial value
// index === 1 -> the current character have been misstyped by user
let index = 0
hiddenInput.addEventListener('keydown', function (e) {
  const c = e.key
  if (c === 'Shift') {
    return
  }
  if (text.charAt(cursor) === '\n' && c === 'Enter') {
    ;
  } else if (text.charAt(cursor) !== c) {
    console.log(text.charAt(cursor))
    index = 1
    return
  }

  if (index === 0) {
    setCurrSpanCursorTyped()
  } else {
    setCurrSpanCursorRed()
    index = 0
  }
  cursor += 1
  setNextCursor()
})

hiddenInput.addEventListener('focusout', function () {
  unsetPresentCursor()
})

userContainer.addEventListener('click', function () {
  hiddenInput.focus()
  setCursor()
})

let spanCursorNb = -1
// Let's find the first position of the cursor
findNextCursor()

function setNextCursor () {
  unsetPresentCursor()
  findNextCursor()
  setCursor()
}

function findNextCursor () {
  ++spanCursorNb
  let sp = userContainer.children.item(spanCursorNb)
  while (sp.tagName === 'BR') {
    ++spanCursorNb
    sp = userContainer.children.item(spanCursorNb)
  }
}
function setCursor () {
  const sp = userContainer.children.item(spanCursorNb)
  sp.classList.add('cursor-blink')
}

function unsetPresentCursor () {
  const sp = userContainer.children.item(spanCursorNb)
  if (sp == null) {
    return
  }
  sp.classList.remove('cursor-blink')
}

function setCurrSpanCursorRed () {
  const sp = userContainer.children.item(spanCursorNb)
  sp.setAttribute('style', 'color:red;')
}

function setCurrSpanCursorTyped () {
  const sp = userContainer.children.item(spanCursorNb)
  sp.setAttribute('style', 'color:gray;')
}
