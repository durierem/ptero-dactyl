'use strict'

export class DataManager {
  constructor () {
    this.timer = null
    this.time = 0 // temps en ms
    this.lastTime = 0 // temps en ms
    this.errChar = 0
    this.errCharPrev = 0
    this.numberOfFalseWord = 0
    this.sameMis = false
    this.mistakes = []
    this.wordTimes = []
    this.keyComb = this.initializeKeyComb()
  }

  // Initialise un tableau avec toutes les combinaisons de couples de lettre
  // de l'alphabet.
  initializeKeyComb () {
    const allKey = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
  'p','q','r','s','t','u','v','w','x','y','z','é','è','-',':','ç',' ','\'',',',
  '0','1','2','3','4','5','6','7','8','9','.']
    const arr = []
    for (let i = 0 ; i <= allKey.length;i++) {
      for (let j = 0 ; j <= allKey.length;j++) {
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

  sendData () {
    const target = '/dactylotest/save' // cible de la requete
    const content = JSON.stringify(this.getData())
    // requete avec jquery
    // on peut stocker l'objet jquery dans une variable si on veut utiliser
    // ses methodes plus tard [.done(), .fail(), .always()]
    $.post(target, { data: content })
      .done(function (data) {
        console.log('response: ' + data)
      })
  }

  computeWordTimes () {
    const res = []
    let prev = 0
    this.wordTimes.forEach(function (val) {
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
  addMistake (word) {
    this.incFalseChar()
    if (this.sameMis) {
      ++this.mistakes[word][this.mistakes[word].length - 1]
    } else if (this.mistakes[word] === undefined) {
      this.mistakes[word] = [this.errChar - this.errCharPrev]
      this.incFalseWords()
    } else {
      this.mistakes[word].push(this.errChar - this.errCharPrev)
    }
    this.sameMis = true
    this.errCharPrev = this.errChar
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
    const myData = this
    this.timer = setInterval(function () {
      myData.time += 10
    }, 10)
  }

  stopTimer () {
    clearInterval(this.timer)
  }
}
