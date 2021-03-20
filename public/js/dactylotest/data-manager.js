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
