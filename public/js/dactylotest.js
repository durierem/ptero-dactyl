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
  constructor (container, char, index = null, cursor = false) {
    this.container = container
    this.char = char

    this.element = document.createElement('span')
    this.innerHTML = this.element.innerHTML
    this.element.innerText = char
    const referenceNode = index === null ? null : this.container.childNodes.item(index)
    container.insertBefore(this.element, referenceNode)

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

  detach () {
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
    this.maxCursorIndex = -1

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
    this.maxCursorIndex += 1
  }

  insertCharAt (char, index) {
    this.spans.splice(index, 0, new SpanObject(this.parentNode, char, index))
    this.maxCursorIndex += 1
  }

  removeCharAt (index) {
    this.spans[index].detach()
    this.spans.splice(index, 1)
    this.maxCursorIndex -= 1
  }

  removeLast () {
    this.spans.pop().detach()
    this.maxCursorIndex -= 1
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
    if (this.cursorIndex >= this.maxCursorIndex) { return }
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

class DataManager {
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
    const arr = []
    for (let i = 97; i <= 122; i++) {
      for (let j = 97; j <= 122; j++) {
        arr[String.fromCharCode(i) + String.fromCharCode(j)] = []
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
    const target = '/benchmark/save' // cible de la requete
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

// -------------------------------------------------------------------------- //

class DactyloTestModel {
  constructor (referenceText) {
    // super()
    this.referenceText = referenceText
    this.userValidText = ''
    this.userText = ''

    this.currChar = this.referenceText.charAt(0)
    this.cursorIndex = -1
    this.currWord = this.referenceText.slice(0, this.findNextSpace())

    //this.currChar = null
    //this.cursorIndex = -1
    //this.maxCurdorIndex = -1
    //this.currWord = this.referenceText.slice(0, this.findNextSpace())
  }

  setUserValidText() {
    this.userValidText = this.userText
  }

  canSetUserValidText(Sting) {
    return this.userValidText < this.userText && this.userText === this.referenceText.slice(0,this.userText.length)
  }

  isUserTextValid() {
    return this.userText === this.referenceText.slice(0,this.userText.length)
  }

  getReferenceTextLength () {
    return this.referenceText.length
  }

  getUserTextLength () {
    return this.userText.length
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
    if (!/\w|\d/.test(input)) {
      const nextSpace = this.findNextSpace()
      this.currWord = this.referenceText.slice(this.cursorIndex + 1,
        nextSpace === -1 ? this.referenceText.length - 1 : nextSpace)
    }
    this.currChar = input
    const fHalf = this.userText.slice(0, this.cursorIndex + 1)
    const sHalf = this.userText.slice(this.cursorIndex + 1)
    this.userText = fHalf + input + sHalf
    this.cursorIndex++
    this.maxCurdorIndex++
  }

  moveCursorLeft () {
    if (this.cursorIndex < 0) { return }
    this.cursorIndex--
  }

  moveCursorRight () {
    if (this.cursorIndex == this.userText.length - 1) { return }
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

// -------------------------------------------------------------------------- //

class Benchmark {
  constructor (referenceText) {
    this.referenceText = referenceText

    this.model = new DactyloTestModel(referenceText)
    this.data = new DataManager()
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    this.initialize()
  }

  initialize () {
    for (const c of this.referenceText) {
      this.textContainer.insertLast(c)
    }

    this.mis = false
    this.inputZone.insertLast('')
    this.inputZone.moveCursorRight()

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.placeCursor(this.model.getCursorIndex())
      this.data.startTimer() // pas sur d'ici
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      const c = e.key

      if (c === 'ArrowRight') {
        this.model.moveCursorRight()
        this.inputZone.moveCursorRight()
        return
      }

      if (c === 'ArrowLeft') {
        this.model.moveCursorLeft()
        this.inputZone.moveCursorLeft()
        return
      }

      if (!/Backspace|^.$/.test(c)) {
        return
      }

      if (c === 'Backspace') {
        if (this.inputZone.cursorIndex > 0) {
          this.inputZone.removeCharAt(this.model.getCursorIndex())
          this.model.delAt()
          this.inputZone.moveCursorLeft()
          if(!this.model.isUserTextValid()){
            this.inputZone.getElement().style.backgroundColor = 'red'
          } else {
            this.inputZone.getElement().style.backgroundColor = 'white'
          }
        }
      } else {
        this.model.setLastInput(c)

        if (this.model.getCursorIndex() === this.model.maxCurdorIndex){
          this.inputZone.setCharAt(c, this.model.getCursorIndex())
        } else {
          this.inputZone.insertCharAt(c, this.model.getCursorIndex())
        }

        if (this.model.isUserTextValid()) {
          if(this.model.canSetUserValidText()) {
            this.model.setUserValidText()
          }

          this.inputZone.getElement().style.backgroundColor = 'white'
          if (c === ' ') {
            this.data.resetMis()
            this.data.addWordTime()
          }
        } else {
          this.inputZone.getElement().style.backgroundColor = 'red'
          if (!this.mis) {
            this.mis = true
            this.data.addMistake(this.model.getCurrWord())
          }
        }
        // Et on ajoute une nouvelle span curseur
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()
        this.mis = false
      }

      if (this.model.isFinished()) {
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
    this.data = new DataManager()
    this.model = new DactyloTestModel(referenceText)
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    this.mis = false
    this.firstInput = true
    this.initialize()
  }

  initialize () {
    for (const c of this.model.getReferenceText()) {
      this.textContainer.insertLast(c)
    }

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

      const c = e.key

      if (!/^.$/.test(c)) {
        return
      }

      if (!this.model.isInputCorrect(c)) {
        if (!this.mis) {
          this.mis = true
          this.data.addMistake(this.model.getCurrWord())
        }
        this.data.incFalseChar()
      } else {
        if (!/\w|\d/.test(c)) {
          this.data.resetMis()
          this.data.addWordTime()
        }
        // on ajoute le caractere avec la bonne couleur
        this.inputZone.setCharAt(c, this.model.getCursorIndex())
        console.log(this.mis);
        this.inputZone.spans[this.model.getCursorIndex()].setColor(this.mis
          ? 'var(--error)'
          : 'var(--light-fg)')
        this.mis = false
        // on avance le curseur
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()
        // on met a jour le modele
        this.model.setLastInput2(c)
        if (this.model.isFinished()) {
          this.data.stopTimer()
          console.log('FINISHED!', this.data.getData())
          this.data.sendData()
        }
      }
    })
  }
}

// -------------------------------------------------------------------------- //

const text = 'Put\' all speaking, her69 speaking delicate recurred possible.'
const benchmark = new Benchmark(text)
