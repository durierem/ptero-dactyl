'use strict'

export class DactyloTestModel {
  constructor (referenceText) {
    // super()
    this.referenceText = referenceText
    this.userValidText = ''
    this.userText = ''
    this.maxCurdorIndex = -1

    // this.currChar = this.referenceText.charAt(0)

    this.currChar = null
    this.cursorIndex = -1
<<<<<<< Updated upstream
    this.maxCursorIndex = -1
    this.currWord = this.referenceText.slice(0, this.findNextSpace())
=======
    this.currWord = this.referenceText.slice(0, this.findNextSpace(0))
>>>>>>> Stashed changes
  }

  getReferenceTextLength () {
    return this.referenceText.length
  }

  getUserTextLength () {
    return this.userText.length
  }

  findNextSpace (index) {
    for (let i = index + 1; i < this.referenceText.length; i++) {
      if (!/\w|\d/.test(this.referenceText.charAt(i))) {
        return i
      }
    }
    return -1
  }

  findFirst() {
    for (let i = this.cursorIndex; i < this.referenceText.length; i++ ) {
      if (!/\w|\d/.test(this.referenceText.charAt(i))) {
        if (/\w|\d/.test(this.referenceText.charAt(i + 1))) {
          return i
        }
      }
    }
    return -1
  }

  setUserValidText () {
    if (!/\w|\d/.test(this.currChar)) {
      const first = this.findFirst()
      const nextSpace = this.findNextSpace(first)
      this.currWord = this.referenceText.slice(first === -1 ? this.cursorIndex + 1 : first + 1,
        nextSpace === -1 ? this.referenceText.length - 1 : nextSpace)
    }
    // if (!/\w|\d/.test(this.currChar)) {
    //   this.currWord = this.currChar
    // } else if (!/\w|\d/.test(this.userText[this.userText.length - 2])) {
    //   const nextSpace = this.findNextSpace(this.getCursorIndex())
    //   this.currWord = this.referenceText.slice(this.cursorIndex,
    //       nextSpace === -1 ? this.referenceText.length - 1 : nextSpace)
    // }
    this.userValidText = this.userText
  }

  canSetUserValidText () {
    return this.userValidText < this.userText && this.userText === this.referenceText.slice(0, this.userText.length)
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

  delAt () {
    if (this.cursorIndex === -1) { return }
    // if (this.currChar === ' ') {
    //   const lastSpace = this.findLastSpace()
    //   this.currWord = this.referenceText.slice(lastSpace === -1 ? 0 : lastSpace,
    //     this.cursorIndex - 1)
    // }
    this.currChar = this.userText[this.cursorIndex - 2]
    const fHalf = this.userText.slice(0, this.cursorIndex)
    const sHalf = this.userText.slice(this.cursorIndex + 1)
    this.userText = fHalf + sHalf
    this.cursorIndex--
    this.maxCursorIndex--
  }

  setLastInput (input) {
    const fHalf = this.userText.slice(0, this.cursorIndex + 1)
    const sHalf = this.userText.slice(this.cursorIndex + 1)
    this.userText = fHalf + input + sHalf
    this.cursorIndex++
    this.maxCursorIndex++
    this.currChar = input
    // if (!/\w|\d/.test(input)) {
    //   const nextSpace = this.findNextSpace()
    //   this.currWord = this.referenceText.slice(this.cursorIndex + 1,
    //     nextSpace === -1 ? this.referenceText.length - 1 : nextSpace)
    // }
    //
    // if (this.cursorIndex < this.referenceText.length) {
    //   if (!/\d|\w/.test(this.referenceText.charAt(this.cursorIndex + 1))) {
    //     this.currWord = this.referenceText.charAt(this.cursorIndex + 1)
    //   } else if (!/\d|\w/.test(this.referenceText.charAt(this.cursorIndex - 1))) {
    //     const nextSpace = this.findNextSpace2()
    //     this.currWord = this.referenceText.slice(this.cursorIndex,
    //       nextSpace === -1 ? this.referenceText.length - 1 : nextSpace)
    //   }
    // }
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
    this.maxCursorIndex++
  }
}
