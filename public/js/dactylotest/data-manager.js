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
    this.keyComb = this.initializeKeyComb()
  }

  // Initialise un tableau avec toutes les combinaisons de couples de lettre
  // de l'alphabet.
  initializeKeyComb () {
    const allKey = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
      'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'é', 'è', '-', ':', 'ç', ' ', '\'', ',',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
    const arr = []
    for (let i = 0; i < allKey.length; i++) {
      for (let j = 0; j < allKey.length; j++) {
        arr[allKey[i] + allKey[j]] = []
      }
    }
    return arr
  }

  // formate un json (par defaut) pour stocker les donnees a sauvegarder
  getData () {
    return {
      time: this.time,
      character_errors: this.errChar,
      nb_false_word: this.numberOfFalseWord,
      word_errors: this.mistakes,
      word_times: this.computeWordTimes(),
      key_cobinations: this.keyComb
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

  // "": empty string means punctuation

  /**
   * Ajoute le mot actuel à la liste des erreurs. Si le mot existe déjà dans
   * la liste des erreurs, incrémente le nombre d'erreurs associées à ce mot.
   * @param {string} word Le mot actuel
   */
  addMistake (word) {
    console.log('\"' + word + '\"')
    this.incFalseChar()
    if (this.mistakes[word] === undefined) {
      this.mistakes[word] = [1]
      this.incFalseWords()
    } else if (this.sameMis) {
      let temp = this.mistakes[word].pop()
      this.mistakes[word].push(temp + 1)
    } else {
      this.mistakes[word].push(1)
    }
    this.sameMis = true
  }

  resetMis () {
    this.sameMis = false
  }

  addWordTime () {
    this.wordTimes.push(this.time)
  }

  // prend en parametre 2 LETTRES
  addKeyComb (a, b) {
    this.keyComb[a + b].push(this.time - this.lastTime)
    this.lastTime = this.time
  }

  // Controle du timer
  //  au 100e de seconde pre car c'est le plus petit interval possible pour
  //  setInterval()
  startTimer () {
    this.timer = setInterval(() => {
      this.time += 10
    }, 10)
  }

  stopTimer () {
    clearInterval(this.timer)
  }
}
