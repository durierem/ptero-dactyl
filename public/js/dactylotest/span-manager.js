'use strict'

import { Span } from './span.js'

export class SpanManager {
  constructor (parentNode) {
    this.parentNode = parentNode
    this.spans = []
    this.spanList = parentNode.children
    this.cursorIndex = 0
    this.maxCursorIndex = 0
  }

  getElement () {
    return this.parentNode
  }

  insertLast (char) {
    this.spans.push(new Span(this.parentNode, char))
    this.maxCursorIndex += 1
  }

  insertCharAt (char, index) {
    this.spans.splice(index, 0, new Span(this.parentNode, char, index))
    this.cursorIndex += 1
  }

  removeCharAt (index) {
    this.spans[index].detach()
    this.spans.splice(index, 1)
    this.cursorIndex -= 1
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
    this.removeCursor()
    this.placeCursor(this.cursorIndex + 1)
  }

  moveCursorLeft () {
    if (this.cursorIndex <= 0) { return }
    this.removeCursor()
    this.placeCursor(this.cursorIndex - 1)
  }
}
