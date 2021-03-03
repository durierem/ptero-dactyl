'use strict'

// Définition de la méthode top() sur les tableaux
Array.prototype.top = function () {
  return this[this.length - 1]
}

// -------------------------------------------------------------------------- //

// Une SpanObject est l'encapsulation Objet d'un objet HTML span. 
// Une SpanObject est ratachée à un conteneur de span donné par container.
// Une SpanObject contiendra 1 caractère donné par char. Ce caratctère est modifiable.
class SpanObject {
  constructor (container, char, cursor=false) {
    this.container = container
    this.char = char

    this.element = document.createElement('span')
    this.innerHTML = this.element.innerHTML
    this.element.innerText = char
    container.appendChild(this.element)

    if (cursor) {
      this.setCursor(true)
    }
  }

  getChar () {
    return this.char
  }

  getColor () {
    return this.element.style.color
  }

  setChar (char) {
    this.char = char
    this.element.innerText = char
  }

  setColor (color) {
    this.element.style.color = color
  }

  setCursor (bool) {
    if (bool) {
      this.element.classList.add('cursor-blink')
    } else {
      this.element.classList.remove('cursor-blink')
    }
  }

  detach() {
    this.container.removeChild(this.element)
  }
}

// -------------------------------------------------------------------------- //

class SpanManager {
  constructor (parentNode) {
    this.parentNode = parentNode
    this.spans = []
    this.spanList = parentNode.children
    this.cursorIndex = -1

    // Première span qui sert de curseur.
    this.parentNode.appendChild(document.createElement('span'))
  }

  append (span) {
    this.spans.push(span)
  }

  insertLast (value) {
    this.append(new SpanObject(this.parentNode, value))
  }

  removeLast () {
    this.spans.pop().detach()
  }

  setCharAt (char, index) {
    this.spans[index].setChar(char)
  }

  getCursorIndex () {
    return this.cursorIndex
  }

  placeCursor (index) {
    if (index < 0 || index >= this.spans.length) { return }
    this.spans[index].setCursor(true)
    this.cursorIndex = index
  }

  removeCursor () {
    if (this.cursorIndex < 0 || this.cursorIndex >= this.spans.length) { return }
    this.spans[this.cursorIndex].setCursor(false)
    // No cursor on the text => cursorIndex === -1
    this.cursorIndex = -1
  }

  moveCursorRight () {
    const index = this.cursorIndex + 1
    this.removeCursor()
    this.placeCursor(index)
  }

  moveCursorLeft () {
    if (this.cursorIndex === 0) { return }
    const index = this.cursorIndex - 1
    this.removeCursor()
    this.placeCursor(index)
  }
}

class DactyloTestModel {
  constructor (referenceText) {
    super()
    this.referenceText = referenceText
    this.lastInput = null
  }

  isLastInputCorrect () {

  }
}

class Benchmark {
  constructor (referenceText) {
    this.model = new DactyloTestModel(referenceText)
    this.hiddenTextArea = //...
    this.spanManager = new SpanManager()
    this.initialize()
  }

  initialize () {
    this.hiddenTextArea.addEventListener('keydown', (e) => {
      const char = e.key

      // if (!/Backspace|^.$/.test(c)) {
      //   return
      // }

      if (char === 'Backspace') {
        this.model.deleteLastinput()
      } else {
        this.model.setlastInput(char)
        if (this.model.isLastInputCorrect()) {
          this.spanManager(char, 'black')
        } else {
          this.spanManager(char, 'red')
        }
      }

      this.updateCursor() // 
    })
  }

  updateCursor () {
    this.spanManager.setCursor(this.model.getIndex())
  }
}

const text = 'La philosophie est une démarche de réflexion critique et de questionnement sur le monde, la connaissance et l\'existence humaine. Elle existe depuis l\'Antiquité en Occident et en Orient, à travers la figure du philosophe, non seulement en tant qu\'activité rationnelle mais aussi comme mode de vie. L\'histoire de la philosophie permet d\'appréhender son évolution.'
const benchmark = new Benchmark(text)
