'use strict'

export class DataManager {
  constructor () {
    this.timer = null
    this.time = 0 // temps en ms
    this.lastTime = 0 // temps en ms
    this.errChar = 0
    this.numberOfFalseWord = 0
    this.sameMis = false
    this.mistakes = []
    this.wordTimes = []
    this.keyComb = []
    this.timer = 0
  }

  // formate un json (par defaut) pour stocker les donnees a sauvegarder
  getData () {
    return {
      time: this.time,
      character_errors: this.errChar,
      nb_false_word: this.numberOfFalseWord,
      word_errors: this.mistakes,
      word_times: this.computeWordTimes(),
      key_combinations: this.keyComb
    }
  }

  computeWordTimes () {
    const res = []
    let prev = 0
    this.wordTimes.forEach((val) => {
      res.push(val - prev)
      prev = val
    })
    return res
  }

  incFalseChar () {
    this.errChar++
  }

  incFalseWords () {
    this.numberOfFalseWord++
  }

  /**
   * Ajoute le mot actuel à la liste des erreurs. Si le mot existe déjà dans
   * la liste des erreurs, incrémente le nombre d'erreurs associées à ce mot.
   * @param {string} word Le mot actuel
   */
  addMistake (word) {
    console.log('mistakes', word)
    this.incFalseChar()
    let idx = -1
    this.mistakes.find((value, index) => {
      if (value.indexOf(word) != -1) {
        idx = index
      }
    })
    if (idx === -1) {
      this.mistakes.push([word])
      idx = this.mistakes.length - 1
    }
    if (this.sameMis) {
      const temp = this.mistakes[idx].pop()
      this.mistakes[idx].push(temp + 1)
    } else {
      this.incFalseWords()
      this.mistakes[idx].push(1)
    }
    this.sameMis = true
  }

  resetMis () {
    this.sameMis = false
  }

  addWordTime () {
    this.wordTimes.push(this.time)
  }

  /**
   * Ajoute le temps entre deux touches a la liste des combinaisons,
   * si la combinaison existe deja, lui ajoute une valeur supplementaire
   * @param {char} first premier caractere
   * @param {char} second second caractere
   */
  addKeyComb (a, b) {
    let idx = -1
    this.keyComb.find((value, index) => {
      if (value.indexOf(a + '' + b) != -1) {
        idx = index
      }
    })
    if (idx === -1) {
      this.keyComb.push([a + '' + b])
      idx = this.keyComb.length - 1
    }
    this.keyComb[idx].push(this.time - this.lastTime)
    this.lastTime = this.time
  }

  // Controle du timer
  //  au 100e de seconde pres car c'est le plus petit interval possible pour
  //  setInterval()
  startTimer () {
    if (this.timer != 0) { return }
    this.timer = setInterval(() => {
        this.time += 10
    }, 10)
  }

  getTime () {
      return this.time
  }

  stopTimer () {
    clearInterval(this.timer)
    this.timer = 0
  }
}
