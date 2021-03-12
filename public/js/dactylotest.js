'use strict'

// Définition de la méthode top() sur les tableaux
Array.prototype.top = function () {
  return this[this.length - 1]
}

// -------------------------------------------------------------------------- //

// Une SpanObject est l'encapsulation Objet d'un objet HTML span.
// Une SpanObject est ratachée à un conteneur de span donné par container.
// Une SpanObject contiendra 1 caractère donné par char. Ce caratctère est modifiable.
class SpanObject {
  constructor (container, char, cursor=false) {
    this.container = container
    this.char = char

    this.element = document.createElement('span')
    this.innerHTML = this.element.innerHTML
    this.element.innerText = char
    container.appendChild(this.element)

    if (cursor) {
      this.setCursor(true)
    }
  }

  getChar () {
    return this.char
  }

  getColor () {
    return this.element.style.color
  }

  setChar (char) {
    this.char = char
    this.element.innerText = char
  }

  setColor (color) {
    this.element.style.color = color
  }

  setCursor (bool) {
    if (bool) {
      this.element.classList.add('cursor-blink')
    } else {
      this.element.classList.remove('cursor-blink')
    }
  }

  detach() {
    this.container.removeChild(this.element)
  }
}

// -------------------------------------------------------------------------- //

class SpanManager {
  constructor (parentNode) {
    this.parentNode = parentNode
    this.spans = []
    this.spanList = parentNode.children
    this.cursorIndex = -1

    // Première span qui sert de curseur.
    this.parentNode.appendChild(document.createElement('span'))
  }

  getElement () {
    return this.parentNode
  }

  append (span) {
    this.spans.push(span)
  }

  insertLast (value) {
    this.append(new SpanObject(this.parentNode, value))
  }

  removeLast () {
    this.spans.pop().detach()
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
    const index = this.cursorIndex + 1
    this.removeCursor()
    this.placeCursor(index)
  }

  moveCursorLeft () {
    if (this.cursorIndex === 0) { return }
    const index = this.cursorIndex - 1
    this.removeCursor()
    this.placeCursor(index)
  }
}

// -------------------------------------------------------------------------- //

class dataManager {
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
  initializeKeyComb() {
    let arr = []
    for(let i = 97; i <= 122; i++) {
      for(let j = 97; j <= 122; j++) {
        arr[String.fromCharCode(i) + String.fromCharCode(j)] = []
      }
    }
    return arr
  }

  // formate un json (par defaut) pour stocker les donnees a sauvegarder
  getData() {
    return {
      "time": this.time,
      "character_errors": this.errChar,
      "nb_false_word": this.numberOfFalseWord,
      "word_errors": this.mistakes,
      "word_times": this.computeWordTimes(),
      "key_cobinations": this.keyComb
    }
  }

  sendData() {
    let target = "/benchmark/save" // cible de la requete
    let content = JSON.stringify(this.getData())
    // requete avec jquery
    // on peut stocker l'objet jquery dans une variable si on veut utiliser
    // ses methodes plus tard [.done(), .fail(), .always()]
    $.post(target, {data: content})
      .done(function(data){
        console.log("response: " + data)
      });
  }

