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

  computeWordTimes () {
    let res = []
    s = 0
    this.wordTimes.forEach(function(val){
      res.push(val - s)
      s += val
    })
    return res
  }

  incFalseChar () {
    this.errChar++
  }

  incFalseWords () {
    this.numberOfFalseWord++
  }

  addMistake(word) {
    if (this.mistakes[word] == undefined) {
      this.mistakes[word] = [this.errChar - this.errCharPrev]
    } else {
      this.mistakes[word].push(this.errChar - this.errCharPrev)
    }
    this.incFalseWords()
    this.errCharPrev = this.errChar
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
    this.currChar = null
    this.currWord = null
    this.cursorIndex = -1
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
    for (i = this.cursorIndex - 1; i > 0; i--) {
      if (this.referenceText.charAt(i) === ' ') {
        return i;
      }
    }
    return -1;
  }

  delAt () {
    if(this.cursorIndex == 0) { return }
    if (currChar === 'Space') {
      lastSpace = this.findLastSpace()
      this.currWord = this.referenceText.slice(lastSpace == -1 ? 0 : lastSpace,
                                            cursorIndex - 1)
    }
    this.currChar = this.userText[cursorIndex - 1]
    fHalf = this.userText.slice(0,this.cursorIndex)
    sHalf = this.userText.slice(this.cursorIndex + 1)
    this.userText = fHalf + sHalf
    this.cursorIndex--
  }

  findNextSpace () {
    for (i = this.cursorIndex + 1; i < this.referenceText.length; i++) {
      if (this.referenceText.charAt(i) === ' ') {
        return i;
      }
    }
    return -1;
  }

  setLastInput (input) {
    if (this.currChar === 'Space') {
      let nextSpace = this.findNextSpace()
      this.currWord = this.referenceText.slice(this.cursorIndex + 1,
                      nextSpace == -1 ? this.referenceText.length - 1 : nextSpace)
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
    this.textContainer = new SpanManager(document.getElementById('text-container'))
    this.inputZone = new SpanManager(document.getElementById('virtual-user-input'))
    this.initialize()
  }

  initialize () {
    for (let c of this.referenceText) {
      this.textContainer.insertLast(c)
    }

    // A MODIFIER POUR CONVENIR AU MVC
    // INITIALISATION DU CURSEUR
    this.currSpanIndex = 0
    this.inputZone.insertLast('')

    this.inputZone.getElement().addEventListener('click', () => {
      this.inputZone.placeCursor(this.currSpanIndex)
    })

    this.inputZone.getElement().addEventListener('keydown', (e) => {
      const c = e.key

      if (!/Backspace|^.$/.test(c)) {
        return
      }

      // A MODIFIER AFIN DE CORRESPONDRE AU MVC //

      // Une span curseur est définie comme une span sans caractère possèdant la classe curseur
      if (c === 'Backspace') {
        // Si la touche 'effacer' est pressée et qu'il y au moin 1 caractère avant le curseur...
        if (this.inputZone.cursorIndex > 0) {
          this.currSpanIndex -= 1
          // ...on retire la span curseur actuel du conteneur...
          this.inputZone.removeLast()
          // ...puis on remplace la span d'avant par un span curseur.
          this.inputZone.setCharAt('', this.currSpanIndex)
          this.inputZone.moveCursorLeft()
        }
      } else {
        // Sinon on attribut le caractère tapé au span curseur.
        this.inputZone.setCharAt(c, this.currSpanIndex)
        // Et on ajoute une nouvelle span curseur
        this.inputZone.insertLast('')
        this.inputZone.moveCursorRight()

        // Si un mauvais caractère à été tapé on colorie la span en rouge
        if (c != text.charAt(this.currSpanIndex)) {
          this.inputZone.spans[this.currSpanIndex].setColor('red')
        } else {
          this.inputZone.spans[this.currSpanIndex].setColor('white')
        }
        this.currSpanIndex += 1
      }


      // CA C'EST CE QUE REMI ET THOMAS ONT ECRIT, A FARE EN SORTE QUE CA MARCHE

      // if (char === 'Backspace') {
      //   this.model.deleteLastinput()
      // } else {
      //   this.model.setcurrChar(char)
      //   if (this.model.isLastInputCorrect()) {
      //     this.spanManager(c, 'black')
      //   } else {
      //     this.spanManager(c, 'red')
      //   }
      // }
      // this.updateCursor() //
    })
  }

  updateCursor () {
    this.spanManager.setCursor(this.model.getIndex())
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

      const c = e.key

      if (!/Backspace|^.$/.test(c)) {
        return
      }

      if (c !== 'Backspace') {
        if (!this.model.isInputCorrect(c)) {
          if (!this.mis) {
            this.mis = true
            this.data.addMistake(this.model.getCurrWord())
          }
          this.data.incFalseChar()
        } else {
          if (c === 'Space') {
            this.data.addWordTime()
          }
          // on ajoute le caractere avec la bonne couleur
          this.inputZone.setCharAt(c, this.model.getCursorIndex())
          this.inputZone.spans[this.model.getCursorIndex()].setColor(this.mis ?
                                                          '--red'
                                                          : '--light-fg')
          this.mis = false
          // on avance le curseur
          this.inputZone.insertLast('')
          this.inputZone.moveCursorRight()
          // on met a jour le modele
          this.model.setLastInput(c)
          if(this.model.isFinished()) {
            this.data.stopTimer()
            alert("FINISHED !")
          }
        }
      }
    })
  }
}

// -------------------------------------------------------------------------- //

const text = 'Put all speaking her delicate recurred possible.'
const benchmark = new Exercise(text)
