'use strict'

class Cursor {
  constructor (parent) {
    this._parent = parent
    this._index = 0
  }

  getIndex () {
    return this._index
  }

  enable () {
    const sp = this._parent.getUserContainer().children.item(this._index)
    sp.classList.add('cursor-blink')
  }

  disable () {
    const sp = this._parent.getUserContainer().children.item(this._index)
    if (sp === null) {
      return
    }
    sp.classList.remove('cursor-blink')
  }
}

class SpanTextManager {
  constructor (text) {
    
  }
}

class Span {
  constructor (node) {
    this.node = node
    this.color = "grey"
  }
}

class AbstractDactyloTest {
  constructor (text) {
    this.hiddenInput = document.getElementById('hidden-input')
    this.userContainer = document.getElementById('user-input')
    this.text = text
    this.cursor = new Cursor(this)
    this.containsError = false
    this.indexOfError = undefined
  }

  getUserContainer() {
    return this.userContainer
  }
}

class Exercise extends AbstractDactyloTest {
  constructor (text) {
    super(text)
  }

  placeText() {
    for (let c of this.text) {
      const span = document.createElement('span')
      span.innerHTML = c
      this.userContainer.appendChild(span)
    }
  }

  initialize () {
    this.hiddenInput.addEventListener('focusout', () => {
      this.cursor.disable()
    })

    this.userContainer.addEventListener('click', () => {
      this.hiddenInput.focus()
      this.cursor.enable()
    })

    this.hiddenInput.addEventListener('keydown', (e) => {
      const c = e.key

      // Il faut tester plus... Il n'y a pas que Shift, mais toutes les autres
      if (c === 'Shift') {
        return
      }

      if (text.charAt(this.cursor.index) !== c) {
        this.containsError = true
        this.indexOfError = this.cursor.index
      }

      if (this.containsError) {
        this.setCharAsError(this.cursor.index)
      } else {
        this.setCharAsTyped(this.cursor.index)
      }
    })
  }

  setCharAsError (index) {
    this.userContainer.children.item(index).setAttribute('style', 'color: red;')
  }

  setCharAsTyped (index) {
    this.userContainer.children.item(index).setAttribute('style', 'color: gray;')
  }
}

// TODO : récupérer le texte depuis une base de donnée
// => Stocker le texte dans la page ? AJAX ?
const text = 'La philosophie est une démarche de réflexion critique et de questionnement sur le monde, la connaissance et l\'existence humaine. Elle existe depuis l\'Antiquité en Occident et en Orient, à travers la figure du philosophe, non seulement en tant qu\'activité rationnelle mais aussi comme mode de vie. L\'histoire de la philosophie permet d\'appréhender son évolution.'
const dactylotest = new Exercise(text)
dactylotest.placeText()
dactylotest.initialize()


// let spanCursorNb = -1
// // Let's find the first position of the cursor
// findNextCursor()

// function setNextCursor () {
//   unsetPresentCursor()
//   findNextCursor()
//   setCursor()
// }

// function findNextCursor () {
//   ++spanCursorNb
//   let sp = userContainer.children.item(spanCursorNb)
//   while (sp.tagName === 'BR') {
//     ++spanCursorNb
//     sp = userContainer.children.item(spanCursorNb)
//   }
// }


// function setCurrSpanCursorRed () {
//   const sp = userContainer.children.item(spanCursorNb)
//   sp.setAttribute('style', 'color:red;')
// }

// function setCurrSpanCursorTyped () {
//   const sp = userContainer.children.item(spanCursorNb)
//   sp.setAttribute('style', 'color:gray;')
// }
