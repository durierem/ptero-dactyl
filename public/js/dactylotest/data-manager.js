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

  /**
   * Cree un json contenant les donnees liees a un benchmark
   * {number} time: temps du test
   * {number} character_errors: nombre de caracteres faux
   * {number} nb_false_word: nombre de mots faux
   * {array} word_errors: mots faux et leur nombre de caracateres faux
   * {array} word_times: temps d'ecriture de chaque mot
   * {array} key_combinations: tableau des temps entre chaque combinaisons
   *  de 2 touches
   * @returns {json} json contenant les donnees du benchmark
   */
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

  /**
   * Mets en forme le tableau des temps d'ecriture des mots
   * @returns {array} temps d'ecriture pour chaque mots du texte
   */
  computeWordTimes () {
    const res = []
    let prev = 0
    this.wordTimes.forEach((val) => {
      res.push(val - prev)
      prev = val
    })
    return res
  }

  /**
   * Incremente le nombre de caracteres faux
   */
  incFalseChar () {
    this.errChar++
  }

  /**
   * Incremente le nombre de mots faux
   */
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

  /**
   * reinitialise l'indicateur de repetition d'une faute, a utiliser quand on
   * change le mot courant dans le model lie
   */
  resetMis () {
    this.sameMis = false
  }

  /**
   * ajoute le temps actuel au chrono time
   */
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

  /**
   * Demarre un timer qui aura une precision au 100e de seconde.
   * Ne fonctionne que si le timer n'est pas deja en route.
   */
  startTimer () {
    if (this.timer != 0) { return }
    this.timer = setInterval(() => {
        this.time += 10
    }, 10)
  }

  /**
   * Renvoie le temps actuel au timer en millisecondes
   * @returns {number} le temps actuel au timer
   */
  getTime () {
      return this.time
  }

  /**
   * Arrete le timer et le remet a 0.
   */
  stopTimer () {
    clearInterval(this.timer)
    this.timer = 0
  }
}
