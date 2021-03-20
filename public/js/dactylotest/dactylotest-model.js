'use strict'

export class DactyloTestModel {
  constructor (referenceText) {
    // super()
    this.referenceText = referenceText
    this.userText = ''

    // this.currChar = this.referenceText.charAt(0)

    this.currChar = null
    this.cursorIndex = 0
    this.currWord = this.referenceText.slice(0, this.findNextSpace(0))
  }

  getReferenceTextLength () {
    return this.referenceText.length
  }

  getUserTextLength () {
    return this.userText.length
  }

  findNextSpace (index) {
    for (let i = index; i < this.referenceText.length; i++) {
      if (!/\w|\d/.test(this.referenceText.charAt(i))) {
        return i
      }
    }
    return -1
  }

  findFirst () {
    for (let i = this.cursorIndex; i < this.referenceText.length; i++) {
      if (!/\w|\d/.test(this.referenceText.charAt(i)) &&
         /\w|\d/.test(this.referenceText.charAt(i + 1))) {
        return i + 1
      }
    }
    return -1
  }

  setCurrentWord () {
    // debut du prochain mot
    const first = this.findFirst()
    // fin du prochain mot
    const nextSpace = this.findNextSpace(first)
    this.currWord = this.referenceText.slice(first === -1 ? this.cursorIndex + 1 : first,
      nextSpace === -1 ? this.referenceText.length - 1 : nextSpace)
  }

  isUserTextValid () {
    return this.userText === this.referenceText.slice(0, this.userText.length)
  }

  isFinished () {
    return this.getUserText() === this.getReferenceText()
  }

  getReferenceText () {
    return this.referenceText
  }

  getUserText () {
    return this.userText
  }

  getCurrWord () {
    return this.currWord
  }

  getCursorIndex () {
    return this.cursorIndex
  }

  isInputCorrect (c) {
    return c === this.referenceText[this.cursorIndex]
  }

  isLastInputCorrect () {
    return this.userText.charAt(this.cursorIndex - 1) ===
        this.referenceText.charAt(this.cursorIndex - 1)
  }

  findLastSpace () {
    for (let i = this.cursorIndex - 1; i > 0; i--) {
      if (this.referenceText.charAt(i) === ' ') {
        return i
      }
    }
    return -1
  }

  deleteLastInput () {
    if (this.userText.length <= 0) { return }
    this.userText = this.userText.slice(0, this.userText.length - 1)
    this.currChar = this.userText[this.userText.length - 1]
    this.cursorIndex -= 1
  }

  setLastInput (input) {
    this.userText += input
    this.currChar = this.userText[this.userText.length - 1]
    this.cursorIndex++
    this.currChar = input
  }
}