  computeWordTimes () {
    let res = []
    let prev = 0
    this.wordTimes.forEach(function(val){
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
  addMistake(word) {
    this.incFalseChar()
    if (this.sameMis) {
      ++this.mistakes[word][this.mistakes[word].length - 1]
    } else if (this.mistakes[word] == undefined) {
      this.mistakes[word] = [this.errChar - this.errCharPrev]
      this.incFalseWords()
    } else {
      this.mistakes[word].push(this.errChar - this.errCharPrev)
    }
    this.sameMis = true
    this.errCharPrev = this.errChar
  }

  resetMis() {
    this.sameMis = false
  }

  addWordTime () {
    this.wordTimes.push(this.time)
  }

  // prend en parametre 2 LETTRES
  addKeyComb(a, b) {
    this.keyComb[a + b].push(this.time - this.lastTime)
    this.lastTime = this.time
  }

  // Controle du timer
  //  au 100e de seconde pre car c'est le plus petit interval possible pour
  //  setInterval()
  startTimer() {
    let myData = this
    this.timer = setInterval(function(){
      myData.time += 10
    }, 10);
  }

  stopTimer () {
    clearInterval(this.timer)
  }
}

// -------------------------------------------------------------------------- //

class DactyloTestModel {
  constructor (referenceText) {
    //super()
    this.referenceText = referenceText
    this.userText = ""
    this.currChar = this.referenceText.charAt(0)
    this.cursorIndex = -1
    this.currWord = this.referenceText.slice(0, this.findNextSpace())
  }

  getReferenceTextLength() {
    return this.referenceText.length
  }

  getUserTextLength() {
    return this.userText.length
  }

  isFinished() {
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

  getCursorIndex() {
    return this.cursorIndex
  }

  isInputCorrect(c) {
    return c === this.referenceText[this.cursorIndex]
  }

  isLastInputCorrect () {
    return this.userText.charAt(this.cursorIndex - 1)
                === this.referenceText.charAt(this.cursorIndex -1)
  }

  findLastSpace () {
    for (let i = this.cursorIndex - 1; i > 0; i--) {
      if (this.referenceText.charAt(i) === ' ') {
        return i;
      }
    }
    return -1;
  }

  delAt () {
    if(this.cursorIndex == -1) { return }
    if (this.currChar === ' ') {
      let lastSpace = this.findLastSpace()
      this.currWord = this.referenceText.slice(lastSpace == -1 ? 0 : lastSpace,
                                            this.cursorIndex - 1)
    }
    this.currChar = this.userText[this.cursorIndex - 2]
    let fHalf = this.userText.slice(0,this.cursorIndex - 1)
    let sHalf = this.userText.slice(this.cursorIndex + 1)
    this.userText = fHalf + sHalf
    this.cursorIndex--
  }

  findNextSpace () {
    for (let i = this.cursorIndex + 1; i < this.referenceText.length; i++) {
      if (!/\w|\d/.test(this.referenceText.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  setLastInput (input) {
    if (!/\w|\d/.test(input)) {
      let nextSpace = this.findNextSpace()
      this.currWord = this.referenceText.slice(this.cursorIndex + 1,
                      nextSpace == -1 ? this.referenceText.length - 1 : nextSpace)
      console.log(this.currWord)
    }
    this.currChar = input
    let fHalf = this.userText.slice(0,this.cursorIndex)
    let sHalf = this.userText.slice(this.cursorIndex)
    this.userText = fHalf + input + sHalf
    this.cursorIndex++
  }

}

// -------------------------------------------------------------------------- //

class Benchmark {
  constructor (referenceText) {
    this.referenceText = referenceText

    this.model = new DactyloTestModel(referenceText)
    this.data = new dataManager()
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    this.initialize()
  }

  initialize() {
    for (let c of this.referenceText) {
      this.textContainer.insertLast(c)
    }

    this.mis = false
    this.currSpanIndex = 0
    this.inputZone.insertLast('')
    this.model.setLastInput('')

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.placeCursor(this.model.getCursorIndex())
      this.data.startTimer() // pas sur d'ici
      console.log(this.model.getCurrWord())
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      const c = e.key

      if (!/Backspace|^.$/.test(c)) {
        return
      }

      if (c === 'Backspace'){
        if (this.inputZone.cursorIndex > 0) {
          this.currSpanIndex -= 1
          this.inputZone.removeLast()
          this.model.delAt()
          this.inputZone.setCharAt('', this.currSpanIndex)
          this.inputZone.moveCursorLeft()
        }
      } else {
        this.inputZone.setCharAt(c, this.currSpanIndex)
        this.model.setLastInput(c)
        if (this.model.isLastInputCorrect()){
          this.inputZone.spans[this.currSpanIndex].setColor('--light-fg')
          if (c === ' ') {
            this.data.resetMis()
            this.data.addWordTime()
          }
        } else {
          this.inputZone.spans[this.currSpanIndex].setColor('#A30000')
          if (!this.mis) {
            this.mis = true
            this.data.addMistake(this.model.getCurrWord())
          }
        }
        // Et on ajoute une nouvelle span curseur
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()
        this.mis = false

        this.currSpanIndex += 1
      }

      if (this.model.isFinished()){
        this.data.addWordTime()
        console.log('THE END')
        console.log(this.data.getData())
      }
    })
  }
}

// -------------------------------------------------------------------------- //

// Exercise: Insere slmt les caracteres s'ils sont corrects,
//  rouge: erreur / normal: bon
class Exercise {
  constructor (referenceText) {
    this.data = new dataManager()
    this.model = new DactyloTestModel(referenceText)
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    this.initialize()
    this.mis = false
    this.firstInput = true
  }

  initialize () {
    for (let c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

    console.log(this.model.currChar)
    this.model.setLastInput('')
    this.inputZone.insertLast('')
    this.currSpanIndex = this.model.getCursorIndex()

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.placeCursor(this.model.getCursorIndex())
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      if (this.firstInput) {
        this.data.startTimer()
        this.firstInput = false
      }

      console.log(e, e.key)

      const c = e.key

      if (!/Backspace|^.$/.test(c) || c === 'Backspace') {
        return
      }

      if (!this.model.isInputCorrect(c)) {
        if (!this.mis) {
          this.mis = true
          this.data.addMistake(this.model.getCurrWord())
        } else {
          this.data.incFalseChar()
        }
      } else {
        if (!/\w|\d/.test(c)) {
          this.data.resetMis()
          this.data.addWordTime()
        }
        // on ajoute le caractere avec la bonne couleur
        this.inputZone.setCharAt(c, this.model.getCursorIndex())
        this.inputZone.spans[this.model.getCursorIndex()].setColor(this.mis ?
                                                        '#A30000'
                                                        : '--light-fg')
        this.mis = false
        // on avance le curseur
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()
        // on met a jour le modele
        this.model.setLastInput(c)
        if(this.model.isFinished()) {
          this.data.stopTimer()
          console.log('FINISHED!', this.data.getData())
        }
      }
    })
  }
}

// -------------------------------------------------------------------------- //

const text = 'Put all speaking, her speaking delicate recurred possible.'
const benchmark = new Exercise(text)
