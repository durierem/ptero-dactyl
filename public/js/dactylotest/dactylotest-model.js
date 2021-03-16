'use strict'

export class DactyloTestModel {
  constructor (referenceText) {
    // super()
    this.referenceText = referenceText
    this.userValidText = ''
    this.userText = ''

    // this.currChar = this.referenceText.charAt(0)
    // this.cursorIndex = 0
    // this.currWord = this.referenceText.slice(0, this.findNextSpace())

    this.currChar = null
    this.cursorIndex = -1
    this.currWord = this.referenceText.slice(0, this.findNextSpace())
  }

  getReferenceTextLength () {
    return this.referenceText.length
  }

  getUserTextLength () {
    return this.userText.length
  }

  setUserValidText () {
    this.userValidText = this.userText
  }

  canSetUserValidText () {
    return this.userValidText < this.userText && this.userText === this.referenceText.slice(0, this.userText.length)
  }

  isUserTextValid () {
    return this.userText === this.referenceText.slice(0, this.userText.length)
  }

  isFinished () {
    return this.getUserTextLength() === this.getReferenceTextLength()
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
    console.log(this.referenceText[this.cursorIndex])
    console.log(c)
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

  delAt () {
    if (this.cursorIndex === -1) { return }
    if (this.currChar === ' ') {
      const lastSpace = this.findLastSpace()
      this.currWord = this.referenceText.slice(lastSpace === -1 ? 0 : lastSpace,
        this.cursorIndex - 1)
    }
    this.currChar = this.userText[this.cursorIndex - 2]
    const fHalf = this.userText.slice(0, this.cursorIndex)
    const sHalf = this.userText.slice(this.cursorIndex + 1)
    this.userText = fHalf + sHalf
    this.cursorIndex--
    this.maxCurdorIndex--
  }

  findNextSpace () {
    for (let i = this.cursorIndex + 1; i < this.referenceText.length; i++) {
      if (!/\w|\d/.test(this.referenceText.charAt(i))) {
        return i
      }
    }
    return -1
  }

  setLastInput (input) {
    const fHalf = this.userText.slice(0, this.cursorIndex + 1)
    const sHalf = this.userText.slice(this.cursorIndex + 1)
    this.userText = fHalf + input + sHalf
    this.cursorIndex++
    this.maxCurdorIndex++
    this.currChar = input
    if (!/\w|\d/.test(input)) {
      const nextSpace = this.findNextSpace()
      this.currWord = this.referenceText.slice(this.cursorIndex + 1,
        nextSpace === -1 ? this.referenceText.length - 1 : nextSpace)
        console.log('---currword---')
        console.log(this.cursorIndex + 1)
        console.log(nextSpace)
        console.log(this.referenceText.slice(this.cursorIndex + 1,
          nextSpace === -1 ? this.referenceText.length - 1 : nextSpace))
    }
  }

  moveCursorLeft () {
    if (this.cursorIndex < 0) { return }
    this.cursorIndex--
  }

  moveCursorRight () {
    if (this.cursorIndex === this.userText.length - 1) { return }
    this.cursorIndex++
  }

  findNextSpace2 () {
    for (let i = this.cursorIndex + 2; i < this.referenceText.length; i++) {
      if (!/\w|\d/.test(this.referenceText.charAt(i))) {
        return i
      }
    }
    return -1
  }

  setLastInput2 (input) {
    if (this.cursorIndex < this.referenceText.length) {
      if (!/\d|\w/.test(this.referenceText.charAt(this.cursorIndex + 1))) {
        this.currWord = this.referenceText.charAt(this.cursorIndex + 1)
      } else if (!/\d|\w/.test(this.referenceText.charAt(this.cursorIndex - 1))) {
        const nextSpace = this.findNextSpace2()
        this.currWord = this.referenceText.slice(this.cursorIndex,
          nextSpace === -1 ? this.referenceText.length - 1 : nextSpace)
      }
    }
    this.currChar = input
    const fHalf = this.userText.slice(0, this.cursorIndex)
    const sHalf = this.userText.slice(this.cursorIndex)
    this.userText = fHalf + input + sHalf
    this.cursorIndex++
  }
}
