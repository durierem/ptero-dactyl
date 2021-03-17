'use strict'

import { Span } from './span.js'

export class SpanManager {
  constructor (parentNode) {
    this.parentNode = parentNode
    this.spans = []
    this.spanList = parentNode.children
    this.cursorIndex = -1
    this.maxCurdorIndex = -1

    // Première span qui sert de curseur.
    this.parentNode.appendChild(document.createElement('span'))
  }

  getElement () {
    return this.parentNode
  }

  append (span) {
    this.spans.push(span)
  }

  insertLast (value) {
    this.append(new Span(this.parentNode, value))
    this.maxCursorIndex += 1
  }

  insertCharAt (char, index) {
    this.spans.splice(index, 0, new Span(this.parentNode, char, index))
    this.maxCursorIndex += 1
  }

  removeCharAt (index) {
    this.spans[index].detach()
    this.spans.splice(index, 1)
    this.maxCursorIndex -= 1
  }

  removeLast () {
    this.spans.pop().detach()
    this.maxCursorIndex -= 1
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
    if (this.cursorIndex >= this.maxCursorIndex) { return }
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
