'use strict'

import { Span } from './span.js'

export class SpanManager {
  constructor (parentNode) {
    this.parentNode = parentNode
    this.spans = []
    this.spanList = parentNode.children
    this.maxCursorIndex = 0
  }

  getElement () {
    return this.parentNode
  }

  insertLast (char) {
    this.spans.push(new Span(this.parentNode, char))
  }

  insertCharAt (char, index) {
    console.log('avant')
    this.inspect()

    this.spans.splice(index, 0, new Span(this.parentNode, char, index))

    console.log('après')
    this.inspect()
  }

  removeCharAt (index) {
    console.log('avant')
    this.inspect()

    console.log(index)

    this.spans[index].detach()
    this.spans.splice(index, 1)

    console.log('après')
    this.inspect()
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
  }

  removeCursor () {
    this.spans[this.spans.length - 1].setCursor(false)
  }

  inspect () {
    let str = '[ '
    for (let i = 0; i < this.spans.length; i++) {
      str += this.spans[i].getChar() + ', '
    }
    str += ']'
    console.log(str)
  }
}
