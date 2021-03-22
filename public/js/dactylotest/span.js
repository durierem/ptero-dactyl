'use strict'

// Une SpanObject est l'encapsulation Objet d'un objet HTML span.
// Une SpanObject est ratachée à un conteneur de span donné par container.
// Une SpanObject contiendra 1 caractère donné par char. Ce caratctère est modifiable.
export class Span {
  constructor (container, char, referent = null) {
    this.container = container
    this.element = document.createElement('span')
    this.element.innerText = char

    container.insertBefore(this.element, referent)
  }

  getChar () {
    return this.element.innerText
  }

  getColor () {
    return this.element.style.color
  }

  setChar (char) {
    this.element.innerText = char
  }

  setColor (color) {
    this.element.style.color = color
  }

  setCursor (bool) {
    if (bool) {
      this.element.classList.remove('inactive-cursor')
      this.element.classList.add('active-cursor')
    } else {
      this.element.classList.remove('active-cursor')
      this.element.classList.add('inactive-cursor')
    }
  }

  detach () {
    this.container.removeChild(this.element)
  }
}
