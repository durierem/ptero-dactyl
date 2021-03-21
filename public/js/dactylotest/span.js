'use strict'

// Une SpanObject est l'encapsulation Objet d'un objet HTML span.
// Une SpanObject est ratachée à un conteneur de span donné par container.
// Une SpanObject contiendra 1 caractère donné par char. Ce caratctère est modifiable.
export class Span {
  constructor (container, char, index = null, cursor = false) {
    this.container = container
    this.element = document.createElement('span')
    this.element.innerText = char

    const referenceNode = index === null ? null : this.container.childNodes.item(index)
    container.insertBefore(this.element, referenceNode)

    if (cursor) {
      this.setCursor(true)
    }
  }

  getChar () {
    this.element.innerText
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
      this.element.classList.add('cursor-blink')
    } else {
      this.element.classList.remove('cursor-blink')
    }
  }

  detach () {
    const children = this.container.childNodes
    this.container.removeChild(children[children.length - 2])
  }
}