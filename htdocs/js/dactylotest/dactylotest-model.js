'use strict'

const punctRegex = /[.,/#!$% "^&*;:{}=_`~()]/

export class DactyloTestModel {
  /**
   * @constructor
   */
  constructor (referenceText) {
    // super()
    this.referenceText = referenceText
    this.userText = ''

    // this.currChar = this.referenceText.charAt(0)

    this.currChar = null
    this.cursorIndex = 0
    this.currWord = this.referenceText.slice(0, this.findEndOfWord(0))
  }

  /**
   * Renvoie la longueur du texte de reference
   * @returns {number} longueur du texte de reference
   */
  getReferenceTextLength () {
    return this.referenceText.length
  }

  /**
   * Renvoie la longueur du texte de l'utilisateur
   * @returns {number} longueur du texte de l'utilisateur
   */
  getUserTextLength () {
    return this.userText.length
  }

  /**
   * Renvoie l'index de la fin d'un mot
   * @param {number} index l'index du debut du mot
   * @returns {number} l'index de la fin du mot
   */
  findEndOfWord (index) {
    for (let i = index; i < this.referenceText.length; i++) {
      if (punctRegex.test(this.referenceText.charAt(i))) {
        return i
      }
    }
    return -1
  }

  /**
   * Renvoie l'index du debut du prochain mot
   * @returns {number} index du debut du prochain mot
   */
  findNextWord () {
    for (let i = this.cursorIndex; i < this.referenceText.length; i++) {
      if (punctRegex.test(this.referenceText.charAt(i)) &&
         !punctRegex.test(this.referenceText.charAt(i + 1))) {
        return i + 1
      }
    }
    return -1
  }

  /**
   * Met a jour le mot courant
   */
  setCurrentWord () {
    // debut du prochain mot
    const first = this.findNextWord()
    // fin du prochain mot
    const nextSpace = this.findEndOfWord(first)
    this.currWord = this.referenceText.slice(first === -1 ? this.cursorIndex + 1 : first,
      nextSpace === -1 ? this.referenceText.length : nextSpace)
  }

  /**
   * Verifie si le texte de l'utilisateur est valide
   * @returns {boolean} validitee du texte
   */
  isUserTextValid () {
    return this.userText === this.referenceText.slice(0, this.userText.length)
  }

  /**
   * Verifie si l'utilisateur a fini de taper le texte
   * @returns {boolean} test fini
   */
  isFinished () {
    return this.getUserText() === this.getReferenceText()
  }

  /**
   * Renvoie le texte de reference
   * @returns {string} le texte a taper
   */
  getReferenceText () {
    return this.referenceText
  }

  /**
   * Renvoie le texte de l'utilisateur
   * @returns {string} le texte de l'utilisateur
   */
  getUserText () {
    return this.userText
  }

  /**
   * Renvoie le mot courrant
   * @returns {string} le prochain mot a taper correctement
   */
  getCurrWord () {
    return this.currWord
  }

  /**
   * Renvoie la position du curseur dans le texte de l'utilisateur
   * @returns {number} index du curseur
   */
  getCursorIndex () {
    return this.cursorIndex
  }

  /**
   * Verifie si le caractere tape correspond au caractere du texte de reference
   * au meme index
   * @param {string} c le caractere a valider
   * @returns {boolean} validitee du caractere a l'index actuel
   */
  isInputCorrect (c) {
    return c === this.referenceText[this.cursorIndex]
  }

  /**
   * Verifie si le dernier caractere du texte de l'utilisateur correspond au
   * caractere au meme index dans le texte de reference
   * @returns {boolean} validitee du caractere en queue du texte de
   * l'utilisateur
   */
  isLastInputCorrect () {
    return this.userText.charAt(this.cursorIndex - 1) ===
        this.referenceText.charAt(this.cursorIndex - 1)
  }

  /**
   * supprime le dernier caractere entre, comme 'Backspace'
   */
  deleteLastInput () {
    if (this.userText.length <= 0) { return }
    this.userText = this.userText.slice(0, this.userText.length - 1)
    this.currChar = this.userText[this.userText.length - 1]
    this.cursorIndex -= 1
  }

  /**
   * ajoute input en fin de texte et avance le curseur
   * @param {string} le caractere a ajouter au texte
   */
  setLastInput (input) {
    this.userText += input
    this.currChar = this.userText[this.userText.length - 1]
    this.cursorIndex++
    this.currChar = input
  }
}
